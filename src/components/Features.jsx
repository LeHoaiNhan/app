import './Features.css'

const features = [
  {
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="var(--blue)" strokeWidth="2">
        <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z"/>
      </svg>
    ),
    bg: '#EEF3FF',
    title: 'Nhanh chóng',
    desc: 'Hoàn tất đơn trong 10 phút. Nhận visa trong 24 giờ với dịch vụ ưu tiên.'
  },
  {
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="var(--green)" strokeWidth="2">
        <path d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"/>
      </svg>
    ),
    bg: '#F0FDF4',
    title: 'An toàn tuyệt đối',
    desc: 'Mã hóa SSL 256-bit. Dữ liệu cá nhân bảo vệ theo tiêu chuẩn quốc tế.'
  },
  {
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="var(--gold)" strokeWidth="2">
        <path d="M18 20V10M12 20V4M6 20v-6"/>
      </svg>
    ),
    bg: '#FFF7ED',
    title: 'Tỷ lệ thành công cao',
    desc: '99% đơn được chấp thuận. Chuyên gia kiểm tra hồ sơ kỹ lưỡng.'
  },
]

export default function Features() {
  return (
    <section className="features">
      <div className="container">
        <div className="features-header">
          <h2>Tại sao chọn eVisa?</h2>
          <p>Chúng tôi đơn giản hóa quy trình để bạn tập trung vào chuyến đi</p>
        </div>
        <div className="features-grid">
          {features.map(f => (
            <div className="feature-card" key={f.title}>
              <div className="feature-icon" style={{background: f.bg}}>{f.icon}</div>
              <h3>{f.title}</h3>
              <p>{f.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
