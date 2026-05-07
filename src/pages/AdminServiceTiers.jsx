import { useEffect, useState } from 'react'
import { api, apiError } from '../lib/api'

const EMPTY = {
  key:'', label:'', fee:0, processingTime:'', description:'',
  features: [],
  accent:'#1B4FD8', popular:false, active:true, sortOrder:0,
}

export default function AdminServiceTiers() {
  const [tiers, setTiers] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [editing, setEditing] = useState(null)
  const [creating, setCreating] = useState(false)

  const load = async () => {
    setLoading(true)
    setError(null)
    try {
      const { data } = await api.get('/service-tiers')
      setTiers(data.tiers)
    } catch (err) {
      setError(apiError(err, 'Failed to load tiers'))
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { load() }, [])

  const handleDelete = async (id, label) => {
    if (!window.confirm(`Delete tier "${label}"? Existing orders won't be affected, but new orders won't be able to pick this tier.`)) return
    try {
      await api.delete(`/service-tiers/${id}`)
      setTiers(prev => prev.filter(t => t.id !== id))
    } catch (err) {
      alert(apiError(err, 'Delete failed'))
    }
  }

  const handleSave = async (form, id) => {
    try {
      if (id) {
        const { data } = await api.patch(`/service-tiers/${id}`, form)
        setTiers(prev => prev.map(t => t.id === id ? data.tier : t))
      } else {
        const { data } = await api.post('/service-tiers', form)
        setTiers(prev => [...prev, data.tier].sort((a, b) => a.sortOrder - b.sortOrder || a.fee - b.fee))
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
        <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:14, flexWrap:'wrap', gap:10 }}>
          <div>
            <h2 style={{ fontFamily:'Fraunces,serif', fontSize:22, fontWeight:900, color:'var(--navy)' }}>Service tiers</h2>
            <p style={{ fontSize:13, color:'#6B7280' }}>Pricing tiers customers pick during checkout (Standard / Fast / Express)</p>
          </div>
          <button
            onClick={() => setCreating(true)}
            style={{ padding:'10px 18px', borderRadius:8, fontSize:13, fontWeight:700, border:'none', background:'var(--gold)', color:'var(--navy)', cursor:'pointer', fontFamily:'inherit' }}
          >+ Add tier</button>
        </div>

        <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fit,minmax(280px,1fr))', gap:14 }}>
          {tiers.map(t => (
            <div key={t.id} style={{ background:'white', border: t.popular ? `2px solid ${t.accent}` : '1px solid #E5E7EB', borderRadius:14, padding:20, position:'relative', opacity: t.active ? 1 : 0.6 }}>
              {t.popular && <span style={{ position:'absolute', top:-10, left:18, fontSize:10, fontWeight:700, padding:'3px 10px', borderRadius:50, background:t.accent, color:'white' }}>POPULAR</span>}
              <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-start', marginBottom:6 }}>
                <div>
                  <div style={{ fontFamily:'monospace', fontSize:11, color:'#9CA3AF' }}>{t.key}</div>
                  <h3 style={{ fontFamily:'Fraunces,serif', fontSize:22, fontWeight:900, color:'var(--navy)' }}>{t.label}</h3>
                </div>
                {!t.active && <span style={{ fontSize:10, fontWeight:700, padding:'2px 7px', borderRadius:4, background:'#F3F4F6', color:'#6B7280' }}>INACTIVE</span>}
              </div>
              <p style={{ fontSize:12, color:'#6B7280', marginBottom:14 }}>{t.description}</p>
              <div style={{ display:'flex', alignItems:'baseline', gap:6, marginBottom:10 }}>
                <span style={{ fontSize:32, fontWeight:900, color:t.accent }}>${t.fee}</span>
                <span style={{ fontSize:12, color:'#6B7280' }}>service fee</span>
              </div>
              <div style={{ fontSize:12, fontWeight:600, color:t.accent, marginBottom:14 }}>⏱ {t.processingTime}</div>
              <ul style={{ listStyle:'none', padding:0, margin:'0 0 14px', fontSize:12, color:'#374151' }}>
                {(t.features || []).map((f, i) => (
                  <li key={i} style={{ display:'flex', gap:6, marginBottom:5 }}>
                    <span style={{ color:t.accent }}>✓</span>{f}
                  </li>
                ))}
              </ul>
              <div style={{ display:'flex', gap:8, paddingTop:12, borderTop:'1px solid #F3F4F6' }}>
                <button onClick={() => setEditing(t)} style={{ flex:1, padding:'8px 12px', fontSize:12, fontWeight:600, borderRadius:6, border:'1px solid #E5E7EB', background:'white', cursor:'pointer', fontFamily:'inherit', color:'var(--blue)' }}>Edit</button>
                <button onClick={() => handleDelete(t.id, t.label)} style={{ flex:1, padding:'8px 12px', fontSize:12, fontWeight:600, borderRadius:6, border:'1px solid #FECACA', background:'white', cursor:'pointer', fontFamily:'inherit', color:'#DC2626' }}>Delete</button>
              </div>
            </div>
          ))}
        </div>

        {!loading && tiers.length === 0 && (
          <div style={{ textAlign:'center', padding:'48px 20px', background:'white', border:'1px solid #E5E7EB', borderRadius:14 }}>
            <div style={{ fontSize:38, opacity:0.5, marginBottom:8 }}>💰</div>
            <p style={{ fontSize:14, color:'#6B7280' }}>No service tiers — click "+ Add tier" to create one</p>
          </div>
        )}

        <div style={{ fontSize:12, color:'#9CA3AF', textAlign:'center', marginTop:18 }}>
          {loading ? 'Loading…' : error ? `Error: ${error}` : `${tiers.length} tier${tiers.length === 1 ? '' : 's'}`}
        </div>
      </div>

      {(editing || creating) && (
        <TierFormModal
          initial={editing || EMPTY}
          isEdit={!!editing}
          onClose={() => { setEditing(null); setCreating(false) }}
          onSave={(form) => handleSave(form, editing?.id)}
        />
      )}
    </section>
  )
}

function TierFormModal({ initial, isEdit, onClose, onSave }) {
  const [form, setForm] = useState(() => ({
    ...EMPTY,
    ...initial,
    features: Array.isArray(initial.features) ? initial.features.join('\n') : '',
  }))
  const [saving, setSaving] = useState(false)

  const set = (k) => (v) => setForm(p => ({ ...p, [k]: v }))

  const handleSubmit = async (e) => {
    e.preventDefault()
    setSaving(true)
    const payload = {
      ...form,
      fee: Number(form.fee) || 0,
      sortOrder: Number(form.sortOrder) || 0,
      features: form.features.split('\n').map(s => s.trim()).filter(Boolean),
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
        style={{ position:'relative', background:'white', borderRadius:16, width:'100%', maxWidth:560, maxHeight:'90vh', overflowY:'auto', boxShadow:'0 32px 80px rgba(0,0,0,0.3)' }}
      >
        <div style={{ padding:'20px 28px', borderBottom:'1px solid #F3F4F6', display:'flex', alignItems:'center', justifyContent:'space-between', position:'sticky', top:0, background:'white', zIndex:10 }}>
          <div>
            <h2 style={{ fontFamily:'Fraunces,serif', fontSize:22, fontWeight:900, color:'var(--navy)' }}>{isEdit ? 'Edit tier' : 'Add tier'}</h2>
            <p style={{ fontSize:12, color:'#6B7280', marginTop:2 }}>{isEdit ? `${initial.label} (${initial.key})` : 'Create a new pricing tier'}</p>
          </div>
          <button type="button" onClick={onClose} style={{ width:32, height:32, borderRadius:'50%', border:'none', background:'#F3F4F6', cursor:'pointer', fontSize:14, color:'#6B7280' }}>✕</button>
        </div>

        <div style={{ padding:'24px 28px', display:'grid', gridTemplateColumns:'1fr 1fr', gap:14 }}>
          <Field label="Key" required hint="lowercase, no spaces (e.g. 'fast')">
            <input className="field-input" required value={form.key} onChange={e => set('key')(e.target.value.toLowerCase().replace(/\s/g, ''))} placeholder="fast" disabled={isEdit} />
          </Field>
          <Field label="Label" required>
            <input className="field-input" required value={form.label} onChange={e => set('label')(e.target.value)} placeholder="Fast" />
          </Field>
          <Field label="Service fee (USD)" required>
            <input className="field-input" required type="number" min={0} value={form.fee} onChange={e => set('fee')(e.target.value)} />
          </Field>
          <Field label="Processing time" required>
            <input className="field-input" required value={form.processingTime} onChange={e => set('processingTime')(e.target.value)} placeholder="2-3 business days" />
          </Field>
          <Field label="Accent color" required hint="hex code">
            <input className="field-input" required type="color" value={form.accent} onChange={e => set('accent')(e.target.value)} style={{ height:42, padding:4 }} />
          </Field>
          <Field label="Sort order">
            <input className="field-input" type="number" value={form.sortOrder} onChange={e => set('sortOrder')(e.target.value)} />
          </Field>
        </div>

        <div style={{ padding:'0 28px 12px' }}>
          <Field label="Description" required>
            <input className="field-input" required value={form.description} onChange={e => set('description')(e.target.value)} placeholder="Our most popular plan" />
          </Field>
        </div>

        <div style={{ padding:'0 28px 12px' }}>
          <Field label="Features" hint="one per line">
            <textarea
              className="field-input"
              rows={6}
              value={form.features}
              onChange={e => set('features')(e.target.value)}
              placeholder="Expert file review&#10;Priority processing&#10;100% refund if rejected"
            />
          </Field>
        </div>

        <div style={{ padding:'0 28px 24px', display:'flex', gap:18, flexWrap:'wrap' }}>
          <Toggle label="Popular" checked={form.popular} onChange={v => set('popular')(v)} />
          <Toggle label="Active" checked={form.active} onChange={v => set('active')(v)} />
        </div>

        <div style={{ padding:'16px 28px', borderTop:'1px solid #F3F4F6', display:'flex', gap:10, justifyContent:'flex-end', position:'sticky', bottom:0, background:'white' }}>
          <button type="button" onClick={onClose} className="btn-secondary" style={{ padding:'10px 22px' }}>Cancel</button>
          <button type="submit" disabled={saving} className="btn-primary" style={{ padding:'10px 22px', background:'var(--gold)', color:'var(--navy)' }}>
            {saving ? 'Saving…' : (isEdit ? 'Save changes' : 'Create tier')}
          </button>
        </div>
      </form>
    </div>
  )
}

function Field({ label, required, hint, children }) {
  return (
    <div style={{ gridColumn: 'span 1' }}>
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
