import { useEffect } from 'react';
import { COMPANY_META, COMPANY_ORGANIZATION, COMPANY_TITLE, COMPANY_URL } from '@/lib/companySeo';

export function useCompanySeo() {
  useEffect(() => {
    const restore: (() => void)[] = [];
    const title = document.querySelector('title');
    const previousTitle = title?.getAttribute('data-company-original') ?? document.title;
    document.title = COMPANY_TITLE;
    restore.push(() => {
      document.title = previousTitle;
      title?.removeAttribute('data-company-original');
    });

    function update(selector: string, create: () => HTMLElement, apply: (element: HTMLElement) => void) {
      let element = document.head.querySelector<HTMLElement>(selector);
      const created = !element || element.hasAttribute('data-company-created');
      const original = element?.cloneNode(true) as HTMLElement | undefined;
      if (!element) {
        element = create();
        document.head.appendChild(element);
      }
      apply(element);
      const current = element;
      restore.push(() => {
        if (created) current.remove();
        else if (original) {
          const originalContent = original.getAttribute('data-company-original');
          if (originalContent !== null) original.setAttribute('content', originalContent);
          original.removeAttribute('data-company-original');
          current.replaceWith(original);
        }
      });
    }

    for (const [attribute, key, value] of COMPANY_META) {
      update(`meta[${attribute}="${key}"]`, () => document.createElement('meta'), element => {
        element.setAttribute(attribute, key);
        element.setAttribute('content', value);
      });
    }
    update('link[rel="canonical"]', () => document.createElement('link'), element => {
      element.setAttribute('rel', 'canonical');
      element.setAttribute('href', COMPANY_URL);
    });
    update('#company-organization', () => document.createElement('script'), element => {
      element.id = 'company-organization';
      element.setAttribute('type', 'application/ld+json');
      element.textContent = JSON.stringify(COMPANY_ORGANIZATION);
    });
    return () => restore.reverse().forEach(cleanup => cleanup());
  }, []);
}
