import { useEffect, useState } from "react";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { db } from "./Firebase";

export default function Students({
  setPage,
  students,
  deleteStudent,
  editStudent,
  openStudentRecord,
}) {
  const [search, setSearch] = useState("");
  const [feesStudent, setFeesStudent] = useState(null);
  const [paidMonths, setPaidMonths] = useState({});
  const [loadingFees, setLoadingFees] = useState(false);

  // ==========================================
  // الشهور
  // ==========================================

  const months = [
    "يناير",
    "فبراير",
    "مارس",
    "أبريل",
    "مايو",
    "يونيو",
    "يوليوز",
    "غشت",
    "شتنبر",
    "أكتوبر",
    "نونبر",
    "دجنبر",
  ];

  // ==========================================
  // البحث
  // ==========================================

  const filteredStudents = students.filter((student) =>
    String(student.name || "")
      .toLowerCase()
      .includes(search.toLowerCase())
  );

  // ==========================================
  // فتح رسوم الطالب
  // ==========================================

  async function openFees(student) {
    try {
      setLoadingFees(true);
      setFeesStudent(student);

      const studentRef = doc(
        db,
        "students",
        student.id
      );

      const snapshot = await getDoc(studentRef);

      if (snapshot.exists()) {
        const data = snapshot.data();

        setPaidMonths(
          data.feesPaidMonths || {}
        );
      } else {
        setPaidMonths({});
      }
    } catch (error) {
      console.error(
        "خطأ في تحميل الرسوم:",
        error
      );

      alert(
        "❌ تعذر تحميل حالة الرسوم"
      );

      setPaidMonths({});
    } finally {
      setLoadingFees(false);
    }
  }

  // ==========================================
  // تغيير حالة أداء الشهر
  // الإدارة فقط
  // ==========================================

  async function toggleMonth(month) {
    if (!feesStudent) return;

    try {
      const newValue =
        !paidMonths[month];

      const newPaidMonths = {
        ...paidMonths,
        [month]: newValue,
      };

      setPaidMonths(newPaidMonths);

      const studentRef = doc(
        db,
        "students",
        feesStudent.id
      );

      await updateDoc(
        studentRef,
        {
          feesPaidMonths:
            newPaidMonths,
        }
      );
    } catch (error) {
      console.error(
        "خطأ في تحديث الرسوم:",
        error
      );

      alert(
        "❌ حدث خطأ أثناء حفظ حالة الرسوم"
      );
    }
  }

  // ==========================================
  // إغلاق نافذة الرسوم
  // ==========================================

  function closeFees() {
    setFeesStudent(null);
    setPaidMonths({});
  }

  // ==========================================
  // الواجهة
  // ==========================================

  return (
    <div className="card">

      <h2>
        📚 إدارة الطلاب
      </h2>

      <button
        className="btn"
        onClick={() =>
          setPage("addStudent")
        }
      >
        ➕ إضافة طالب
      </button>

      <br />
      <br />

      <input
        type="text"
        placeholder="🔍 البحث عن طالب..."
        value={search}
        onChange={(e) =>
          setSearch(e.target.value)
        }
        style={{
          width: "100%",
          padding: "10px",
          marginBottom: "20px",
          boxSizing: "border-box",
        }}
      />

      {/* ======================================
          جدول الطلاب
      ====================================== */}

      <div
        style={{
          overflowX: "auto",
        }}
      >

        <table
          border="1"
          style={{
            width: "100%",
            borderCollapse:
              "collapse",
            textAlign:
              "center",
          }}
        >

          <thead>

            <tr>

              <th>
                الصورة
              </th>

              <th>
                الاسم
              </th>

              <th>
                الحلقة
              </th>

              <th>
                المستوى
              </th>

              <th>
                ولي الأمر
              </th>

              <th>
                الهاتف
              </th>

              <th>
                العمليات
              </th>

            </tr>

          </thead>

          <tbody>

            {filteredStudents.length === 0 ? (

              <tr>

                <td colSpan="7">

                  لا يوجد طلاب

                </td>

              </tr>

            ) : (

              filteredStudents.map(
                (student) => (

                  <tr
                    key={student.id}
                  >

                    <td>

                      {student.photo ? (

                        <img
                          src={
                            student.photo
                          }
                          alt={
                            student.name
                          }
                          width="60"
                          height="60"
                          style={{
                            borderRadius:
                              "50%",
                            objectFit:
                              "cover",
                          }}
                        />

                      ) : (

                        "📷"

                      )}

                    </td>

                    <td>
                      {student.name}
                    </td>

                    <td>
                      {student.halaqa ||
                        "—"}
                    </td>

                    <td>
                      {student.level ||
                        "—"}
                    </td>

                    <td>
                      {student.parent ||
                        "—"}
                    </td>

                    <td>
                      {student.phone ||
                        "—"}
                    </td>

                    <td>

                      {/* سجل الحفظ */}

                      <button
                        className="btn"
                        onClick={() =>
                          openStudentRecord(
                            student
                          )
                        }
                      >
                        📖 سجل الحفظ
                      </button>

                      {/* الرسوم */}

                      <button
                        className="btn"
                        style={{
                          background:
                            "#0b7d45",
                        }}
                        onClick={() =>
                          openFees(
                            student
                          )
                        }
                      >
                        💳 الرسوم
                      </button>

                      {/* تعديل */}

                      <button
                        className="btn"
                        onClick={() =>
                          editStudent(
                            student
                          )
                        }
                      >
                        ✏️ تعديل
                      </button>

                      {/* حذف */}

                      <button
                        className="btn"
                        onClick={() => {

                          if (
                            window.confirm(
                              "هل تريد حذف هذا الطالب؟"
                            )
                          ) {

                            deleteStudent(
                              student.id
                            );

                          }

                        }}
                      >
                        🗑️ حذف
                      </button>

                    </td>

                  </tr>

                )
              )

            )}

          </tbody>

        </table>

      </div>

      <br />

      {/* ======================================
          الرجوع
      ====================================== */}

      <button
        className="btn"
        onClick={() =>
          setPage("admin")
        }
      >
        ⬅️ الرجوع للإدارة
      </button>

      {/* ======================================
          نافذة الرسوم
      ====================================== */}

      {feesStudent && (

        <div
          style={{
            position:
              "fixed",
            inset: 0,
            background:
              "rgba(0,0,0,.55)",
            display:
              "flex",
            justifyContent:
              "center",
            alignItems:
              "center",
            padding:
              "20px",
            zIndex: 9999,
          }}
        >

          <div
            style={{
              background:
                "#fff",
              width:
                "100%",
              maxWidth:
                "500px",
              maxHeight:
                "90vh",
              overflowY:
                "auto",
              borderRadius:
                "20px",
              padding:
                "20px",
              boxSizing:
                "border-box",
            }}
          >

            <h2
              style={{
                textAlign:
                  "center",
                color:
                  "#0b7d45",
              }}
            >
              💳 رسوم الطالب
            </h2>

            <h3
              style={{
                textAlign:
                  "center",
              }}
            >
              👨‍🎓{" "}
              {feesStudent.name}
            </h3>

            <p
              style={{
                textAlign:
                  "center",
                color:
                  "#64748b",
              }}
            >
              رقم التسجيل:{" "}
              {feesStudent.number ||
                "غير محدد"}
            </p>

            <hr />

            {loadingFees ? (

              <p
                style={{
                  textAlign:
                    "center",
                }}
              >
                ⏳ جاري تحميل الرسوم...
              </p>

            ) : (

              <>

                <p
                  style={{
                    textAlign:
                      "center",
                    color:
                      "#64748b",
                  }}
                >
                  اضغط على الشهر لتسجيل
                  أداء الرسوم
                </p>

                {/* جدول الشهور */}

                <div
                  style={{
                    display:
                      "grid",
                    gridTemplateColumns:
                      "repeat(3, 1fr)",
                    gap:
                      "10px",
                  }}
                >

                  {months.map(
                    (month) => {

                      const paid =
                        !!paidMonths[
                          month
                        ];

                      return (

                        <button
                          key={
                            month
                          }
                          type="button"
                          onClick={() =>
                            toggleMonth(
                              month
                            )
                          }
                          style={{
                            padding:
                              "14px 5px",
                            borderRadius:
                              "12px",
                            border:
                              paid
                                ? "2px solid #0b7d45"
                                : "1px solid #ddd",
                            background:
                              paid
                                ? "#dcfce7"
                                : "#f8fafc",
                            color:
                              paid
                                ? "#166534"
                                : "#475569",
                            cursor:
                              "pointer",
                            fontWeight:
                              "bold",
                            fontSize:
                              "14px",
                          }}
                        >

                          <div>
                            {month}
                          </div>

                          <div
                            style={{
                              fontSize:
                                "22px",
                              marginTop:
                                "5px",
                            }}
                          >
                            {paid
                              ? "✓"
                              : "—"}
                          </div>

                          <small>
                            {paid
                              ? "تم الأداء"
                              : "لم يتم"}
                          </small>

                        </button>

                      );

                    }
                  )}

                </div>

                {/* ملخص */}

                <div
                  style={{
                    marginTop:
                      "20px",
                    padding:
                      "15px",
                    background:
                      "#f8fafc",
                    borderRadius:
                      "12px",
                    textAlign:
                      "center",
                  }}
                >

                  <strong>
                    تم أداء{" "}
                    {
                      months.filter(
                        (month) =>
                          paidMonths[
                            month
                          ]
                      ).length
                    }{" "}
                    من أصل{" "}
                    {months.length}{" "}
                    شهرًا
                  </strong>

                </div>

              </>

            )}

            <button
              className="btn"
              style={{
                width:
                  "100%",
                marginTop:
                  "20px",
                background:
                  "#64748b",
              }}
              onClick={
                closeFees
              }
            >
              ✖️ إغلاق
            </button>

          </div>

        </div>

      )}

    </div>
  );
}