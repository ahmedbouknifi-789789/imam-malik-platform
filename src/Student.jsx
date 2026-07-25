import { useEffect, useState } from "react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "./Firebase";

export default function Student({ setPage, student }) {
  const [record, setRecord] = useState(null);

  useEffect(() => {
    if (student) {
      loadRecord();
    }
  }, [student]);

  async function loadRecord() {
    const snapshot = await getDocs(
      collection(db, "memorization")
    );

    let lastRecord = null;

    snapshot.forEach((doc) => {
      const item = doc.data();

      if (item.studentId === student.id) {
        lastRecord = item;
      }
    });

    setRecord(lastRecord);
  }

  if (!student) {
    return (
      <div className="card">
        <h2>لا يوجد طالب مسجل الدخول</h2>

        <button
          className="btn"
          onClick={() => setPage("login")}
        >
          رجوع
        </button>
      </div>
    );
  }

  return (
    <div className="card">
      <h2>👨‍🎓 حساب الطالب</h2>

      {student.photo && (
        <img
          src={student.photo}
          alt={student.name}
          width="120"
          height="120"
          style={{
            borderRadius: "50%",
            objectFit: "cover",
            marginBottom: "15px",
          }}
        />
      )}

      <p>
        <strong>الاسم:</strong> {student.name}
      </p>

      <p>
        <strong>رقم التسجيل:</strong> {student.number}
      </p>

      <p>
        <strong>الحلقة:</strong> {student.halaqa}
      </p>

      <p>
        <strong>نوع الحلقة:</strong>{" "}
        {student.halaqaType || "غير محدد"}
      </p>

      {/* يظهر رابط الدخول فقط للطلاب عن بعد */}
      {student.halaqaType === "عن بعد" && (
        <a
          href="https://meet.google.com/ksq-dbwh-izx"
          target="_blank"
          rel="noopener noreferrer"
          className="btn"
          style={{
            display: "block",
            textDecoration: "none",
            boxSizing: "border-box",
          }}
        >
          💻 دخول الحلقة عن بعد
        </a>
      )}

      <p>
        <strong>المستوى:</strong> {student.level}
      </p>

      <p>
        <strong>ولي الأمر:</strong> {student.parent}
      </p>

      <p>
        <strong>الهاتف:</strong> {student.phone}
      </p>

      <hr />

      <h3>📖 آخر محفوظ</h3>

      <p>
        <strong>السورة:</strong>{" "}
        {record?.surah || "لا يوجد"}
      </p>

      <p>
        <strong>الصفحة:</strong>{" "}
        {record?.page || "لا يوجد"}
      </p>

      <p>
        <strong>الحفظ الجديد:</strong>{" "}
        {record?.new || "لا يوجد"}
      </p>

      <p>
        <strong>المراجعة:</strong>{" "}
        {record?.review || "لا يوجد"}
      </p>

      <p>
        <strong>التقييم:</strong>{" "}
        {record?.rate || "لا يوجد"}
      </p>

      <p>
        <strong>الملاحظات:</strong>{" "}
        {record?.notes || "لا توجد"}
      </p>

      <button
        className="btn"
        onClick={() => setPage("studentHistory")}
      >
        📚 سجل الحفظ الكامل
      </button>

      <br />
      <br />

      <button
        className="btn"
        onClick={() => setPage("login")}
      >
        🚪 تسجيل الخروج
      </button>
    </div>
  );
}