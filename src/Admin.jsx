export default function Admin({ setPage, students }) {
  return (
    <div className="card">
      <h2>🛠️ لوحة تحكم الإدارة</h2>

      <p>مرحبًا بك في منصة جمعية الإمام مالك الثقافية.</p>

      <hr />

      <h3>📊 الإحصائيات</h3>

      <p>👨‍🎓 عدد الطلاب: {students.length}</p>
      <p>👨‍🏫 عدد الأساتذة: قريبًا</p>
      <p>📖 عدد الحلقات: قريبًا</p>

      <hr />

      <button
        className="btn"
        onClick={() => setPage("students")}
      >
        👨‍🎓 إدارة الطلاب
      </button>

      <button
        className="btn"
        onClick={() => setPage("memorization")}
      >
        📝 نتائج الحفظ
      </button>

      <button
        className="btn"
        onClick={() => setPage("attendance")}
      >
        📅 الحضور والغياب
      </button>

      <button
        className="btn"
        onClick={() => setPage("teacher")}
      >
        👨‍🏫 إدارة الأساتذة
      </button>

      <button
  className="btn"
  onClick={() => setPage("halaqas")}
>
  📖 إدارة الحلقات
</button>

      <button className="btn">
        📢 الإعلانات
      </button>

      <button
        className="btn"
        style={{ background: "#b91c1c" }}
        onClick={() => setPage("login")}
      >
        🚪 تسجيل الخروج
      </button>
    </div>
  );
}