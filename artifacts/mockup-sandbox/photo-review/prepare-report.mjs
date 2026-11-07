// Run from the repository root after authenticated read-only downloads and visual review.
// No storage writes, network requests, application imports or environment changes.
import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { execFileSync } from 'node:child_process';
import { createHash } from 'node:crypto';

const root = path.dirname(fileURLToPath(import.meta.url));
const source = JSON.parse(await fs.readFile('/tmp/esoko-photo-review/manifest.json', 'utf8'));
const decisions = JSON.parse(await fs.readFile(path.join(root, 'review-data.json'), 'utf8'));
assert.equal(source.length, 47);
assert.equal(decisions.length, source.length);
assert.equal(new Set(decisions.map(r => r.number)).size, source.length);
const output = path.join(root, 'webp');
await fs.mkdir(output, { recursive: true });
const records = [];

for (const original of source) {
  const review = decisions.find(r => r.number === original.number);
  assert.ok(review);
  const bytes = await fs.readFile(original.local);
  assert.equal(createHash('sha256').update(bytes).digest('hex'), original.sha256);
  const swapped = /^(Left|Right)/.test(original.orientation);
  const record = {
    number: original.number, filename: original.name,
    width: original.width, height: original.height,
    displayWidth: swapped ? original.height : original.width,
    displayHeight: swapped ? original.width : original.height,
    bytes: original.bytes, format: original.format, sha256: original.sha256,
    ...review, consent: review.faces ? 'Not confirmed; filename-specific approval required' : 'No identifiable face observed; not a release/rights determination',
    derivative: null,
  };
  // Explicit conservative fallback: never create a web copy of a face-flagged input.
  if (!review.faces && review.rating !== 'unusable') {
    assert.match(review.copyName, /^[a-z0-9-]+\.webp$/);
    const target = path.join(output, review.copyName);
    const hero = review.rating === 'hero-quality';
    const limit = hero ? 250000 : 150000;
    let accepted = false;
    for (const width of (hero ? [2400, 2200, 1920] : [1440, 1200, 960])) {
      for (const quality of [82, 78, 74, 70, 66]) {
        execFileSync('magick', [
          original.local + '[0]', '-auto-orient', '-colorspace', 'sRGB',
          '-resize', `${width}x>`, '-strip', '-define', 'webp:method=6',
          '-quality', String(quality), target,
        ]);
        const webp = await fs.readFile(target);
        if (webp.length >= limit) continue;
        const chunks = [];
        assert.equal(webp.toString('ascii', 0, 4), 'RIFF');
        assert.equal(webp.toString('ascii', 8, 12), 'WEBP');
        for (let offset = 12; offset + 8 <= webp.length;) {
          chunks.push(webp.toString('ascii', offset, offset + 4));
          const length = webp.readUInt32LE(offset + 4);
          offset += 8 + length + (length % 2);
        }
        assert.ok(!chunks.some(c => ['EXIF', 'XMP ', 'ICCP'].includes(c)));
        const [w, h, format] = execFileSync('magick', ['identify', '-format', '%w|%h|%m', target], { encoding: 'utf8' }).split('|');
        assert.equal(format, 'WEBP');
        assert.ok(+w <= record.displayWidth && +h <= record.displayHeight);
        if (hero) assert.ok(+w <= 2400);
        record.derivative = { filename: review.copyName, width: +w, height: +h, bytes: webp.length, quality, metadataChunks: chunks };
        accepted = true;
        break;
      }
      if (accepted) break;
    }
    assert.ok(accepted, `Cannot meet limits for ${original.name}`);
  }
  records.push(record);
}

const summary = {
  sourceImages: records.length,
  totalSourceBytes: records.reduce((n, r) => n + r.bytes, 0),
  heroQuality: records.filter(r => r.rating === 'hero-quality').length,
  supporting: records.filter(r => r.rating === 'supporting').length,
  unusable: records.filter(r => r.rating === 'unusable').length,
  faceFlagged: records.filter(r => r.faces).length,
  derivativesPrepared: records.filter(r => r.derivative).length,
  eligibleFaceCopiesDeferred: records.filter(r => r.faces && r.rating !== 'unusable').length,
  heicSources: records.filter(r => r.format === 'HEIC').length,
};
const inventory = { reviewedAt: new Date().toISOString(), summary, records };
await fs.writeFile(path.join(root, 'inventory.json'), JSON.stringify(inventory, null, 2) + '\n');
const headers = ['No.', 'Filename', 'Source dimensions', 'Display dimensions', 'Bytes', 'Format', 'Description', 'Rating', 'Reason', 'Subjects', 'Identifiable faces', 'Consent / rights', 'WebP status'];
const cells = r => [
  r.number, r.filename, `${r.width}×${r.height}`, `${r.displayWidth}×${r.displayHeight}`, r.bytes, r.format,
  r.description, r.rating, r.reason, r.tags.join('; '), r.faces ? 'YES — consent pending' : 'No face observed', r.consent,
  r.derivative ? `${r.derivative.filename}; ${r.derivative.width}×${r.derivative.height}; ${r.derivative.bytes} bytes`
    : r.rating === 'unusable' ? 'Not generated: unusable / redundant selection' : 'Deferred: identifiable face',
];
const csv = [headers, ...records.map(cells)].map(row => row.map(v => `"${String(v).replaceAll('"', '""')}"`).join(',')).join('\n');
await fs.writeFile(path.join(root, 'inventory.csv'), '\uFEFF' + csv + '\n');
const escape = v => String(v).replaceAll('&', '&amp;').replaceAll('<', '&lt;').replaceAll('>', '&gt;').replaceAll('"', '&quot;');
const narrative = [
  'Scope: 47 originals reviewed using full-frame previews, 1:1 detail samples and selected enlarged views. Ratings are editorial judgments, not automated quality scores or consent evidence. No attempt was made to identify people by name.',
  'Privacy finding: the originals are already under an existing application public-search prefix, and the API public-object handler has no authentication gate. No public URL was requested or shared and no ACL, object, metadata or permission was changed. This is not certification that the originals are private. Ask for a separate privacy remediation review before public marketing use.',
  'Sandbox restriction was not certified. The approved fallback was used: only no-identifiable-face inputs received WebP derivatives. No WebP copies of face-flagged originals were made. Temporary JPEG inspection previews and original downloads were outside the workspace, not shared as public previews, and are not deliverables.',
  'Output policy: hero WebP under 250,000 bytes and no wider than 2400px; supporting WebP under 150,000 bytes and no upscaling. Orientation is applied before conversion; EXIF/GPS, XMP and ICC source-profile chunks are absent from every output. These checks do not anonymise visible writing, logos, faces or clothing, and absence of a face is not proof of usage rights.',
  'Five strongest: (1) image 4, pineapple farmer, a warm farmer-led lead image; (2) image 46, market tablet interaction, connects technology to produce; (3) image 2, tablet in input shop, strong no-face technology composition; (4) image 44, headset agents, a clear human advisory story; (5) image 42, overhead helpline office, a distinctive operational composition. Image 17 is a strong service-interaction alternate. Images 4, 46, 44, 42 and 17 still require consent.',
  'Coverage: team/office and events are well represented but repetitive. Technology has a tablet-in-shop image, a market tablet interaction, helpline workstations and one SMS graphic; there is little clear phone-in-field use. Field-agent/training coverage is limited and largely event-based. Actual crops/produce are mainly pineapple, maize kernels and market maize; shelf photographs show agricultural inputs and must not be counted as crop diversity. Farmers/fields are thinly covered, and standalone landscapes are absent.',
  'Future shoot: consenting farmers checking a real SMS or app in their field; agent-led one-to-one and small-group training; diverse crops, harvesting, market transactions and input delivery; wide field/landscape compositions with space for copy; candid team collaboration rather than more posed line-ups. Capture horizontal and vertical alternatives in soft light, focus on faces/hands/screens, and log written releases by filename without storing personal release information in this public-facing inventory.',
  'Duplicate findings: images 2 and 3 have identical SHA-256 hashes. Other redundant selections are visual near-duplicates, not claimed to have identical bytes. All five HEIC files have identifiable people; no production WebP conversion was retained for them pending consent. They decoded successfully for inspection.',
  'Next gate: review the table and confirm specific original filenames for marketing use. Prompt 2 is not started: no redesign, canvas, publication, page changes, database operation or service restart occurred. The original storage exposure must not be confused with approval to reuse these images.',
];
const html = `<!doctype html><html lang="en"><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>Esoko photography inventory</title><style>body{font:16px/1.6 system-ui,sans-serif;color:#202020;max-width:1600px;margin:32px auto;padding:0 24px}h1{font-size:32px}.scroll{overflow:auto}table{border-collapse:collapse;min-width:2200px}th,td{border:1px solid #ccc;padding:10px;text-align:left;vertical-align:top}th{background:#eee}caption{text-align:left;font-weight:700;padding:12px 0}p{max-width:100ch}</style><h1>Esoko photography inventory</h1><p>${escape(inventory.reviewedAt)} · ${summary.sourceImages} images · ${summary.heroQuality} hero-quality · ${summary.supporting} supporting · ${summary.unusable} unusable/redundant · ${summary.faceFlagged} face-flagged · ${summary.derivativesPrepared} WebP copies prepared</p>${narrative.map(p => `<p>${escape(p)}</p>`).join('')}<div class="scroll"><table><caption>Complete inventory — no photographs or storage URLs embedded</caption><thead><tr>${headers.map(h => `<th>${escape(h)}</th>`).join('')}</tr></thead><tbody>${records.map(r => `<tr>${cells(r).map(c => `<td>${escape(c)}</td>`).join('')}</tr>`).join('')}</tbody></table></div></html>`;
await fs.writeFile(path.join(root, 'report.html'), html);
await fs.writeFile(path.join(root, 'README.md'), '# Esoko photography review\n\n' + narrative.map(p => p + '\n').join('\n') +
  '\n## Files\n\n- `report.html`: self-contained report and complete table, no embedded photos.\n- `inventory.csv`: spreadsheet-ready full table.\n- `inventory.json`: measurements, source hashes, decisions and output verification.\n- `review-data.json`: editorial ratings, tags and consent flags.\n- `webp/`: ignored generated derivatives; only no-identifiable-face photos.\n\n## Summary\n\n```json\n' + JSON.stringify(summary, null, 2) + '\n```\n');
console.log(JSON.stringify(summary, null, 2));
console.log('PREPARED', records.filter(r => r.derivative).map(r => r.derivative));
