import { useEffect, useState } from "react";
import {
  collection,
  getDocs,
} from "firebase/firestore";

import { db } from "./Firebase";

export default function StudentReport({
  setPage,
  student,
}) {

  const [records, setRecords] = useState([]);

  const [stats, setStats] = useState({
    total: 0,
    excellent: 0,
    absent: 0,
    memorized: 0,
  });

  const [points, setPoints] = useState(0);

  const [level, setLevel] =
    useState("🥉 مبتدئ");

  useEffect(() => {

    if (student) {
      loadReport();
    }

  }, [student]);

  async function loadReport() {

    try {

      const snapshot =
        await getDocs(
          collection(
            db,
            "memorization"
          )
        );

      const studentRecords = [];

      snapshot.forEach(
        (docItem) => {

          const item =
            docItem.data();

          if (
            item.studentId ===
            student.id
          ) {

            studentRecords.push({
              id: docItem.id,
              ...item,
            });

          }

        }
      );

      studentRecords.sort(
        (a, b) =>
          new Date(b.date) -
          new Date(a.date)
      );

      setRecords(studentRecords);

      // =====================
      // الإحصائيات
      // =====================

      const excellent =
        studentRecords.filter(
          (item) =>
            item.rate === "ممتاز"
        ).length;

      const absent =
        studentRecords.filter(
          (item) =>
            item.new === "غائب" ||
            item.new === "غائب بعذر"
        ).length;

      const memorized =
        studentRecords.filter(
          (item) =>
            item.new &&
            item.new !== "غائب" &&
            item.new !== "غائب بعذر" &&
            item.new !==
              "حضر ولم يحفظ"
        ).length;

      setStats({
        total:
          studentRecords.length,
        excellent,
        absent,
        memorized,
      });

      // =====================
      // النقاط
      // =====================

      let totalPoints = 0;

      studentRecords.forEach(
        (item) => {

          if (
            item.rate ===
            "ممتاز"
          ) {
            totalPoints += 10;
          } else if (
            item.rate ===
            "جيد جدًا"
          ) {
            totalPoints += 7;
          } else if (
            item.rate ===
            "جيد"
          ) {
            totalPoints += 5;
          } else if (
            item.rate ===
            "متوسط"
          ) {
            totalPoints += 3;
          } else if (
            item.rate ===
            "ضعيف"
          ) {
            totalPoints += 1;
          }

          if (
            item.new &&
            item.new !== "غائب" &&
            item.new !== "غائب بعذر" &&
            item.new !==
              "حضر ولم يحفظ"
          ) {
            totalPoints += 5;
          }

          if (
            item.review
          ) {
            totalPoints += 3;
          }

        }
      );

      setPoints(totalPoints);

      let currentLevel =
        "🥉 مبتدئ";

      if (
        totalPoints >= 1000
      ) {
        currentLevel =
          "🌟 نجم الحلقة";
      } else if (
        totalPoints >= 500
      ) {
        currentLevel =
          "🏆 حافظ مجتهد";
      } else if (
        totalPoints >= 250
      ) {
        currentLevel =
          "🥇 متقدم";
      } else if (
        totalPoints >= 100
      ) {
        currentLevel =
          "🥈 مجتهد";
      }

      setLevel(
        currentLevel
      );

    } catch (error) {

      console.log(
        "خطأ في التقرير:",
        error
      );

    }

  }

  // =========================
  // لا يوجد طالب
  // =========================

  if (!student) {

    return (

      <div className="card">

        <h2>
          لا توجد بيانات الطالب
        </h2>

        <button
          className="btn"
          onClick={() =>
            setPage("student")
          }
        >
          ⬅️ رجوع
        </button>

      </div>

    );

  }

  // =========================
  // طباعة / حفظ PDF
  // =========================

  function printReport() {

    window.print();

  }

  return (

    <div className="student-report-page">

      <div className="report-actions no-print">

        <button
          className="btn"
          onClick={printReport}
        >
          📄 تحميل التقرير PDF
        </button>

        <button
          className="btn"
          onClick={() =>
            setPage("student")
          }
        >
          ⬅️ رجوع
        </button>

      </div>

      <div className="student-report">

        {/* =====================
            الرأس
        ===================== */}

        <div className="report-header">

          <img
            src="/logo.png"
            alt="شعار الجمعية"
            className="report-logo"
          />

          <h1>
            جمعية الإمام مالك الثقافية
          </h1>

          <h2>
            تقرير الطالب
          </h2>

          <p>
            التقرير الدراسي لحفظ القرآن الكريم
          </p>

        </div>

        {/* =====================
            معلومات الطالب
        ===================== */}

        <div className="report-section">

          <h3>
            👨‍🎓 معلومات الطالب
          </h3>

          <div className="report-info">

            <p>
              <strong>
                الاسم:
              </strong>{" "}
              {student.name}
            </p>

            <p>
              <strong>
                رقم التسجيل:
              </strong>{" "}
              {student.number ||
                "غير متوفر"}
            </p>

            <p>
              <strong>
                الحلقة:
              </strong>{" "}
              {student.halaqa ||
                "غير محددة"}
            </p>

            <p>
              <strong>
                المستوى:
              </strong>{" "}
              {student.level ||
                "غير محدد"}
            </p>

            <p>
              <strong>
                نوع الحلقة:
              </strong>{" "}
              {student.halaqaType ||
                "حضوري"}
            </p>

          </div>

        </div>

        {/* =====================
            الملخص
        ===================== */}

        <div className="report-section">

          <h3>
            📊 الملخص
          </h3>

          <div className="report-stats">

            <div>
              <strong>
                {stats.memorized}
              </strong>
              <span>
                مرات الحفظ
              </span>
            </div>

            <div>
              <strong>
                {stats.excellent}
              </strong>
              <span>
                تقييم ممتاز
              </span>
            </div>

            <div>
              <strong>
                {stats.absent}
              </strong>
              <span>
                أيام الغياب
              </span>
            </div>

            <div>
              <strong>
                {points}
              </strong>
              <span>
                النقاط
              </span>
            </div>

          </div>

          <div className="report-level">

            المستوى الحالي:
            <strong>
              {level}
            </strong>

          </div>

        </div>

        {/* =====================
            سجل النتائج
        ===================== */}

        <div className="report-section">

          <h3>
            📚 سجل نتائج الحفظ
          </h3>

          {records.length === 0 ? (

            <p>
              لا توجد نتائج مسجلة.
            </p>

          ) : (

            <table className="report-table">

              <thead>

                <tr>

                  <th>
                    التاريخ
                  </th>

                  <th>
                    المحفوظ الجديد
                  </th>

                  <th>
                    المراجعة
                  </th>

                  <th>
                    التقييم
                  </th>

                  <th>
                    الملاحظات
                  </th>

                </tr>

              </thead>

              <tbody>

                {records.map(
                  (item) => (

                    <tr
                      key={item.id}
                    >

                      <td>
                        {item.date ||
                          "-"}
                      </td>

                      <td>
                        {item.new ||
                          "-"}
                      </td>

                      <td>
                        {item.review ||
                          "-"}
                      </td>

                      <td>
                        {item.rate ||
                          "-"}
                      </td>

                      <td>
                        {item.notes ||
                          "-"}
                      </td>

                    </tr>

                  )
                )}

              </tbody>

            </table>

          )}

        </div>

        {/* =====================
            التاريخ
        ===================== */}

        <div className="report-footer">

          <p>
            تاريخ استخراج التقرير:
            {" "}
            {new Date().toLocaleDateString(
              "ar-MA"
            )}
          </p>

          <p>
            جمعية الإمام مالك الثقافية
          </p>

        </div>

      </div>

    </div>

  );

}