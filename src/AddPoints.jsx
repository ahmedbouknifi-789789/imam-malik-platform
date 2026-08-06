import { useState } from "react";
import { doc, updateDoc } from "firebase/firestore";
import { db } from "./Firebase";

export default function AddPoints({
  students,
  loadStudents,
  setPage,
  previousPage,
}) {

  const [selectedStudent, setSelectedStudent] = useState(null);

  const [hifz, setHifz] = useState(0);
  const [attendance, setAttendance] = useState(0);
  const [behavior, setBehavior] = useState(0);


  async function savePoints() {

    if (!selectedStudent) {
      alert("اختر الطالب أولاً");
      return;
    }


    const newHifz =
      (selectedStudent.hifzPoints || 0) +
      Number(hifz);


    const newAttendance =
      (selectedStudent.attendancePoints || 0) +
      Number(attendance);


    const newBehavior =
      (selectedStudent.behaviorPoints || 0) +
      Number(behavior);


    const total =
      newHifz +
      newAttendance +
      newBehavior;


    await updateDoc(
      doc(db, "students", selectedStudent.id),
      {
        hifzPoints: newHifz,
        attendancePoints: newAttendance,
        behaviorPoints: newBehavior,
        points: total,
      }
    );


    await loadStudents();


    setHifz(0);
    setAttendance(0);
    setBehavior(0);

    alert("تم تحديث النقاط بنجاح");
  }



  return (
    <div
      style={{
        direction:"rtl",
        textAlign:"center",
        padding:"20px"
      }}
    >

      <button
        onClick={() => setPage(previousPage)}
      >
        ⬅️ رجوع
      </button>


      <h2>
        ➕ إضافة نقاط طالب
      </h2>


      <select
        onChange={(e) =>
          setSelectedStudent(
            students.find(
              s => s.id === e.target.value
            )
          )
        }
      >

        <option>
          اختر الطالب
        </option>

        {students.map(student => (

          <option
            key={student.id}
            value={student.id}
          >
            {student.name}
          </option>

        ))}

      </select>


      {selectedStudent && (

        <div>

          <h3>
            {selectedStudent.name}
          </h3>

          <p>
            النقاط الحالية:
            {selectedStudent.points || 0}
          </p>


          <p>
            📖 نقاط الحفظ
          </p>

          <input
            type="number"
            value={hifz}
            onChange={(e)=>setHifz(e.target.value)}
          />


          <p>
            🕌 نقاط الحضور
          </p>

          <input
            type="number"
            value={attendance}
            onChange={(e)=>setAttendance(e.target.value)}
          />


          <p>
            ⭐ نقاط التقدير
          </p>

          <input
            type="number"
            value={behavior}
            onChange={(e)=>setBehavior(e.target.value)}
          />


          <br />

          <button
            onClick={savePoints}
          >
            💾 حفظ النقاط
          </button>

        </div>

      )}

    </div>
  );
}