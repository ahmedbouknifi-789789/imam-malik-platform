import { useState } from "react";

export default function Halaqas({
  setPage,
  halaqas,
  students,
  editHalaqa,
  deleteHalaqa,
  openHalaqaStudents,
}) {
  const [search, setSearch] = useState("");

  const filteredHalaqas = halaqas.filter((halaqa) =>
    (halaqa.name || "")
      .toLowerCase()
      .includes(search.toLowerCase())
  );

  return (
    <div className="halaqas-page">

      <div className="halaqas-header">
        <div>
          <h2>📖 إدارة الحلقات</h2>
          <p>إدارة الحلقات والأساتذة والطلاب</p>
        </div>

        <button
          className="add-halaqa-btn"
          onClick={() => setPage("addHalaqa")}
        >
          ➕ إضافة حلقة
        </button>
      </div>

      <div className="halaqa-search">
        <span>🔍</span>

        <input
          type="text"
          placeholder="البحث عن حلقة..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      <div className="halaqa-stat">
        <span>📚</span>

        <div>
          <strong>{filteredHalaqas.length}</strong>
          <small>عدد الحلقات</small>
        </div>
      </div>

      {filteredHalaqas.length === 0 ? (

        <div className="empty-halaqas">
          📭
          <h3>لا توجد حلقات</h3>
          <p>قم بإضافة حلقة جديدة للبدء</p>
        </div>

      ) : (

        <div className="halaqas-grid">

          {filteredHalaqas.map((halaqa) => {

            const studentCount = students.filter(
              (student) =>
                (student.halaqa || "").trim() ===
                (halaqa.name || "").trim()
            ).length;

            return (

              <div
                className="halaqa-card"
                key={halaqa.id}
              >

                <div className="halaqa-card-header">

                  <div className="halaqa-icon">
                    📖
                  </div>

                  <div>
                    <h3>{halaqa.name}</h3>

                    <p>
                      👨‍🏫 {halaqa.teacher || "غير محدد"}
                    </p>
                  </div>

                </div>

                <div className="halaqa-info">

                  <div>
                    <span>👨‍🎓</span>
                    <strong>{studentCount}</strong>
                    <small>طالب</small>
                  </div>

                  <div>
                    <span>📚</span>
                    <strong>حلقة</strong>
                    <small>قرآنية</small>
                  </div>

                </div>

                <div className="halaqa-actions">

                  <button
                    className="halaqa-students-btn"
                    onClick={() =>
                      openHalaqaStudents(halaqa)
                    }
                  >
                    👨‍🎓 الطلاب
                  </button>

                  <button
                    className="halaqa-edit-btn"
                    onClick={() =>
                      editHalaqa(halaqa)
                    }
                  >
                    ✏️ تعديل
                  </button>

                  <button
                    className="halaqa-delete-btn"
                    onClick={() => {
                      if (
                        window.confirm(
                          "هل تريد حذف هذه الحلقة؟"
                        )
                      ) {
                        deleteHalaqa(halaqa.id);
                      }
                    }}
                  >
                    🗑️ حذف
                  </button>

                </div>

              </div>

            );

          })}

        </div>

      )}

      <button
        className="back-admin-btn"
        onClick={() => setPage("admin")}
      >
        ⬅️ الرجوع إلى لوحة الإدارة
      </button>

    </div>
  );
}