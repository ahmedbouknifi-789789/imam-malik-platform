export default function TeacherPanel({ setPage }) {
  return (
    <div className="card">
      <h2>👨‍🏫 لوحة الأستاذ</h2>

      <button className="btn" onClick={() => setPage("attendance")}>
📋 تسجيل الحضور
</button>

<br /><br />

<button className="btn" onClick={() => setPage("memorization")}>
📖 إدخال الحفظ
</button>

<br /><br />

<button className="btn" onClick={() => setPage("notes")}>
📝 ملاحظات الطلاب
</button>

<br /><br />

<button className="btn" onClick={() => setPage("login")}>
🚪 تسجيل الخروج
</button>
    </div>
  );
}