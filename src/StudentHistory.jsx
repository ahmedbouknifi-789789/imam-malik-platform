import { useEffect, useState } from "react";

import {
  collection,
  getDocs,
  query,
  where,
} from "firebase/firestore";

import { db } from "./Firebase";

export default function StudentHistory({
  setPage,
  student,
}) {
  const [studentData, setStudentData] = useState(
    student || null
  );

  const [records, setRecords] = useState([]);

  const [loading, setLoading] = useState(true);

  const [error, setError] = useState("");

  // ==================================================
  // تحميل الطالب وسجل الحفظ
  // ==================================================

  useEffect(() => {
    loadHistory();
  }, []);

  async function loadHistory() {
    try {
      setLoading(true);
      setError("");

      // ==================================================
      // البحث عن رقم الطالب من الرابط
      // مثال:
      // ?studentHistory=S12345678
      // ==================================================

      const params = new URLSearchParams(
        window.location.search
      );

      const studentNumber =
        params.get("studentHistory");

      let currentStudent = student || null;

      // ==================================================
      // إذا فتح السجل بواسطة QR
      // ==================================================

      if (
        !currentStudent &&
        studentNumber
      ) {
        const studentsSnapshot =
          await getDocs(
            query(
              collection(db, "students"),
              where(
                "number",
                "==",
                studentNumber
              )
            )
          );

        if (
          studentsSnapshot.empty
        ) {
          setError(
            "❌ لم يتم العثور على الطالب."
          );

          setLoading(false);

          return;
        }

        const studentDoc =
          studentsSnapshot.docs[0];

        currentStudent = {
          id: studentDoc.id,
          ...studentDoc.data(),
        };

        setStudentData(
          currentStudent
        );
      }

      // ==================================================
      // لا يوجد طالب
      // ==================================================

      if (!currentStudent) {
        setError(
          "❌ لا توجد بيانات الطالب."
        );

        setLoading(false);

        return;
      }

      // ==================================================
      // تحميل سجل الحفظ
      // ==================================================

      const memorizationSnapshot =
        await getDocs(
          collection(
            db,
            "memorization"
          )
        );

      const studentRecords = [];

      memorizationSnapshot.forEach(
        (docItem) => {
          const item =
            docItem.data();

          // السجلات مرتبطة بـ studentId
          if (
            item.studentId ===
            currentStudent.id
          ) {
            studentRecords.push({
              id: docItem.id,
              ...item,
            });
          }
        }
      );

      // ==================================================
      // ترتيب الأحدث أولاً
      // ==================================================

      studentRecords.sort(
        (a, b) => {
          const dateA =
            new Date(
              a.date || 0
            );

          const dateB =
            new Date(
              b.date || 0
            );

          return dateB - dateA;
        }
      );

      setRecords(
        studentRecords
      );

    } catch (err) {
      console.error(
        "خطأ في تحميل سجل الحفظ:",
        err
      );

      setError(
        "❌ حدث خطأ أثناء تحميل سجل الحفظ."
      );
    } finally {
      setLoading(false);
    }
  }

  // ==================================================
  // تحميل
  // ==================================================

  if (loading) {
    return (
      <div
        className="card"
        style={{
          textAlign: "center",
          padding: "30px",
        }}
      >
        <h2>
          ⏳ جاري تحميل سجل الحفظ...
        </h2>
      </div>
    );
  }

  // ==================================================
  // خطأ
  // ==================================================

  if (error) {
    return (
      <div
        className="card"
        style={{
          textAlign: "center",
          padding: "30px",
        }}
      >
        <h2>
          {error}
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

  // ==================================================
  // الواجهة
  // ==================================================

  return (
    <div
      className="card student-history"
      dir="rtl"
    >

      {/* ================================================== */}
      {/* رأس الصفحة */}
      {/* ================================================== */}

      <div
        style={{
          textAlign: "center",
          marginBottom: "25px",
        }}
      >

        <img
          src="/logo.png"
          alt="شعار الجمعية"
          style={{
            width: "80px",
            height: "80px",
            objectFit: "contain",
          }}
        />

        <h2>
          📚 سجل الحفظ
        </h2>

        {studentData && (
          <>
            <h3>
              👨‍🎓 {studentData.name}
            </h3>

            <p>
              👤 رقم الطالب:
              {" "}
              <strong>
                {studentData.number ||
                  "غير متوفر"}
              </strong>
            </p>

            <p>
              📚 الحلقة:
              {" "}
              {studentData.halaqa ||
                "غير محددة"}
            </p>
          </>
        )}

      </div>

      {/* ================================================== */}
      {/* لا توجد نتائج */}
      {/* ================================================== */}

      {records.length === 0 ? (

        <div
          style={{
            textAlign: "center",
            padding: "30px",
          }}
        >

          <h3>
            📭 لا توجد نتائج حفظ بعد
          </h3>

        </div>

      ) : (

        <>
          {/* ================================================== */}
          {/* عدد النتائج */}
          {/* ================================================== */}

          <div
            style={{
              textAlign: "center",
              marginBottom: "15px",
            }}
          >
            <strong>
              📊 عدد النتائج:
              {" "}
              {records.length}
            </strong>
          </div>

          {/* ================================================== */}
          {/* الجدول */}
          {/* ================================================== */}

          <div
            style={{
              overflowX: "auto",
              width: "100%",
            }}
          >

            <table
              style={{
                width: "100%",
                borderCollapse:
                  "collapse",
                minWidth:
                  "700px",
                textAlign:
                  "center",
              }}
            >

              <thead>

                <tr>

                  <th
                    style={thStyle}
                  >
                    #
                  </th>

                  <th
                    style={thStyle}
                  >
                    📅 التاريخ
                  </th>

                  <th
                    style={thStyle}
                  >
                    📖 المحفوظ الجديد
                  </th>

                  <th
                    style={thStyle}
                  >
                    🔄 المراجعة
                  </th>

                  <th
                    style={thStyle}
                  >
                    ⭐ التقييم
                  </th>

                  <th
                    style={thStyle}
                  >
                    📝 الملاحظات
                  </th>

                </tr>

              </thead>

              <tbody>

                {records.map(
                  (record, index) => (

                    <tr
                      key={
                        record.id
                      }
                    >

                      <td
                        style={tdStyle}
                      >
                        {index + 1}
                      </td>

                      <td
                        style={tdStyle}
                      >
                        {record.date ||
                          "غير محدد"}
                      </td>

                      <td
                        style={tdStyle}
                      >
                        {record.new ||
                          "—"}
                      </td>

                      <td
                        style={tdStyle}
                      >
                        {record.review ||
                          "—"}
                      </td>

                      <td
                        style={{
                          ...tdStyle,
                          fontWeight:
                            "bold",
                        }}
                      >
                        {record.rate ||
                          "—"}
                      </td>

                      <td
                        style={tdStyle}
                      >
                        {record.notes ||
                          "—"}
                      </td>

                    </tr>

                  )
                )}

              </tbody>

            </table>

          </div>
        </>
      )}

      {/* ================================================== */}
      {/* الأزرار */}
      {/* ================================================== */}

      <div
        style={{
          marginTop: "25px",
          display: "flex",
          gap: "10px",
          flexWrap: "wrap",
        }}
      >

        <button
          className="btn"
          onClick={() =>
            window.print()
          }
        >
          🖨️ طباعة السجل
        </button>

        {studentData &&
          !new URLSearchParams(
            window.location.search
          ).get(
            "studentHistory"
          ) && (

            <button
              className="btn"
              onClick={() =>
                setPage("student")
              }
            >
              ⬅️ رجوع للطالب
            </button>

          )}

      </div>

    </div>
  );
}

// ==================================================
// تنسيق الجدول
// ==================================================

const thStyle = {
  border: "1px solid #ddd",
  padding: "12px",
  background: "#f1f5f9",
  fontWeight: "bold",
};

const tdStyle = {
  border: "1px solid #ddd",
  padding: "10px",
};