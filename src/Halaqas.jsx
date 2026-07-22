import { useState } from "react";

export default function Halaqas({
  setPage,
  halaqas,
  editHalaqa,
  deleteHalaqa,
}) {
  const [search, setSearch] = useState("");

  const filteredHalaqas = halaqas.filter((halaqa) =>
    halaqa.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="card">
  <h2>📖 إدارة الحلقات</h2>

  <button
    className="btn"
    onClick={() => setPage("addHalaqa")}
  >
    ➕ إضافة حلقة
  </button>

  <br />
  <br />

      <input
        type="text"
        placeholder="🔍 البحث عن حلقة..."
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
            <th>اسم الحلقة</th>
            <th>الأستاذ</th>
            <th>عدد الطلاب</th>
            <th>العمليات</th>
          </tr>
        </thead>

        <tbody>
          {filteredHalaqas.length === 0 ? (
            <tr>
              <td colSpan="4">لا توجد حلقات</td>
            </tr>
          ) : (
            filteredHalaqas.map((halaqa) => (
              <tr key={halaqa.id}>
                <td>{halaqa.name}</td>
                <td>{halaqa.teacher}</td>
                <td>{halaqa.students || 0}</td>

                <td>
                  <button
                    className="btn"
                    onClick={() => editHalaqa(halaqa)}
                  >
                    ✏️ تعديل
                  </button>

                  <button
                    className="btn"
                    onClick={() => {
                      if (window.confirm("هل تريد حذف هذه الحلقة؟")) {
                        deleteHalaqa(halaqa.id);
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