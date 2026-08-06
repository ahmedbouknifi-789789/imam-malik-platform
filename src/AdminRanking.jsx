import { useState } from "react";

export default function AdminRanking({
  students,
  setPage,
  previousPage,
}) {

  const [selectedHalaqa, setSelectedHalaqa] = useState("الكل");

  const halaqat = [
    "الكل",
    ...new Set(students.map(s => s.halaqa))
  ];

  const ranking = students
    .filter(student =>
      selectedHalaqa === "الكل" ||
      student.halaqa === selectedHalaqa
    )
    .sort(
      (a, b) => (b.points || 0) - (a.points || 0)
    );


  return (
    <div style={{
      direction: "rtl",
      textAlign: "center",
      padding: "20px"
    }}>

      <h2>🏆 ترتيب الطلاب</h2>
<button
  onClick={() => setPage(previousPage)}
  style={{
    padding: "10px",
    margin: "10px",
    cursor: "pointer"
  }}
>
  ⬅️ رجوع
</button>

      <select
        value={selectedHalaqa}
        onChange={(e) => setSelectedHalaqa(e.target.value)}
        style={{
          padding: "10px",
          fontSize: "16px"
        }}
      >

        {halaqat.map((h, index) => (
          <option key={index}>
            {h}
          </option>
        ))}

      </select>


      {ranking.map((student, index) => (

        <div key={student.id}
          style={{
            border: "1px solid #ccc",
            margin: "10px",
            padding: "10px",
            borderRadius: "10px"
          }}>

          <h3>
            {index === 0 ? "🥇" :
             index === 1 ? "🥈" :
             index === 2 ? "🥉" :
             "🏅"
            }
            {" "}
            {index + 1} - {student.name}
          </h3>

          <p>
            الحلقة: {student.halaqa}
          </p>

          <p>
            ⭐ النقاط: {student.points || 0}
          </p>

        </div>

      ))}

    </div>
  );
}