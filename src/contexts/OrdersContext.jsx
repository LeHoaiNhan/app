import { createContext, useContext, useState, useEffect } from 'react'

const STORAGE_KEY = 'evisa_orders_v1'

export const ORDER_STATUSES = {
  submitted: { label: 'Đã nộp đơn',         icon: '📝', color: '#6B7280', bg: '#F3F4F6' },
  review:    { label: 'Đang kiểm tra',      icon: '🔍', color: '#1B4FD8', bg: '#EEF3FF' },
  sent:      { label: 'Đã gửi cơ quan cấp', icon: '📤', color: '#9333EA', bg: '#FDF4FF' },
  approved:  { label: 'Đã được duyệt',      icon: '✅', color: '#16A34A', bg: '#F0FDF4' },
  delivered: { label: 'Đã gửi email visa',  icon: '📧', color: '#059669', bg: '#ECFDF5' },
  rejected:  { label: 'Bị từ chối',         icon: '❌', color: '#DC2626', bg: '#FEF2F2' },
}

export const STAGE_FLOW = ['submitted', 'review', 'sent', 'approved', 'delivered']

const SEED_ORDERS = [
  {
    id: 'EV-A47B92', customerId: 'demo-customer', status: 'review',
    destination: 'Thái Lan', flag: '🇹🇭', visaType: 'E-Visa', processing: 'fast',
    fee: { gov: 30, service: 39, total: 69, currency: 'USD' },
    payment: { method: 'card', status: 'paid', paidAt: '2026-04-29T10:30:00Z' },
    applicant: {
      fullName: 'Nguyễn Văn An', email: 'nguyenvanan@gmail.com', phone: '+84 901 234 567',
      dob: '1995-03-12', gender: 'Nam', nationality: 'Việt Nam', birthPlace: 'TP. Hồ Chí Minh',
      photoURL: 'https://ui-avatars.com/api/?name=Nguyen+Van+An&background=1B4FD8&color=fff&size=200',
    },
    passport: {
      no: 'B1234567', type: 'Hộ chiếu phổ thông',
      issueDate: '2020-01-15', expiryDate: '2030-01-14',
      issuePlace: 'Cục Xuất nhập cảnh TP.HCM', issueCountry: 'Việt Nam',
    },
    trip: {
      purpose: 'Du lịch', entryDate: '2026-06-15', exitDate: '2026-06-25',
      accommodation: 'Hilton Sukhumvit Bangkok', notes: '',
    },
    timeline: [
      { stage: 'submitted', at: '2026-04-29T10:30:00Z', note: 'Đơn đã nhận, thanh toán $69 thành công' },
      { stage: 'review',    at: '2026-04-30T08:00:00Z', note: 'Chuyên gia đang kiểm tra hồ sơ' },
    ],
    createdAt: '2026-04-29T10:30:00Z', updatedAt: '2026-04-30T08:00:00Z',
  },
  {
    id: 'EV-X92K11', customerId: 'demo-customer', status: 'delivered',
    destination: 'Nhật Bản', flag: '🇯🇵', visaType: 'E-Visa', processing: 'normal',
    fee: { gov: 30, service: 19, total: 49, currency: 'USD' },
    payment: { method: 'card', status: 'paid', paidAt: '2026-03-15T14:20:00Z' },
    applicant: {
      fullName: 'Nguyễn Văn An', email: 'nguyenvanan@gmail.com', phone: '+84 901 234 567',
      dob: '1995-03-12', gender: 'Nam', nationality: 'Việt Nam', birthPlace: 'TP. Hồ Chí Minh',
      photoURL: 'https://ui-avatars.com/api/?name=Nguyen+Van+An&background=1B4FD8&color=fff&size=200',
    },
    passport: {
      no: 'B1234567', type: 'Hộ chiếu phổ thông',
      issueDate: '2020-01-15', expiryDate: '2030-01-14',
      issuePlace: 'Cục Xuất nhập cảnh TP.HCM', issueCountry: 'Việt Nam',
    },
    trip: {
      purpose: 'Du lịch', entryDate: '2026-04-01', exitDate: '2026-04-10',
      accommodation: 'Park Hotel Tokyo', notes: '',
    },
    timeline: [
      { stage: 'submitted', at: '2026-03-15T14:20:00Z', note: 'Đơn đã nhận' },
      { stage: 'review',    at: '2026-03-16T09:00:00Z', note: 'Hồ sơ hợp lệ' },
      { stage: 'sent',      at: '2026-03-17T11:00:00Z', note: 'Đã gửi đến cơ quan visa Nhật Bản' },
      { stage: 'approved',  at: '2026-03-21T15:00:00Z', note: 'Visa được chấp thuận' },
      { stage: 'delivered', at: '2026-03-21T16:30:00Z', note: 'Email visa đã gửi đến nguyenvanan@gmail.com' },
    ],
    createdAt: '2026-03-15T14:20:00Z', updatedAt: '2026-03-21T16:30:00Z',
  },
  {
    id: 'EV-P3L8M2', customerId: 'cust-002', status: 'submitted',
    destination: 'Hàn Quốc', flag: '🇰🇷', visaType: 'E-Visa', processing: 'express',
    fee: { gov: 30, service: 69, total: 99, currency: 'USD' },
    payment: { method: 'card', status: 'paid', paidAt: '2026-05-05T08:00:00Z' },
    applicant: {
      fullName: 'Trần Thị Bình', email: 'tranbinh@gmail.com', phone: '+84 902 345 678',
      dob: '1992-07-23', gender: 'Nữ', nationality: 'Việt Nam', birthPlace: 'Hà Nội',
      photoURL: 'https://ui-avatars.com/api/?name=Tran+Thi+Binh&background=F59E0B&color=fff&size=200',
    },
    passport: { no: 'C7654321', type: 'Hộ chiếu phổ thông', issueDate: '2023-05-10', expiryDate: '2033-05-10', issuePlace: 'Cục XNC Hà Nội', issueCountry: 'Việt Nam' },
    trip: { purpose: 'Du lịch', entryDate: '2026-05-15', exitDate: '2026-05-22', accommodation: 'Hotel Skypark Myeongdong', notes: 'Đi cùng bạn bè 4 người' },
    timeline: [{ stage: 'submitted', at: '2026-05-05T08:00:00Z', note: 'Đơn vừa được nhận, thanh toán thành công' }],
    createdAt: '2026-05-05T08:00:00Z', updatedAt: '2026-05-05T08:00:00Z',
  },
  {
    id: 'EV-K4N7T9', customerId: 'cust-003', status: 'sent',
    destination: 'Dubai (UAE)', flag: '🇦🇪', visaType: 'E-Visa', processing: 'fast',
    fee: { gov: 30, service: 39, total: 69, currency: 'USD' },
    payment: { method: 'ewallet', status: 'paid', paidAt: '2026-05-02T12:00:00Z' },
    applicant: {
      fullName: 'Lê Hoàng Cường', email: 'lehoangcuong@yahoo.com', phone: '+84 903 456 789',
      dob: '1988-11-05', gender: 'Nam', nationality: 'Việt Nam', birthPlace: 'Đà Nẵng',
      photoURL: 'https://ui-avatars.com/api/?name=Le+Hoang+Cuong&background=10B981&color=fff&size=200',
    },
    passport: { no: 'A5432167', type: 'Hộ chiếu phổ thông', issueDate: '2017-12-20', expiryDate: '2027-12-19', issuePlace: 'Cục XNC Đà Nẵng', issueCountry: 'Việt Nam' },
    trip: { purpose: 'Công tác', entryDate: '2026-05-20', exitDate: '2026-05-27', accommodation: 'Burj Al Arab', notes: '' },
    timeline: [
      { stage: 'submitted', at: '2026-05-02T12:00:00Z', note: 'Đơn nhận' },
      { stage: 'review',    at: '2026-05-02T14:30:00Z', note: 'Hồ sơ hợp lệ' },
      { stage: 'sent',      at: '2026-05-03T09:00:00Z', note: 'Đã gửi cơ quan UAE' },
    ],
    createdAt: '2026-05-02T12:00:00Z', updatedAt: '2026-05-03T09:00:00Z',
  },
  {
    id: 'EV-Q9F2R8', customerId: 'cust-004', status: 'rejected',
    destination: 'Thổ Nhĩ Kỳ', flag: '🇹🇷', visaType: 'E-Visa', processing: 'normal',
    fee: { gov: 30, service: 19, total: 49, currency: 'USD' },
    payment: { method: 'card', status: 'refunded', paidAt: '2026-04-20T10:00:00Z' },
    applicant: {
      fullName: 'Phạm Minh Đức', email: 'phamminhduc@gmail.com', phone: '+84 904 567 890',
      dob: '1990-02-28', gender: 'Nam', nationality: 'Việt Nam', birthPlace: 'Hải Phòng',
      photoURL: 'https://ui-avatars.com/api/?name=Pham+Minh+Duc&background=DC2626&color=fff&size=200',
    },
    passport: { no: 'D9871234', type: 'Hộ chiếu phổ thông', issueDate: '2021-08-15', expiryDate: '2026-08-15', issuePlace: 'Cục XNC Hải Phòng', issueCountry: 'Việt Nam' },
    trip: { purpose: 'Du lịch', entryDate: '2026-05-10', exitDate: '2026-05-18', accommodation: 'Sultan Hotel Istanbul', notes: '' },
    timeline: [
      { stage: 'submitted', at: '2026-04-20T10:00:00Z', note: 'Đơn nhận' },
      { stage: 'review',    at: '2026-04-20T11:30:00Z', note: 'Phát hiện hộ chiếu sắp hết hạn' },
      { stage: 'rejected',  at: '2026-04-21T09:00:00Z', note: 'Hộ chiếu chỉ còn 4 tháng — yêu cầu đổi mới trước khi xin visa. Đã hoàn $19 phí dịch vụ.' },
    ],
    createdAt: '2026-04-20T10:00:00Z', updatedAt: '2026-04-21T09:00:00Z',
  },
  {
    id: 'EV-W6Y1Z3', customerId: 'cust-005', status: 'approved',
    destination: 'Singapore', flag: '🇸🇬', visaType: 'E-Visa', processing: 'fast',
    fee: { gov: 30, service: 39, total: 69, currency: 'USD' },
    payment: { method: 'card', status: 'paid', paidAt: '2026-04-25T16:00:00Z' },
    applicant: {
      fullName: 'Vũ Thị Hằng', email: 'vuhang@gmail.com', phone: '+84 905 678 901',
      dob: '1996-09-15', gender: 'Nữ', nationality: 'Việt Nam', birthPlace: 'Cần Thơ',
      photoURL: 'https://ui-avatars.com/api/?name=Vu+Thi+Hang&background=9333EA&color=fff&size=200',
    },
    passport: { no: 'B6543219', type: 'Hộ chiếu phổ thông', issueDate: '2019-03-20', expiryDate: '2029-03-20', issuePlace: 'Cục XNC Cần Thơ', issueCountry: 'Việt Nam' },
    trip: { purpose: 'Du lịch', entryDate: '2026-05-12', exitDate: '2026-05-16', accommodation: 'Marina Bay Sands', notes: '' },
    timeline: [
      { stage: 'submitted', at: '2026-04-25T16:00:00Z', note: 'Đơn nhận' },
      { stage: 'review',    at: '2026-04-25T18:00:00Z', note: 'Hồ sơ hợp lệ' },
      { stage: 'sent',      at: '2026-04-26T09:00:00Z', note: 'Đã gửi cơ quan Singapore' },
      { stage: 'approved',  at: '2026-04-28T14:00:00Z', note: 'Visa được chấp thuận, đang chuẩn bị gửi' },
    ],
    createdAt: '2026-04-25T16:00:00Z', updatedAt: '2026-04-28T14:00:00Z',
  },
  {
    id: 'EV-T8V5C7', customerId: 'cust-006', status: 'submitted',
    destination: 'Indonesia', flag: '🇮🇩', visaType: 'Visa on Arrival', processing: 'normal',
    fee: { gov: 35, service: 19, total: 54, currency: 'USD' },
    payment: { method: 'ewallet', status: 'paid', paidAt: '2026-05-04T20:00:00Z' },
    applicant: {
      fullName: 'Đỗ Quang Huy', email: 'doquanghuy@gmail.com', phone: '+84 906 789 012',
      dob: '1985-05-30', gender: 'Nam', nationality: 'Việt Nam', birthPlace: 'Bình Dương',
      photoURL: 'https://ui-avatars.com/api/?name=Do+Quang+Huy&background=059669&color=fff&size=200',
    },
    passport: { no: 'C9876543', type: 'Hộ chiếu phổ thông', issueDate: '2020-11-10', expiryDate: '2030-11-10', issuePlace: 'Cục XNC TP.HCM', issueCountry: 'Việt Nam' },
    trip: { purpose: 'Du lịch', entryDate: '2026-07-01', exitDate: '2026-07-15', accommodation: 'Bali Hyatt Sanur', notes: 'Đi cùng vợ và 2 con' },
    timeline: [{ stage: 'submitted', at: '2026-05-04T20:00:00Z', note: 'Đơn vừa được nhận' }],
    createdAt: '2026-05-04T20:00:00Z', updatedAt: '2026-05-04T20:00:00Z',
  },
  {
    id: 'EV-J2H6B4', customerId: 'cust-007', status: 'review',
    destination: 'Ấn Độ', flag: '🇮🇳', visaType: 'E-Visa', processing: 'normal',
    fee: { gov: 30, service: 19, total: 49, currency: 'USD' },
    payment: { method: 'card', status: 'paid', paidAt: '2026-05-03T11:00:00Z' },
    applicant: {
      fullName: 'Bùi Thị Lan', email: 'builan@yahoo.com', phone: '+84 907 890 123',
      dob: '1993-08-12', gender: 'Nữ', nationality: 'Việt Nam', birthPlace: 'Vũng Tàu',
      photoURL: 'https://ui-avatars.com/api/?name=Bui+Thi+Lan&background=F5A623&color=fff&size=200',
    },
    passport: { no: 'A1357924', type: 'Hộ chiếu phổ thông', issueDate: '2018-06-25', expiryDate: '2028-06-25', issuePlace: 'Cục XNC Vũng Tàu', issueCountry: 'Việt Nam' },
    trip: { purpose: 'Du lịch', entryDate: '2026-06-01', exitDate: '2026-06-10', accommodation: 'Taj Mahal Hotel New Delhi', notes: '' },
    timeline: [
      { stage: 'submitted', at: '2026-05-03T11:00:00Z', note: 'Đơn nhận' },
      { stage: 'review',    at: '2026-05-04T08:00:00Z', note: 'Đang kiểm tra ảnh chân dung' },
    ],
    createdAt: '2026-05-03T11:00:00Z', updatedAt: '2026-05-04T08:00:00Z',
  },
  {
    id: 'EV-S5G3D9', customerId: 'cust-008', status: 'approved',
    destination: 'Úc', flag: '🇦🇺', visaType: 'E-Visa', processing: 'fast',
    fee: { gov: 95, service: 39, total: 134, currency: 'USD' },
    payment: { method: 'card', status: 'paid', paidAt: '2026-04-15T13:00:00Z' },
    applicant: {
      fullName: 'Hoàng Văn Khôi', email: 'hoangkhoi@gmail.com', phone: '+84 908 901 234',
      dob: '1980-12-22', gender: 'Nam', nationality: 'Việt Nam', birthPlace: 'Nha Trang',
      photoURL: 'https://ui-avatars.com/api/?name=Hoang+Van+Khoi&background=1B4FD8&color=fff&size=200',
    },
    passport: { no: 'B2468135', type: 'Hộ chiếu phổ thông', issueDate: '2021-04-30', expiryDate: '2031-04-30', issuePlace: 'Cục XNC Khánh Hòa', issueCountry: 'Việt Nam' },
    trip: { purpose: 'Công tác', entryDate: '2026-05-25', exitDate: '2026-06-05', accommodation: 'Four Seasons Sydney', notes: 'Hội nghị thường niên' },
    timeline: [
      { stage: 'submitted', at: '2026-04-15T13:00:00Z', note: 'Đơn nhận' },
      { stage: 'review',    at: '2026-04-15T15:00:00Z', note: 'Hồ sơ hợp lệ' },
      { stage: 'sent',      at: '2026-04-16T10:00:00Z', note: 'Đã gửi cơ quan Úc' },
      { stage: 'approved',  at: '2026-04-23T09:30:00Z', note: 'Visa chấp thuận' },
    ],
    createdAt: '2026-04-15T13:00:00Z', updatedAt: '2026-04-23T09:30:00Z',
  },
]

const OrdersContext = createContext(null)

export function OrdersProvider({ children }) {
  const [orders, setOrders] = useState(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY)
      if (stored) return JSON.parse(stored)
    } catch (_) { /* fall through */ }
    return SEED_ORDERS
  })

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(orders))
    } catch (_) { /* ignore quota errors */ }
  }, [orders])

  const createOrder = (data) => {
    const id = 'EV-' + Math.random().toString(36).slice(2, 8).toUpperCase()
    const now = new Date().toISOString()
    const order = {
      id,
      status: 'submitted',
      timeline: [{ stage: 'submitted', at: now, note: 'Đơn đã nhận, thanh toán thành công' }],
      createdAt: now,
      updatedAt: now,
      ...data,
    }
    setOrders(prev => [order, ...prev])
    return order
  }

  const updateStatus = (id, newStatus, note = '') => {
    setOrders(prev => prev.map(o => {
      if (o.id !== id) return o
      const now = new Date().toISOString()
      return {
        ...o,
        status: newStatus,
        timeline: [...o.timeline, { stage: newStatus, at: now, note: note || ORDER_STATUSES[newStatus]?.label }],
        updatedAt: now,
      }
    }))
  }

  const resetOrders = () => setOrders(SEED_ORDERS)

  return (
    <OrdersContext.Provider value={{ orders, createOrder, updateStatus, resetOrders }}>
      {children}
    </OrdersContext.Provider>
  )
}

export const useOrders = () => useContext(OrdersContext)
