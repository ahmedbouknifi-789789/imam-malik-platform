import { useState, useEffect } from "react";

import {
  updatePassword,
  reauthenticateWithCredential,
  EmailAuthProvider,
} from "firebase/auth";
import { auth } from "./Firebase";

export default function TeacherPanel({
  setPage,
  loggedTeacher,
  selectedHalaqa,
  setSelectedHalaqa,
}) {
  const [showPasswordForm, setShowPasswordForm] =
    useState(false);

  const [oldPassword, setOldPassword] =
    useState("");

  const [newPassword, setNewPassword] =
    useState("");

  // ==========================================
// الحلقات الخاصة بالأستاذ
// ==========================================

const teacherHalaqas =
  Array.isArray(loggedTeacher?.halaqas)
    ? loggedTeacher.halaqas
    : loggedTeacher?.halaqa
    ? [loggedTeacher.halaqa]
    : [];

useEffect(() => {
  if (!selectedHalaqa && teacherHalaqas.length > 0) {
    localStorage.setItem(
      "teacherSelectedHalaqa",
      teacherHalaqas[0]
    );

    if (setSelectedHalaqa) {
      setSelectedHalaqa(teacherHalaqas[0]);
    }
  }
}, []);

// ==========================================
// الحلقة المختارة
// ==========================================

const currentHalaqa =
  selectedHalaqa ||
  teacherHalaqas[0] ||
  "";
  // ==========================================
  // تغيير الحلقة
  // ==========================================

  function handleHalaqaChange(e) {
    const value = e.target.value;

    if (setSelectedHalaqa) {
      setSelectedHalaqa(value);
    }

    // تخزين الحلقة المختارة حتى تستطيع
    // Attendance و Memorization استعمالها لاحقاً
    localStorage.setItem(
      "teacherSelectedHalaqa",
      value
    );
  }

  // ==========================================
  // تغيير كلمة المرور
  // ==========================================

  async function changePassword(e) {
    e.preventDefault();

    const user = auth.currentUser;

    if (!user) {
      alert("❌ لا يوجد أستاذ مسجل الدخول");
      return;
    }

    try {
      const credential =
        EmailAuthProvider.credential(
          user.email,
          oldPassword
        );

      await reauthenticateWithCredential(
        user,
        credential
      );

      await updatePassword(
        user,
        newPassword
      );

      alert(
        "✅ تم تغيير كلمة المرور بنجاح"
      );

      setOldPassword("");
      setNewPassword("");
      setShowPasswordForm(false);

    } catch (error) {
      console.log(error);

      alert(
        "❌ كلمة المرور الحالية غير صحيحة"
      );
    }
  }

  // ==========================================
  // الواجهة
  // ==========================================

  return (
    <div className="card">

      <h2>
        👨‍🏫 لوحة الأستاذ
      </h2>

      <hr />

      {/* معلومات الأستاذ */}

      <p>
        <strong>
          الاسم:
        </strong>{" "}
        {loggedTeacher?.name ||
          "غير محدد"}
      </p>

      {/* ======================================
          اختيار الحلقة
      ======================================= */}

      <div
        style={{
          marginTop: "20px",
          marginBottom: "20px",
          padding: "15px",
          borderRadius: "12px",
          background: "#f8fafc",
          border: "1px solid #ddd",
        }}
      >

        <h3>
          📚 الحلقة
        </h3>

        {teacherHalaqas.length === 0 ? (

          <p>
            ⚠️ لا توجد حلقة مسندة إليك
          </p>

        ) : teacherHalaqas.length === 1 ? (

          <div
            style={{
              padding: "12px",
              background: "#dcfce7",
              borderRadius: "8px",
              fontWeight: "bold",
              color: "#166534",
            }}
          >
            📖 {teacherHalaqas[0]}
          </div>

        ) : (

          <>
            <p>
              اختر الحلقة التي تريد العمل
              معها:
            </p>

            <select
              value={currentHalaqa}
              onChange={
                handleHalaqaChange
              }
              style={{
                width: "100%",
                padding: "12px",
                borderRadius: "8px",
                border: "1px solid #ccc",
                fontSize: "16px",
                background: "#fff",
              }}
            >

              {teacherHalaqas.map(
                (halaqa) => (

                  <option
                    key={halaqa}
                    value={halaqa}
                  >
                    📖 {halaqa}
                  </option>

                )
              )}

            </select>

          </>

        )}

        {currentHalaqa && (

          <p
            style={{
              marginTop: "12px",
              color: "#0b7d45",
              fontWeight: "bold",
            }}
          >
            ✅ الحلقة الحالية:{" "}
            {currentHalaqa}
          </p>

        )}

      </div>

      <hr />

      {/* ======================================
          الحضور
      ======================================= */}

      <button
        className="btn"
        onClick={() =>
          setPage("attendance")
        }
        disabled={!currentHalaqa}
      >
        📋 حضور طلاب الحلقة
      </button>

      <br />
      <br />

      {/* ======================================
          الحفظ
      ======================================= */}

      <button
        className="btn"
        onClick={() =>
          setPage("memorization")
        }
        disabled={!currentHalaqa}
      >
        📖 حفظ طلاب الحلقة
      </button>

      <br />
      <br />

      {/* ======================================
          الملاحظات
      ======================================= */}

      <button
        className="btn"
        onClick={() =>
          setPage("notes")
        }
        disabled={!currentHalaqa}
      >
        📝 ملاحظات طلاب الحلقة
      </button>

      <br />
      <br />
<button
  className="btn"
  onClick={() => setPage("statistics")}
  disabled={!currentHalaqa}
>
  📊 الإحصائيات
</button>

<br />
<br />
      {/* ======================================
          تغيير كلمة المرور
      ======================================= */}

      <button
        className="btn"
        onClick={() =>
          setShowPasswordForm(
            !showPasswordForm
          )
        }
      >
        🔑 تغيير كلمة المرور
      </button>

      {showPasswordForm && (

        <form
          onSubmit={changePassword}
        >

          <br />

          <input
            type="password"
            placeholder="كلمة المرور الحالية"
            value={oldPassword}
            onChange={(e) =>
              setOldPassword(
                e.target.value
              )
            }
            required
          />

          <br />
          <br />

          <input
            type="password"
            placeholder="كلمة المرور الجديدة"
            value={newPassword}
            onChange={(e) =>
              setNewPassword(
                e.target.value
              )
            }
            required
            minLength={6}
          />

          <br />
          <br />

          <button
            type="submit"
            className="btn"
          >
            💾 حفظ
          </button>

        </form>

      )}

      <br />
      <br />

      {/* ======================================
          تسجيل الخروج
      ======================================= */}

      <button
        className="btn"
        onClick={() => {

          localStorage.removeItem(
            "teacherSelectedHalaqa"
          );

          setPage("login");

        }}
      >
        🚪 تسجيل الخروج
      </button>

    </div>
  );
}