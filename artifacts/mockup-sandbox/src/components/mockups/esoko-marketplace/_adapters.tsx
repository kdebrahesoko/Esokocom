import type { AnchorHTMLAttributes } from 'react';
export const DEMO_HREF='/esoko-next/demo/';
export function SiteLink({href,...props}:AnchorHTMLAttributes<HTMLAnchorElement>&{href:string}) {return <a href={href.startsWith('/')?'/esoko-next'+href:href} {...props}/>;}
