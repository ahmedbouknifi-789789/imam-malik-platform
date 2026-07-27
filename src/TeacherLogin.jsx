import { useState } from "react";

import {
  signInWithEmailAndPassword,
  setPersistence,
  browserLocalPersistence,
  browserSessionPersistence,
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
}) {
  const [email, setEmail] =
    useState("");

  const [password, setPassword] =
    useState("");

  const [rememberMe, setRememberMe] =
    useState(true);

  const [loading, setLoading] =
    useState(false);

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

      // حفظ الأستاذ
      setLoggedTeacher(
        teacherFound
      );

      // الذهاب إلى لوحة الأستاذ
      setPage(
        "teacherPanel"
      );

    } catch (error) {
      console.log(error);

      alert(
        "❌ البريد الإلكتروني أو كلمة المرور غير صحيحة"
      );

    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="card">

      <h2>👨‍🏫 دخول الأستاذ</h2>

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