import { useEffect, useState } from 'react'
import { api, apiError } from '../lib/api'

const TAGS = ['E-Visa', 'Visa on Arrival', 'eTA', 'Visa-free']
const REGIONS = ['Southeast Asia', 'East Asia', 'Europe', 'Americas', 'Middle East', 'Oceania', 'Africa']

const TAG_COLORS = {
  'E-Visa':          { bg:'#EEF3FF', text:'#1B4FD8' },
  'Visa on Arrival': { bg:'#FFF7ED', text:'#D97706' },
  'eTA':             { bg:'#FDF4FF', text:'#9333EA' },
  'Visa-free':       { bg:'#ECFDF5', text:'#059669' },
}

const EMPTY = {
  name:'', flag:'', iso:'', region:'Southeast Asia', city:'',
  tag:'E-Visa', govFee:0,
  processingTime:'3-5 days', maxStay:'30 days', entries:'Single', validity:'3 months',
  description:'',
  popular:false, trending:false, active:true, sortOrder:0,
}

export default function AdminCountries() {
  const [countries, setCountries] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [search, setSearch] = useState('')
  const [regionFilter, setRegionFilter] = useState('all')
  const [editing, setEditing] = useState(null)
  const [creating, setCreating] = useState(false)

  const load = async () => {
    setLoading(true)
    setError(null)
    try {
      const { data } = await api.get('/countries')
      setCountries(data.countries)
    } catch (err) {
      setError(apiError(err, 'Failed to load countries'))
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { load() }, [])

  const term = search.trim().toLowerCase()
  const filtered = countries.filter(c => {
    const matchSearch = !term || c.name.toLowerCase().includes(term) || c.region.toLowerCase().includes(term) || c.iso.toLowerCase().includes(term)
    const matchRegion = regionFilter === 'all' || c.region === regionFilter
    return matchSearch && matchRegion
  })

  const handleDelete = async (id, name) => {
    if (!window.confirm(`Delete country "${name}"? This cannot be undone.`)) return
    try {
      await api.delete(`/countries/${id}`)
      setCountries(prev => prev.filter(c => c.id !== id))
    } catch (err) {
      alert(apiError(err, 'Delete failed'))
    }
  }

  const handleSave = async (form, id) => {
    try {
      if (id) {
        const { data } = await api.patch(`/countries/${id}`, form)
        setCountries(prev => prev.map(c => c.id === id ? data.country : c))
      } else {
        const { data } = await api.post('/countries', form)
        setCountries(prev => [...prev, data.country].sort((a, b) => a.sortOrder - b.sortOrder || a.name.localeCompare(b.name)))
      }
      setEditing(null)
      setCreating(false)
    } catch (err) {
      alert(apiError(err, 'Save failed'))
    }
  }

  return (
    <section style={{ background:'#F9FAFB', padding:'32px 20px 64px' }}>
      <div style={{ maxWidth:1200, margin:'0 auto' }}>
        <div style={{ background:'white', border:'1px solid #E5E7EB', borderRadius:14, overflow:'hidden', marginBottom:14 }}>
          <div style={{ padding:'14px 18px', borderBottom:'1px solid #F3F4F6', display:'flex', gap:10, flexWrap:'wrap', alignItems:'center' }}>
            <div style={{ position:'relative', flex:'1 1 240px' }}>
              <svg style={{ position:'absolute', left:12, top:'50%', transform:'translateY(-50%)', color:'#9CA3AF' }} width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/>
              </svg>
              <input
                style={{ width:'100%', padding:'10px 12px 10px 36px', borderRadius:8, border:'1px solid #E5E7EB', fontSize:13, outline:'none', fontFamily:'inherit' }}
                placeholder="Search by name, region, ISO..."
                value={search}
                onChange={e => setSearch(e.target.value)}
              />
            </div>
            <select
              style={{ padding:'10px 14px', borderRadius:8, border:'1px solid #E5E7EB', fontSize:13, background:'white', fontFamily:'inherit', outline:'none', cursor:'pointer', minWidth:180 }}
              value={regionFilter}
              onChange={e => setRegionFilter(e.target.value)}
            >
              <option value="all">All regions</option>
              {REGIONS.map(r => <option key={r} value={r}>{r}</option>)}
            </select>
            <button
              onClick={() => setCreating(true)}
              style={{ padding:'10px 18px', borderRadius:8, fontSize:13, fontWeight:700, border:'none', background:'var(--gold)', color:'var(--navy)', cursor:'pointer', fontFamily:'inherit' }}
            >+ Add country</button>
          </div>

          <div style={{ overflowX:'auto' }}>
            <table style={{ width:'100%', borderCollapse:'collapse', fontSize:14 }}>
              <thead>
                <tr style={{ background:'#F9FAFB', borderBottom:'1px solid #E5E7EB' }}>
                  {['Country','Region','Type','Gov fee','Processing','Flags',''].map((h, i) => (
                    <th key={i} style={{ padding:'12px 16px', fontSize:11, fontWeight:700, color:'#6B7280', textTransform:'uppercase', letterSpacing:'.06em', textAlign:'left', whiteSpace:'nowrap' }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filtered.map(c => {
                  const tagColor = TAG_COLORS[c.tag] || { bg:'#F3F4F6', text:'#6B7280' }
                  return (
                    <tr key={c.id} style={{ borderBottom:'1px solid #F3F4F6', opacity: c.active ? 1 : 0.55 }}>
                      <td style={{ padding:'12px 16px' }}>
                        <div style={{ display:'flex', alignItems:'center', gap:10 }}>
                          <span style={{ fontSize:22 }}>{c.flag}</span>
                          <div>
                            <div style={{ fontWeight:700, color:'var(--navy)', fontSize:14 }}>{c.name}</div>
                            <div style={{ fontSize:11, color:'#9CA3AF' }}>{c.iso.toUpperCase()} · {c.city}</div>
                          </div>
                        </div>
                      </td>
                      <td style={{ padding:'12px 16px', fontSize:13, color:'#6B7280' }}>{c.region}</td>
                      <td style={{ padding:'12px 16px' }}>
                        <span style={{ fontSize:11, fontWeight:700, padding:'3px 10px', borderRadius:50, background:tagColor.bg, color:tagColor.text, whiteSpace:'nowrap' }}>{c.tag}</span>
                      </td>
                      <td style={{ padding:'12px 16px', fontSize:13, color:'var(--navy)', fontWeight:600 }}>{c.govFee == null ? '—' : `$${c.govFee}`}</td>
                      <td style={{ padding:'12px 16px', fontSize:13, color:'#6B7280' }}>{c.processingTime}</td>
                      <td style={{ padding:'12px 16px' }}>
                        <div style={{ display:'flex', gap:4, flexWrap:'wrap' }}>
                          {c.popular && <span title="Popular" style={{ fontSize:10, fontWeight:700, padding:'2px 7px', borderRadius:4, background:'#FFFBEB', color:'#92400E' }}>POPULAR</span>}
                          {c.trending && <span title="Trending" style={{ fontSize:10, fontWeight:700, padding:'2px 7px', borderRadius:4, background:'#FEE2E2', color:'#991B1B' }}>TRENDING</span>}
                          {!c.active && <span title="Inactive" style={{ fontSize:10, fontWeight:700, padding:'2px 7px', borderRadius:4, background:'#F3F4F6', color:'#6B7280' }}>INACTIVE</span>}
                        </div>
                      </td>
                      <td style={{ padding:'12px 16px', textAlign:'right', whiteSpace:'nowrap' }}>
                        <button onClick={() => setEditing(c)} style={{ padding:'6px 12px', fontSize:12, fontWeight:600, borderRadius:6, border:'1px solid #E5E7EB', background:'white', cursor:'pointer', fontFamily:'inherit', marginRight:6, color:'var(--blue)' }}>Edit</button>
                        <button onClick={() => handleDelete(c.id, c.name)} style={{ padding:'6px 12px', fontSize:12, fontWeight:600, borderRadius:6, border:'1px solid #FECACA', background:'white', cursor:'pointer', fontFamily:'inherit', color:'#DC2626' }}>Delete</button>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>

          {!loading && filtered.length === 0 && (
            <div style={{ textAlign:'center', padding:'48px 20px' }}>
              <div style={{ fontSize:38, opacity:0.5, marginBottom:8 }}>🌍</div>
              <p style={{ fontSize:14, color:'#6B7280' }}>No countries match your filter</p>
            </div>
          )}
        </div>

        <div style={{ fontSize:12, color:'#9CA3AF', textAlign:'center' }}>
          {loading ? 'Loading…' : error ? `Error: ${error}` : `Showing ${filtered.length} of ${countries.length} countries`}
        </div>
      </div>

      {(editing || creating) && (
        <CountryFormModal
          initial={editing || EMPTY}
          isEdit={!!editing}
          onClose={() => { setEditing(null); setCreating(false) }}
          onSave={(form) => handleSave(form, editing?.id)}
        />
      )}
    </section>
  )
}

function CountryFormModal({ initial, isEdit, onClose, onSave }) {
  const [form, setForm] = useState(() => ({
    ...EMPTY,
    ...initial,
    govFee: initial.govFee == null ? '' : initial.govFee,
    sortOrder: initial.sortOrder ?? 0,
  }))
  const [saving, setSaving] = useState(false)

  const set = (k) => (v) => setForm(p => ({ ...p, [k]: v }))

  const handleSubmit = async (e) => {
    e.preventDefault()
    setSaving(true)
    const payload = {
      ...form,
      govFee: form.govFee === '' || form.govFee == null ? null : Number(form.govFee),
      sortOrder: Number(form.sortOrder) || 0,
    }
    await onSave(payload)
    setSaving(false)
  }

  return (
    <div style={{ position:'fixed', inset:0, zIndex:200, display:'flex', alignItems:'center', justifyContent:'center', padding:16 }} onClick={onClose}>
      <div style={{ position:'absolute', inset:0, background:'rgba(0,0,0,0.6)', backdropFilter:'blur(4px)' }} />
      <form
        onSubmit={handleSubmit}
        onClick={e => e.stopPropagation()}
        className="fade-up"
        style={{ position:'relative', background:'white', borderRadius:16, width:'100%', maxWidth:720, maxHeight:'90vh', overflowY:'auto', boxShadow:'0 32px 80px rgba(0,0,0,0.3)' }}
      >
        <div style={{ padding:'20px 28px', borderBottom:'1px solid #F3F4F6', display:'flex', alignItems:'center', justifyContent:'space-between', position:'sticky', top:0, background:'white', zIndex:10 }}>
          <div>
            <h2 style={{ fontFamily:'Fraunces,serif', fontSize:22, fontWeight:900, color:'var(--navy)' }}>{isEdit ? 'Edit country' : 'Add country'}</h2>
            <p style={{ fontSize:12, color:'#6B7280', marginTop:2 }}>{isEdit ? `${initial.name} · ${initial.iso?.toUpperCase()}` : 'Add a new destination to the catalog'}</p>
          </div>
          <button type="button" onClick={onClose} style={{ width:32, height:32, borderRadius:'50%', border:'none', background:'#F3F4F6', cursor:'pointer', fontSize:14, color:'#6B7280' }}>✕</button>
        </div>

        <div style={{ padding:'24px 28px', display:'grid', gridTemplateColumns:'repeat(auto-fit,minmax(220px,1fr))', gap:14 }}>
          <Field label="Name" required>
            <input className="field-input" required value={form.name} onChange={e => set('name')(e.target.value)} placeholder="Thailand" />
          </Field>
          <Field label="Flag (emoji)" required>
            <input className="field-input" required value={form.flag} onChange={e => set('flag')(e.target.value)} placeholder="🇹🇭" />
          </Field>
          <Field label="ISO code" required hint="2 letters, lowercase">
            <input className="field-input" required maxLength={3} value={form.iso} onChange={e => set('iso')(e.target.value.toLowerCase())} placeholder="th" />
          </Field>
          <Field label="Region" required>
            <select className="field-input" required value={form.region} onChange={e => set('region')(e.target.value)}>
              {REGIONS.map(r => <option key={r} value={r}>{r}</option>)}
            </select>
          </Field>
          <Field label="City / showcase" required>
            <input className="field-input" required value={form.city} onChange={e => set('city')(e.target.value)} placeholder="Bangkok" />
          </Field>
          <Field label="Visa type" required>
            <select className="field-input" required value={form.tag} onChange={e => set('tag')(e.target.value)}>
              {TAGS.map(t => <option key={t} value={t}>{t}</option>)}
            </select>
          </Field>
          <Field label="Government fee (USD)" hint="Leave empty for visa-free">
            <input className="field-input" type="number" min={0} value={form.govFee} onChange={e => set('govFee')(e.target.value)} placeholder="30" />
          </Field>
          <Field label="Processing time" required>
            <input className="field-input" required value={form.processingTime} onChange={e => set('processingTime')(e.target.value)} placeholder="3-5 days" />
          </Field>
          <Field label="Max stay" required>
            <input className="field-input" required value={form.maxStay} onChange={e => set('maxStay')(e.target.value)} placeholder="30 days" />
          </Field>
          <Field label="Entries" required>
            <input className="field-input" required value={form.entries} onChange={e => set('entries')(e.target.value)} placeholder="Single / Multiple" />
          </Field>
          <Field label="Visa validity" required>
            <input className="field-input" required value={form.validity} onChange={e => set('validity')(e.target.value)} placeholder="3 months" />
          </Field>
          <Field label="Sort order" hint="Lower = appears earlier">
            <input className="field-input" type="number" value={form.sortOrder} onChange={e => set('sortOrder')(e.target.value)} />
          </Field>
        </div>

        <div style={{ padding:'0 28px 12px' }}>
          <Field label="Description" required>
            <textarea
              className="field-input"
              required rows={3}
              value={form.description}
              onChange={e => set('description')(e.target.value)}
              placeholder="Tropical paradise with affordable costs..."
            />
          </Field>
        </div>

        <div style={{ padding:'0 28px 24px', display:'flex', gap:18, flexWrap:'wrap' }}>
          <Toggle label="Popular" checked={form.popular} onChange={v => set('popular')(v)} />
          <Toggle label="Trending" checked={form.trending} onChange={v => set('trending')(v)} />
          <Toggle label="Active" checked={form.active} onChange={v => set('active')(v)} />
        </div>

        <div style={{ padding:'16px 28px', borderTop:'1px solid #F3F4F6', display:'flex', gap:10, justifyContent:'flex-end', position:'sticky', bottom:0, background:'white' }}>
          <button type="button" onClick={onClose} className="btn-secondary" style={{ padding:'10px 22px' }}>Cancel</button>
          <button type="submit" disabled={saving} className="btn-primary" style={{ padding:'10px 22px', background:'var(--gold)', color:'var(--navy)' }}>
            {saving ? 'Saving…' : (isEdit ? 'Save changes' : 'Create country')}
          </button>
        </div>
      </form>
    </div>
  )
}

function Field({ label, required, hint, children }) {
  return (
    <div>
      <label style={{ display:'block', fontSize:11, fontWeight:700, color:'#6B7280', textTransform:'uppercase', letterSpacing:'.06em', marginBottom:4 }}>
        {label}{required && <span style={{ color:'#DC2626' }}> *</span>}
      </label>
      {children}
      {hint && <div style={{ fontSize:11, color:'#9CA3AF', marginTop:4 }}>{hint}</div>}
    </div>
  )
}

function Toggle({ label, checked, onChange }) {
  return (
    <label style={{ display:'inline-flex', alignItems:'center', gap:8, cursor:'pointer', fontSize:13, fontWeight:600, color:'var(--navy)' }}>
      <input type="checkbox" checked={checked} onChange={e => onChange(e.target.checked)} style={{ width:16, height:16, cursor:'pointer' }} />
      {label}
    </label>
  )
}
