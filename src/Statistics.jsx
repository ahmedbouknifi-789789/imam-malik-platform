import { useMemo, useEffect, useState } from "react";
import {
  collection,
  getDocs,
  query,
  where,
} from "firebase/firestore";
import { db } from "./Firebase";

export default function Statistics({
  setPage,
  students,
  loggedTeacher,
  selectedHalaqa,
}) {
  const [attendance, setAttendance] = useState([]);
  const [memorization, setMemorization] = useState([]);

  const currentHalaqa =
    selectedHalaqa ||
    localStorage.getItem("teacherSelectedHalaqa") ||
    loggedTeacher?.halaqas?.[0] ||
    "";

  const visibleStudents = useMemo(() => {
    if (!loggedTeacher) return students;

    return students.filter(
      (student) => student.halaqa === currentHalaqa
    );
  }, [students, currentHalaqa, loggedTeacher]);

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

  useEffect(() => {
    if (currentHalaqa && visibleStudents.length > 0) {
      loadStatistics();
    } else {
      setAttendance([]);
      setMemorization([]);
    }
  }, [currentHalaqa, visibleStudents]);

  async function loadStatistics() {
    try {
      const today = getToday();

      const ids = visibleStudents.map((s) => s.id);

      if (ids.length === 0) {
        setAttendance([]);
        setMemorization([]);
        return;
      }

      const attendanceSnapshot = await getDocs(
        query(
          collection(db, "attendance"),
          where("date", "==", today)
        )
      );

      const memorizationSnapshot = await getDocs(
        query(
          collection(db, "memorization"),
          where("date", "==", today)
        )
      );

      const attendanceData = attendanceSnapshot.docs
        .map((doc) => doc.data())
        .filter((item) => ids.includes(item.studentId));

      const memorizationData = memorizationSnapshot.docs
        .map((doc) => doc.data())
        .filter((item) => ids.includes(item.studentId));

      setAttendance(attendanceData);
      setMemorization(memorizationData);

    } catch (error) {
      console.error(error);
    }
  }

  const total = visibleStudents.length;

  const males = visibleStudents.filter(
    (s) => s.gender === "ذكر"
  ).length;

  const females = visibleStudents.filter(
    (s) => s.gender === "أنثى"
  ).length;

  const present = attendance.filter(
    (a) => a.status === "حاضر"
  ).length;

  const absent = attendance.filter(
    (a) => a.status === "غائب"
  ).length;

  const late = attendance.filter(
    (a) => a.status === "متأخر"
  ).length;

  const memorized = memorization.filter(
    (m) => m.new && m.new !== ""
  ).length;

  const reviewed = memorization.filter(
    (m) => m.review && m.review !== ""
  ).length;

  return (
    <div className="card">
      <h2>📊 إحصائيات الحلقة</h2>

      <p>
        <strong>الحلقة:</strong> {currentHalaqa || "غير محددة"}
      </p>

      <hr />

      <h3>👨‍🎓 عدد الطلاب: {total}</h3>
      <h3>👦 الذكور: {males}</h3>
      <h3>👧 الإناث: {females}</h3>

      <hr />

      <h3>✅ الحاضرون: {present}</h3>
      <h3>❌ الغائبون: {absent}</h3>
      <h3>⏰ المتأخرون: {late}</h3>

      <hr />

      <h3>📖 سجلوا حفظًا: {memorized}</h3>
      <h3>🔁 سجلوا مراجعة: {reviewed}</h3>

      <br />

      <button
        className="btn"
        onClick={() => setPage("teacherPanel")}
      >
        ⬅️ الرجوع
      </button>
    </div>
  );
}