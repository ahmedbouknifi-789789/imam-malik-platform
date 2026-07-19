export default function Admin({ setPage }) {
  return (
    <div className="card">
      <h2>🛠️ لوحة تحكم الإدارة</h2>

      <p>مرحبًا بك في لوحة الإدارة، اختر القسم الذي تريد إدارته.</p>

      <button
        className="btn"
        onClick={() => setPage("students")}
      >
        📚 إدارة الطلاب
      </button>

      <button
        className="btn"
        onClick={() => alert("سيتم تطوير إدارة الأساتذة قريبًا")}
      >
        👨‍🏫 إدارة الأساتذة
      </button>

      <button
        className="btn"
        onClick={() => alert("سيتم تطوير إدارة الحلقات قريبًا")}
      >
        📖 إدارة الحلقات
      </button>

      <button
        className="btn"
        onClick={() => alert("سيتم تطوير نتائج الحفظ قريبًا")}
      >
        📝 نتائج الحفظ
      </button>

      <button
        className="btn"
        onClick={() => alert("سيتم تطوير الحضور والغياب قريبًا")}
      >
        📅 الحضور والغياب
      </button>

      <button
        className="btn"
        onClick={() => alert("سيتم تطوير الإعلانات قريبًا")}
      >
        📢 الإعلانات
      </button>

      <button
        className="btn"
        onClick={() => setPage("login")}
      >
        🚪 تسجيل الخروج
      </button>
    </div>
  );
}