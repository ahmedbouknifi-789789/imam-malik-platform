import { useState, useEffect } from "react";

export default function AddTeacher({
  setPage,
  addTeacher,
  editingTeacher,
  updateTeacher,
  halaqas = [],
}) {
  const [teacher, setTeacher] = useState({
    name: "",
    phone: "",
    email: "",
    halaqas: [],
    date: "",
    notes: "",
  });

  useEffect(() => {
    if (editingTeacher) {
      setTeacher({
        ...editingTeacher,
        halaqas: editingTeacher.halaqas || [],
      });
    }
  }, [editingTeacher]);

  function handleChange(e) {
    setTeacher({
      ...teacher,
      [e.target.name]: e.target.value,
    });
  }

  function toggleHalaqa(halaqaName) {
    setTeacher((prev) => {
      const current = prev.halaqas || [];

      if (current.includes(halaqaName)) {
        return {
          ...prev,
          halaqas: current.filter(
            (h) => h !== halaqaName
          ),
        };
      }

      return {
        ...prev,
        halaqas: [...current, halaqaName],
      };
    });
  }

  function handleSubmit(e) {
    e.preventDefault();

    if (teacher.halaqas.length === 0) {
      alert("⚠️ اختر حلقة واحدة على الأقل");
      return;
    }

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

        <h3>📚 حلقات الأستاذ</h3>

        {halaqas.length === 0 ? (
          <p>⚠️ لا توجد حلقات مضافة</p>
        ) : (
          halaqas.map((halaqa) => (
            <label
              key={halaqa.id}
              style={{
                display: "block",
                padding: "10px",
                marginBottom: "8px",
                border: "1px solid #ddd",
                borderRadius: "8px",
              }}
            >
              <input
                type="checkbox"
                checked={teacher.halaqas.includes(
                  halaqa.name
                )}
                onChange={() =>
                  toggleHalaqa(halaqa.name)
                }
              />

              {" "}

              {halaqa.name}
            </label>
          ))
        )}

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
          💾{" "}
          {editingTeacher
            ? "حفظ التعديل"
            : "حفظ الأستاذ"}
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