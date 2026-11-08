import type { Plugin } from 'vite';
import { COMPANY_META, COMPANY_ORGANIZATION, COMPANY_TITLE, COMPANY_URL } from '../src/lib/companySeo';

const escape = (value: string) => value.replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

// Store original tags so client navigation can restore the shell's metadata.
function companyHtml(html: string): string {
  html = html.replace(/<title>(.*?)<\/title>/s, (_, previous: string) =>
    `<title data-company-original="${escape(previous)}">${escape(COMPANY_TITLE)}</title>`);
  for (const [attribute, key, value] of COMPANY_META) {
    const pattern = new RegExp(`<meta\\s+${attribute}="${key}"[^>]*>`);
    const previous = html.match(pattern)?.[0];
    const originalContent = previous?.match(/content="([^"]*)"/)?.[1];
    const restoration = previous
      ? `data-company-original="${originalContent ?? ''}"`
      : 'data-company-created="true"';
    const tag = `<meta ${attribute}="${key}" content="${escape(value)}" ${restoration} />`;
    html = previous ? html.replace(previous, tag) : html.replace('</head>', `${tag}\n</head>`);
  }
  return html.replace('</head>', `<link rel="canonical" href="${COMPANY_URL}" data-company-created="true" />
<script id="company-organization" type="application/ld+json" data-company-created="true">${JSON.stringify(COMPANY_ORGANIZATION)}</script>
</head>`);
}

export function companySeoPlugin(): Plugin {
  return {
    name: 'company-seo',
    enforce: 'post',
    transformIndexHtml: {
      order: 'post',
      handler(html, context) {
        // Vite's SPA fallback rewrites path to /index.html before this hook.
        const pathname = (context.originalUrl ?? context.path).split('?')[0];
        return /^\/company\/?$/.test(pathname) ? companyHtml(html) : html;
      },
    },
    generateBundle: {
      order: 'post',
      handler(_, bundle) {
        const index = bundle['index.html'];
        if (!index || index.type !== 'asset') throw new Error('Missing HTML shell for Company SEO');
        this.emitFile({
          type: 'asset',
          fileName: 'company/index.html',
          source: companyHtml(String(index.source)),
        });
      },
    },
  };
}
