import './Hero.css'

const NATIONALITIES = ['Việt Nam','Mỹ','Nhật Bản','Hàn Quốc','Trung Quốc','Pháp','Đức','Anh','Úc']
const DESTINATIONS = ['Thái Lan','Nhật Bản','Singapore','Indonesia','Hàn Quốc','Mỹ','Anh','Úc','Pháp']

export default function Hero({ onApplyClick }) {
  return (
    <section className="hero">
      <div className="hero-bg-glow" />
      <div className="container">
        <div className="hero-content">
          <div className="hero-badge">
            <span className="badge-dot" />
            Được tin dùng bởi 2 triệu+ người dùng
          </div>
          <h1 className="hero-title">
            Visa du lịch<br />
            <span className="hero-title-accent">nhanh & dễ dàng</span>
          </h1>
          <p className="hero-sub">
            Nộp đơn visa trực tuyến chỉ trong 10 phút.<br />
            Đội ngũ chuyên gia 24/7 hỗ trợ bạn từng bước.
          </p>
        </div>

        <div className="search-card">
          <h2 className="search-card-title">Kiểm tra visa bạn cần</h2>
          <div className="search-row">
            <div className="form-group">
              <label>Quốc tịch của bạn</label>
              <select>
                {NATIONALITIES.map(n => <option key={n}>{n}</option>)}
              </select>
            </div>
            <div className="form-group">
              <label>Điểm đến</label>
              <select>
                {DESTINATIONS.map(d => <option key={d}>{d}</option>)}
              </select>
            </div>
            <button className="btn-primary search-btn" onClick={onApplyClick}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/>
              </svg>
              Kiểm tra ngay
            </button>
          </div>
          <div className="trust-row">
            <TrustItem icon="shield" text="Bảo mật 256-bit" />
            <TrustItem icon="clock" text="Xét duyệt 24h" />
            <TrustItem icon="card" text="Hoàn tiền 100%" />
          </div>
        </div>
      </div>
    </section>
  )
}

function TrustItem({ icon, text }) {
  const icons = {
    shield: <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>,
    clock: <path d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"/>,
    card: <path d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z"/>
  }
  return (
    <div className="trust-item">
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--green)" strokeWidth="2">
        {icons[icon]}
      </svg>
      {text}
    </div>
  )
}
