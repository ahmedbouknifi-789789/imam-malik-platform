import { useEffect, useState } from "react";
import {
  collection,
  getDocs,
  addDoc,
  deleteDoc,
  doc,
} from "firebase/firestore";
import { db } from "./Firebase";
import { createStudentAccount } from "./CreateStudentAccount";

export default function RegistrationRequests({ setPage }) {
  const [requests, setRequests] = useState([]);

  useEffect(() => {
    loadRequests();
  }, []);

  async function loadRequests() {
    const querySnapshot = await getDocs(
      collection(db, "registrationRequests")
    );

    const list = querySnapshot.docs.map((item) => ({
      id: item.id,
      ...item.data(),
    }));

    setRequests(list);
  }

  async function acceptRequest(student) {
    try {
      // إنشاء رقم الطالب
      const studentNumber =
        "S" + Date.now().toString().slice(-8);

      // إنشاء حساب الطالب
      const account = await createStudentAccount({
        ...student,
        number: studentNumber,
      });

      if (!account || !account.uid) {
        alert("❌ فشل إنشاء حساب الطالب");
        return;
      }

      // إضافة الطالب إلى قاعدة البيانات
      await addDoc(collection(db, "students"), {
        uid: account.uid,

        name: student.name,
        birth: student.birth,
        gender: student.gender,

        parent: student.parent,
        phone: student.phone,
        parentEmail: student.parentEmail || "",

        halaqa: student.halaqa,
        level: student.level,
        halaqaType: student.halaqaType || "",

        notes: student.notes,

        number: studentNumber,
        email: account.email,
      });

      // رسالة واتساب
      const message = `
السلام عليكم 👋

تم قبول تسجيل الطالب: ${student.name} ✅

📖 منصة جمعية الإمام مالك الثقافية

👤 رقم الطالب:
${studentNumber}

📧 البريد الإلكتروني:
${account.email}

🔑 كلمة المرور:
123456

🌐 رابط المنصة:
https://imam-malik-platform.vercel.app/

وشكراً لكم.
`;

      // تحويل رقم الهاتف المغربي إلى الصيغة الدولية
      let phone = String(student.phone || "").replace(/\D/g, "");

      if (phone.startsWith("0")) {
        phone = "212" + phone.substring(1);
      }

      // فتح واتساب برسالة جاهزة
      const whatsappUrl =
        `https://wa.me/${phone}?text=${encodeURIComponent(message)}`;

      window.open(whatsappUrl, "_blank");

      // حذف طلب التسجيل
      await deleteDoc(
        doc(db, "registrationRequests", student.id)
      );

      alert("✅ تم قبول الطالب وإنشاء حسابه");

      loadRequests();

    } catch (error) {
      console.error(error);
      alert("❌ حدث خطأ أثناء قبول الطالب");
    }
  }

  async function rejectRequest(id) {
    await deleteDoc(
      doc(db, "registrationRequests", id)
    );

    loadRequests();
  }

  return (
    <div className="card">
      <h2>📥 طلبات تسجيل الطلاب</h2>

      {requests.length === 0 ? (
        <p>لا توجد طلبات تسجيل.</p>
      ) : (
        requests.map((student) => (
          <div key={student.id} className="card">

            <h3>{student.name}</h3>

            <p>👤 ولي الأمر: {student.parent}</p>

            <p>📱 الهاتف: {student.phone}</p>

            <p>
              📧 البريد الإلكتروني:
              {student.parentEmail || "غير موجود"}
            </p>

            <p>📅 تاريخ الميلاد: {student.birth}</p>

            <p>⚧ الجنس: {student.gender}</p>

            <p>📖 الحلقة: {student.halaqa}</p>

            <p>📚 المستوى: {student.level}</p>

            <p>
              🏫 نوع الحلقة:
              {student.halaqaType || "غير محدد"}
            </p>

            <p>📝 الملاحظات: {student.notes}</p>

            <button
              className="btn"
              onClick={() => acceptRequest(student)}
            >
              ✅ قبول وإرسال واتساب
            </button>

            <button
              className="btn"
              style={{ background: "#b91c1c" }}
              onClick={() => rejectRequest(student.id)}
            >
              ❌ رفض
            </button>

            <hr />

          </div>
        ))
      )}

      <button
        className="btn"
        onClick={() => setPage("admin")}
      >
        ⬅ العودة للإدارة
      </button>
    </div>
  );
}