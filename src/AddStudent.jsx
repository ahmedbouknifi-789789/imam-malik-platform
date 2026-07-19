import { useState } from "react";

export default function AddStudent({ setPage, addStudent }) {
  const [student, setStudent] = useState({
    name: "",
    number: "",
    birth: "",
    gender: "",
    parent: "",
    phone: "",
    halaqa: "",
    level: "",
    date: "",
    notes: "",
  });

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

    addStudent(student);
  };

  return (
    <div className="card">
      <h2>➕ إضافة طالب جديد</h2>

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
          type="text"
          name="number"
          placeholder="رقم التسجيل"
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

        <input
          type="text"
          name="parent"
          placeholder="اسم ولي الأمر"
          value={student.parent}
          onChange={handleChange}
        />

        <input
          type="text"
          name="phone"
          placeholder="رقم الهاتف"
          value={student.phone}
          onChange={handleChange}
        />

        <input
          type="text"
          name="halaqa"
          placeholder="الحلقة"
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

        <input
          type="date"
          name="date"
          value={student.date}
          onChange={handleChange}
        />

        <textarea
          name="notes"
          placeholder="ملاحظات"
          value={student.notes}
          onChange={handleChange}
        />

        <br />
        <br />

        <button type="submit" className="btn">
          💾 حفظ الطالب
        </button>

        <button
          type="button"
          className="btn"
          onClick={() => setPage("students")}
        >
          ⬅️ رجوع
        </button>
      </form>
    </div>
  );
}