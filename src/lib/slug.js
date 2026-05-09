export const slugify = (s) =>
  String(s || '')
    .toLowerCase()
    .normalize('NFKD').replace(/[̀-ͯ]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '')

export const findCountryBySlug = (countries, slug) =>
  countries.find(c => slugify(c.name) === slug)
