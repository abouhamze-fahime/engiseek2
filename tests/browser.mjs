import { chromium } from 'playwright';
import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
const base=process.env.TEST_BASE_URL || 'http://127.0.0.1:3000';
const browser=await chromium.launch({headless:true});
const errors=[];
await fs.mkdir('test-results',{recursive:true});
try {
 for(const width of [360,768,1440]){
  const page=await browser.newPage({viewport:{width,height:1000},deviceScaleFactor:1});
  page.on('pageerror',error=>errors.push(error.message));
  for(const path of ['/','/solutions','/products','/why-engiseek','/faqs','/consultation','/privacy']){
   const response=await page.goto(base+path); assert.equal(response.status(),200,`${path} at ${width}`);
   await page.evaluate(()=>document.fonts.ready);
   assert.equal(await page.locator('h1').count(),1,`one h1 on ${path}`);
   assert.ok(await page.locator('a[href="/consultation"]').count(),`consultation reachable on ${path}`);
   assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth),false,`no overflow: ${path} at ${width}`);
   assert.equal(await page.locator('meta[property="og:image"]').count(),1);
   assert.equal(await page.locator('link[rel="canonical"]').count(),1);
   await page.locator('img').evaluateAll(images=>Promise.all(images.map(async im=>{im.loading='eager';await im.decode().catch(()=>{});}))); 
   const broken=await page.locator('img').evaluateAll(images=>images.filter(im=>!im.complete || !im.naturalWidth).map(im=>im.src));
   assert.deepEqual(broken,[],`images load on ${path}`);
   if(path==='/' && width!==768) await page.screenshot({path:`test-results/home-${width}.png`,fullPage:true});
  }
  if(width===360){
   await page.getByRole('button',{name:'Open menu'}).click();
   await page.getByRole('navigation',{name:'Mobile navigation'}).getByRole('link',{name:'Products',exact:true}).click();
   await page.waitForURL('**/products');
   assert.equal(await page.getByRole('button',{name:'Open menu'}).getAttribute('aria-expanded'),'false');
  }
  await page.close();
 }
 const page=await browser.newPage({viewport:{width:1440,height:1000}});
 page.on('pageerror',error=>errors.push(error.message));
 await page.goto(base);
 await page.getByRole('tab',{name:/Airspace Lab/}).click();
 await page.getByRole('tabpanel').getByRole('heading',{name:'Clarity in every dimension.'}).waitFor();
 await page.getByRole('tab',{name:/Airspace Lab/}).press('ArrowDown');
 assert.equal(await page.getByRole('tab',{name:/Aerowash/}).getAttribute('aria-selected'),'true');
 await page.goto(base+'/faqs');
 await page.getByText('Who owns our data?',{exact:true}).click();
 assert.ok(await page.locator('details').first().getAttribute('open')!==null);
 await page.setViewportSize({width:360,height:1000});
 await page.goto(base+'/consultation?interest=Lab%2055000');
 assert.equal(await page.getByLabel('Area of interest').inputValue(),'Lab 55000');
 await page.getByRole('button',{name:'Preview your request'}).click();
 assert.equal(await page.getByLabel('Your name').evaluate(el=>el.validity.valid),false);
 await page.getByLabel('Your name').fill('Alex Morgan');
 await page.getByLabel('Company',{exact:true}).fill('Example Engineering');
 await page.getByLabel('Your role').fill('Asset manager');
 await page.getByLabel('Email address').fill('alex@example.com');
 await page.getByLabel('What are you working on?').fill('I would like to see an asset inspection demonstration.');
 let submissions=0;page.on('request',request=>{if(request.url().includes('/api/consultation')) submissions++});
 await page.getByRole('button',{name:'Preview your request'}).click();
 await page.getByText(/Preview complete. Your request has not been sent or saved/).waitFor();
 assert.equal(submissions,0,'preview never transmits client details');
 await page.evaluate(()=>window.scrollTo({top:0,behavior:'instant'}));
 await page.screenshot({path:'test-results/consultation-360.png',fullPage:true});
 const result=await page.request.post(base+'/api/consultation',{headers:{Origin:base},data:{id:'281470cc-8a55-41a2-934b-420fa1aad56e',name:'Alex Morgan',company:'Example Engineering',role:'Asset manager',email:'alex@example.com',phone:'',interest:'Lab 55000',message:'I would like to see an asset inspection demonstration.'}});
 assert.equal(result.status(),503,'unconfigured API refuses to claim a save');
 await page.close();
 assert.deepEqual(errors,[],'no browser runtime errors');
 console.log('Passed: seven pages at 360, 768 and 1440px; metadata, images, navigation, tabs, FAQ, form validation and honest preview behaviour.');
} finally {await browser.close();}
