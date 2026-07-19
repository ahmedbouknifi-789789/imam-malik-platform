export default function Login({ setPage }) {
  return (
    <div className="card">
      <h2>مرحبًا بك في منصة جمعية الإمام مالك الثقافية</h2>

      <p>اختر نوع الحساب للدخول إلى المنصة:</p>

      <button
        className="btn"
        onClick={() => setPage("student")}
      >
        👨‍🎓 دخول الطالب
      </button>

      <button
        className="btn"
        onClick={() => setPage("parent")}
      >
        👨‍👩‍👦 دخول ولي الأمر
      </button>

      <button
        className="btn"
        onClick={() => setPage("teacher")}
      >
        👨‍🏫 دخول الأستاذ
      </button>

      <button
        className="btn"
        onClick={() => setPage("admin")}
      >
        🛠️ دخول الإدارة
      </button>
    </div>
  );
}