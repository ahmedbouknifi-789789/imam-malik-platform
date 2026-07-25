export default function HalaqaStudents({
  setPage,
  selectedHalaqa,
  students,
}) {
  const halaqaStudents = students.filter(
    (student) => student.halaqa === selectedHalaqa.name
  );

  return (
    <div className="card">
      <h2>📖 {selectedHalaqa.name}</h2>

      <h3>طلاب الحلقة</h3>

      {halaqaStudents.length === 0 ? (
        <p>لا يوجد طلاب في هذه الحلقة.</p>
      ) : (
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
              <th>المستوى</th>
              <th>الهاتف</th>
            </tr>
          </thead>

          <tbody>
            {halaqaStudents.map((student) => (
              <tr key={student.id}>
                <td>{student.name}</td>
                <td>{student.level}</td>
                <td>{student.phone}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      <br />

      <button
        className="btn"
        onClick={() => setPage("halaqas")}
      >
        ⬅️ الرجوع
      </button>
    </div>
  );
}