export default function Parent({ setPage }) {
  return (
    <div className="card">
      <h2>👨‍👩‍👦 صفحة ولي الأمر</h2>

      <p>اسم الولي: ............................</p>
      <p>اسم الطالب: ............................</p>

      <h3>متابعة الابن</h3>

      <table>
        <tbody>
          <tr>
            <th>المادة</th>
            <th>التقدم</th>
          </tr>

          <tr>
            <td>حفظ القرآن</td>
            <td>25%</td>
          </tr>

          <tr>
            <td>المراجعة</td>
            <td>جيد</td>
          </tr>

          <tr>
            <td>ملاحظات الأستاذ</td>
            <td>نسأل الله التوفيق</td>
          </tr>
        </tbody>
      </table>

      <br />

      <button className="btn" onClick={() => setPage("login")}>
        رجوع
      </button>
    </div>
  );
}