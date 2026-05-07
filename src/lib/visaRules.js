/**
 * Pure helpers that turn a country's `variants` + `rules` JSON into UI options
 * and validation messages. Keeps Step3/Step4 free of business logic so adding
 * a new country only means adding a row in seedCountries / countryRules.
 */

const ISO = (s) => (s || '').toLowerCase()

/** Returns true if nationality (name or iso) appears in `list`. */
function applicantMatches(list, { name, iso }) {
  if (!list?.length) return false
  const needles = list.map(x => String(x).toLowerCase())
  if (iso && needles.includes(ISO(iso))) return true
  if (name && needles.includes(String(name).toLowerCase())) return true
  return false
}

export function getVariants(country) {
  if (!country?.variants?.length) return []
  return country.variants
}

export function variantsForApplicant(country, { nationalityName, nationalityIso, purpose } = {}) {
  return getVariants(country).filter(v => {
    if (applicantMatches(v.blockNationalities, { name: nationalityName, iso: nationalityIso })) return false
    if (v.purpose?.length && purpose && !v.purpose.includes(purpose)) return false
    return true
  })
}

export function purposesForCountry(country) {
  const all = getVariants(country).flatMap(v => v.purpose || [])
  if (!all.length) return ['Tourism','Business / Work','Visiting family','Study / Research','Medical treatment','Transit']
  return [...new Set(all)]
}

export function findVariant(country, key) {
  return getVariants(country).find(v => v.key === key) || getVariants(country)[0] || null
}

/** Validate a trip + applicant against country.rules. Returns array of messages. */
export function validateTrip({ country, variant, personal, passport, trip }) {
  const errs = []
  const rules = country?.rules || {}

  const nat = { name: personal?.nationality, iso: personal?.nationalityIso }
  if (rules.onlyNationalities?.length && !applicantMatches(rules.onlyNationalities, nat)) {
    errs.push(`${country.name} eVisa is only available for: ${rules.onlyNationalities.join(', ').toUpperCase()}.`)
  }
  if (applicantMatches(rules.blockOrigin, nat)) {
    errs.push(`Applicants of ${personal.nationality} nationality are not eligible for ${country.name}.`)
  }
  if (applicantMatches(variant?.blockNationalities, nat)) {
    errs.push(`${variant.label} is not available for ${personal.nationality} nationals — choose another visa type.`)
  }

  // Passport min validity beyond entry
  const minMonths = rules.passport?.minMonthsBeyondEntry
  if (minMonths && trip?.entryDate && passport?.expiryDate) {
    const entry = new Date(trip.entryDate)
    const expiry = new Date(passport.expiryDate)
    const cutoff = new Date(entry); cutoff.setMonth(cutoff.getMonth() + minMonths)
    if (expiry < cutoff) {
      errs.push(`Passport must be valid at least ${minMonths} months past your entry date (${entry.toISOString().slice(0,10)}). Current expiry: ${passport.expiryDate}.`)
    }
  }

  // Passport-type restriction
  if (rules.passport?.ordinaryOnly && passport?.type && !/regular|ordinary/i.test(passport.type)) {
    errs.push(`${country.name} only accepts ordinary passports. Diplomatic / official not eligible.`)
  }

  // Surname required (India)
  if (rules.passport?.surnameRequired && personal?.lastName?.trim() === '') {
    errs.push(`${country.name} requires a surname on the passport. Applicants without a surname cannot apply through this channel.`)
  }

  // Apply window
  if (rules.applyWindow && trip?.entryDate) {
    const today = new Date(new Date().toDateString())
    const entry = new Date(trip.entryDate)
    const diffDays = Math.floor((entry - today) / 86400000)
    if (rules.applyWindow.minDaysBefore != null && diffDays < rules.applyWindow.minDaysBefore) {
      errs.push(`${country.name} requires applying at least ${rules.applyWindow.minDaysBefore} days before entry — you have ${diffDays} day(s).`)
    }
    if (rules.applyWindow.maxDaysBefore != null && diffDays > rules.applyWindow.maxDaysBefore) {
      errs.push(`${country.name} accepts applications within ${rules.applyWindow.maxDaysBefore} days of entry — your trip is ${diffDays} days away.`)
    }
  }

  // Stay length must fit the variant
  if (variant?.stay?.days && trip?.entryDate && trip?.exitDate) {
    const days = Math.ceil((new Date(trip.exitDate) - new Date(trip.entryDate)) / 86400000)
    if (days > variant.stay.days) {
      errs.push(`${variant.label} allows max ${variant.stay.days} days; your trip is ${days} days.`)
    }
  }

  // Minor age — Brazil
  if (rules.minorRules && personal?.dob) {
    const age = Math.floor((Date.now() - new Date(personal.dob).getTime()) / (365.25 * 86400000))
    if (age < rules.minorRules.ageBelow) {
      errs.push(`Applicant is ${age} years old — extra documents required for minors: ${rules.minorRules.extraDocs.join(', ')}.`)
    }
  }

  return errs
}

export function describeStay(variant) {
  if (!variant?.stay) return ''
  const { type, days, perEntryMaxDays, entries } = variant.stay
  if (type === 'total-across-entries') {
    return perEntryMaxDays
      ? `${days} day${days > 1 ? 's' : ''} total across ${entries || 'multiple'} entries (max ${perEntryMaxDays}/entry)`
      : `${days} day${days > 1 ? 's' : ''} total across ${entries || 'multiple'} entries`
  }
  return `${days} day${days > 1 ? 's' : ''} per entry`
}

export function describeValidity(variant) {
  if (!variant?.validity) return ''
  const { type, days } = variant.validity
  return type === 'days-from-arrival'
    ? `${days} day${days > 1 ? 's' : ''} from arrival`
    : `${days} day${days > 1 ? 's' : ''} from issue`
}
