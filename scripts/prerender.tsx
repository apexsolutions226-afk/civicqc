import fs from 'node:fs';
import path from 'node:path';
import { renderToString } from 'react-dom/server';
import { StaticRouter } from 'react-router-dom';
import { loadEnv } from 'vite';
import App from '../src/App';
import { getMeta } from '../src/seo';
import { publicPagePaths, legacyRedirects } from '../src/routes';

const env = loadEnv('production', process.cwd(), '');
const origin = (process.env.VITE_SITE_URL || env.VITE_SITE_URL || '').replace(/\/$/, '');
if (origin) process.env.VITE_SITE_URL = origin;
const template = fs.readFileSync('dist/index.html', 'utf-8');
const pages = publicPagePaths;
const escape = (text: string) =>
  text.replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
for (const route of [...pages, '/404']) {
  const meta = getMeta(route);
  const app = renderToString(
    <StaticRouter location={route}>
      <App />
    </StaticRouter>,
  );
  let html = template
    .replace('<div id="root"></div>', `<div id="root">${app}</div>`)
    .replace(/<title>.*?<\/title>/, `<title>${escape(meta.title)}</title>`)
    .replace(
      /<meta name="description"[^>]*>/,
      `<meta name="description" content="${escape(meta.description)}" />`,
    )
    .replace(
      /<meta property="og:title"[^>]*>/,
      `<meta property="og:title" content="${escape(meta.title)}" />`,
    )
    .replace(
      /<meta property="og:description"[^>]*>/,
      `<meta property="og:description" content="${escape(meta.description)}" />`,
    )
    .replace(
      /<meta name="twitter:title"[^>]*>/,
      `<meta name="twitter:title" content="${escape(meta.title)}" />`,
    )
    .replace(
      /<meta name="twitter:description"[^>]*>/,
      `<meta name="twitter:description" content="${escape(meta.description)}" />`,
    );
  if (route !== '/404')
    html = html
      .replace(
        '</head>',
        `<link rel="canonical" href="${origin}${route}" /><meta property="og:url" content="${origin}${route}" /></head>`,
      )
      .replaceAll(
        'content="/images/civicqc-social.jpg"',
        `content="${origin}/images/civicqc-social.jpg"`,
      );
  if (route === '/404') html = html.replace('content="index, follow"', 'content="noindex, follow"');
  const output =
    route === '/404'
      ? 'dist/404.html'
      : route === '/'
        ? 'dist/index.html'
        : path.join('dist', route, 'index.html');
  fs.mkdirSync(path.dirname(output), { recursive: true });
  fs.writeFileSync(output, html);
  console.log(`Pre-rendered ${route}: ${Math.round(html.length / 1024)} KB`);
}
if (origin) {
  const xml = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${pages.map((route) => `\n  <url><loc>${origin}${route}</loc></url>`).join('')}\n</urlset>`;
  fs.writeFileSync('dist/sitemap.xml', xml);
  fs.writeFileSync('dist/robots.txt', `User-agent: *\nAllow: /\nSitemap: ${origin}/sitemap.xml\n`);
  console.log('Generated canonical URLs and sitemap.xml.');
} else
  console.log(
    'Set VITE_SITE_URL to the final public domain before production build to generate the canonical URLs and sitemap.',
  );

const redirects =
  [
    ...Object.entries(legacyRedirects).map(([from, to]) => `${from} ${to} 301`),
    ...pages.filter((route) => route !== '/').map((route) => `${route} ${route}/index.html 200`),
    '/* /404.html 404',
  ].join('\n') + '\n';
fs.writeFileSync('dist/_redirects', redirects);
