import { signOut } from "firebase/auth";
import { auth } from "./Firebase";

export default function TeacherDashboard({ setPage }) {
  async function logout() {
    await signOut(auth);
    setPage("login");
  }

  return (
    <div className="card">
      <h2>👨‍🏫 لوحة الأستاذ</h2>

      <p>مرحبًا بك في منصة جمعية الإمام مالك الثقافية.</p>

      <div className="buttons">

        <button
          className="btn"
          onClick={() => setPage("teacherStudents")}
        >
          👨‍🎓 طلاب الحلقة
        </button>

        <button
          className="btn"
          onClick={() => setPage("attendance")}
        >
          📋 تسجيل الحضور
        </button>

        <button
          className="btn"
          onClick={() => setPage("memorization")}
        >
          📖 تسجيل الحفظ
        </button>

        <button
          className="btn"
          onClick={logout}
        >
          🚪 تسجيل الخروج
        </button>

      </div>
    </div>
  );
}