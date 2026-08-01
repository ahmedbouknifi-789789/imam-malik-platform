import { useState, useEffect } from "react";
import {
  collection,
  addDoc,
  getDocs,
  updateDoc,
  doc,
  query,
  where,
} from "firebase/firestore";
import { db } from "./Firebase";

export default function Attendance({
  setPage,
  students,
  loggedTeacher,
  selectedHalaqa,
}) {
  const [attendance, setAttendance] = useState({});

  useEffect(() => {
    setAttendance({});
  }, [selectedHalaqa]);

  const handleChange = (id, value) => {
    setAttendance((prev) => ({
      ...prev,
      [id]: value,
    }));
  };

  const currentHalaqa =
    selectedHalaqa ||
    localStorage.getItem("teacherSelectedHalaqa") ||
    loggedTeacher?.halaqas?.[0] ||
    loggedTeacher?.halaqa ||
    "";

  const visibleStudents = loggedTeacher
    ? students.filter(
        (student) => student.halaqa === currentHalaqa
      )
    : students;

  function getToday() {
    const now = new Date();

    if (now.getHours() < 4) {
      now.setDate(now.getDate() - 1);
    }

    const y = now.getFullYear();
    const m = String(now.getMonth() + 1).padStart(2, "0");
    const d = String(now.getDate()).padStart(2, "0");

    return `${y}-${m}-${d}`;
  }

  async function saveAttendance() {
    try {
      const today = getToday();

      for (const student of visibleStudents) {
        const studentId = student.id;

        if (!attendance[studentId]) continue;

        const attendanceQuery = query(
          collection(db, "attendance"),
          where("studentId", "==", studentId),
          where("date", "==", today)
        );

        const attendanceSnapshot = await getDocs(attendanceQuery);

        if (!attendanceSnapshot.empty) {
          await updateDoc(
            doc(
              db,
              "attendance",
              attendanceSnapshot.docs[0].id
            ),
            {
              status: attendance[studentId],
              halaqa: currentHalaqa,
            }
          );
        } else {
          await addDoc(
            collection(db, "attendance"),
            {
              studentId,
              status: attendance[studentId],
              halaqa: currentHalaqa,
              date: today,
            }
          );
        }
      }

      alert("✅ تم حفظ الحضور بنجاح");
    } catch (error) {
      console.error(error);
      alert("❌ حدث خطأ أثناء حفظ الحضور");
    }
  }
  return (
    <div className="card">

      <h2>📅 الحضور والغياب</h2>

      {loggedTeacher && (
        <p>
          <strong>الحلقة الحالية:</strong> {currentHalaqa || "غير محددة"}
        </p>
      )}

      {loggedTeacher &&
        currentHalaqa &&
        visibleStudents.length === 0 && (
          <p
            style={{
              textAlign: "center",
              padding: "20px",
              color: "#b45309",
              fontWeight: "bold",
            }}
          >
            ⚠️ لا يوجد طلاب في هذه الحلقة
          </p>
        )}

      {visibleStudents.length > 0 && (
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
              <th>الطالب</th>
              <th>الحالة</th>
            </tr>
          </thead>

          <tbody>
            {visibleStudents.map((student) => (
              <tr key={student.id}>
                <td>{student.name}</td>

                <td>
                  <select
                    value={attendance[student.id] || ""}
                    onChange={(e) =>
                      handleChange(student.id, e.target.value)
                    }
                  >
                    <option value="">اختر</option>
                    <option value="حاضر">✅ حاضر</option>
                    <option value="غائب">❌ غائب</option>
                    <option value="متأخر">⏰ متأخر</option>
                  </select>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      <br />

      {visibleStudents.length > 0 && (
        <button className="btn" onClick={saveAttendance}>
          💾 حفظ الحضور
        </button>
      )}

      <br />
      <br />

      <button
        className="btn"
        onClick={() =>
          setPage(loggedTeacher ? "teacherPanel" : "admin")
        }
      >
        ⬅️ الرجوع
      </button>

    </div>
  );
}