export default function Admin({
  setPage,
  students,
  teachers,
  halaqas,
}) {

  return (
    <div className="card">
      <h2>🛠️ لوحة تحكم الإدارة</h2>

      <p>مرحبًا بك في منصة جمعية الإمام مالك الثقافية.</p>

      <hr />

      <h3>📊 الإحصائيات</h3>

<p>👨‍🎓 عدد الطلاب: {students.length}</p>
<p>👨‍🏫 عدد الأساتذة: {teachers.length}</p>
<p>📖 عدد الحلقات: {halaqas.length}</p>
      <hr />

      <button
        className="btn"
        onClick={() => setPage("students")}
      >
        👨‍🎓 إدارة الطلاب
      </button>

      <button
        className="btn"
        onClick={() => setPage("registrationRequests")}
      >
        📥 طلبات التسجيل
      </button>

<button
  className="btn"
  onClick={() =>
    setPage("teacherRegistrationRequests")
  }
>
  👨‍🏫 طلبات تسجيل الأساتذة
</button>

      <button
        className="btn"
        onClick={() => setPage("createAccounts")}
      >
        👤 إنشاء حسابات الطلاب
      </button>

      <button
        className="btn"
        onClick={() => setPage("createTeacherAccounts")}
      >
        👨‍🏫 إنشاء حسابات الأساتذة
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
        onClick={() => setPage("teachers")}
      >
        👨‍🏫 إدارة الأساتذة
      </button>

      <button
        className="btn"
        onClick={() => setPage("halaqas")}
      >
        📖 إدارة الحلقات
      </button>

<button
  className="btn"
  onClick={() =>
    setPage("adminResults")
  }
>
  🗑️ إدارة نتائج الطلاب
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