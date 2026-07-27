import logo from "./assets/Malik.png";

export default function Login({ setPage }) {
  return (
    <div className="login-page">

      <div className="login-container">

        {/* الشعار */}
        <div className="logo-wrapper">
          <img
            src={logo}
            alt="شعار جمعية الإمام مالك"
            className="logo"
          />
        </div>

        {/* العنوان */}
        <h1>
          منصة جمعية الإمام مالك الثقافية
        </h1>

        <p className="subtitle">
          نظام إدارة الحلقات القرآنية
        </p>

        {/* الخيارات */}
        <div className="login-options">

          <button
            className="login-card student-card"
            onClick={() => setPage("studentLogin")}
          >
            <span className="login-icon">🎓</span>

            <div>
              <strong>دخول الطالب</strong>
              <small>الوصول إلى ملفك الدراسي</small>
            </div>

            <span className="arrow">←</span>
          </button>

          <button
            className="login-card register-card"
            onClick={() => setPage("studentRegister")}
          >
            <span className="login-icon">📝</span>

            <div>
              <strong>تسجيل طالب جديد</strong>
              <small>إنشاء طلب تسجيل جديد</small>
            </div>

            <span className="arrow">←</span>
          </button>

          <button
            className="login-card parent-card"
            onClick={() => setPage("parentLogin")}
          >
            <span className="login-icon">👨‍👩‍👦</span>

            <div>
              <strong>دخول ولي الأمر</strong>
              <small>متابعة مستوى الطالب</small>
            </div>

            <span className="arrow">←</span>
          </button>

          <button
            className="login-card teacher-card"
            onClick={() => setPage("teacherLogin")}
          >
            <span className="login-icon">👨‍🏫</span>

            <div>
              <strong>دخول الأستاذ</strong>
              <small>إدارة الطلاب والحلقات</small>
            </div>

            <span className="arrow">←</span>
          </button>

          <button
            className="login-card admin-card"
            onClick={() => setPage("adminLogin")}
          >
            <span className="login-icon">🛡️</span>

            <div>
              <strong>دخول الإدارة</strong>
              <small>إدارة المنصة بالكامل</small>
            </div>

            <span className="arrow">←</span>
          </button>

        </div>

        {/* نسيت كلمة المرور */}
        <button
          className="link-btn"
          onClick={() => setPage("forgotPassword")}
        >
          🔑 نسيت كلمة المرور؟
        </button>

        <div className="login-footer">
          © جمعية الإمام مالك الثقافية
        </div>

      </div>

    </div>
  );
}