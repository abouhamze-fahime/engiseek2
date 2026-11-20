import Link from 'next/link';
import { PageIntro, CTA } from '@/components/shared';
import { Arrow, DomainIcon } from '@/components/icons';
import { solutions } from '@/lib/content';
import { pageMetadata } from '@/lib/metadata';
export const metadata = pageMetadata('Solutions', 'Explore asset and bridge inspection, aerodrome compliance and the next generation of engineering workflows.', '/solutions');
export default function Solutions() { return <><PageIntro number="01" label="SOLUTIONS" title={<>Your environment.<br /><em>Your advantage.</em></>} description="Software earns its place when it understands your work. Start with the challenge. Find the right tool." /><div className="container solution-list">{solutions.map((solution,i)=><article className="solution-detail" id={String(i)} key={solution.name}><div><DomainIcon name={solution.icon} /></div><div><p className="eyebrow">0{i+1} / {solution.product}</p><h2>{solution.name}</h2>{solution.soon && <span className="status-label">COMING SOON</span>}</div><div><p>{solution.description}</p><p className="solution-audience">{solution.detail}</p><Link className="text-link" href={`/consultation?interest=${encodeURIComponent(solution.interest)}`}>{solution.soon?'Discuss your requirements':'Explore your use case'} <Arrow diagonal /></Link></div></article>)}</div><CTA dark /></>; }
