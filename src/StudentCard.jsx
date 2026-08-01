import { useEffect, useState } from "react";
import { doc, getDoc } from "firebase/firestore";
import QRCode from "react-qr-code";
import { db } from "./Firebase";
import "./StudentCard.css";

export default function StudentCard({
  student,
  points = 0,
  level = "🥉 مبتدئ",
  setPage,
}) {
  const [paidMonths, setPaidMonths] = useState({});

  // ================================
  // الشهور
  // ================================

  const months = [
    "يناير",
    "فبراير",
    "مارس",
    "أبريل",
    "مايو",
    "يونيو",
    "يوليوز",
    "غشت",
    "شتنبر",
    "أكتوبر",
    "نونبر",
    "دجنبر",
  ];

  // ================================
  // تحميل حالة الرسوم
  // الطالب يستطيع المشاهدة فقط
  // ================================

  useEffect(() => {
    if (student?.id) {
      loadPaidMonths();
    }
  }, [student]);

  async function loadPaidMonths() {
    try {
      const studentRef = doc(
        db,
        "students",
        student.id
      );

      const snapshot = await getDoc(studentRef);

      if (snapshot.exists()) {
        const data = snapshot.data();

        setPaidMonths(
          data.feesPaidMonths || {}
        );
      }
    } catch (error) {
      console.error(
        "خطأ في تحميل حالة الرسوم:",
        error
      );
    }
  }

  // ================================
  // الرابط الموجود داخل QR
  // ================================

  const historyUrl = JSON.stringify({
  type: "studentHistory",
  studentId: student?.id,
  studentNumber: student?.number,
});
  // ================================
  // لا يوجد طالب
  // ================================

  if (!student) {
    return (
      <div className="student-card-page">

        <div className="student-card-empty">

          <h2>
            ⚠️ لم يتم اختيار طالب
          </h2>

          <button
            className="card-btn back-btn"
            onClick={() =>
              setPage("student")
            }
          >
            ↩️ رجوع
          </button>

        </div>

      </div>
    );
  }

  return (
    <div className="student-card-page">

      {/* ================================
          البطاقة
      ================================= */}

      <div className="student-card">

        {/* ================================
            رأس البطاقة
        ================================= */}

        <div className="card-header">

          <div className="header-logo">
            📖
          </div>

          <div className="header-text">

            <h2>
              منصة جمعية الإمام مالك الثقافية
            </h2>

            <span>
              البطاقة الإلكترونية للطالب
            </span>

          </div>

        </div>

        {/* ================================
            صورة الطالب والمعلومات
        ================================= */}

        <div className="student-main">

          <div className="card-photo">

            {student.photo ? (

              <img
                src={student.photo}
                alt={student.name}
              />

            ) : (

              <div className="photo-placeholder">
                👨‍🎓
              </div>

            )}

          </div>

          <div className="card-info">

            <div className="info-row">

              <span className="info-label">
                الاسم
              </span>

              <span className="info-value">
                {student.name || "غير محدد"}
              </span>

            </div>

            <div className="info-row">

              <span className="info-label">
                رقم التسجيل
              </span>

              <span className="info-value">
                {student.number || "غير محدد"}
              </span>

            </div>

            <div className="info-row">

              <span className="info-label">
                تاريخ الازدياد
              </span>

              <span className="info-value">
                {student.birth || "غير محدد"}
              </span>

            </div>

            <div className="info-row">

              <span className="info-label">
                الحلقة
              </span>

              <span className="info-value">
                {student.halaqa || "غير محددة"}
              </span>

            </div>

            <div className="info-row">

              <span className="info-label">
                المستوى
              </span>

              <span className="info-value">
                {student.level || "غير محدد"}
              </span>

            </div>

          </div>

        </div>

        {/* ================================
            النقاط والمستوى
        ================================= */}

        <div className="card-stats">

          <div className="stat-box">

            <span className="stat-icon">
              🏆
            </span>

            <strong>
              {points}
            </strong>

            <small>
              النقاط
            </small>

          </div>

          <div className="stat-box">

            <span className="stat-icon">
              🎖️
            </span>

            <strong>
              {level}
            </strong>

            <small>
              المستوى
            </small>

          </div>

        </div>

        {/* ================================
            الباركود
        ================================= */}

        <div className="qr-section">

          <div className="qr-box">

            <QRCode
              value={historyUrl}
              size={120}
            />

          </div>

          <div className="qr-number">
            {student.number}
          </div>

          <div className="qr-description">
            امسح الباركود لفتح سجل الحفظ
          </div>

        </div>

        {/* ================================
            جدول الرسوم الشهرية
        ================================= */}

        <div className="fees-section">

          <h3 className="fees-title">
            💳 أداء الرسوم الشهرية
          </h3>

          <p className="fees-help">
            حالة أداء الرسوم المسجلة من طرف الإدارة
          </p>

          <div className="fees-table">

            {months.map((month) => {

              const paid =
                !!paidMonths[month];

              return (

                <div
                  key={month}
                  className={
                    `month-cell ${
                      paid
                        ? "month-paid"
                        : "month-unpaid"
                    }`
                  }
                >

                  <span className="month-name">
                    {month}
                  </span>

                  <span className="month-status">

                    {paid
                      ? "✓ تم الأداء"
                      : "— لم يتم"}

                  </span>

                </div>

              );

            })}

          </div>

          <div className="fees-legend">

            <span>

              <b className="legend-paid">
                ✓
              </b>

              تم الأداء

            </span>

            <span>

              <b className="legend-unpaid">
                —
              </b>

              لم يتم الأداء

            </span>

          </div>

        </div>

        {/* ================================
            الأزرار
        ================================= */}

        <div className="card-buttons">

          <button
            className="card-btn print-btn"
            onClick={() =>
              window.print()
            }
          >
            🖨️ طباعة البطاقة
          </button>

          <button
  className="card-btn back-btn"
  onClick={() => {
    localStorage.setItem(
      "studentNumber",
      student.number
    );
    setPage("student");
  }}
>
  ↩️ رجوع
</button>
        </div>

      </div>

    </div>
  );
}