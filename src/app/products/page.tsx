import Link from 'next/link';
import { PageIntro, CTA } from '@/components/shared';
import { Arrow } from '@/components/icons';
import { products } from '@/lib/content';
import { pageMetadata } from '@/lib/metadata';
export const metadata = pageMetadata('Products', 'Meet Lab 55000, Airspace Lab, Aerowash, L33T and EngiFlow. Specialist software for your engineering work.', '/products');
export default function Products(){return <><PageIntro number="02" label="THE PRODUCT SUITE" title={<>Five specialist tools.<br /><em>A different standard.</em></>} description="From the condition of a bridge to the movement of a project. Put purpose-built intelligence into your workflow."/><div className="container product-page-list">{products.map((product,i)=><article id={product.id} className="product-detail" key={product.id}><div className="product-brand"><p className="eyebrow">0{i+1} / {product.name}</p><img src={`/images/products/${product.logo}`} width="180" height="70" alt={`${product.name} logo`} /><span className="small-label">{product.category}</span></div><div><h2>{product.thesis}</h2><p>{product.description}</p></div><div><ul>{product.capabilities.map(item=><li key={item}>{item}</li>)}</ul><Link href={`/consultation?interest=${encodeURIComponent(product.name)}`} className="text-link">Request a {product.name} demo <Arrow diagonal /></Link></div></article>)}</div><CTA dark /></>}
