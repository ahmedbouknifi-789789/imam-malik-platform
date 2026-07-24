import { useState, useEffect } from "react";
import {
  collection,
  addDoc,
  getDocs,
} from "firebase/firestore";
import { db } from "./Firebase";

export default function Attendance({ setPage, students }) {
  const [attendance, setAttendance] = useState({});

  useEffect(() => {
    loadAttendance();
  }, []);

  async function loadAttendance() {
    try {
      const querySnapshot = await getDocs(collection(db, "attendance"));

      const data = {};

      querySnapshot.forEach((doc) => {
        const item = doc.data();

        data[item.studentId] = item.status;
      });

      setAttendance(data);
    } catch (error) {
      console.error(error);
    }
  }

  const handleChange = (id, value) => {
    setAttendance((prev) => ({
      ...prev,
      [id]: value,
    }));
  };

  async function saveAttendance() {
    try {
      for (const studentId in attendance) {
        await addDoc(collection(db, "attendance"), {
          studentId,
          status: attendance[studentId],
          date: new Date().toLocaleDateString("fr-CA"),
        });
      }

      alert("✅ تم حفظ الحضور");
      loadAttendance();
    } catch (error) {
      console.error(error);
      alert("❌ حدث خطأ أثناء الحفظ");
    }
  }

  return (
    <div className="card">
      <h2>📅 الحضور والغياب</h2>

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
          {students.map((student) => (
            <tr key={student.id}>
              <td>{student.name}</td>

              <td>
                <select
                  value={attendance[student.id] || "حاضر"}
                  onChange={(e) =>
                    handleChange(student.id, e.target.value)
                  }
                >
                  <option value="حاضر">✅ حاضر</option>
                  <option value="غائب">❌ غائب</option>
                  <option value="متأخر">⏰ متأخر</option>
                </select>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <br />
      <button
        className="btn"
        onClick={saveAttendance}
      >
        💾 حفظ الحضور
      </button>

      <button
        className="btn"
        onClick={() => setPage("teacherPanel")}
      >
        ⬅️ الرجوع
      </button>
    </div>
  );
}