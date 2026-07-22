export default function Notes({ setPage }) {
  return (
    <div className="card">
      <h2>📝 ملاحظات الطلاب</h2>

      <p>سيتم هنا عرض الطلاب وإضافة الملاحظات لكل طالب.</p>

      <br />

      <button
        className="btn"
        onClick={() => setPage("teacherPanel")}
      >
        ⬅️ الرجوع
      </button>
    </div>
  );
}