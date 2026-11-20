import Link from 'next/link';
import { CTA, PageIntro } from '@/components/shared';
import { Arrow } from '@/components/icons';
import { faqs } from '@/lib/content';
import { pageMetadata } from '@/lib/metadata';
export const metadata = pageMetadata('FAQs', 'Answers to your questions about EngiSeek data, cloud hosting, implementation, governance and consultation.', '/faqs');
export default function FAQs(){return <><PageIntro number="04" label="THE PRACTICAL QUESTIONS" title={<>Clarity.<br /><em>Before commitment.</em></>} description="Your software decisions need context. Start with the questions that matter."/><section className="container faq-section"><aside className="faq-aside"><p>Your operation is specific.<br />Your answers should be too.</p><Link className="text-link" href="/consultation">Ask your question <Arrow diagonal /></Link></aside><div className="faq-list">{faqs.map(faq=><details key={faq.question}><summary>{faq.question}</summary><p>{faq.answer}</p></details>)}</div></section><CTA dark /></>}
