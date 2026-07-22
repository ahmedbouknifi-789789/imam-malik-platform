import { useEffect, useState } from "react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "./Firebase";

export default function StudentHistory({ setPage, student }) {
  const [records, setRecords] = useState([]);

  useEffect(() => {
    if (student) {
      loadHistory();
    }
  }, [student]);

  async function loadHistory() {
    const snapshot = await getDocs(collection(db, "memorization"));

    const list = [];

    snapshot.forEach((doc) => {
      const item = doc.data();

      if (item.studentId === student.id) {
        list.push(item);
      }
    });

    list.sort((a, b) => {
      return (
        new Date(b.date + " " + (b.time || "")) -
        new Date(a.date + " " + (a.time || ""))
      );
    });

    setRecords(list);
  }

  return (
    <div className="card">
      <h2>📚 سجل الحفظ الكامل</h2>

      <p><strong>الطالب:</strong> {student?.name}</p>

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
            <th>التاريخ</th>
            <th>السورة</th>
            <th>الصفحة</th>
            <th>الجديد</th>
            <th>المراجعة</th>
            <th>التقييم</th>
          </tr>
        </thead>

        <tbody>
          {records.map((r, index) => (
            <tr key={index}>
              <td>{r.date}</td>
              <td>{r.surah}</td>
              <td>{r.page}</td>
              <td>{r.new}</td>
              <td>{r.review}</td>
              <td>{r.rate}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <br />

      <button
        className="btn"
        onClick={() => setPage("student")}
      >
        رجوع
      </button>
    </div>
  );
}