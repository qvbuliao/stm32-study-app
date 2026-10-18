// ------------------------------------------------------------
// Service Worker —— 让 App 打开过一次后，没网也能用
//
// 策略：缓存优先（cache-first）
//   离线学习工具的内容是静态的，不需要每次联网校验。
//   首次访问时把页面存进缓存，之后直接读缓存，断网也照常打开。
//
// 生效条件：必须 https（GitHub Pages 满足）。
//   file:// 与 http://内网IP 下浏览器不注册 SW，会自动退回普通离线文件。
//
// 更新方法：改动内容后把 CACHE 的版本号 +1，旧缓存会被清理。
// ------------------------------------------------------------

const CACHE = 'stm32-study-app-v1';

// 预缓存：装好 SW 时就把入口存下来，这样第一次访问后即可离线
const PRECACHE = [
  './',
  './index.html',
];

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE)
      .then(c => c.addAll(PRECACHE))
      .then(() => self.skipWaiting())   // 新版本立即接管
      .catch(() => self.skipWaiting())  // 预缓存失败也不阻塞安装
  );
});

self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys()
      .then(keys => Promise.all(
        keys.filter(k => k !== CACHE).map(k => caches.delete(k))
      ))
      .then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', event => {
  const req = event.request;
  if (req.method !== 'GET') return;

  const url = new URL(req.url);
  // 只处理自己站点下的资源，站外请求（例如点开 B 站链接）原样放行
  if (url.origin !== self.location.origin) return;

  event.respondWith(
    caches.match(req).then(hit => {
      if (hit) {
        // 命中缓存：直接返回，同时在后台静默更新，下次打开就是新版
        event.waitUntil(
          fetch(req).then(res => {
            if (res && res.ok) caches.open(CACHE).then(c => c.put(req, res.clone()));
          }).catch(() => {})
        );
        return hit;
      }
      // 未命中：联网取，成功后写入缓存
      return fetch(req).then(res => {
        if (res && res.ok && res.type === 'basic') {
          const copy = res.clone();
          event.waitUntil(caches.open(CACHE).then(c => c.put(req, copy)));
        }
        return res;
      }).catch(() => {
        // 断网且未缓存：若是页面导航，回退到缓存的入口页
        if (req.mode === 'navigate') return caches.match('./index.html');
        return new Response('', { status: 504, statusText: 'offline' });
      });
    })
  );
});
