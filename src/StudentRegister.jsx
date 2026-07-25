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
    parentEmail: "",
    halaqa: "",
    level: "",
    notes: "",
    halaqaType: "",
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

      alert(
        "✅ تم إرسال طلب التسجيل بنجاح، وسيتم مراجعته من طرف الإدارة."
      );

      setPage("login");
    } catch (error) {
      alert("حدث خطأ أثناء إرسال الطلب");
      console.log(error);
    }
  }

  return (
    <div className="card student-register">

      {/* رأس الاستمارة */}
      <div className="registration-header">

        <h2>📝 جمعية الإمام مالك الثقافية</h2>

        <h3>
          استمارة تسجيل طالب جديد
        </h3>

        <p>
          نظام إدارة الحلقات القرآنية
        </p>

      </div>

      <form onSubmit={handleSubmit}>

        {/* معلومات الطالب */}

        <h3 className="section-title">
          👨‍🎓 معلومات الطالب
        </h3>

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
          <option value="">
            اختر الجنس
          </option>

          <option value="ذكر">
            ذكر
          </option>

          <option value="أنثى">
            أنثى
          </option>
        </select>

        {/* معلومات ولي الأمر */}

        <h3 className="section-title">
          👨‍👩‍👦 معلومات ولي الأمر
        </h3>

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
          placeholder="رقم هاتف ولي الأمر"
          value={student.phone}
          onChange={handleChange}
          required
        />

        <input
          type="email"
          name="parentEmail"
          placeholder="البريد الإلكتروني لولي الأمر"
          value={student.parentEmail}
          onChange={handleChange}
          required
        />

        {/* معلومات الحلقة */}

        <h3 className="section-title">
          📖 معلومات الحلقة
        </h3>

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

        {/* الملاحظات */}

        <h3 className="section-title">
          📝 ملاحظات
        </h3>

        <textarea
          name="notes"
          placeholder="ملاحظات"
          value={student.notes}
          onChange={handleChange}
          rows="4"
        />

        {/* نوع الحلقة في آخر الصفحة */}

        <h3 className="section-title">
          🏫 نوع الحلقة
        </h3>

        <select
          name="halaqaType"
          value={student.halaqaType}
          onChange={handleChange}
          required
        >
          <option value="">
            اختر نوع الحلقة
          </option>

          <option value="حضوري">
            🏫 حضوري
          </option>

          <option value="عن بعد">
            💻 عن بعد
          </option>
        </select>

        {/* التعهد */}

        <div className="declaration">
          <h3>
            📜 تعهد ولي الأمر
          </h3>

          <p>
            أتعهد بصحة المعلومات المقدمة في هذه الاستمارة،
            والحرص على متابعة الطالب والالتزام بنظام الحلقة.
          </p>
        </div>

        <br />

        {/* الأزرار */}

        <div className="no-print">

          <button
            className="btn"
            type="submit"
          >
            📨 إرسال الطلب
          </button>

          <button
            type="button"
            className="btn"
            onClick={() => window.print()}
          >
            🖨️ طباعة الاستمارة
          </button>

          <button
            type="button"
            className="btn"
            onClick={() => setPage("login")}
          >
            ⬅ العودة
          </button>

        </div>

        {/* التوقيعات */}

        <div className="signatures">

          <div>
            توقيع ولي الأمر:
            <br />
            <br />
            ......................
          </div>

          <div>
            توقيع الإدارة:
            <br />
            <br />
            ......................
          </div>

        </div>

      </form>

    </div>
  );
}