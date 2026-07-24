import { useState, useEffect } from "react";
import {
  collection,
  addDoc,
  getDocs,
} from "firebase/firestore";
import { db } from "./Firebase";

export default function Memorization({ setPage, students }) {
  const [records, setRecords] = useState({});

  useEffect(() => {
    loadResults();
  }, []);

  async function loadResults() {
    try {
      const querySnapshot = await getDocs(collection(db, "memorization"));

      const data = {};

      querySnapshot.forEach((doc) => {
        const item = doc.data();

        data[item.studentId] = {
          surah: item.surah || "",
          page: item.page || "",
          new: item.new || "",
          review: item.review || "",
          rate: item.rate || "ممتاز",
          notes: item.notes || "",
        };
      });

      setRecords(data);
    } catch (error) {
      console.error(error);
    }
  }

  const handleChange = (id, field, value) => {
    setRecords((prev) => ({
      ...prev,
      [id]: {
        ...prev[id],
        [field]: value,
      },
    }));
  };

  async function saveResults() {
    try {
      for (const studentId in records) {
        await addDoc(collection(db, "memorization"), {
  studentId,
  date: new Date().toLocaleDateString("fr-CA"),
  time: new Date().toLocaleTimeString(),
  ...records[studentId],
});
      }

      alert("✅ تم حفظ النتائج بنجاح");
      loadResults();
    } catch (error) {
      console.error(error);
      alert("❌ حدث خطأ أثناء الحفظ");
    }
  }

  return (
    <div className="card">
      <h2>📝 نتائج الحفظ اليومية</h2>

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
            <th>السورة</th>
            <th>الصفحة</th>
            <th>الحفظ الجديد</th>
            <th>المراجعة</th>
            <th>التقييم</th>
            <th>ملاحظات</th>
          </tr>
        </thead>

        <tbody>
          {students.map((student) => (
            <tr key={student.id}>
              <td>{student.name}</td>

              <td>
                <input
                  type="text"
                  value={records[student.id]?.surah || ""}
                  onChange={(e) =>
                    handleChange(student.id, "surah", e.target.value)
                  }
                />
              </td>

              <td>
                <input
                  type="text"
                  value={records[student.id]?.page || ""}
                  onChange={(e) =>
                    handleChange(student.id, "page", e.target.value)
                  }
                />
              </td>

              <td>
                <input
                  type="text"
                  value={records[student.id]?.new || ""}
                  onChange={(e) =>
                    handleChange(student.id, "new", e.target.value)
                  }
                />
              </td>

              <td>
                <input
                  type="text"
                  value={records[student.id]?.review || ""}
                  onChange={(e) =>
                    handleChange(student.id, "review", e.target.value)
                  }
                />
              </td>

              <td>
                <select
                  value={records[student.id]?.rate || "ممتاز"}
                  onChange={(e) =>
                    handleChange(student.id, "rate", e.target.value)
                  }
                >
                  <option value="ممتاز">ممتاز</option>
                  <option value="جيد جدًا">جيد جدًا</option>
                  <option value="جيد">جيد</option>
                  <option value="متوسط">متوسط</option>
                  <option value="ضعيف">ضعيف</option>
                </select>
              </td>

              <td>
                <input
                  type="text"
                  value={records[student.id]?.notes || ""}
                  onChange={(e) =>
                    handleChange(student.id, "notes", e.target.value)
                  }
                />
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <br />

      <button className="btn" onClick={saveResults}>
        💾 حفظ النتائج
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