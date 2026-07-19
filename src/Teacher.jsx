export default function Teacher({ setPage }) {
  return (
    <div className="card">
      <h2>لوحة الأستاذ</h2>

      <button className="btn">تسجيل الحضور</button>
      <br /><br />

      <button className="btn">إدخال نتائج الحفظ</button>
      <br /><br />

      <button className="btn">إضافة ملاحظة</button>
      <br /><br />

      <button className="btn" onClick={() => setPage("login")}>
        رجوع
      </button>
    </div>
  );
}