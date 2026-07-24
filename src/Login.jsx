import logo from "./assets/Malik.PNG";

export default function Login({ setPage }) {
  return (
    <div className="login-container">

      <img src={logo} alt="شعار الجمعية" className="logo" />

      <h1>منصة جمعية الإمام مالك الثقافية</h1>

      <p className="subtitle">
        نظام إدارة الحلقات القرآنية
      </p>

      <button
        className="btn"
        onClick={() => setPage("studentLogin")}
      >
        👨‍🎓 دخول الطالب
      </button>

      <button
        className="btn"
        onClick={() => setPage("studentRegister")}
      >
        📝 تسجيل طالب جديد
      </button>

      <button
        className="btn"
        onClick={() => setPage("parentLogin")}
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
        className="btn admin-btn"
        onClick={() => setPage("adminLogin")}
      >
        🛡️ دخول الإدارة
      </button>

      <button
        className="link-btn"
        onClick={() => setPage("forgotPassword")}
      >
        🔑 نسيت كلمة المرور؟
      </button>

    </div>
  );
}