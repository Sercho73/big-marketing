import test from 'node:test';
import assert from 'node:assert/strict';
import { validateLead, handleContact } from '../src/lib/contact.mjs';

const valid = { name: 'Ana García', email: 'ana@example.com', company: 'Estudio Ana', service: 'captacion', message: 'Queremos captar nuevos clientes.', consent: true, website: '', requestId: '7735b747-30e0-482d-9780-538ab39eec15' };
test('acepta y normaliza una solicitud válida', () => {
  const result = validateLead({...valid, email: ' ANA@example.com '});
  assert.equal(result.ok, true);
  assert.equal(result.data.email, 'ana@example.com');
});
for (const [field, value] of [['name',''], ['email','no-email'], ['company',''], ['service','invalid'], ['message','x'], ['message','x'.repeat(3001)], ['consent',false], ['requestId','invalid']]) {
  test(`rechaza ${field} inválido (${String(value).slice(0,12)})`, () => assert.equal(validateLead({...valid,[field]:value}).ok, false));
}
const request = (data = valid, origin = 'https://big.example') => new Request('https://big.example/api/contact', {method:'POST', headers:{'Content-Type':'application/json',Origin:origin}, body:JSON.stringify(data)});
test('rechaza peticiones de otro origen', async () => assert.equal((await handleContact(request(valid,'https://other.example'),{})).status,403));
test('no declara éxito sin configuración de Supabase', async () => assert.equal((await handleContact(request(),{})).status,503));
test('rechaza cuerpos malformados', async () => assert.equal((await handleContact(new Request('https://big.example/api/contact',{method:'POST',headers:{'Content-Type':'application/json'},body:'{'}),{})).status,400));
test('solo confirma después de guardar y no expone claves al cliente', async () => {
  let saved = false;
  const response = await handleContact(request(), {url:'https://project.supabase.co',key:'private-secret'}, async (url, options) => {
    assert.match(url,/rpc\/submit_marketing_lead$/);
    assert.equal(options.headers.Authorization,'Bearer private-secret');
    assert.equal(JSON.parse(options.body).p_lead.email, valid.email);
    saved = true;
    return new Response(JSON.stringify({ok:true}),{status:200});
  });
  assert.equal(saved,true); assert.equal(response.status,201);
  assert.doesNotMatch(await response.text(),/private-secret/);
});
test('un fallo de almacenamiento conserva el estado de error', async () => {
  const response=await handleContact(request(),{url:'https://project.supabase.co',key:'secret'}, async()=>new Response('failure',{status:500}));
  assert.equal(response.status,502);
});
test('un fallo de red no produce éxito', async () => assert.equal((await handleContact(request(),{url:'https://project.supabase.co',key:'secret'},async()=>{throw new Error('offline');})).status,502));
test('propaga límite persistente de solicitudes', async () => assert.equal((await handleContact(request(),{url:'https://project.supabase.co',key:'secret'},async()=>new Response(JSON.stringify({ok:false,rateLimited:true}),{status:200}))).status,429));
test('envía las nuevas claves secretas en apikey, sin tratarlas como JWT', async () => {
  let authorization;
  const response=await handleContact(request(),{url:'https://project.supabase.co',key:'sb_secret_test'},async(_url,options)=>{authorization=options.headers.Authorization;assert.equal(options.headers.apikey,'sb_secret_test');return new Response(JSON.stringify({ok:true}));});
  assert.equal(response.status,201);assert.equal(authorization,undefined);
});
