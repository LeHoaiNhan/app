/**
 * Per-country eVisa rules — drives form variants, fees, and validation.
 *
 * Each entry is keyed by Country.name and merged into the seeded country row
 * via `variants` (visa-type options) and `rules` (cross-cutting policy).
 *
 * variants[] item shape:
 *   key            stable id used by the order payload
 *   label          shown in the UI dropdown
 *   purpose[]      allowed trip purposes for this variant (omit = any)
 *   entries        'single' | 'multiple' | 'double'
 *   validity       { type: 'days-from-issue' | 'days-from-arrival', days }
 *   stay           { type: 'per-entry' | 'total-across-entries', days, entries? }
 *   govFee         number — government fee in USD (per applicant)
 *   blockNationalities[] iso2 list that cannot pick this variant
 *
 * rules object shape:
 *   passport: { ordinaryOnly?, surnameRequired?, minMonthsBeyondEntry? }
 *   blockOrigin[]            iso2 nationalities barred from any variant
 *   requiredDocs[]           'passport' | 'photo' | 'hotel' | 'ticket' | 'host_letter' | 'company_letter' | 'birth_cert' | 'auth_letter' | 'non_citizen_stmt'
 *   applyWindow              { minDaysBefore?, maxDaysBefore? }
 *   schengenIdAlt[]          iso2 nationalities allowed to substitute ID card for passport
 *   notes[]                  free-text operational notes shown to admin
 */

export const COUNTRY_RULES = {
  Kenya: {
    variants: [
      { key:'eta-90',   label:'eTA — 90 day single', purpose:['Tourism','Business / Work','Visiting family','Transit','Conference','Religious'],
        entries:'single', validity:{ type:'days-from-issue', days:90 }, stay:{ type:'per-entry', days:90 }, govFee:30 },
    ],
    rules: {
      passport: { ordinaryOnly:true, minMonthsBeyondEntry:6 },
      requiredDocs: ['passport','photo','hotel','ticket'],
      conditionalDocs: {
        'Visiting family': ['host_passport','host_letter_or_hotel'],
        'Business / Work': ['company_letter'],
      },
      notes: ['Kenya replaced eVisa with eTA in Jan 2024 — all visitors must apply.'],
    },
  },

  India: {
    variants: [
      { key:'tourist-30d', label:'Tourist — 30 days, double entry',
        entries:'double', validity:{ type:'days-from-arrival', days:30 },
        stay:{ type:'total-across-entries', days:30, entries:2 }, govFee:25 },
      { key:'tourist-1y',  label:'Tourist — 1 year, multiple entry',
        entries:'multiple', validity:{ type:'days-from-issue', days:365 },
        stay:{ type:'per-entry', days:90 }, govFee:40 },
      { key:'tourist-5y',  label:'Tourist — 5 years, multiple entry',
        entries:'multiple', validity:{ type:'days-from-issue', days:1825 },
        stay:{ type:'per-entry', days:90 }, govFee:80,
        blockNationalities:['ca'] },
    ],
    rules: {
      passport: { ordinaryOnly:true, surnameRequired:true, minMonthsBeyondEntry:6 },
      blockOrigin: ['pk','af'],
      requiredDocs: ['passport','photo'],
      notes: ['CA nationals: no 5-year tourist (political).', 'PAK/AFG origin: cannot apply.'],
    },
  },

  'Sri Lanka': {
    variants: [
      { key:'eta-tourist',  label:'Tourist ETA — 30 day double entry',  purpose:['Tourism','Visiting family','Transit'],
        entries:'double', validity:{ type:'days-from-issue', days:180 }, stay:{ type:'per-entry', days:30 }, govFee:35 },
      { key:'eta-business', label:'Business ETA — 30 day double entry', purpose:['Business / Work'],
        entries:'double', validity:{ type:'days-from-issue', days:180 }, stay:{ type:'per-entry', days:30 }, govFee:40 },
    ],
    rules: {
      passport: { minMonthsBeyondEntry:6 },
      requiredDocs: ['passport'],
      childrenFreeUnder: 12,
      manualReviewNationalities: ['pk','np'],
      titleByGender: { Male:'Mr', Female:'Ms' },
      notes: ['PAK/Nepal: passport sent to gov via etarac@immigration.gov.lk.', 'Past travel date → waitlist.'],
    },
  },

  Ethiopia: {
    variants: [
      { key:'tourist-30',  label:'Tourist — 30 days single', purpose:['Tourism','Visiting family'],
        entries:'single', validity:{ type:'days-from-arrival', days:30 }, stay:{ type:'per-entry', days:30 }, govFee:82 },
      { key:'tourist-90',  label:'Tourist — 90 days single', purpose:['Tourism','Visiting family'],
        entries:'single', validity:{ type:'days-from-arrival', days:90 }, stay:{ type:'per-entry', days:90 }, govFee:202 },
    ],
    rules: {
      passport: { allowTravelDocument:true, minMonthsBeyondEntry:6 },
      requiredDocs: ['passport','photo'],
      notes: ['Travel document allowed — verify nationality matches issuing country.'],
    },
  },

  Vietnam: {
    variants: [
      { key:'evisa-single',   label:'eVisa — 90 day single',   purpose:['Tourism','Business / Work','Visiting family'],
        entries:'single',   validity:{ type:'days-from-issue', days:90 }, stay:{ type:'per-entry', days:90 }, govFee:25 },
      { key:'evisa-multiple', label:'eVisa — 90 day multiple', purpose:['Tourism','Business / Work','Visiting family'],
        entries:'multiple', validity:{ type:'days-from-issue', days:90 }, stay:{ type:'per-entry', days:90 }, govFee:50 },
    ],
    rules: {
      passport: { minMonthsBeyondEntry:6 },
      requiredDocs: ['passport','photo'],
      delivery: { weekdays:[1,2,3,4,5], note:'Returned Mon-Fri only; Thursday batches the next 3 paid days.' },
    },
  },

  Canada: {
    variants: [
      { key:'eta-5y', label:'eTA — 5 year multiple entry',
        entries:'multiple', validity:{ type:'days-from-issue', days:1825 }, stay:{ type:'per-entry', days:180 }, govFee:7 },
    ],
    rules: {
      passport: { ordinaryOnly:true, minMonthsBeyondEntry:6 },
      requiredDocs: ['passport'],
      notes: ['Passport-only, no upload — applicant types details.'],
    },
  },

  Egypt: {
    variants: [
      { key:'single', label:'Single entry — 90 day validity / 30 day stay',
        entries:'single',   validity:{ type:'days-from-issue', days:90  }, stay:{ type:'per-entry',           days:30  }, govFee:25 },
      { key:'multi',  label:'Multiple entry — 180 day validity / 30 day per stay (180 total)',
        entries:'multiple', validity:{ type:'days-from-issue', days:180 }, stay:{ type:'total-across-entries', days:180, perEntryMaxDays:30 }, govFee:60 },
    ],
    rules: {
      passport: { ordinaryOnly:true, minMonthsBeyondEntry:6, noSpecialChars:true },
      requiredDocs: ['passport'],
      schengenIdAlt: ['be','fr','de','it','pt'],
      groupApplication: ['in','xk','ba'],
      applyWindow: { minDaysBefore:0, maxDaysBefore:30 },
      notes: ['Apply ≤ 30 days before departure; otherwise waitlist.', 'Draft auto-deletes after 7 days.', 'No special chars / spaces in form.'],
    },
  },

  Madagascar: {
    variants: [
      { key:'tourist-15', label:'Tourist — 15 day single', entries:'single', validity:{ type:'days-from-arrival', days:15 }, stay:{ type:'per-entry', days:15 }, govFee:35 },
      { key:'tourist-30', label:'Tourist — 30 day single', entries:'single', validity:{ type:'days-from-arrival', days:30 }, stay:{ type:'per-entry', days:30 }, govFee:45 },
      { key:'tourist-60', label:'Tourist — 60 day single', entries:'single', validity:{ type:'days-from-arrival', days:60 }, stay:{ type:'per-entry', days:60 }, govFee:55, blockNationalities:['pk','in'] },
    ],
    rules: {
      passport: { minMonthsBeyondEntry:6 },
      requiredDocs: ['passport'],
      applyWindow: { minDaysBefore:7 },
      notes: ['Apply ≥ 7 days before departure (apply day excluded).', 'No order ID — status checked via web.'],
    },
  },

  Brazil: {
    variants: [
      { key:'evisa-5y', label:'eVisa — up to 5 years multiple, 90 day per stay', purpose:['Tourism','Business / Work','Transit'],
        entries:'multiple', validity:{ type:'days-from-issue', days:1825 }, stay:{ type:'per-entry', days:90 }, govFee:80 },
    ],
    rules: {
      passport: { format:'jpg', minMonthsBeyondEntry:6 },
      requiredDocs: ['passport','photo'],
      onlyNationalities: ['us','ca','au'],
      minorRules: {
        ageBelow: 18,
        extraDocs: ['parent_passport_with_signature','authorization_letter_notarized','birth_certificate'],
        brazilianParentExtra: ['statement_of_non_citizenship'],
      },
      notes: ['Restricted to USA / Canada / Australia nationals.', 'Processing 9-15 days.'],
    },
  },
}
