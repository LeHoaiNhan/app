const SITE = 'https://lehoainhan.github.io/app'
const DEFAULT_IMAGE = `${SITE}/og-cover.png`
const SITE_NAME = 'eVisa'

export default function Seo({ title, description, path = '', image, type = 'website', noindex = false, jsonLd }) {
  const fullTitle = title ? `${title} — ${SITE_NAME}` : `${SITE_NAME} — Apply for your travel visa online`
  const url = `${SITE}${path}`
  const ogImage = image || DEFAULT_IMAGE

  return (
    <>
      <title>{fullTitle}</title>
      {description && <meta name="description" content={description} />}
      <link rel="canonical" href={url} />
      <meta name="robots" content={noindex ? 'noindex, nofollow' : 'index, follow'} />

      <meta property="og:type" content={type} />
      <meta property="og:site_name" content={SITE_NAME} />
      <meta property="og:title" content={fullTitle} />
      {description && <meta property="og:description" content={description} />}
      <meta property="og:url" content={url} />
      <meta property="og:image" content={ogImage} />

      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={fullTitle} />
      {description && <meta name="twitter:description" content={description} />}
      <meta name="twitter:image" content={ogImage} />

      {jsonLd && (
        <script type="application/ld+json">{JSON.stringify(jsonLd)}</script>
      )}
    </>
  )
}
