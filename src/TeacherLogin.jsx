import { useState } from "react";

import {
  signInWithEmailAndPassword,
  setPersistence,
  browserLocalPersistence,
  browserSessionPersistence,
  sendPasswordResetEmail,
} from "firebase/auth";

import {
  collection,
  getDocs,
} from "firebase/firestore";

import {
  db,
  auth,
} from "./Firebase";

export default function TeacherLogin({
  setPage,
  setLoggedTeacher,
  setSelectedHalaqa,
}) {
  const [email, setEmail] =
    useState("");

  const [password, setPassword] =
    useState("");

  const [rememberMe, setRememberMe] =
    useState(true);

  const [loading, setLoading] =
    useState(false);

  // =========================
  // تسجيل دخول الأستاذ
  // =========================

  async function loginTeacher() {
    if (!email || !password) {
      alert(
        "المرجو إدخال البريد الإلكتروني وكلمة المرور"
      );

      return;
    }

    try {
      setLoading(true);

      // حفظ جلسة الدخول
      await setPersistence(
        auth,
        rememberMe
          ? browserLocalPersistence
          : browserSessionPersistence
      );

      // تسجيل الدخول في Firebase
      await signInWithEmailAndPassword(
        auth,
        email,
        password
      );

      // البحث عن بيانات الأستاذ
      const snapshot =
        await getDocs(
          collection(db, "teachers")
        );

      let teacherFound = null;

      snapshot.forEach((docItem) => {
        const teacher = {
          id: docItem.id,
          ...docItem.data(),
        };

        if (
          teacher.email === email
        ) {
          teacherFound = teacher;
        }
      });

      if (!teacherFound) {
        alert(
          "تم الدخول، لكن لم يتم العثور على بيانات الأستاذ"
        );

        return;
      }

      // حفظ بيانات الأستاذ
setLoggedTeacher(teacherFound);

// اختيار أول حلقة تلقائياً
const firstHalaqa =
  teacherFound.halaqas?.[0] ||
  teacherFound.halaqa ||
  "";

localStorage.setItem(
  "teacherSelectedHalaqa",
  firstHalaqa
);

if (setSelectedHalaqa) {
  setSelectedHalaqa(firstHalaqa);
}
// الذهاب إلى لوحة الأستاذ
setPage("teacherPanel");

    } catch (error) {
      console.log(
        "خطأ في تسجيل الدخول:",
        error
      );

      alert(
        "❌ البريد الإلكتروني أو كلمة المرور غير صحيحة"
      );

    } finally {
      setLoading(false);
    }
  }

  // =========================
  // نسيت كلمة السر
  // =========================

  async function forgotPassword() {

    if (!email) {

      alert(
        "⚠️ أدخل البريد الإلكتروني أولاً"
      );

      return;
    }

    try {

      setLoading(true);

      await sendPasswordResetEmail(
        auth,
        email
      );

      alert(
        "✅ تم إرسال رابط إعادة تعيين كلمة المرور إلى بريدك الإلكتروني. تحقق من البريد الوارد أو الرسائل غير المرغوب فيها."
      );

    } catch (error) {

      console.log(
        "خطأ في إعادة تعيين كلمة المرور:",
        error
      );

      if (
        error.code ===
        "auth/user-not-found"
      ) {

        alert(
          "❌ هذا البريد الإلكتروني غير مسجل"
        );

      } else if (
        error.code ===
        "auth/invalid-email"
      ) {

        alert(
          "❌ البريد الإلكتروني غير صحيح"
        );

      } else {

        alert(
          "❌ حدث خطأ. حاول مرة أخرى."
        );

      }

    } finally {

      setLoading(false);

    }
  }

  // =========================
  // واجهة تسجيل الدخول
  // =========================

  return (

    <div className="card">

      <h2>
        👨‍🏫 دخول الأستاذ
      </h2>

      {/* البريد الإلكتروني */}

      <input
        type="email"
        placeholder="البريد الإلكتروني"
        value={email}
        onChange={(e) =>
          setEmail(e.target.value)
        }
      />

      <br />
      <br />

      {/* كلمة المرور */}

      <input
        type="password"
        placeholder="كلمة المرور"
        value={password}
        onChange={(e) =>
          setPassword(e.target.value)
        }
      />

      <br />
      <br />

      {/* البقاء متصلًا */}

      <label
        style={{
          display: "flex",
          alignItems: "center",
          gap: "8px",
          cursor: "pointer",
        }}
      >

        <input
          type="checkbox"
          checked={rememberMe}
          onChange={(e) =>
            setRememberMe(
              e.target.checked
            )
          }
        />

        🔒 البقاء متصلًا

      </label>

      <br />

      {/* دخول الأستاذ */}

      <button
        className="btn"
        onClick={loginTeacher}
        disabled={loading}
      >
        {loading
          ? "جاري الدخول..."
          : "دخول الأستاذ"}
      </button>

      <br />
      <br />

      {/* نسيت كلمة السر */}

      <button
        className="btn"
        onClick={forgotPassword}
        disabled={loading}
        style={{
          background: "#2563eb",
        }}
      >
        🔑 نسيت كلمة السر؟
      </button>

      <br />
      <br />

      {/* الرجوع */}

      <button
        className="btn"
        onClick={() =>
          setPage("login")
        }
      >
        ⬅️ رجوع
      </button>

    </div>

  );
}