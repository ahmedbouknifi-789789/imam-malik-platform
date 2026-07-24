import { useState, useEffect } from "react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "./Firebase";

export default function StudentRecord({ setPage, student }) {
  const [records, setRecords] = useState([]);

  useEffect(() => {
    loadRecords();
  }, []);

  async function loadRecords() {
    const querySnapshot = await getDocs(collection(db, "memorization"));

    const list = [];

    querySnapshot.forEach((doc) => {
      const data = doc.data();

      if (data.studentId === student.id) {
        list.push(data);
      }
    });

    list.sort((a, b) => b.date.localeCompare(a.date));

    setRecords(list);
  }

  return (
    <div className="card">
      <h2>📖 سجل الحفظ</h2>

      <h3>{student?.name}</h3>

      {records.length === 0 ? (
        <p>لا توجد نتائج محفوظة.</p>
      ) : (
        records.map((item, index) => (
          <div
            key={index}
            style={{
              border: "1px solid #ddd",
              padding: "10px",
              marginBottom: "10px",
              borderRadius: "8px",
            }}
          >
            <p><b>📅 التاريخ:</b> {item.date}</p>
            <p><b>📖 السورة:</b> {item.surah}</p>
            <p><b>🆕 الجديد:</b> {item.new}</p>
            <p><b>🔁 المراجعة:</b> {item.review}</p>
            <p><b>⭐ التقييم:</b> {item.rate}</p>
            <p><b>📝 الملاحظات:</b> {item.notes}</p>
          </div>
        ))
      )}

      <button
        className="btn"
        onClick={() => setPage("teacherPanel")}
      >
        ⬅️ الرجوع
      </button>
    </div>
  );
}