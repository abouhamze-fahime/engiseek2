import { test } from 'node:test';
import assert from 'node:assert/strict';
import { validateConsultation } from '../src/lib/consultation.ts';
import { createConsultationHandler } from '../src/lib/consultation-handler.ts';
const valid={id:'281470cc-8a55-41a2-934b-420fa1aad56e',name:'Alex Morgan',company:'Example Engineering',role:'Asset manager',email:'Alex@example.com',phone:'',interest:'Lab 55000',message:'I would like to see an asset inspection demonstration.'};
const config={supabaseUrl:'https://example.supabase.co',supabaseKey:'test-server-key',resendKey:'test-email-key',resendFrom:'EngiSeek <test@example.com>',notificationEmail:'team@example.com'};
const request=(body:unknown=valid,origin='http://localhost:3000')=>new Request('http://localhost:3000/api/consultation',{method:'POST',headers:{origin,'Content-Type':'application/json'},body:JSON.stringify(body)});
test('validates and normalises input, rejects arbitrary interests and invalid identifiers',()=>{assert.equal(validateConsultation(valid).data?.email,'alex@example.com');assert.ok(validateConsultation({...valid,interest:'Unapproved',id:'bad'}).errors.interest);assert.ok(validateConsultation({...valid,id:'bad'}).errors.id);assert.ok(validateConsultation({...valid,message:'short'}).errors.message);assert.ok(validateConsultation({...valid,phone:'abc'}).errors.phone);assert.ok(validateConsultation(null).errors.name)});
test('unconfigured database never pretends to save',async()=>{const response=await createConsultationHandler({})(request());assert.equal(response.status,503);assert.notEqual((await response.json()).saved,true)});
test('accepts the visible host when Next uses localhost internally',async()=>{const req=request(valid,'http://127.0.0.1:3000');req.headers.set('host','127.0.0.1:3000');assert.equal((await createConsultationHandler({})(req)).status,503)});
test('database failure prevents notification and success',async()=>{let calls=0;const response=await createConsultationHandler(config,async()=>{calls++;return new Response('unavailable',{status:503})})(request());assert.equal(response.status,503);assert.equal(calls,1);assert.notEqual((await response.json()).saved,true)});
test('authenticates Supabase writes with current secret keys and legacy service-role keys', async () => {
 for (const supabaseKey of ['sb_secret_example', config.supabaseKey]) {
  const methods: string[] = [];
  const response = await createConsultationHandler({ supabaseUrl: config.supabaseUrl, supabaseKey }, async (_url, init) => {
   const headers = new Headers(init?.headers);
   assert.equal(headers.get('apikey'), supabaseKey);
   assert.equal(headers.get('Authorization'), supabaseKey === config.supabaseKey ? `Bearer ${supabaseKey}` : null);
   methods.push(init?.method ?? '');
   if (init?.method === 'POST') {
    assert.equal(headers.get('Prefer'), 'resolution=ignore-duplicates,return=representation');
    assert.equal(JSON.parse(String(init.body)).phone, null);
    return Response.json([{ id: valid.id }]);
   }
   assert.deepEqual(JSON.parse(String(init?.body)), { notification_status: 'not_configured' });
   return new Response(null, { status: 204 });
  })(request());
  assert.equal(response.status, 200);
  assert.equal((await response.json()).saved, true);
  assert.deepEqual(methods, ['POST', 'PATCH']);
 }
});
test('inserts before email; email failure preserves success and records failure',async()=>{const calls:{url:string;method:string;body:unknown}[]=[];const response=await createConsultationHandler(config,async(url,init)=>{calls.push({url:String(url),method:init?.method||'GET',body:JSON.parse(String(init?.body))});return calls.length===1?Response.json([{id:valid.id}]):calls.length===2?new Response('email down',{status:500}):new Response(null,{status:204})})(request());assert.equal(response.status,200);assert.equal((await response.json()).saved,true);assert.match(calls[0].url,/consultation_requests/);assert.equal(calls[1].url,'https://api.resend.com/emails');assert.deepEqual(calls[2].body,{notification_status:'failed'})});
test('successful notification and status tracking',async()=>{let calls=0;const response=await createConsultationHandler(config,async(_url,init)=>{calls++;if(calls===1)return Response.json([{id:valid.id}]);if(calls===2){const email=JSON.parse(String(init?.body));assert.equal(email.reply_to,'alex@example.com');assert.match(email.text,/asset inspection/);return Response.json({id:'email-id'})}assert.deepEqual(JSON.parse(String(init?.body)),{notification_status:'sent'});return new Response(null,{status:204})})(request());assert.equal(response.status,200);assert.equal(calls,3)});
test('duplicate request IDs do not send another email',async()=>{let calls=0;const response=await createConsultationHandler(config,async()=>{calls++;return Response.json([])})(request());assert.equal((await response.json()).saved,true);assert.equal(calls,1)});
test('notification status update failure cannot lose a saved request',async()=>{let calls=0;const response=await createConsultationHandler({supabaseUrl:config.supabaseUrl,supabaseKey:config.supabaseKey},async()=>{if(++calls===1)return Response.json([{id:valid.id}]);throw new Error('network failure')})(request());assert.equal((await response.json()).saved,true)});
test('rejects cross-origin, spam, invalid and oversized requests before external writes',async()=>{let calls=0;const handle=createConsultationHandler(config,async()=>{calls++;throw new Error('should not fetch')});assert.equal((await handle(request(valid,'https://other.example'))).status,403);assert.equal((await handle(request({...valid,website:'spam'}))).status,400);assert.equal((await handle(request({...valid,email:'invalid'}))).status,400);assert.equal((await handle(request({...valid,message:'a'.repeat(17000)}))).status,413);assert.equal(calls,0)});
