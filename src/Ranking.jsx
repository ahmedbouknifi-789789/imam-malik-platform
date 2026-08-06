export default function Ranking({
  setPage,
  student,
  students,
}) {
  if (!student) return null;

  const halaqaStudents = students
    .filter(s => s.halaqa === student.halaqa)
    .sort((a, b) => (b.points || 0) - (a.points || 0));

  const rank =
    halaqaStudents.findIndex(s => s.id === student.id) + 1;

  return (
    <div className="card">
      <h2>🏆 رتبتي في الحلقة</h2>

      <p>👤 الطالب: {student.name}</p>
      <p>📚 الحلقة: {student.halaqa}</p>
      <p>🥇 ترتيبي: {rank} من {halaqaStudents.length}</p>
      <p>⭐ النقاط: {student.points || 0}</p>
      <p>📖 الصفحات المحفوظة: {student.memorizedPages || 0}</p>
      <p>📈 نسبة الإنجاز: {student.progress || 0}%</p>

      <button
        className="btn"
        onClick={() => setPage("student")}
      >
        ⬅ الرجوع
      </button>
    </div>
  );
}