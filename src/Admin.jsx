export default function Admin({ setPage }) {
  return (
    <div className="card">
      <h2>🛠️ لوحة تحكم الإدارة</h2>

      <p>مرحبًا بك في منصة جمعية الإمام مالك الثقافية.</p>

      <hr />

      <h3>📊 الإحصائيات</h3>

      <p>👨‍🎓 عدد الطلاب: 0</p>
      <p>👨‍🏫 عدد الأساتذة: 0</p>
      <p>📖 عدد الحلقات: 0</p>

      <hr />

      <button className="btn" onClick={() => setPage("students")}>
        👨‍🎓 إدارة الطلاب
      </button>

      <button
  className="btn"
  onClick={() => setPage("teacher")}
>
  👨‍🏫 إدارة الأساتذة
</button>

      <button className="btn">
        📖 إدارة الحلقات
      </button>

      <button className="btn">
        📝 نتائج الحفظ
      </button>

      <button className="btn">
        📅 الحضور والغياب
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