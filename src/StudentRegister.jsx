import { useState } from "react";
import { collection, addDoc } from "firebase/firestore";
import { db } from "./Firebase";

export default function StudentRegister({ setPage }) {
  const [student, setStudent] = useState({
    name: "",
    birth: "",
    gender: "",
    parent: "",
    phone: "",
    halaqa: "",
    level: "",
    notes: "",
  });

  function handleChange(e) {
    setStudent({
      ...student,
      [e.target.name]: e.target.value,
    });
  }

  async function handleSubmit(e) {
    e.preventDefault();

    try {
      await addDoc(collection(db, "registrationRequests"), {
        ...student,
        status: "pending",
        createdAt: new Date(),
      });

      alert("✅ تم إرسال طلب التسجيل بنجاح، وسيتم مراجعته من طرف الإدارة.");

      setPage("login");
    } catch (error) {
      alert("حدث خطأ أثناء إرسال الطلب");
      console.log(error);
    }
  }

  return (
    <div className="card">
      <h2>📝 تسجيل طالب جديد</h2>

      <form onSubmit={handleSubmit}>

        <input
          type="text"
          name="name"
          placeholder="الاسم الكامل"
          value={student.name}
          onChange={handleChange}
          required
        />

        <input
          type="date"
          name="birth"
          value={student.birth}
          onChange={handleChange}
          required
        />

        <select
          name="gender"
          value={student.gender}
          onChange={handleChange}
          required
        >
          <option value="">اختر الجنس</option>
          <option value="ذكر">ذكر</option>
          <option value="أنثى">أنثى</option>
        </select>

        <input
          type="text"
          name="parent"
          placeholder="اسم ولي الأمر"
          value={student.parent}
          onChange={handleChange}
          required
        />

        <input
          type="tel"
          name="phone"
          placeholder="رقم الهاتف"
          value={student.phone}
          onChange={handleChange}
          required
        />

        <input
          type="text"
          name="halaqa"
          placeholder="الحلقة المطلوبة"
          value={student.halaqa}
          onChange={handleChange}
        />

        <input
          type="text"
          name="level"
          placeholder="المستوى"
          value={student.level}
          onChange={handleChange}
        />

        <textarea
          name="notes"
          placeholder="ملاحظات"
          value={student.notes}
          onChange={handleChange}
        />

        <button className="btn" type="submit">
          📨 إرسال الطلب
        </button>

        <button
          type="button"
          className="btn"
          onClick={() => setPage("login")}
        >
          ⬅ العودة
        </button>

      </form>
    </div>
  );
}