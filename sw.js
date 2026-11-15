/* AYN service worker v195 — يفتح فوراً من الذاكرة (حتى من غير نت) ويحدّث نفسه في الخلفية */
const C='ayn-v195';
const CORE=['./','./index.html','./radar.html','./manifest.webmanifest','./ayn-icon-180.png','./ayn-icon-192.png','./ayn-icon-512.png',
 'https://cdnjs.cloudflare.com/ajax/libs/html2canvas/1.4.1/html2canvas.min.js','https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js','https://cdnjs.cloudflare.com/ajax/libs/xlsx/0.18.5/xlsx.full.min.js'];
self.addEventListener('install',e=>{self.skipWaiting();e.waitUntil(caches.open(C).then(c=>Promise.all(CORE.map(u=>fetch(u,{cache:'reload',mode:u.startsWith('http')?'cors':'same-origin'}).then(r=>{if(r&&(r.ok||r.type==='opaque'))return c.put(u.startsWith('http')?u:key(new URL(u,self.registration.scope).href),r)}).catch(()=>{})))))});
self.addEventListener('activate',e=>e.waitUntil(caches.keys().then(K=>Promise.all(K.filter(k=>k!==C).map(k=>caches.delete(k)))).then(()=>self.clients.claim())));
const key=u=>{const x=new URL(u);return x.origin+x.pathname};
const put=(k,res)=>{if(res&&(res.ok||res.type==='opaque')){const cp=res.clone();caches.open(C).then(c=>c.put(k,cp))}return res};
self.addEventListener('fetch',e=>{const r=e.request;if(r.method!=='GET'||r.headers.get('range'))return;const u=new URL(r.url);
 if(u.origin===self.location.origin){
  const k=key(r.url),isPage=r.mode==='navigate'||/\.html?$|\/$/.test(u.pathname);
  const net=()=>fetch(r,{cache:'no-cache'}).then(res=>put(k,res));
  /* ?u= / ?_= : المستخدم طالب تحديث — هات من النت الأول */
  if(u.searchParams.has('u')||u.searchParams.has('_')){e.respondWith(net().catch(()=>caches.match(k).then(m=>m||caches.match(key(self.registration.scope+'index.html')))));return}
  e.respondWith(caches.match(k).then(m=>{
   if(m){e.waitUntil(net().catch(()=>{}));return m}
   return net().catch(()=>isPage?caches.match(key(self.registration.scope+'index.html')):Response.error())}));return}
 if(/(^|\.)cdnjs\.cloudflare\.com$|(^|\.)cdn\.jsdelivr\.net$|fonts\.googleapis\.com$|fonts\.gstatic\.com$/.test(u.hostname)){
  e.respondWith(caches.match(r).then(m=>m||fetch(r).then(res=>put(r.url,res))))}
});
