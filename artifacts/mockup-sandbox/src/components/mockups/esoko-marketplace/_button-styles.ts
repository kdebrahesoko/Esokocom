// Minimal copy of the source shadcn Button appearance (default + outline variants, default size).
const BASE = 'inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 hover-elevate active-elevate-2 min-h-9 px-4 py-2';
const VARIANTS = {
  default: 'bg-primary text-primary-foreground border border-primary-border',
  outline: 'border [border-color:var(--button-outline)] shadow-xs active:shadow-none',
} as const;

export function buttonClass(className = '', variant: keyof typeof VARIANTS = 'default') {
  return `${BASE} ${VARIANTS[variant]} ${className}`;
}
