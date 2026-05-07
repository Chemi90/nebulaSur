import { mkdirSync, writeFileSync } from 'node:fs'
import { join } from 'node:path'
import { seoServices, siteSeo } from '../src/data/seoServices.js'

const publicDir = join(process.cwd(), 'public')
const servicesDir = join(publicDir, 'servicios')

const businessId = `${siteSeo.url}/#business`
const websiteId = `${siteSeo.url}/#website`

function escapeHtml(value) {
  return String(value)
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#39;')
}

function jsonLd(value) {
  return JSON.stringify(value, null, 2).replaceAll('<', '\\u003c')
}

function absolutePath(path) {
  return new URL(path, `${siteSeo.url}/`).href
}

function serviceUrl(service) {
  return absolutePath(`/servicios/${service.slug}/`)
}

function areaSchema(name) {
  if (name === 'España') {
    return { '@type': 'Country', name }
  }

  if (name === 'Andalucía') {
    return { '@type': 'AdministrativeArea', name }
  }

  return { '@type': 'City', name }
}

function providerSchema() {
  return {
    '@type': ['LocalBusiness', 'ProfessionalService'],
    '@id': businessId,
    name: siteSeo.name,
    url: `${siteSeo.url}/`,
    logo: siteSeo.logo,
    image: siteSeo.logo,
    email: siteSeo.email,
    telephone: siteSeo.phone,
    priceRange: '€€',
    address: {
      '@type': 'PostalAddress',
      addressRegion: siteSeo.region,
      addressCountry: 'ES'
    },
    areaServed: [
      { '@type': 'City', name: 'Granada' },
      { '@type': 'City', name: 'Málaga' },
      { '@type': 'AdministrativeArea', name: 'Andalucía' },
      { '@type': 'Country', name: 'España' }
    ]
  }
}

function websiteSchema() {
  return {
    '@type': 'WebSite',
    '@id': websiteId,
    url: `${siteSeo.url}/`,
    name: siteSeo.name,
    publisher: { '@id': businessId },
    inLanguage: 'es-ES'
  }
}

function serviceSchema(service) {
  const url = serviceUrl(service)

  return {
    '@type': 'Service',
    '@id': `${url}#service`,
    name: service.title,
    alternateName: service.shortTitle,
    url,
    serviceType: service.serviceType,
    description: service.description,
    provider: { '@id': businessId },
    areaServed: service.areaServed.map(areaSchema),
    audience: service.audience.map((audienceType) => ({
      '@type': 'Audience',
      audienceType
    })),
    availableChannel: {
      '@type': 'ServiceChannel',
      serviceUrl: url,
      servicePhone: siteSeo.phone,
      availableLanguage: ['es', 'en', 'it']
    }
  }
}

function serviceGraph(service) {
  const url = serviceUrl(service)
  const faqId = `${url}#faq`

  return {
    '@context': 'https://schema.org',
    '@graph': [
      providerSchema(),
      websiteSchema(),
      serviceSchema(service),
      {
        '@type': 'WebPage',
        '@id': `${url}#webpage`,
        url,
        name: service.title,
        description: service.metaDescription,
        isPartOf: { '@id': websiteId },
        about: { '@id': `${url}#service` },
        mainEntity: { '@id': `${url}#service` },
        breadcrumb: { '@id': `${url}#breadcrumb` },
        inLanguage: 'es-ES'
      },
      {
        '@type': 'BreadcrumbList',
        '@id': `${url}#breadcrumb`,
        itemListElement: [
          {
            '@type': 'ListItem',
            position: 1,
            name: 'Inicio',
            item: `${siteSeo.url}/`
          },
          {
            '@type': 'ListItem',
            position: 2,
            name: 'Servicios',
            item: absolutePath('/servicios/')
          },
          {
            '@type': 'ListItem',
            position: 3,
            name: service.shortTitle,
            item: url
          }
        ]
      },
      {
        '@type': 'FAQPage',
        '@id': faqId,
        mainEntity: service.faqs.map((item) => ({
          '@type': 'Question',
          name: item.question,
          acceptedAnswer: {
            '@type': 'Answer',
            text: item.answer
          }
        }))
      }
    ]
  }
}

function listItems(items) {
  return items.map((item) => `<li>${escapeHtml(item)}</li>`).join('\n')
}

function faqItems(items) {
  return items.map((item, index) => `
          <details ${index === 0 ? 'open' : ''}>
            <summary>${escapeHtml(item.question)}</summary>
            <p>${escapeHtml(item.answer)}</p>
          </details>`).join('\n')
}

function sharedHead(title, description, canonicalUrl) {
  return `
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>${escapeHtml(title)}</title>
  <meta name="description" content="${escapeHtml(description)}" />
  <meta name="robots" content="index, follow, max-snippet:-1, max-image-preview:large" />
  <meta name="author" content="${escapeHtml(siteSeo.name)}" />
  <meta name="theme-color" content="#1d2847" />
  <link rel="canonical" href="${canonicalUrl}" />
  <link rel="home" href="${siteSeo.url}/" />
  <link rel="sitemap" type="application/xml" href="/sitemap.xml" />
  <link rel="alternate" type="text/plain" title="Resumen para IA" href="/llms.txt" />
  <link rel="icon" type="image/x-icon" href="/favicon.ico?v=2" sizes="any" />
  <link rel="icon" type="image/svg+xml" href="/nebula-sur-favicon.svg?v=2" />
  <meta property="og:type" content="website" />
  <meta property="og:locale" content="es_ES" />
  <meta property="og:site_name" content="${escapeHtml(siteSeo.name)}" />
  <meta property="og:title" content="${escapeHtml(title)}" />
  <meta property="og:description" content="${escapeHtml(description)}" />
  <meta property="og:url" content="${canonicalUrl}" />
  <meta property="og:image" content="${siteSeo.logo}" />
  <meta property="og:image:alt" content="Símbolo de Nébula Sur" />
  <meta name="twitter:card" content="summary_large_image" />
  <meta name="twitter:title" content="${escapeHtml(title)}" />
  <meta name="twitter:description" content="${escapeHtml(description)}" />
  <meta name="twitter:image" content="${siteSeo.logo}" />
  <style>
    :root {
      --bg-950: #1d2847;
      --bg-980: #27193a;
      --primary: #1bdbef;
      --accent: #de2de7;
      --text: #f0eff1;
      --text-muted: #b8b3c0;
      --line: rgba(27, 219, 239, 0.24);
      --panel: rgba(10, 19, 36, 0.74);
      --container: min(1080px, calc(100% - 2rem));
    }

    * {
      box-sizing: border-box;
      margin: 0;
      padding: 0;
    }

    body {
      min-height: 100vh;
      font-family: Manrope, "Segoe UI", sans-serif;
      color: var(--text);
      background:
        radial-gradient(circle at 10% 8%, rgba(222, 45, 231, 0.18), transparent 34%),
        radial-gradient(circle at 88% 2%, rgba(27, 219, 239, 0.18), transparent 40%),
        linear-gradient(150deg, #150f2e 0%, #1d2847 48%, #122a3f 100%);
      -webkit-font-smoothing: antialiased;
    }

    a {
      color: inherit;
      text-decoration: none;
    }

    .container {
      width: var(--container);
      margin-inline: auto;
    }

    .site-header {
      padding: 1rem 0;
    }

    .header-inner,
    .panel,
    .service-card {
      border: 1px solid var(--line);
      background: var(--panel);
      backdrop-filter: blur(10px);
    }

    .header-inner {
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 1rem;
      border-radius: 18px;
      padding: 0.85rem 1rem;
    }

    .brand {
      display: inline-flex;
      align-items: center;
      gap: 0.75rem;
      font-weight: 800;
      letter-spacing: 0.05em;
    }

    .brand img {
      width: 42px;
      height: 42px;
      border-radius: 12px;
      object-fit: cover;
    }

    .nav {
      display: flex;
      gap: 0.85rem;
      color: var(--text-muted);
      font-size: 0.86rem;
      font-weight: 700;
      text-transform: uppercase;
      letter-spacing: 0.06em;
    }

    main {
      padding: clamp(3.5rem, 7vw, 6rem) 0 4rem;
    }

    .eyebrow {
      color: var(--primary);
      font-size: 0.8rem;
      font-weight: 800;
      letter-spacing: 0.12em;
      text-transform: uppercase;
    }

    h1 {
      margin-top: 0.8rem;
      max-width: 920px;
      font-size: clamp(2.25rem, 6vw, 4.4rem);
      line-height: 1.05;
      letter-spacing: 0.02em;
    }

    .lead {
      margin-top: 1rem;
      max-width: 780px;
      color: #d6d2dc;
      font-size: clamp(1.05rem, 2vw, 1.22rem);
      line-height: 1.75;
    }

    .actions,
    .chips {
      display: flex;
      flex-wrap: wrap;
      gap: 0.65rem;
    }

    .actions {
      margin-top: 1.7rem;
    }

    .btn {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      min-height: 42px;
      border-radius: 999px;
      padding: 0.72rem 1.15rem;
      border: 1px solid var(--line);
      font-weight: 800;
    }

    .btn-primary {
      border-color: transparent;
      color: #110e1f;
      background: linear-gradient(120deg, var(--primary), var(--accent));
    }

    .section {
      margin-top: clamp(3rem, 6vw, 5rem);
    }

    .section h2 {
      font-size: clamp(1.6rem, 3vw, 2.35rem);
      line-height: 1.2;
    }

    .grid {
      display: grid;
      grid-template-columns: repeat(3, minmax(0, 1fr));
      gap: 1rem;
      margin-top: 1.4rem;
    }

    .panel,
    .service-card {
      border-radius: 16px;
      padding: 1.2rem;
    }

    .panel p,
    .service-card p,
    li {
      color: var(--text-muted);
      line-height: 1.65;
    }

    .service-card h2,
    .service-card h3 {
      margin-bottom: 0.65rem;
      color: var(--text);
      font-size: 1.06rem;
      line-height: 1.3;
    }

    .panel strong {
      display: block;
      margin-bottom: 0.35rem;
      color: var(--text);
    }

    ul {
      padding-left: 1.1rem;
      display: grid;
      gap: 0.45rem;
    }

    li::marker {
      color: var(--primary);
    }

    .chips {
      margin-top: 1rem;
      list-style: none;
      padding-left: 0;
    }

    .chips li {
      border: 1px solid rgba(222, 45, 231, 0.28);
      border-radius: 999px;
      padding: 0.42rem 0.68rem;
      background: rgba(34, 18, 55, 0.62);
      color: #ded6e8;
      font-size: 0.85rem;
    }

    .faq {
      display: grid;
      gap: 0.7rem;
      margin-top: 1.2rem;
    }

    details {
      border-top: 1px solid rgba(27, 219, 239, 0.18);
      padding-top: 0.75rem;
    }

    summary {
      cursor: pointer;
      font-weight: 800;
    }

    details p {
      margin-top: 0.6rem;
      color: var(--text-muted);
      line-height: 1.65;
    }

    .site-footer {
      border-top: 1px solid rgba(27, 219, 239, 0.16);
      padding: 2rem 0 2.6rem;
      color: var(--text-muted);
    }

    @media (max-width: 820px) {
      .header-inner,
      .nav {
        align-items: flex-start;
        flex-direction: column;
      }

      .grid {
        grid-template-columns: 1fr;
      }
    }
  </style>`
}

function renderServicePage(service) {
  const url = serviceUrl(service)
  const graph = serviceGraph(service)

  return `<!doctype html>
<html lang="es">
<head>
${sharedHead(`${service.shortTitle} | ${siteSeo.name}`, service.metaDescription, url)}
  <script type="application/ld+json">
${jsonLd(graph)}
  </script>
</head>
<body>
  <header class="site-header">
    <div class="container header-inner">
      <a class="brand" href="/">
        <img src="/logo-mark.jpeg" alt="Símbolo de Nébula Sur" />
        <span>Nébula Sur</span>
      </a>
      <nav class="nav" aria-label="Navegación principal">
        <a href="/">Inicio</a>
        <a href="/#services">Servicios</a>
        <a href="/#contact">Contacto</a>
      </nav>
    </div>
  </header>

  <main>
    <section class="container">
      <p class="eyebrow">${escapeHtml(service.mode)} | ${escapeHtml(service.areaLabel)}</p>
      <h1>${escapeHtml(service.title)}</h1>
      <p class="lead">${escapeHtml(service.description)}</p>
      <div class="actions">
        <a class="btn btn-primary" href="/#contact">Solicitar diagnóstico</a>
        <a class="btn" href="/servicios/">Ver todos los servicios</a>
      </div>
    </section>

    <section class="container section">
      <div class="grid">
        <article class="panel">
          <strong>Modalidad</strong>
          <p>${escapeHtml(service.mode)}</p>
        </article>
        <article class="panel">
          <strong>Zona</strong>
          <p>${escapeHtml(service.areaLabel)}</p>
        </article>
        <article class="panel">
          <strong>Contacto</strong>
          <p>${escapeHtml(siteSeo.displayPhone)} · ${escapeHtml(siteSeo.email)}</p>
        </article>
      </div>
    </section>

    <section class="container section">
      <h2>Qué incluye este servicio</h2>
      <div class="grid">
        <article class="service-card">
          <h3>Intervención</h3>
          <ul>
            ${listItems(service.includes)}
          </ul>
        </article>
        <article class="service-card">
          <h3>Resultados esperados</h3>
          <ul>
            ${listItems(service.outcomes)}
          </ul>
        </article>
        <article class="service-card">
          <h3>Búsquedas habituales</h3>
          <ul>
            ${listItems(service.searchQueries)}
          </ul>
        </article>
      </div>
    </section>

    <section class="container section">
      <h2>Preguntas frecuentes</h2>
      <div class="faq">
        ${faqItems(service.faqs)}
      </div>
    </section>

    <section class="container section panel">
      <p class="eyebrow">Siguiente paso</p>
      <h2>Cuéntanos qué necesitas</h2>
      <p class="lead">Indica el servicio, la ubicación aproximada si requiere presencia física, tiempos y resultado esperado. Te responderemos para concretar alcance y prioridad.</p>
      <div class="actions">
        <a class="btn btn-primary" href="/#contact">Abrir formulario</a>
        <a class="btn" href="mailto:${siteSeo.email}">${escapeHtml(siteSeo.email)}</a>
      </div>
    </section>
  </main>

  <footer class="site-footer">
    <div class="container">© ${new Date(siteSeo.lastUpdated).getFullYear()} Nébula Sur. Servicios locales y digitales en España.</div>
  </footer>
</body>
</html>
`
}

function catalogGraph() {
  const url = absolutePath('/servicios/')

  return {
    '@context': 'https://schema.org',
    '@graph': [
      providerSchema(),
      websiteSchema(),
      {
        '@type': 'CollectionPage',
        '@id': `${url}#webpage`,
        url,
        name: 'Servicios de Nébula Sur',
        description: 'Catálogo de servicios locales y remotos de Nébula Sur para España.',
        isPartOf: { '@id': websiteId },
        about: { '@id': businessId },
        mainEntity: { '@id': `${url}#services` },
        inLanguage: 'es-ES'
      },
      {
        '@type': 'ItemList',
        '@id': `${url}#services`,
        name: 'Servicios de Nébula Sur',
        itemListElement: seoServices.map((service, index) => ({
          '@type': 'ListItem',
          position: index + 1,
          name: service.shortTitle,
          url: serviceUrl(service),
          item: { '@id': `${serviceUrl(service)}#service` }
        }))
      }
    ]
  }
}

function renderCatalogPage() {
  const url = absolutePath('/servicios/')
  const title = `Servicios de ${siteSeo.name}`
  const description = 'Catálogo de servicios de Nébula Sur: IA, automatización, digitalización, electricidad, mantenimiento informático, limpieza, formación, consultoría y auditoría.'

  return `<!doctype html>
<html lang="es">
<head>
${sharedHead(title, description, url)}
  <script type="application/ld+json">
${jsonLd(catalogGraph())}
  </script>
</head>
<body>
  <header class="site-header">
    <div class="container header-inner">
      <a class="brand" href="/">
        <img src="/logo-mark.jpeg" alt="Símbolo de Nébula Sur" />
        <span>Nébula Sur</span>
      </a>
      <nav class="nav" aria-label="Navegación principal">
        <a href="/">Inicio</a>
        <a href="/#services">Servicios</a>
        <a href="/#contact">Contacto</a>
      </nav>
    </div>
  </header>

  <main>
    <section class="container">
      <p class="eyebrow">Catálogo rastreable</p>
      <h1>Servicios de Nébula Sur</h1>
      <p class="lead">Servicios digitales a distancia en toda España y trabajos presenciales locales en Granada, Málaga y zonas cercanas según disponibilidad.</p>
    </section>

    <section class="container section">
      <div class="grid">
        ${seoServices.map((service) => `
        <article class="service-card">
          <h2>${escapeHtml(service.shortTitle)}</h2>
          <p>${escapeHtml(service.metaDescription)}</p>
          <p><strong>${escapeHtml(service.mode)} · ${escapeHtml(service.areaLabel)}</strong></p>
          <div class="actions">
            <a class="btn" href="/servicios/${service.slug}/">Ver detalle</a>
          </div>
        </article>`).join('\n')}
      </div>
    </section>
  </main>

  <footer class="site-footer">
    <div class="container">© ${new Date(siteSeo.lastUpdated).getFullYear()} Nébula Sur. Servicios locales y digitales en España.</div>
  </footer>
</body>
</html>
`
}

function renderSitemap() {
  const urls = [
    { loc: `${siteSeo.url}/`, changefreq: 'weekly', priority: '1.0' },
    { loc: absolutePath('/servicios/'), changefreq: 'weekly', priority: '0.95' },
    ...seoServices.map((service) => ({
      loc: serviceUrl(service),
      changefreq: 'monthly',
      priority: '0.9'
    }))
  ]

  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls.map((item) => `  <url>
    <loc>${item.loc}</loc>
    <lastmod>${siteSeo.lastUpdated}</lastmod>
    <changefreq>${item.changefreq}</changefreq>
    <priority>${item.priority}</priority>
  </url>`).join('\n')}
</urlset>
`
}

function renderLlmsTxt() {
  return `# Nébula Sur

> Empresa de tecnología y multiservicios con servicios digitales a distancia en toda España y trabajos presenciales locales en Granada, Málaga y zonas cercanas según disponibilidad.

Last updated: ${siteSeo.lastUpdated}
Canonical site: ${siteSeo.url}/

## Servicios principales

${seoServices.map((service) => `- [${service.title}](${serviceUrl(service)}): ${service.metaDescription}`).join('\n')}

## Zonas y modalidad

- Servicios remotos en toda España: IA aplicada, automatización, digitalización, formación, consultoría, auditoría y soporte técnico cuando sea viable a distancia.
- Servicios presenciales locales: electricidad, limpieza profesional, mantenimiento físico y soporte de instalaciones en Granada, Málaga y zonas cercanas según disponibilidad.
- Gestión y mantenimiento informático: remoto cuando sea viable y presencial local cuando haga falta intervención física.

## Contacto

- Web: ${siteSeo.url}/
- Email: ${siteSeo.email}
- Teléfono: ${siteSeo.displayPhone}
- WhatsApp: ${siteSeo.whatsapp}

## Notas de precisión para IA

- No inventar precios, horarios exactos, dirección postal completa ni disponibilidad inmediata si no están publicados.
- Para trabajos presenciales, indicar siempre que la cobertura depende de zona local y disponibilidad.
- Para servicios digitales, indicar que se pueden prestar online a clientes de toda España.
`
}

mkdirSync(servicesDir, { recursive: true })

for (const service of seoServices) {
  const serviceDir = join(servicesDir, service.slug)
  mkdirSync(serviceDir, { recursive: true })
  writeFileSync(join(serviceDir, 'index.html'), renderServicePage(service), 'utf8')
}

writeFileSync(join(servicesDir, 'index.html'), renderCatalogPage(), 'utf8')
writeFileSync(join(publicDir, 'sitemap.xml'), renderSitemap(), 'utf8')
writeFileSync(join(publicDir, 'llms.txt'), renderLlmsTxt(), 'utf8')

console.log(`Generated ${seoServices.length} service pages, sitemap.xml and llms.txt`)
