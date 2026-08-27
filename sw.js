/* Menu Generator service worker.
 *
 * NETWORK FIRST, on purpose.  Four PWAs share the jaylaantaylor-boop.github.io
 * origin and cache-first workers have served stale copies there before: a fix
 * would go out and the phone would keep the old version.  Here the network is
 * always tried first, so an online device always gets the newest deploy, and
 * the stored copy only steps in when there is no signal.  The cache therefore
 * heals itself the moment a connection comes back.
 *
 * Scope is this folder alone.  Registered from /menu-generator/sw.js, the
 * browser limits control to /menu-generator/, and the fetch handler checks the
 * path again rather than trusting that.
 */
const VERSION = "menugen-2026-08-27";
const CORE = ["./", "./index.html", "./manifest.webmanifest",
              "./icon-180.png", "./icon-192.png", "./icon-512.png"];
const SCOPE_PATH = new URL("./", self.location).pathname;

self.addEventListener("install", e=>{
  self.skipWaiting();                       /* a new worker takes over promptly */
  e.waitUntil(caches.open(VERSION).then(c=>c.addAll(CORE)).catch(()=>{}));
});

self.addEventListener("activate", e=>{
  e.waitUntil(
    caches.keys()
      .then(keys=>Promise.all(keys.filter(k=>k!==VERSION).map(k=>caches.delete(k))))
      .then(()=>self.clients.claim())
      .catch(()=>{})
  );
});

/* Try the network, but do not hang on a bad connection — fall back to the
   stored copy after a few seconds rather than leaving a blank screen. */
function fromNetwork(req, ms){
  return new Promise((resolve, reject)=>{
    const timer = setTimeout(()=>reject(new Error("slow")), ms);
    fetch(req).then(res=>{
      clearTimeout(timer);
      if(res && res.ok && res.type === "basic"){
        const copy = res.clone();
        caches.open(VERSION).then(c=>c.put(req, copy)).catch(()=>{});
      }
      resolve(res);
    }, err=>{ clearTimeout(timer); reject(err); });
  });
}

self.addEventListener("fetch", e=>{
  const req = e.request;
  if(req.method !== "GET") return;
  let url;
  try{ url = new URL(req.url); }catch(err){ return; }
  if(url.origin !== self.location.origin) return;      /* never touch other hosts */
  if(!url.pathname.startsWith(SCOPE_PATH)) return;     /* never touch the other apps */

  e.respondWith(
    fromNetwork(req, 4000)
      .catch(()=>caches.match(req, {ignoreSearch:true}))
      .then(res => res || caches.match("./index.html", {ignoreSearch:true}))
      .then(res => res || new Response(
        "Offline, and this page has not been saved yet. Open it once with a connection.",
        {status:503, headers:{"Content-Type":"text/plain"}}))
  );
});
