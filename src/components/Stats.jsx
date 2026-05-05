import './Stats.css'

const stats = [
  { num: '99%', label: 'Tỷ lệ chấp thuận' },
  { num: '10+', label: 'Năm kinh nghiệm' },
  { num: '24/7', label: 'Hỗ trợ tiếng Việt' },
  { num: '150+', label: 'Quốc gia phục vụ' },
]

export default function Stats() {
  return (
    <section className="stats">
      <div className="container">
        <div className="stats-grid">
          {stats.map(s => (
            <div className="stat-item" key={s.label}>
              <div className="stat-num">{s.num}</div>
              <div className="stat-label">{s.label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
