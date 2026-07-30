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

export default function Memorization({
  setPage,
  students,
  loggedTeacher,
}) {
  const [records, setRecords] = useState({});

  // ==========================================
  // حساب يوم الحلقة
  // بداية اليوم الدراسي: 04:00 صباحًا
  // الجمعة: إجازة
  // ==========================================

  function getHalaqaDate() {
    const now = new Date();

    // إذا كان الوقت قبل 04:00 صباحًا
    // نعتبره تابعًا لليوم السابق
    if (now.getHours() < 4) {
      now.setDate(now.getDate() - 1);
    }

    const year = now.getFullYear();
    const month = String(
      now.getMonth() + 1
    ).padStart(2, "0");

    const day = String(
      now.getDate()
    ).padStart(2, "0");

    return `${year}-${month}-${day}`;
  }

  // ==========================================
  // هل اليوم جمعة؟
  // ==========================================

  function isFriday() {
    const now = new Date();

    // قبل 04:00 نحسب اليوم السابق
    if (now.getHours() < 4) {
      now.setDate(now.getDate() - 1);
    }

    return now.getDay() === 5;
  }

  // ==========================================
  // تحميل الصفحة
  // ==========================================

  useEffect(() => {
    // مهم:
    // لا نقوم بتحميل النتائج القديمة داخل الخانات.
    // عند دخول الأستاذ تبدأ الخانات فارغة.

    setRecords({});
  }, [loggedTeacher]);

  // ==========================================
  // تغيير نتيجة الطالب
  // ==========================================

  function handleChange(
    id,
    field,
    value
  ) {
    setRecords((prev) => ({
      ...prev,

      [id]: {
        ...prev[id],

        [field]: value,
      },
    }));
  }

  // ==========================================
  // الطلاب الظاهرون
  // ==========================================

  const visibleStudents =
    loggedTeacher
      ? students.filter(
          (student) =>
            student.halaqa ===
            loggedTeacher.halaqa
        )
      : students;

  // ==========================================
  // حفظ النتائج
  // ==========================================

  async function saveResults() {
    try {
      // ======================================
      // الجمعة إجازة
      // ======================================

      if (isFriday()) {
        alert(
          "🕌 اليوم الجمعة إجازة، لا توجد حلقة اليوم."
        );

        return;
      }

      const today = getHalaqaDate();

      let savedCount = 0;

      // ======================================
      // المرور على الطلاب
      // ======================================

      for (
        const student of visibleStudents
      ) {
        const result =
          records[student.id] || {};

        // ====================================
        // هل الأستاذ سجل شيئًا للطالب؟
        // ====================================

        const hasResult =
          Boolean(
            result.new ||
            result.review ||
            result.notes
          );

        // ====================================
        // إذا لم يسجل الأستاذ شيئًا
        // لا نحفظ الطالب إطلاقًا
        // ====================================

        if (!hasResult) {
          continue;
        }

        // ====================================
        // النتيجة النهائية
        // ====================================

        const finalResult = {
          studentId:
            student.id,

          date:
            today,

          new:
            result.new || "",

          review:
            result.review || "",

          rate:
            result.rate || "ممتاز",

          notes:
            result.notes || "",
        };

        // ====================================
        // البحث عن نتيجة الطالب في نفس
        // يوم الحلقة
        // ====================================

        const resultQuery =
          query(
            collection(
              db,
              "memorization"
            ),

            where(
              "studentId",
              "==",
              student.id
            ),

            where(
              "date",
              "==",
              today
            )
          );

        const resultSnapshot =
          await getDocs(
            resultQuery
          );

        // ====================================
        // إذا كانت موجودة
        // نقوم بالتحديث بدل التكرار
        // ====================================

        if (
          !resultSnapshot.empty
        ) {
          const existingDoc =
            resultSnapshot.docs[0];

          await updateDoc(
            doc(
              db,
              "memorization",
              existingDoc.id
            ),
            finalResult
          );
        }

        // ====================================
        // إذا لم تكن موجودة
        // ننشئ واحدة فقط
        // ====================================

        else {
          await addDoc(
            collection(
              db,
              "memorization"
            ),
            finalResult
          );
        }

        savedCount++;

        // ====================================
        // الإشعار
        // ====================================

        const notificationQuery =
          query(
            collection(
              db,
              "notifications"
            ),

            where(
              "studentId",
              "==",
              student.id
            ),

            where(
              "date",
              "==",
              today
            )
          );

        const notificationSnapshot =
          await getDocs(
            notificationQuery
          );

        // ====================================
        // إنشاء إشعار واحد فقط
        // ====================================

        if (
          notificationSnapshot.empty
        ) {
          await addDoc(
            collection(
              db,
              "notifications"
            ),
            {
              studentId:
                student.id,

              title:
                "📖 نتيجة الحفظ",

              message:
                `تم تسجيل نتيجة الحفظ الخاصة بك: ${
                  result.new ||
                  "لم يتم تسجيل محفوظ جديد"
                }.`,

              date:
                today,

              read:
                false,
            }
          );
        }
      }

      // ======================================
      // مسح الخانات بعد الحفظ
      // ======================================

      setRecords({});

      // ======================================
      // الرسالة
      // ======================================

      if (savedCount === 0) {
        alert(
          "⚠️ لم يتم تسجيل أي نتيجة."
        );
      } else {
        alert(
          `✅ تم حفظ نتائج ${savedCount} طالب بنجاح.`
        );
      }

    } catch (error) {
      console.log(
        "خطأ أثناء حفظ النتائج:",
        error
      );

      alert(
        "❌ حدث خطأ أثناء حفظ النتائج."
      );
    }
  }

  // ==========================================
  // الرجوع الصحيح
  // ==========================================

  function handleBack() {
    if (loggedTeacher) {
      setPage(
        "teacherPanel"
      );
    } else {
      setPage(
        "admin"
      );
    }
  }

  // ==========================================
  // إذا كان الجمعة
  // ==========================================

  if (isFriday()) {
    return (
      <div className="card">

        <h2>
          🕌 يوم الجمعة
        </h2>

        <p>
          اليوم إجازة ولا توجد حلقة.
        </p>

        <button
          className="btn"
          onClick={handleBack}
        >
          ⬅️ الرجوع
        </button>

      </div>
    );
  }

  // ==========================================
  // واجهة الصفحة
  // ==========================================

  return (
    <div className="card">

      <h2>
        📖 نتائج الحفظ اليومية
      </h2>

      <p>
        🕓 يوم الحلقة يبدأ من الساعة 04:00 صباحًا
      </p>

      <table
        border="1"
        style={{
          width: "100%",
          borderCollapse:
            "collapse",
          textAlign:
            "center",
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
                key={
                  student.id
                }
              >

                {/* الطالب */}

                <td>
                  {student.name}
                </td>

                {/* الجديد */}

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
                      ]?.rate || ""
                    }

                    onChange={(e) =>
                      handleChange(
                        student.id,
                        "rate",
                        e.target.value
                      )
                    }
                  >

                    <option value="">
                      اختر
                    </option>

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

      <button
        className="btn"
        onClick={
          saveResults
        }
      >
        💾 حفظ النتائج
      </button>

      <br />
      <br />

      <button
        className="btn"
        onClick={
          handleBack
        }
      >
        ⬅️ الرجوع
      </button>

    </div>
  );
}