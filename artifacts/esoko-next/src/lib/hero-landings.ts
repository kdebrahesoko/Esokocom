/** Only these landings place their hero underneath the fixed navigation. */
export function usesOverlayHeader(path: string): boolean {
  return path === "/" || path === "/careers" || path === "/resources";
}
