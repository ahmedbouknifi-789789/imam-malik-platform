import { useState, useEffect } from "react";
import logo from "./assets/Malik.png";
export default function AddStudent({
  setPage,
  addStudent,
  editingStudent,
  updateStudent,
  halaqas,
}) {
  const [student, setStudent] = useState({
    photo: "",
    name: "",
    number: "",
    birth: "",
    gender: "",
    parent: "",
    phone: "",
    parentEmail: "",
    halaqa: "",
    level: "",
    date: "",
    notes: "",
    halaqaType: "",
  });

  useEffect(() => {
    if (editingStudent) {
      setStudent({
        photo: "",
        name: "",
        number: "",
        birth: "",
        gender: "",
        parent: "",
        phone: "",
        parentEmail: "",
        halaqa: "",
        level: "",
        date: "",
        notes: "",
        halaqaType: "",
        ...editingStudent,
      });
    }
  }, [editingStudent]);

  const handleChange = (e) => {
    setStudent({
      ...student,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (student.name.trim() === "") {
      alert("الرجاء إدخال اسم الطالب");
      return;
    }

    if (editingStudent) {
      updateStudent(student);
    } else {
      addStudent(student);
    }
  };

  return (
    <div className="card student-form">

      <div className="print-header">
        <img
          src={logo}
          alt="شعار الجمعية"
          className="print-logo"
        />

        <h2>جمعية الإمام مالك الثقافية</h2>
        <h3>استمارة تسجيل طالب</h3>
        <p>نظام إدارة الحلقات القرآنية</p>
      </div>

      <form onSubmit={handleSubmit}>

        <h3 className="section-title">
          👨‍🎓 أولاً: معلومات الطالب
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
          type="text"
          name="number"
          placeholder="رقم الطالب / رقم التسجيل"
          value={student.number}
          onChange={handleChange}
        />

        <input
          type="date"
          name="birth"
          value={student.birth}
          onChange={handleChange}
        />

        <select
          name="gender"
          value={student.gender}
          onChange={handleChange}
        >
          <option value="">اختر الجنس</option>
          <option value="ذكر">ذكر</option>
          <option value="أنثى">أنثى</option>
        </select>

        <h3 className="section-title">
          👨‍👩‍👦 ثانياً: معلومات ولي الأمر
        </h3>

        <input
          type="text"
          name="parent"
          placeholder="اسم ولي الأمر"
          value={student.parent}
          onChange={handleChange}
        />

        <input
          type="tel"
          name="phone"
          placeholder="رقم هاتف ولي الأمر"
          value={student.phone}
          onChange={handleChange}
        />

        <input
          type="email"
          name="parentEmail"
          placeholder="البريد الإلكتروني لولي الأمر"
          value={student.parentEmail}
          onChange={handleChange}
        />

        <h3 className="section-title">
          📖 ثالثاً: معلومات الحلقة
        </h3>

        <select
          name="halaqa"
          value={student.halaqa}
          onChange={handleChange}
          required
        >
          <option value="">اختر الحلقة</option>

          {halaqas.map((halaqa) => (
            <option
              key={halaqa.id}
              value={halaqa.name}
            >
              {halaqa.name}
            </option>
          ))}
        </select>

        <input
          type="text"
          name="level"
          placeholder="المستوى"
          value={student.level}
          onChange={handleChange}
        />

        <select
          name="halaqaType"
          value={student.halaqaType}
          onChange={handleChange}
          required
        >
          <option value="">اختر نوع الحلقة</option>
          <option value="حضوري">🏫 حضوري</option>
          <option value="عن بعد">💻 عن بعد</option>
        </select>

        <h3 className="section-title">
          📅 رابعاً: تاريخ التسجيل
        </h3>

        <input
          type="date"
          name="date"
          value={student.date}
          onChange={handleChange}
        />

        <h3 className="section-title">
          📝 خامساً: ملاحظات
        </h3>

        <textarea
          name="notes"
          placeholder="ملاحظات"
          value={student.notes}
          onChange={handleChange}
          rows="4"
        />

        <div className="declaration">
          <h3>📜 تعهد ولي الأمر</h3>

          <p>
            أتعهد بمتابعة ابني/ابنتي والحرص على الحضور
            والالتزام بنظام الحلقة، وأتحمل مسؤولية صحة
            المعلومات المقدمة في هذه الاستمارة.
          </p>
        </div>

        <br />

        <div className="no-print">

          <button
            type="submit"
            className="btn"
          >
            {editingStudent
              ? "💾 حفظ التعديلات"
              : "💾 حفظ الطالب"}
          </button>

          <button
            type="button"
            className="btn print-btn"
            onClick={() => window.print()}
          >
            🖨️ طباعة الاستمارة
          </button>

          <button
            type="button"
            className="btn"
            onClick={() => setPage("students")}
          >
            ⬅️ العودة
          </button>

        </div>

        <div className="signatures">
          <div>
            توقيع ولي الأمر:
            <br /><br />
            ......................
          </div>

          <div>
            توقيع الإدارة:
            <br /><br />
            ......................
          </div>
        </div>

      </form>

    </div>
  );
}