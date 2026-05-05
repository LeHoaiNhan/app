import { useState } from 'react'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'

const DESTINATIONS = [
  { name:'Thái Lan', flag:'🇹🇭', time:'3-5 ngày', price:'$29', popular:true, tag:'Miễn phí visa' },
  { name:'Nhật Bản', flag:'🇯🇵', time:'5-7 ngày', price:'$49', popular:true, tag:'E-Visa' },
  { name:'Singapore', flag:'🇸🇬', time:'2-3 ngày', price:'$39', popular:false, tag:'E-Visa' },
  { name:'Indonesia', flag:'🇮🇩', time:'3-5 ngày', price:'$35', popular:false, tag:'Visa on Arrival' },
  { name:'Hàn Quốc', flag:'🇰🇷', time:'5-7 ngày', price:'$55', popular:true, tag:'E-Visa' },
  { name:'Mỹ', flag:'🇺🇸', time:'7-14 ngày', price:'$160', popular:false, tag:'Visa dán' },
  { name:'Anh', flag:'🇬🇧', time:'7-14 ngày', price:'$120', popular:false, tag:'Visa dán' },
  { name:'Úc', flag:'🇦🇺', time:'5-10 ngày', price:'$95', popular:false, tag:'E-Visa' },
  { name:'Pháp', flag:'🇫🇷', time:'10-15 ngày', price:'$80', popular:false, tag:'Schengen' },
  { name:'Đức', flag:'🇩🇪', time:'10-15 ngày', price:'$80', popular:false, tag:'Schengen' },
  { name:'Dubai', flag:'🇦🇪', time:'3-5 ngày', price:'$45', popular:true, tag:'E-Visa' },
  { name:'Ấn Độ', flag:'🇮🇳', time:'3-5 ngày', price:'$30', popular:false, tag:'E-Visa' },
]

const REGIONS = ['Tất cả','Đông Nam Á','Đông Á','Châu Âu','Châu Mỹ','Trung Đông']

export default function Destinations() {
  const [search, setSearch] = useState('')
  const [region, setRegion] = useState('Tất cả')

  const filtered = DESTINATIONS.filter(d =>
    d.name.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div className="min-h-screen" style={{background:'var(--gray50)'}}>
      <Navbar />

      {/* Hero */}
      <div className="py-12 md:py-20 text-center px-4" style={{background:'linear-gradient(135deg,var(--navy) 0%,#1a3060 100%)'}}>
        <h1 className="text-3xl md:text-5xl font-black text-white mb-3" style={{fontFamily:'Fraunces,serif'}}>
          Khám phá <span style={{color:'var(--gold)'}}>điểm đến</span>
        </h1>
        <p className="text-white/60 text-sm md:text-base mb-8">Hỗ trợ visa cho 150+ quốc gia trên thế giới</p>

        {/* Search */}
        <div className="max-w-md mx-auto relative">
          <svg className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/>
          </svg>
          <input
            className="w-full pl-11 pr-4 py-3.5 rounded-xl text-sm outline-none border-none shadow-lg"
            placeholder="Tìm quốc gia..."
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 py-10">
        {/* Regions */}
        <div className="flex gap-2 flex-wrap mb-8">
          {REGIONS.map(r => (
            <button
              key={r}
              onClick={() => setRegion(r)}
              className={`px-4 py-2 rounded-full text-sm font-semibold transition-all border ${region===r ? 'text-white border-transparent' : 'border-gray-200 text-gray-600 bg-white hover:border-gray-300'}`}
              style={region===r ? {background:'var(--blue)'} : {}}
            >{r}</button>
          ))}
        </div>

        {/* Popular */}
        <div className="mb-10">
          <h2 className="text-lg font-bold mb-5" style={{color:'var(--navy)'}}>⭐ Phổ biến nhất</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {filtered.filter(d=>d.popular).map(d => <DestCard key={d.name} d={d} />)}
          </div>
        </div>

        <div>
          <h2 className="text-lg font-bold mb-5" style={{color:'var(--navy)'}}>🌍 Tất cả điểm đến</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {filtered.map(d => <DestCard key={d.name} d={d} />)}
          </div>
        </div>
      </div>
      <Footer />
    </div>
  )
}

function DestCard({ d }) {
  return (
    <div className="bg-white border border-gray-200 rounded-xl p-4 hover:shadow-md hover:-translate-y-0.5 transition-all cursor-pointer group">
      <div className="text-4xl mb-3">{d.flag}</div>
      <h3 className="font-bold text-sm mb-1" style={{color:'var(--navy)'}}>{d.name}</h3>
      <span className="inline-block text-xs px-2 py-0.5 rounded-full mb-3 font-medium" style={{background:'var(--blue-light)',color:'var(--blue)'}}>{d.tag}</span>
      <div className="flex justify-between items-center text-xs text-gray-500">
        <span>⏱ {d.time}</span>
        <span className="font-bold text-sm" style={{color:'var(--blue)'}}>{d.price}</span>
      </div>
      <button className="w-full mt-3 py-2 rounded-lg text-xs font-bold text-white opacity-0 group-hover:opacity-100 transition-opacity" style={{background:'var(--blue)'}}>
        Đăng ký ngay
      </button>
    </div>
  )
}
