import { ConsultationForm } from '@/components/consultation-form';
import { getConsultationDatabaseConfig } from '@/lib/consultation-handler';
import { pageMetadata } from '@/lib/metadata';
export const dynamic = 'force-dynamic';
export const metadata = pageMetadata('Request a consultation', 'Bring your engineering challenge. Request an initial conversation or a demonstration of the EngiSeek product suite.', '/consultation');
export default async function Consultation({ searchParams }: { searchParams: Promise<{ interest?: string }> }) {
 const params = await searchParams;
 const { supabaseUrl, supabaseKey } = getConsultationDatabaseConfig();
 const connected = Boolean(supabaseUrl && supabaseKey);
 return <section className="container consultation-page"><div className="consultation-copy"><p className="eyebrow">LET’S TALK ABOUT YOUR WORK.</p><h1>Your challenge.<br /><em>The next move.</em></h1><p>Bring your requirements, your questions or the process you want to improve. Start with a conversation. See the right tools in action.</p><div className="consultation-steps">{[['A little context','Tell the team what you’re working on and what you need.'],['A focused conversation','Explore your requirements with an engineering-led team.'],['A practical next step','See a relevant product demonstration or discuss your implementation.']].map(([title,description],i)=><div className="consultation-step" key={title}><span>0{i+1}</span><div><h2>{title}</h2><p>{description}</p></div></div>)}</div><p className="consultation-contact">Your initial conversation is free. No obligation.<br />Prefer email? <a href="mailto:admin@engiseek.com">admin@engiseek.com</a></p></div><ConsultationForm connected={connected} initialInterest={typeof params.interest==='string'?params.interest:''} /></section>;
}
