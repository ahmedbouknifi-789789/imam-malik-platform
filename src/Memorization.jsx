import { useState, useEffect } from "react";
import {
  collection,
  addDoc,
  getDocs,
} from "firebase/firestore";
import { db } from "./Firebase";

export default function Memorization({
  setPage,
  students,
  loggedTeacher,
}) {
  const [records, setRecords] = useState({});

  useEffect(() => {
    loadResults();
  }, []);

  async function loadResults() {
    try {
      const snapshot = await getDocs(
        collection(db, "memorization")
      );

      const data = {};

      snapshot.forEach((doc) => {
        const item = doc.data();

        data[item.studentId] = {
          surah: item.surah || "",
          new: item.new || "",
          review: item.review || "",
          rate: item.rate || "ممتاز",
          notes: item.notes || "",
        };
      });

      setRecords(data);
    } catch (error) {
      console.log(error);
    }
  }

  function handleChange(id, field, value) {
    setRecords((prev) => ({
      ...prev,
      [id]: {
        ...prev[id],
        [field]: value,
      },
    }));
  }

  const visibleStudents = loggedTeacher
    ? students.filter(
        (s) => s.halaqa === loggedTeacher.halaqa
      )
    : students;

  async function saveResults() {
    try {
      const today = new Date().toLocaleDateString("fr-CA");

      for (const student of visibleStudents) {
        const result = records[student.id] || {};

        // إذا لم يختر الأستاذ شيئًا
        // يتم تسجيل الطالب غائبًا تلقائيًا
        const isAbsent =
          !result.new &&
          !result.review &&
          !result.notes;

        const finalResult = {
          studentId: student.id,
          date: today,
          new: isAbsent
            ? "غائب"
            : result.new || "",
          review: result.review || "",
          rate: result.rate || "ممتاز",
          notes: result.notes || "",
        };

        // حفظ نتيجة الطالب
        await addDoc(
          collection(db, "memorization"),
          finalResult
        );

        // إنشاء إشعار للطالب
        await addDoc(
          collection(db, "notifications"),
          {
            studentId: student.id,
            title: isAbsent
              ? "⚠️ تسجيل الغياب"
              : "📖 نتيجة الحفظ",

            message: isAbsent
              ? "تم تسجيل غيابك اليوم."
              : `تم تسجيل نتيجة الحفظ الخاصة بك: ${
                  result.new || "لم يتم تسجيل محفوظ جديد"
                }.`,

            date: today,
            read: false,
          }
        );
      }

      alert("✅ تم حفظ نتائج جميع الطلاب وإرسال الإشعارات");

    } catch (error) {
      console.log(error);
      alert("❌ حدث خطأ أثناء حفظ النتائج");
    }
  }

  return (
    <div className="card">

      <h2>📖 نتائج الحفظ اليومية</h2>

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
            <th>المحفوظ الجديد</th>
            <th>المراجعة</th>
            <th>التقدير</th>
            <th>ملاحظة</th>
          </tr>
        </thead>

        <tbody>
          {visibleStudents.map((student) => (

            <tr key={student.id}>

              <td>
                {student.name}
              </td>

              <td>
                <select
                  value={
                    records[student.id]?.new || ""
                  }
                  onChange={(e) =>
                    handleChange(
                      student.id,
                      "new",
                      e.target.value
                    )
                  }
                >
                  <option value="">
                    اختر
                  </option>

                  <option value="نصف حزب">
                    نصف حزب
                  </option>

                  <option value="ربع">
                    ربع
                  </option>

                  <option value="ثمن">
                    ثمن
                  </option>

                  <option value="نصف ثمن">
                    نصف ثمن
                  </option>

                  <option value="ربع ثمن">
                    ربع ثمن
                  </option>

                  <option value="حضر ولم يحفظ">
                    حضر ولم يحفظ
                  </option>
                </select>
              </td>

              <td>
                <select
                  value={
                    records[student.id]?.review || ""
                  }
                  onChange={(e) =>
                    handleChange(
                      student.id,
                      "review",
                      e.target.value
                    )
                  }
                >
                  <option value="">
                    اختر
                  </option>

                  <option value="خمسة أحزاب">
                    خمسة أحزاب
                  </option>

                  <option value="نصف خمسة">
                    نصف خمسة
                  </option>

                  <option value="حزب واحد">
                    حزب واحد
                  </option>

                  <option value="نصف حزب">
                    نصف حزب
                  </option>
                </select>
              </td>

              <td>
                <select
                  value={
                    records[student.id]?.rate ||
                    "ممتاز"
                  }
                  onChange={(e) =>
                    handleChange(
                      student.id,
                      "rate",
                      e.target.value
                    )
                  }
                >
                  <option value="ممتاز">
                    ممتاز
                  </option>

                  <option value="جيد جدًا">
                    جيد جدًا
                  </option>

                  <option value="جيد">
                    جيد
                  </option>

                  <option value="متوسط">
                    متوسط
                  </option>

                  <option value="ضعيف">
                    ضعيف
                  </option>
                </select>
              </td>

              <td>
                <input
                  type="text"
                  value={
                    records[student.id]?.notes || ""
                  }
                  onChange={(e) =>
                    handleChange(
                      student.id,
                      "notes",
                      e.target.value
                    )
                  }
                />
              </td>

            </tr>

          ))}
        </tbody>
      </table>

      <br />

      <button
        className="btn"
        onClick={saveResults}
      >
        💾 حفظ النتائج
      </button>

      <br />
      <br />

      <button
        className="btn"
        onClick={() =>
          setPage(
            loggedTeacher
              ? "teacherPanel"
              : "admin"
          )
        }
      >
        ⬅️ الرجوع
      </button>

    </div>
  );
}