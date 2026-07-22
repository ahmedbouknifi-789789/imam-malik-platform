import { useState, useEffect } from "react";

export default function AddHalaqa({
  setPage,
  addHalaqa,
  editingHalaqa,
  updateHalaqa,
  teachers,
}) {
  const [halaqa, setHalaqa] = useState({
    name: "",
    teacher: "",
    students: 0,
    notes: "",
  });

  useEffect(() => {
    if (editingHalaqa) {
      setHalaqa(editingHalaqa);
    }
  }, [editingHalaqa]);

  function handleChange(e) {
    setHalaqa({
      ...halaqa,
      [e.target.name]: e.target.value,
    });
  }

  function handleSubmit(e) {
    e.preventDefault();

    if (editingHalaqa) {
      updateHalaqa(halaqa);
    } else {
      addHalaqa(halaqa);
    }
  }

  return (
    <div className="card">
      <h2>
        {editingHalaqa
          ? "✏️ تعديل الحلقة"
          : "➕ إضافة حلقة"}
      </h2>

      <form onSubmit={handleSubmit}>

        <input
          type="text"
          name="name"
          placeholder="اسم الحلقة"
          value={halaqa.name}
          onChange={handleChange}
          required
        />

        <select
          name="teacher"
          value={halaqa.teacher}
          onChange={handleChange}
          required
        >
          <option value="">اختر الأستاذ</option>

          {teachers.map((teacher) => (
            <option key={teacher.id} value={teacher.name}>
              {teacher.name}
            </option>
          ))}
        </select>

        <textarea
          name="notes"
          placeholder="ملاحظات"
          value={halaqa.notes}
          onChange={handleChange}
        />

        <button
          type="submit"
          className="btn"
        >
          💾 {editingHalaqa ? "حفظ التعديل" : "حفظ الحلقة"}
        </button>

        <button
          type="button"
          className="btn"
          onClick={() => setPage("halaqas")}
        >
          ⬅️ رجوع
        </button>

      </form>
    </div>
  );
}