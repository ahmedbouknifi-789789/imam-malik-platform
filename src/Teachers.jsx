import { useState } from "react";

export default function Teachers({
  setPage,
  teachers,
  editTeacher,
  deleteTeacher,
}) {
  const [search, setSearch] = useState("");

  const filteredTeachers = teachers.filter((teacher) =>
    teacher.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="card">
      <h2>👨‍🏫 إدارة الأساتذة</h2>

      <button
        className="btn"
        onClick={() => setPage("addTeacher")}
      >
        ➕ إضافة أستاذ
      </button>

      <br />
      <br />

      <input
        type="text"
        placeholder="🔍 البحث عن أستاذ..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        style={{
          width: "100%",
          padding: "10px",
          marginBottom: "20px",
        }}
      />

      <table
        border="1"
        style={{
          width: "100%",
          borderCollapse: "collapse",
          textAlign: "center",
        }}
      >
        <thead>
          <tr>
            <th>الاسم</th>
            <th>الهاتف</th>
            <th>البريد</th>
            <th>الحلقة</th>
            <th>العمليات</th>
          </tr>
        </thead>

        <tbody>
          {filteredTeachers.length === 0 ? (
            <tr>
              <td colSpan="5">لا يوجد أساتذة</td>
            </tr>
          ) : (
            filteredTeachers.map((teacher) => (
              <tr key={teacher.id}>
                <td>{teacher.name}</td>
                <td>{teacher.phone}</td>
                <td>{teacher.email}</td>
                <td>{teacher.halaqa}</td>

                <td>
                  <button
                    className="btn"
                    onClick={() => editTeacher(teacher)}
                  >
                    ✏️ تعديل
                  </button>

                  <button
                    className="btn"
                    onClick={() => {
                      if (window.confirm("هل تريد حذف هذا الأستاذ؟")) {
                        deleteTeacher(teacher.id);
                      }
                    }}
                  >
                    🗑️ حذف
                  </button>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>

      <br />

      <button
        className="btn"
        onClick={() => setPage("admin")}
      >
        ⬅️ الرجوع
      </button>
    </div>
  );
}