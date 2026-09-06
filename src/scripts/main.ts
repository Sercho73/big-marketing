import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);
const motion = gsap.matchMedia();
motion.add('(prefers-reduced-motion: no-preference)', () => {
  gsap.from('.hero h1 span', {y:35, opacity:0, duration:1, stagger:.11, ease:'power3.out', clearProps:'all'});
  gsap.from('.hero-copy > p, .hero-actions', {y:18, opacity:0, duration:.8, delay:.35, stagger:.12, clearProps:'all'});
  gsap.from('.hero-art', {opacity:0, duration:1.5, delay:.1, clearProps:'opacity'});
  gsap.utils.toArray<HTMLElement>('.reveal').forEach(element => {
    gsap.from(element,{y:28,opacity:0,duration:.8,ease:'power2.out',scrollTrigger:{trigger:element,start:'top 94%',once:true},clearProps:'all'});
  });
  gsap.to('.hero-art img',{y:24,ease:'none',scrollTrigger:{trigger:'.hero',start:'top top',end:'bottom top',scrub:1}});
});

const form = document.querySelector<HTMLFormElement>('#contact-form');
document.querySelectorAll<HTMLAnchorElement>('[data-service]').forEach(link => {
  link.addEventListener('click',() => {
    const select = form?.elements.namedItem('service') as HTMLSelectElement | null;
    if(select) select.value=link.dataset.service || '';
  });
});

if (form) {
  const status=document.querySelector<HTMLParagraphElement>('#form-status')!;
  const submit=form.querySelector<HTMLButtonElement>('button[type=submit]')!;
  const buttonLabel=submit.querySelector('span')!;
  let requestId=crypto.randomUUID();
  let lastPayload='';
  form.addEventListener('submit',async event=>{
    event.preventDefault();
    if(!form.reportValidity() || submit.disabled) return;
    const data=new FormData(form);
    const payload={name:data.get('name'),email:data.get('email'),company:data.get('company'),service:data.get('service'),message:data.get('message'),website:data.get('website'),consent:data.get('consent')==='on'};
    const serialized=JSON.stringify(payload);
    if(lastPayload && lastPayload!==serialized) requestId=crypto.randomUUID();
    lastPayload=serialized;
    submit.disabled=true;form.setAttribute('aria-busy','true');buttonLabel.textContent='Enviando…';status.textContent='';
    try {
      const response=await fetch('/api/contact',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({...payload,requestId}),signal:AbortSignal.timeout(18000)});
      const result=await response.json();
      if(!response.ok || !result.ok) throw new Error(result.error || 'No se ha podido enviar. Inténtalo de nuevo.');
      status.dataset.error='false';status.textContent='¡Recibido! Tu próximo gran paso ya está en marcha. Nos pondremos en contacto contigo.';
      form.reset();requestId=crypto.randomUUID();lastPayload='';
    } catch(error) {
      status.dataset.error='true';
      status.textContent=error instanceof Error && error.name!=='TimeoutError' && error.name!=='TypeError' ? error.message : 'No hemos podido confirmar el envío. Conservamos tus datos aquí para que puedas volver a intentarlo.';
    } finally {
      submit.disabled=false;form.removeAttribute('aria-busy');buttonLabel.textContent='Hagamos algo BIG';status.focus({preventScroll:true});
    }
  });
}
