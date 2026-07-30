import logo from "./assets/Malik.png";

export default function Login({ setPage }) {
  return (
    <div className="home-page">

      {/* =========================
          الشريط العلوي
      ========================= */}
      <header className="home-navbar">

        <div className="home-logo">
          <img src={logo} alt="جمعية الإمام مالك" />

          <div>
            <strong>جمعية الإمام مالك</strong>
            <span>الثقافية</span>
          </div>
        </div>

        <button
          className="join-btn"
          onClick={() => setPage("studentRegister")}
        >
          انضم إلينا
        </button>

      </header>


      {/* =========================
          القسم الرئيسي
      ========================= */}
      <main className="home-hero">

        <div className="hero-text">

          <div className="hero-badge">
            ✨ مرحباً بكم في منصتنا
          </div>

          <h1>
            منصة جمعية الإمام مالك
            <br />
            <span>الثقافية</span>
          </h1>

          <p>
            نظام متكامل لإدارة الحلقات القرآنية،
            ومتابعة حفظ الطلاب وتقدمهم بسهولة.
          </p>

          <button
            className="start-btn"
            onClick={() => setPage("studentRegister")}
          >
            ابدأ الآن مجاناً
            <span>←</span>
          </button>

        </div>


        {/* الشعار */}
        <div className="hero-logo-area">

          <div className="hero-circle">

            <div className="hero-circle-inner">

              <img
                src={logo}
                alt="شعار جمعية الإمام مالك"
              />

            </div>

          </div>

        </div>

      </main>


      {/* =========================
          خيارات الدخول
      ========================= */}
      <section className="access-section">

        <h2>اختر طريقة الدخول</h2>

        <p className="access-subtitle">
          الوصول إلى حسابك حسب نوع المستخدم
        </p>


        <div className="access-grid">

          {/* =========================
              الطالب
          ========================= */}
          <button
            className="access-card student-access"
            onClick={() => setPage("studentLogin")}
          >
            <div className="access-icon">
              🎓
            </div>

            <div>
              <strong>دخول الطالب</strong>
              <span>متابعة الحفظ والنتائج</span>
            </div>

            <b>←</b>
          </button>


          {/* =========================
              ولي الأمر
          ========================= */}
          <button
            className="access-card parent-access"
            onClick={() => setPage("parentLogin")}
          >
            <div className="access-icon">
              👨‍👩‍👦
            </div>

            <div>
              <strong>دخول ولي الأمر</strong>
              <span>متابعة مستوى الطالب</span>
            </div>

            <b>←</b>
          </button>


          {/* =========================
              الأستاذ
          ========================= */}
          <button
            className="access-card teacher-access"
            onClick={() => setPage("teacherLogin")}
          >
            <div className="access-icon">
              👨‍🏫
            </div>

            <div>
              <strong>دخول الأستاذ</strong>
              <span>إدارة الطلاب والحفظ</span>
            </div>

            <b>←</b>
          </button>


          {/* =========================
              الإدارة
          ========================= */}
          <button
            className="access-card admin-access"
            onClick={() => setPage("adminLogin")}
          >
            <div className="access-icon">
              🛡️
            </div>

            <div>
              <strong>دخول الإدارة</strong>
              <span>إدارة المنصة بالكامل</span>
            </div>

            <b>←</b>
          </button>

        </div>


        {/* =========================
            تسجيل طالب
        ========================= */}
        <button
  className="student-register-home-btn"
  onClick={() => setPage("studentRegister")}
>
  <span className="register-icon">📝</span>

  <span className="register-text">
    <strong>تسجيل طالب جديد</strong>
    <small>اضغط هنا لطلب التسجيل في الجمعية</small>
  </span>

  <span className="register-arrow">←</span>
</button>


        {/* =========================
            طلب تسجيل أستاذ
        ========================= */}
        <button
          className="register-teacher-btn"
          onClick={() => setPage("teacherRegister")}
        >
          👨‍🏫 طلب تسجيل أستاذ
        </button>

      </section>

<button
  type="button"
  className="app-download-home-btn"
  disabled
>
  <span className="app-download-icon">📱</span>

  <span className="app-download-text">
    <strong>تحميل التطبيق</strong>
    <small>متوفر قريبًا بإذن الله</small>
  </span>

  <span className="coming-soon-badge">
    قريبًا
  </span>
</button>
      {/* =========================
          المزايا
      ========================= */}
      <section className="features-section">

        <div className="feature">
          <span>📖</span>
          <strong>متابعة الحفظ</strong>
          <small>تسجيل ومتابعة المحفوظ اليومي</small>
        </div>

        <div className="feature">
          <span>📊</span>
          <strong>تقارير دقيقة</strong>
          <small>معرفة مستوى الطالب وتطوره</small>
        </div>

        <div className="feature">
          <span>👨‍🏫</span>
          <strong>إدارة الحلقات</strong>
          <small>تنظيم الطلاب والأساتذة</small>
        </div>

        <div className="feature">
          <span>🔔</span>
          <strong>الإشعارات</strong>
          <small>التواصل ومتابعة النتائج</small>
        </div>

      </section>


      {/* =========================
          التذييل
      ========================= */}
      <footer className="home-footer">

        <img src={logo} alt="" />

        <div>
          <strong>
            جمعية الإمام مالك الثقافية
          </strong>

          <p>
            نظام إدارة الحلقات القرآنية
          </p>
        </div>

        <small>
          © جميع الحقوق محفوظة
        </small>

      </footer>

    </div>
  );
}