/* Bump V whenever you upload a new index.html so phones pick up the update. */
const V="sol-v1",PRE=["./","./index.html","./manifest.json","./icon-192.png","./icon-512.png"];
self.addEventListener("install",e=>{e.waitUntil(caches.open(V).then(c=>c.addAll(PRE)).then(()=>self.skipWaiting()))});
self.addEventListener("activate",e=>{e.waitUntil(caches.keys().then(k=>Promise.all(k.filter(x=>x!==V).map(x=>caches.delete(x)))).then(()=>self.clients.claim()))});
self.addEventListener("fetch",e=>{
  const r=e.request;if(r.method!=="GET")return;
  const u=new URL(r.url);
  /* only handle our own files and Google Fonts; never touch Supabase or Paystack */
  if(u.origin!==location.origin&&!/(^|\.)fonts\.(googleapis|gstatic)\.com$/.test(u.hostname))return;
  if(r.mode==="navigate"){
    e.respondWith(fetch(r).then(x=>{if(x.ok){const cp=x.clone();caches.open(V).then(c=>c.put("./index.html",cp))}return x}).catch(()=>caches.match("./index.html")));
    return;
  }
  e.respondWith(caches.match(r).then(h=>h||fetch(r).then(x=>{if(x.ok){const cp=x.clone();caches.open(V).then(c=>c.put(r,cp))}return x})));
});