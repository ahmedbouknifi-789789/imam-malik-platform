import { useState } from "react";
import {
  doc,
  updateDoc,
} from "firebase/firestore";

import { db } from "./Firebase";

export default function HalaqaStudents({
  setPage,
  selectedHalaqa,
  students,
  loadStudents,
}) {
  const [loading, setLoading] = useState(false);

  if (!selectedHalaqa) {
    return (
      <div className="card">
        <h2>لا توجد حلقة محددة</h2>

        <button
          className="btn"
          onClick={() => setPage("halaqas")}
        >
          ⬅️ الرجوع
        </button>
      </div>
    );
  }

  // الطلاب الموجودون في الحلقة
  const halaqaStudents = students.filter(
    (student) =>
      student.halaqa === selectedHalaqa.name
  );

  // الطلاب الذين يمكن إضافتهم
  const otherStudents = students.filter(
    (student) =>
      student.halaqa !== selectedHalaqa.name
  );

  // =========================
  // إضافة طالب إلى الحلقة
  // =========================

  async function addStudentToHalaqa(student) {
    try {
      setLoading(true);

      const studentRef = doc(
        db,
        "students",
        student.id
      );

      await updateDoc(studentRef, {
        halaqa: selectedHalaqa.name,
      });

      await loadStudents();

      alert(
        `✅ تمت إضافة ${student.name} إلى الحلقة`
      );

    } catch (error) {
      console.log(error);

      alert(
        "❌ حدث خطأ أثناء إضافة الطالب"
      );

    } finally {
      setLoading(false);
    }
  }

  // =========================
  // إزالة طالب من الحلقة
  // =========================

  async function removeStudentFromHalaqa(student) {
    const confirmRemove = window.confirm(
      `هل تريد إزالة الطالب ${student.name} من الحلقة؟`
    );

    if (!confirmRemove) {
      return;
    }

    try {
      setLoading(true);

      const studentRef = doc(
        db,
        "students",
        student.id
      );

      await updateDoc(studentRef, {
        halaqa: "",
      });

      await loadStudents();

      alert(
        `✅ تمت إزالة ${student.name} من الحلقة`
      );

    } catch (error) {
      console.log(error);

      alert(
        "❌ حدث خطأ أثناء إزالة الطالب"
      );

    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="card">

      <h2>
        📖 {selectedHalaqa.name}
      </h2>

      {/* ========================= */}
      {/* طلاب الحلقة */}
      {/* ========================= */}

      <h3>
        👨‍🎓 طلاب الحلقة
      </h3>

      {halaqaStudents.length === 0 ? (

        <p>
          لا يوجد طلاب في هذه الحلقة.
        </p>

      ) : (

        <table
          border="1"
          style={{
            width: "100%",
            borderCollapse: "collapse",
            textAlign: "center",
          }}
        >

          <thead>
            <tr>
              <th>الاسم</th>
              <th>المستوى</th>
              <th>الهاتف</th>
              <th>الإجراء</th>
            </tr>
          </thead>

          <tbody>

            {halaqaStudents.map((student) => (

              <tr key={student.id}>

                <td>
                  {student.name}
                </td>

                <td>
                  {student.level || "غير محدد"}
                </td>

                <td>
                  {student.phone || "غير متوفر"}
                </td>

                <td>

                  <button
                    className="btn"
                    style={{
                      background: "#b91c1c",
                      fontSize: "14px",
                    }}
                    disabled={loading}
                    onClick={() =>
                      removeStudentFromHalaqa(student)
                    }
                  >
                    ❌ إزالة
                  </button>

                </td>

              </tr>

            ))}

          </tbody>

        </table>

      )}

      <br />

      {/* ========================= */}
      {/* إضافة طلاب */}
      {/* ========================= */}

      <h3>
        ➕ إضافة طالب إلى الحلقة
      </h3>

      {otherStudents.length === 0 ? (

        <p>
          لا يوجد طلاب آخرون لإضافتهم.
        </p>

      ) : (

        <table
          border="1"
          style={{
            width: "100%",
            borderCollapse: "collapse",
            textAlign: "center",
          }}
        >

          <thead>
            <tr>
              <th>الاسم</th>
              <th>الحلقة الحالية</th>
              <th>المستوى</th>
              <th>الإجراء</th>
            </tr>
          </thead>

          <tbody>

            {otherStudents.map((student) => (

              <tr key={student.id}>

                <td>
                  {student.name}
                </td>

                <td>
                  {student.halaqa || "بدون حلقة"}
                </td>

                <td>
                  {student.level || "غير محدد"}
                </td>

                <td>

                  <button
                    className="btn"
                    style={{
                      background: "#15803d",
                      fontSize: "14px",
                    }}
                    disabled={loading}
                    onClick={() =>
                      addStudentToHalaqa(student)
                    }
                  >
                    ➕ إضافة
                  </button>

                </td>

              </tr>

            ))}

          </tbody>

        </table>

      )}

      <br />

      <button
        className="btn"
        onClick={() =>
          setPage("halaqas")
        }
      >
        ⬅️ الرجوع إلى الحلقات
      </button>

    </div>
  );
}