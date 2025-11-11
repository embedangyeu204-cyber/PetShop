import React, { useState } from 'react';
import './ConsultationForm.css';

function ConsultationForm() {
  const [form, setForm] = useState({
    fullName: '',
    phone: '',
    email: '',
    note: ''
  });
  const [errors, setErrors] = useState({});
  const [submitted, setSubmitted] = useState(false);

  const validate = () => {
    const e = {};
    if (!form.fullName.trim()) e.fullName = 'Vui lòng nhập họ và tên';

    const phone = form.phone.trim();
    if (!phone) {
      e.phone = 'Vui lòng nhập số điện thoại';
    } else if (!/^\+?\d{9,12}$/.test(phone)) {
      e.phone = 'Số điện thoại không hợp lệ';
    }

    const email = form.email.trim();
    if (!email) {
      e.email = 'Vui lòng nhập email';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      e.email = 'Email không hợp lệ';
    }

    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const onChange = (ev) => {
    const { name, value } = ev.target;
    setForm((f) => ({ ...f, [name]: value }));
  };

  const onSubmit = (ev) => {
    ev.preventDefault();
    if (!validate()) return;
    // In a real app, send to backend here.
    setSubmitted(true);
  };

  const onReset = () => {
    setForm({ fullName: '', phone: '', email: '', note: '' });
    setErrors({});
    setSubmitted(false);
  };

  return (
    <div className="consultation-wrapper">
      <h1 className="consultation-title">Đăng ký tư vấn</h1>
      <p className="consultation-subtitle">Điền thông tin để chúng tôi liên hệ hỗ trợ nhanh nhất.</p>

      <form onSubmit={onSubmit} noValidate>
        <div className="form-grid">
          <div className="form-field">
            <label htmlFor="fullName">Họ và tên</label>
            <input
              id="fullName"
              name="fullName"
              type="text"
              value={form.fullName}
              onChange={onChange}
              placeholder="Nguyễn Văn A"
              required
            />
            {errors.fullName && <div className="error-text">{errors.fullName}</div>}
          </div>

          <div className="form-field">
            <label htmlFor="phone">Số điện thoại</label>
            <input
              id="phone"
              name="phone"
              type="tel"
              value={form.phone}
              onChange={onChange}
              placeholder="0912 345 678"
              required
              inputMode="tel"
            />
            {errors.phone && <div className="error-text">{errors.phone}</div>}
          </div>

          <div className="form-field">
            <label htmlFor="email">Email</label>
            <input
              id="email"
              name="email"
              type="email"
              value={form.email}
              onChange={onChange}
              placeholder="ban@example.com"
              required
            />
            {errors.email && <div className="error-text">{errors.email}</div>}
          </div>

          <div className="form-field">
            <label htmlFor="note">Ghi chú (tuỳ chọn)</label>
            <textarea
              id="note"
              name="note"
              rows="4"
              value={form.note}
              onChange={onChange}
              placeholder="Mô tả ngắn vấn đề của thú cưng..."
            />
          </div>
        </div>

        <div className="actions">
          <button className="btn-primary" type="submit">Gửi yêu cầu</button>
          <button className="btn-secondary" type="button" onClick={onReset}>Làm mới</button>
        </div>

        {submitted && (
          <div className="success-note">
            Cảm ơn bạn! Chúng tôi sẽ liên hệ tư vấn trong thời gian sớm nhất.
          </div>
        )}
      </form>
    </div>
  );
}

export default ConsultationForm;

