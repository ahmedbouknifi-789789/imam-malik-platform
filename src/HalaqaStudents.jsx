import { useState } from "react";
import { doc, updateDoc } from "firebase/firestore";
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

  const halaqaName = (selectedHalaqa.name || "").trim();

  // الطلاب الموجودون في الحلقة
  const halaqaStudents = students.filter(
    (student) =>
      (student.halaqa || "").trim() === halaqaName
  );

  // باقي الطلاب
  const otherStudents = students.filter(
    (student) =>
      (student.halaqa || "").trim() !== halaqaName
  );

  async function addStudentToHalaqa(student) {
    try {
      setLoading(true);

      await updateDoc(
        doc(db, "students", student.id),
        {
          halaqa: halaqaName,
        }
      );

      await loadStudents();

      alert(`✅ تمت إضافة ${student.name}`);

    } catch (error) {
      console.error(error);
      alert("❌ حدث خطأ أثناء الإضافة");
    } finally {
      setLoading(false);
    }
  }

  async function removeStudentFromHalaqa(student) {

    if (
      !window.confirm(
        `هل تريد إزالة ${student.name} من الحلقة؟`
      )
    ) {
      return;
    }

    try {
      setLoading(true);

      await updateDoc(
        doc(db, "students", student.id),
        {
          halaqa: "",
        }
      );

      await loadStudents();

      alert(`✅ تمت إزالة ${student.name}`);

    } catch (error) {
      console.error(error);
      alert("❌ حدث خطأ أثناء الحذف");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="card">

      <h2>📖 {halaqaName}</h2>

      <h3>👨‍🎓 طلاب الحلقة</h3>

      {halaqaStudents.length === 0 ? (
        <p>لا يوجد طلاب في هذه الحلقة.</p>
      ) : (
        <table border="1" style={{width:"100%",textAlign:"center"}}>
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

                <td>{student.name}</td>

                <td>{student.level || "غير محدد"}</td>

                <td>{student.phone || "-"}</td>

                <td>

                  <button
                    className="btn"
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

      <h3>➕ إضافة طالب</h3>

      {otherStudents.length === 0 ? (
        <p>لا يوجد طلاب لإضافتهم.</p>
      ) : (
        <table border="1" style={{width:"100%",textAlign:"center"}}>
          <thead>
            <tr>
              <th>الاسم</th>
              <th>الحلقة الحالية</th>
              <th>الإجراء</th>
            </tr>
          </thead>

          <tbody>

            {otherStudents.map((student) => (

              <tr key={student.id}>

                <td>{student.name}</td>

                <td>{student.halaqa || "بدون حلقة"}</td>

                <td>

                  <button
                    className="btn"
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
        onClick={() => setPage("halaqas")}
      >
        ⬅️ الرجوع
      </button>

    </div>
  );
}