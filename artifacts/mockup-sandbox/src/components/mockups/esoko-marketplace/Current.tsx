import './_group.css';
import { SolutionPage } from './_Source';
import { getSolutionBySlug } from './_data';
// Real existing page source; routing adapted for isolated preview only.
export function Current(){return <div className='marketplace-preview esoko-home'><SolutionPage solution={getSolutionBySlug('marketplace')!}/></div>;}
