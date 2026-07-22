import { useState } from "react";

export default function Students({
  setPage,
  students,
  deleteStudent,
  editStudent,
  openStudentRecord,
}) {
  const [search, setSearch] = useState("");

  const filteredStudents = students.filter((student) =>
    student.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="card">
      <h2>📚 إدارة الطلاب</h2>

      <button
        className="btn"
        onClick={() => setPage("addStudent")}
      >
        ➕ إضافة طالب
      </button>

      <br />
      <br />

      <input
        type="text"
        placeholder="🔍 البحث عن طالب..."
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
            <th>الصورة</th>
            <th>الاسم</th>
            <th>الحلقة</th>
            <th>المستوى</th>
            <th>ولي الأمر</th>
            <th>الهاتف</th>
            <th>العمليات</th>
          </tr>
        </thead>

        <tbody>
          {filteredStudents.length === 0 ? (
            <tr>
              <td colSpan="7">لا يوجد طلاب</td>
            </tr>
          ) : (
            filteredStudents.map((student) => (
              <tr key={student.id}>
                <td>
                  {student.photo ? (
                    <img
                      src={student.photo}
                      alt={student.name}
                      width="60"
                      height="60"
                      style={{
                        borderRadius: "50%",
                        objectFit: "cover",
                      }}
                    />
                  ) : (
                    "📷"
                  )}
                </td>

                <td>{student.name}</td>
                <td>{student.halaqa}</td>
                <td>{student.level}</td>
                <td>{student.parent}</td>
                <td>{student.phone}</td>

                <td>
                  <button
                    className="btn"
                    onClick={() => openStudentRecord(student)}
                  >
                    📖 سجل الحفظ
                  </button>

                  <button
                    className="btn"
                    onClick={() => editStudent(student)}
                  >
                    ✏️ تعديل
                  </button>

                  <button
                    className="btn"
                    onClick={() => {
                      if (window.confirm("هل تريد حذف هذا الطالب؟")) {
                        deleteStudent(student.id);
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
        ⬅️ الرجوع للإدارة
      </button>
    </div>
  );
}