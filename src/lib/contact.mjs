const SERVICES = new Set(['publicaciones','chatbot','captacion','creatividad','automatizacion','analitica','estrategia']);
const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
export function validateLead(payload) {
  if (!payload || typeof payload !== 'object' || Array.isArray(payload)) return {ok:false,error:'Revisa los datos del formulario.'};
  const clean = key => typeof payload[key] === 'string' ? payload[key].trim() : '';
  const data = {name:clean('name'),email:clean('email').toLowerCase(),company:clean('company'),service:clean('service'),message:clean('message'),requestId:clean('requestId'),consent:payload.consent===true};
  if(data.name.length<2 || data.name.length>100) return {ok:false,error:'Escribe tu nombre (entre 2 y 100 caracteres).'};
  if(data.email.length>254 || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) return {ok:false,error:'Escribe un email válido.'};
  if(data.company.length<2 || data.company.length>160) return {ok:false,error:'Escribe el nombre de tu empresa.'};
  if(!SERVICES.has(data.service)) return {ok:false,error:'Selecciona un servicio.'};
  if(data.message.length<10 || data.message.length>3000) return {ok:false,error:'Cuéntanos tu idea usando entre 10 y 3000 caracteres.'};
  if(!data.consent) return {ok:false,error:'Debes aceptar la política de privacidad.'};
  if(!UUID.test(data.requestId)) return {ok:false,error:'Recarga la página antes de volver a enviar.'};
  return {ok:true,data};
}
const json = (status,data) => new Response(JSON.stringify(data),{status,headers:{'Content-Type':'application/json; charset=utf-8','Cache-Control':'no-store'}});
export async function handleContact(request,config,fetchImpl=fetch) {
  const origin=request.headers.get('origin');
  if(origin && origin!==new URL(request.url).origin) return json(403,{ok:false,error:'No se permite este origen.'});
  if(!request.headers.get('content-type')?.startsWith('application/json')) return json(415,{ok:false,error:'Formato de solicitud no válido.'});
  if(Number(request.headers.get('content-length'))>16384) return json(413,{ok:false,error:'El mensaje es demasiado largo.'});
  let payload;
  try {
    const reader=request.body?.getReader();
    if(!reader) return json(400,{ok:false,error:'Faltan los datos del formulario.'});
    const chunks=[];let total=0;
    while(true){const {value,done}=await reader.read();if(done)break;total+=value.byteLength;if(total>16384){await reader.cancel();return json(413,{ok:false,error:'El mensaje es demasiado largo.'});}chunks.push(value);}
    const bytes=new Uint8Array(total);let offset=0;for(const chunk of chunks){bytes.set(chunk,offset);offset+=chunk.byteLength;}
    payload=JSON.parse(new TextDecoder().decode(bytes));
  } catch{return json(400,{ok:false,error:'No se ha podido leer el formulario.'});}
  if(payload?.website) return json(400,{ok:false,error:'No se ha podido validar la solicitud.'});
  const result=validateLead(payload);
  if(!result.ok) return json(400,result);
  if(!config.url || !config.key) return json(503,{ok:false,error:'El formulario aún no está disponible. Tus datos no se han enviado; vuelve a intentarlo más tarde.'});
  try {
    const headers={apikey:config.key,'Content-Type':'application/json'};
    if(!config.key.startsWith('sb_secret_')) headers.Authorization=`Bearer ${config.key}`;
    const response=await fetchImpl(`${config.url.replace(/\/$/,'')}/rest/v1/rpc/submit_marketing_lead`,{method:'POST',headers,body:JSON.stringify({p_lead:result.data}),signal:AbortSignal.timeout(12000)});
    if(!response.ok) return json(502,{ok:false,error:'No hemos podido guardar tu solicitud. Conservamos los datos para que puedas volver a intentarlo.'});
    const saved=await response.json();
    if(saved.rateLimited) return json(429,{ok:false,error:'Ya hemos recibido varias solicitudes con este email. Prueba de nuevo más tarde.'});
    if(saved.ok!==true) return json(502,{ok:false,error:'No se ha podido confirmar el envío. Inténtalo de nuevo.'});
    return json(201,{ok:true});
  } catch{return json(502,{ok:false,error:'No hemos podido conectar. Tus datos siguen en el formulario; vuelve a intentarlo.'});}
}
