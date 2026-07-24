import { useState, useEffect } from "react";

export default function AddTeacher({
  setPage,
  addTeacher,
  editingTeacher,
  updateTeacher,
}) {
  const [teacher, setTeacher] = useState({
    name: "",
    phone: "",
    email: "",
    halaqa: "",
    date: "",
    notes: "",
  });

  useEffect(() => {
    if (editingTeacher) {
      setTeacher(editingTeacher);
    }
  }, [editingTeacher]);

  function handleChange(e) {
    setTeacher({
      ...teacher,
      [e.target.name]: e.target.value,
    });
  }

  function handleSubmit(e) {
    e.preventDefault();

    if (editingTeacher) {
      updateTeacher(teacher);
    } else {
      addTeacher(teacher);
    }
  }

  return (
    <div className="card">
      <h2>
        {editingTeacher
          ? "✏️ تعديل بيانات الأستاذ"
          : "➕ إضافة أستاذ"}
      </h2>

      <form onSubmit={handleSubmit}>

        <input
          type="text"
          name="name"
          placeholder="اسم الأستاذ"
          value={teacher.name}
          onChange={handleChange}
          required
        />

        <input
          type="text"
          name="phone"
          placeholder="رقم الهاتف"
          value={teacher.phone}
          onChange={handleChange}
        />

        <input
          type="email"
          name="email"
          placeholder="البريد الإلكتروني"
          value={teacher.email}
          onChange={handleChange}
        />

        <input
          type="text"
          name="halaqa"
          placeholder="الحلقة"
          value={teacher.halaqa}
          onChange={handleChange}
        />

        <input
          type="date"
          name="date"
          value={teacher.date}
          onChange={handleChange}
        />

        <textarea
          name="notes"
          placeholder="ملاحظات"
          value={teacher.notes}
          onChange={handleChange}
        />

        <button
          type="submit"
          className="btn"
        >
          💾 {editingTeacher ? "حفظ التعديل" : "حفظ الأستاذ"}
        </button>

        <button
          type="button"
          className="btn"
          onClick={() => setPage("teachers")}
        >
          ⬅️ رجوع
        </button>

      </form>
    </div>
  );
}