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
    // إنشاء حساب للطالب في Firebase Authentication
    const uid = await createStudentAccount(student);

    if (!uid) {
      alert("❌ فشل إنشاء حساب الطالب");
      return;
    }

    // إضافة الطالب إلى قاعدة البيانات
    await addDoc(collection(db, "students"), {
      uid,
      name: student.name,
      birth: student.birth,
      gender: student.gender,
      parent: student.parent,
      phone: student.phone,
      email: `${student.phone}@imam-malik.com`,
      halaqa: student.halaqa,
      level: student.level,
      notes: student.notes,
      number: "S" + Date.now().toString().slice(-8),
    });

    // حذف طلب التسجيل
    await deleteDoc(
      doc(db, "registrationRequests", student.id)
    );

    alert("✅ تم قبول الطالب وإنشاء حسابه بنجاح");

    loadRequests();
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
            <p>📅 تاريخ الميلاد: {student.birth}</p>
            <p>⚧ الجنس: {student.gender}</p>
            <p>📖 الحلقة: {student.halaqa}</p>
            <p>📚 المستوى: {student.level}</p>
            <p>📝 الملاحظات: {student.notes}</p>

            <button
              className="btn"
              onClick={() => acceptRequest(student)}
            >
              ✅ قبول
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