import { useState } from "react";
import {
  signInWithEmailAndPassword,
  setPersistence,
  browserLocalPersistence,
  browserSessionPersistence,
} from "firebase/auth";

import { auth } from "./Firebase";

export default function AdminLogin({ setPage }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [rememberMe, setRememberMe] =
    useState(true);

  const [loading, setLoading] =
    useState(false);

  async function loginAdmin() {
    if (!email || !password) {
      alert("المرجو إدخال البريد الإلكتروني وكلمة المرور");
      return;
    }

    try {
      setLoading(true);

      // حفظ الدخول أو جعله مؤقتًا
      await setPersistence(
        auth,
        rememberMe
          ? browserLocalPersistence
          : browserSessionPersistence
      );

      await signInWithEmailAndPassword(
        auth,
        email,
        password
      );

      // الدخول إلى لوحة الإدارة
      setPage("admin");

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

      <h2>🔐 دخول الإدارة</h2>

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
            setRememberMe(e.target.checked)
          }
        />

        🔒 البقاء متصلًا

      </label>

      <br />

      <button
        className="btn"
        onClick={loginAdmin}
        disabled={loading}
      >
        {loading
          ? "جاري الدخول..."
          : "دخول الإدارة"}
      </button>

      <br />
      <br />

      <button
        className="btn"
        onClick={() => setPage("login")}
      >
        ⬅️ رجوع
      </button>

    </div>
  );
}