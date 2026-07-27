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

  // =========================
  // تحميل النتائج السابقة
  // =========================

  useEffect(() => {
    loadResults();
  }, []);

  async function loadResults() {
    try {
      const snapshot = await getDocs(
        collection(db, "memorization")
      );

      const data = {};

      snapshot.forEach((docItem) => {
        const item = docItem.data();

        data[item.studentId] = {
          new: item.new || "",
          review: item.review || "",
          rate: item.rate || "ممتاز",
          notes: item.notes || "",
        };
      });

      setRecords(data);
    } catch (error) {
      console.log("خطأ في تحميل النتائج:", error);
    }
  }

  // =========================
  // تغيير بيانات الطالب
  // =========================

  function handleChange(id, field, value) {
    setRecords((prev) => ({
      ...prev,
      [id]: {
        ...prev[id],
        [field]: value,
      },
    }));
  }

  // =========================
  // الطلاب الظاهرون
  // =========================

  const visibleStudents = loggedTeacher
    ? students.filter(
        (student) =>
          student.halaqa === loggedTeacher.halaqa
      )
    : students;

  // =========================
  // حفظ النتائج
  // =========================

  async function saveResults() {
    try {
      const today =
        new Date().toLocaleDateString("fr-CA");

      for (const student of visibleStudents) {
        const result =
          records[student.id] || {};

        // إذا لم يتم إدخال أي نتيجة
        // يسجل الطالب غائبًا تلقائيًا

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

          rate:
            result.rate || "ممتاز",

          notes:
            result.notes || "",
        };

        // =========================
        // حفظ نتيجة الحفظ
        // =========================

        await addDoc(
          collection(db, "memorization"),
          finalResult
        );

        // =========================
        // إنشاء إشعار للطالب
        // =========================

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
                  result.new ||
                  "لم يتم تسجيل محفوظ جديد"
                }.`,

            date: today,

            read: false,
          }
        );
      }

      alert(
        "✅ تم حفظ نتائج جميع الطلاب وإرسال الإشعارات"
      );

    } catch (error) {
      console.log(
        "خطأ أثناء حفظ النتائج:",
        error
      );

      alert(
        "❌ حدث خطأ أثناء حفظ النتائج"
      );
    }
  }

  // =========================
  // الرجوع الصحيح
  // =========================

  function handleBack() {
    if (loggedTeacher) {
      // إذا دخل الأستاذ إلى صفحة الحفظ
      setPage("teacherPanel");
    } else {
      // إذا دخل المدير إلى صفحة الحفظ
      setPage("admin");
    }
  }

  // =========================
  // واجهة الصفحة
  // =========================

  return (
    <div className="card">

      <h2>
        📖 نتائج الحفظ اليومية
      </h2>

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

            <th>
              الطالب
            </th>

            <th>
              المحفوظ الجديد
            </th>

            <th>
              المراجعة
            </th>

            <th>
              التقدير
            </th>

            <th>
              ملاحظة
            </th>

          </tr>
        </thead>

        <tbody>

          {visibleStudents.map(
            (student) => (

              <tr
                key={student.id}
              >

                {/* اسم الطالب */}

                <td>
                  {student.name}
                </td>

                {/* المحفوظ الجديد */}

                <td>

                  <select
                    value={
                      records[
                        student.id
                      ]?.new || ""
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

                {/* المراجعة */}

                <td>

                  <select
                    value={
                      records[
                        student.id
                      ]?.review || ""
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

                {/* التقدير */}

                <td>

                  <select
                    value={
                      records[
                        student.id
                      ]?.rate ||
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

                {/* الملاحظات */}

                <td>

                  <input
                    type="text"
                    value={
                      records[
                        student.id
                      ]?.notes || ""
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

            )
          )}

        </tbody>

      </table>

      <br />

      {/* زر الحفظ */}

      <button
        className="btn"
        onClick={saveResults}
      >
        💾 حفظ النتائج
      </button>

      <br />
      <br />

      {/* زر الرجوع */}

      <button
        className="btn"
        onClick={handleBack}
      >
        ⬅️ الرجوع
      </button>

    </div>
  );
}