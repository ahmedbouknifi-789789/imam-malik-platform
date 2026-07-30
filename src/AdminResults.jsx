import { useEffect, useState } from "react";

import {
  collection,
  getDocs,
  deleteDoc,
  doc,
} from "firebase/firestore";

import { db } from "./Firebase";

export default function AdminResults({
  setPage,
  students,
}) {
  const [selectedStudent, setSelectedStudent] =
    useState("");

  const [records, setRecords] = useState([]);

  const [loading, setLoading] =
    useState(false);

  // =========================
  // تحميل نتائج الطالب
  // =========================

  async function loadResults(studentId) {
    if (!studentId) {
      setRecords([]);
      return;
    }

    try {
      setLoading(true);

      const snapshot =
        await getDocs(
          collection(
            db,
            "memorization"
          )
        );

      const list = [];

      snapshot.forEach((docItem) => {
        const item =
          docItem.data();

        if (
          item.studentId ===
          studentId
        ) {
          list.push({
            id: docItem.id,
            ...item,
          });
        }
      });

      // الأحدث أولًا

      list.sort((a, b) => {
        return (
          new Date(
            b.date +
              " " +
              (b.time || "")
          ) -
          new Date(
            a.date +
              " " +
              (a.time || "")
          )
        );
      });

      setRecords(list);

    } catch (error) {

      console.log(
        "خطأ في تحميل النتائج:",
        error
      );

      alert(
        "❌ حدث خطأ أثناء تحميل النتائج"
      );

    } finally {

      setLoading(false);

    }
  }

  // =========================
  // تغيير الطالب
  // =========================

  function handleStudentChange(
    e
  ) {

    const studentId =
      e.target.value;

    setSelectedStudent(
      studentId
    );

    loadResults(
      studentId
    );
  }

  // =========================
  // حذف النتيجة
  // =========================

  async function deleteResult(
    record
  ) {

    const confirmed =
      window.confirm(
        `هل أنت متأكد من حذف نتيجة الطالب في تاريخ ${record.date}؟\n\nهذا الإجراء لا يمكن التراجع عنه.`
      );

    if (!confirmed) {
      return;
    }

    try {

      await deleteDoc(
        doc(
          db,
          "memorization",
          record.id
        )
      );

      // حذف النتيجة من الشاشة
      setRecords((prev) =>
        prev.filter(
          (item) =>
            item.id !==
            record.id
        )
      );

      alert(
        "✅ تم حذف النتيجة بنجاح"
      );

    } catch (error) {

      console.log(
        "خطأ في حذف النتيجة:",
        error
      );

      alert(
        "❌ لم يتم حذف النتيجة"
      );

    }
  }

  // =========================
  // اسم الطالب
  // =========================

  const selectedStudentData =
    students.find(
      (student) =>
        student.id ===
        selectedStudent
    );

  return (

    <div className="card">

      <h2>
        📚 إدارة نتائج الطلاب
      </h2>

      <p>
        من هنا يستطيع المدير
        مشاهدة وحذف نتائج الطلاب.
      </p>

      {/* =====================
          اختيار الطالب
      ===================== */}

      <select
        value={
          selectedStudent
        }
        onChange={
          handleStudentChange
        }
        style={{
          width: "100%",
          padding: "12px",
          marginBottom: "20px",
        }}
      >

        <option value="">
          اختر الطالب
        </option>

        {students.map(
          (student) => (

            <option
              key={
                student.id
              }
              value={
                student.id
              }
            >
              {student.name}
              {" - "}
              {student.number ||
                "بدون رقم"}
            </option>

          )
        )}

      </select>

      {/* =====================
          معلومات الطالب
      ===================== */}

      {selectedStudentData && (

        <div
          style={{
            background:
              "#f1f5f9",
            padding: "15px",
            borderRadius:
              "10px",
            marginBottom:
              "20px",
          }}
        >

          <h3>
            👨‍🎓{" "}
            {
              selectedStudentData.name
            }
          </h3>

          <p>
            رقم التسجيل:{" "}
            {
              selectedStudentData.number ||
              "غير متوفر"
            }
          </p>

          <p>
            الحلقة:{" "}
            {
              selectedStudentData.halaqa ||
              "غير محددة"
            }
          </p>

        </div>

      )}

      {/* =====================
          النتائج
      ===================== */}

      {loading ? (

        <p>
          ⏳ جاري تحميل النتائج...
        </p>

      ) : selectedStudent ? (

        records.length === 0 ? (

          <p className="empty-message">
            📭 لا توجد نتائج لهذا الطالب.
          </p>

        ) : (

          <div
            style={{
              overflowX:
                "auto",
            }}
          >

            <table
              border="1"
              style={{
                width:
                  "100%",
                borderCollapse:
                  "collapse",
                textAlign:
                  "center",
              }}
            >

              <thead>

                <tr>

                  <th>
                    التاريخ
                  </th>

                  <th>
                    السورة
                  </th>

                  <th>
                    الصفحة
                  </th>

                  <th>
                    الجديد
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

                  <th>
                    حذف
                  </th>

                </tr>

              </thead>

              <tbody>

                {records.map(
                  (record) => (

                    <tr
                      key={
                        record.id
                      }
                    >

                      <td>
                        {
                          record.date ||
                          "-"
                        }
                      </td>

                      <td>
                        {
                          record.surah ||
                          "-"
                        }
                      </td>

                      <td>
                        {
                          record.page ||
                          "-"
                        }
                      </td>

                      <td>
                        {
                          record.new ||
                          "-"
                        }
                      </td>

                      <td>
                        {
                          record.review ||
                          "-"
                        }
                      </td>

                      <td>
                        {
                          record.rate ||
                          "-"
                        }
                      </td>

                      <td>
                        {
                          record.notes ||
                          "-"
                        }
                      </td>

                      <td>

                        <button
                          className="btn"
                          style={{
                            background:
                              "#b91c1c",
                            color:
                              "white",
                          }}
                          onClick={() =>
                            deleteResult(
                              record
                            )
                          }
                        >
                          🗑️ حذف
                        </button>

                      </td>

                    </tr>

                  )
                )}

              </tbody>

            </table>

          </div>

        )

      ) : (

        <p>
          👆 اختر طالبًا لعرض نتائجه.
        </p>

      )}

      <br />

      {/* =====================
          رجوع
      ===================== */}

      <button
        className="btn"
        onClick={() =>
          setPage("admin")
        }
      >
        ⬅️ رجوع إلى لوحة الإدارة
      </button>

    </div>

  );
}