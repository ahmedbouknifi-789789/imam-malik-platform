export default function StudentPlan({
  setPage,
  student,
}) {
  if (!student) {
    return (
      <div className="card">
        <h2>📖 خطة الحفظ</h2>
        <p>لم يتم العثور على بيانات الطالب.</p>

        <button
          className="btn"
          onClick={() => setPage("studentPanel")}
        >
          ⬅ الرجوع
        </button>
      </div>
    );
  }

  return (
    <div className="card">

      <h2>📖 خطة الحفظ</h2>

      <hr />

      <p>
        👤 <strong>الطالب:</strong> {student.name}
      </p>

      <p>
        📚 <strong>الخطة:</strong> {student.plan || "غير محددة"}
      </p>

      🎯 <strong>الورد اليومي:</strong>{" "}
{student.dailyAmount || student.plan || "غير محدد"}
      <p>
        ✅ <strong>الأيام المنجزة:</strong> {student.completedDays || 0}
      </p>

      <p>
        📈 <strong>نسبة الإنجاز:</strong> {student.progress || 0}%
      </p>

      <p>
        📖 <strong>الصفحات المحفوظة:</strong> {student.memorizedPages || 0}
      </p>

      <br />

      <button
        className="btn"
        onClick={() => setPage("student")}
      >
        ⬅ الرجوع
      </button>

    </div>
  );
}