#!/usr/bin/env node
/**
 * Lightweight pre-render: after `vite build`, generate one
 * dist/<slug>/index.html per country with SEO-critical head
 * tags swapped in (title, description, canonical, OG, JSON-LD).
 *
 * Body content stays as the SPA shell — React hydrates the page when JS
 * runs. The win is that bots, social-media crawlers, and slow first-paint
 * users get the right meta + structured data immediately.
 *
 * Driven entirely by `server/src/seedCountries.js`, so adding a country
 * gives you a static SEO page automatically.
 */

import { readFile, writeFile, mkdir } from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath, pathToFileURL } from 'node:url'

const HERE = path.dirname(fileURLToPath(import.meta.url))
const ROOT = path.resolve(HERE, '..')
const DIST = path.join(ROOT, 'dist')
const SHELL = path.join(DIST, 'index.html')
const SITE  = process.env.VITE_SITE_URL || 'https://lehoainhan.github.io/app'
const OG_IMAGE = `${SITE}/og-cover.png`

const slugify = (s) =>
  String(s || '').toLowerCase().normalize('NFKD')
    .replace(/[̀-ͯ]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '')

const main = async () => {
  // Load seed module dynamically — it pulls in countryRules.js too.
  const seedUrl = pathToFileURL(path.join(ROOT, 'server/src/seedCountries.js')).href
  const { SEED_COUNTRIES } = await import(seedUrl)

  const shell = await readFile(SHELL, 'utf8')

  let count = 0
  for (const c of SEED_COUNTRIES) {
    const slug = slugify(c.name)
    const url = `${SITE}/${slug}`
    const title = `${c.name} ${c.tag} — Apply online — eVisa`
    const minFee = (c.variants || [])
      .map(v => v.govFee).filter(n => Number.isFinite(n))
      .reduce((a, b) => Math.min(a, b), c.govFee ?? Infinity)
    const feeStr = Number.isFinite(minFee) ? `from $${minFee}` : ''
    const description = [
      `Apply for the ${c.name} ${c.tag} online.`,
      c.description,
      `Processing ${c.processingTime}, max stay ${c.maxStay}${feeStr ? ', gov fee ' + feeStr : ''}.`,
    ].join(' ').replace(/\s+/g, ' ').trim()

    const offers = (c.variants || []).map(v => ({
      '@type': 'Offer',
      name: v.label,
      priceCurrency: 'USD',
      price: String(v.govFee ?? 0),
    }))

    const jsonLd = {
      '@context': 'https://schema.org',
      '@type': 'Service',
      name: `${c.name} ${c.tag}`,
      description: c.description,
      areaServed: { '@type': 'Country', name: c.name },
      provider: { '@type': 'Organization', name: 'eVisa' },
      serviceType: 'Visa application processing',
      ...(offers.length ? { offers } : {}),
    }

    let html = shell
      .replace(/<title>[^<]*<\/title>/, `<title>${escapeHtml(title)}</title>`)
      // Drop existing meta description / canonical / og / ld+json so we don't double-up.
      .replace(/<meta\s+name=["']description["'][^>]*>\s*/g, '')
      .replace(/<link\s+rel=["']canonical["'][^>]*>\s*/g, '')
      .replace(/<meta\s+property=["']og:[^"']+["'][^>]*>\s*/g, '')
      .replace(/<meta\s+name=["']twitter:[^"']+["'][^>]*>\s*/g, '')
      .replace(/<script\s+type=["']application\/ld\+json["'][^>]*>[\s\S]*?<\/script>\s*/g, '')

    const headInjection = [
      `<meta name="description" content="${escapeAttr(description)}">`,
      `<link rel="canonical" href="${url}">`,
      `<meta property="og:type" content="website">`,
      `<meta property="og:site_name" content="eVisa">`,
      `<meta property="og:title" content="${escapeAttr(title)}">`,
      `<meta property="og:description" content="${escapeAttr(description)}">`,
      `<meta property="og:url" content="${url}">`,
      `<meta property="og:image" content="${OG_IMAGE}">`,
      `<meta name="twitter:card" content="summary_large_image">`,
      `<meta name="twitter:title" content="${escapeAttr(title)}">`,
      `<meta name="twitter:description" content="${escapeAttr(description)}">`,
      `<meta name="twitter:image" content="${OG_IMAGE}">`,
      `<script type="application/ld+json">${JSON.stringify(jsonLd)}</script>`,
    ].join('\n    ')

    html = html.replace('</head>', `    ${headInjection}\n  </head>`)

    const outDir = path.join(DIST, slug)
    await mkdir(outDir, { recursive: true })
    await writeFile(path.join(outDir, 'index.html'), html, 'utf8')
    count++
  }

  // Also regenerate sitemap from the same source of truth so it can never
  // drift from the actual list of countries.
  const today = new Date().toISOString().slice(0, 10)
  const staticEntries = [
    { loc: `${SITE}/`,             changefreq: 'weekly',  priority: '1.0' },
    { loc: `${SITE}/destinations`, changefreq: 'weekly',  priority: '0.9' },
    { loc: `${SITE}/visa-types`,   changefreq: 'monthly', priority: '0.8' },
    { loc: `${SITE}/pricing`,      changefreq: 'weekly',  priority: '0.9' },
    { loc: `${SITE}/guide`,        changefreq: 'monthly', priority: '0.7' },
    { loc: `${SITE}/support`,      changefreq: 'monthly', priority: '0.6' },
  ]
  const countryEntries = SEED_COUNTRIES.map(c => ({
    loc: `${SITE}/${slugify(c.name)}`,
    changefreq: 'weekly',
    priority: '0.9',
  }))
  const sitemap =
    `<?xml version="1.0" encoding="UTF-8"?>\n` +
    `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n` +
    [...staticEntries, ...countryEntries]
      .map(e => `  <url><loc>${e.loc}</loc><lastmod>${today}</lastmod><changefreq>${e.changefreq}</changefreq><priority>${e.priority}</priority></url>`)
      .join('\n') +
    `\n</urlset>\n`
  await writeFile(path.join(DIST, 'sitemap.xml'), sitemap, 'utf8')

  console.log(`[prerender] generated ${count} country pages + sitemap (${SEED_COUNTRIES.length} entries)`)
}

const escapeHtml = (s) => String(s).replace(/[&<>]/g, c => ({ '&':'&amp;','<':'&lt;','>':'&gt;' }[c]))
const escapeAttr = (s) => String(s).replace(/[&<>"']/g, c => ({ '&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;' }[c]))

main().catch(err => {
  console.error('[prerender] failed:', err)
  process.exit(1)
})
