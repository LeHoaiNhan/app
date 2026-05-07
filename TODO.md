# TODO - Chỉ login bằng Google

- [ ] Cập nhật `src/components/LoginModal.jsx`: xóa form email/password và tab register; chỉ hiển thị nút Google.
- [ ] Cập nhật `src/components/LoginModal.jsx`: xóa form email/password và tab register/login; chỉ hiển thị nút Google.
- [ ] Cập nhật `src/pages/Admin.jsx` (gate): xóa form admin email/password; nếu user chưa phải admin thì chỉ hiển thị thông báo.
- [ ] Cập nhật backend (nếu cần): giữ `/auth/google`; role mặc định `customer`.
- [ ] Kiểm tra luồng:
  - Đăng nhập Google customer -> tạo user -> vào `/my-orders`.
  - Truy cập `/admin` với customer -> hiển thị message không có quyền (không hỏi password).


