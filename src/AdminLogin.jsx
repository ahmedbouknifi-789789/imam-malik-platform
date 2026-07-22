import { useState } from "react";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "./Firebase";

export default function AdminLogin({ setPage }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  async function login() {
    try {
      await signInWithEmailAndPassword(auth, email, password);

      setPage("admin");
    } catch (error) {
      alert("البريد الإلكتروني أو كلمة المرور غير صحيحة");
    }
  }

  return (
    <div className="card">
      <h2>🛠️ دخول الإدارة</h2>

      <input
        type="email"
        placeholder="البريد الإلكتروني"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />

      <br /><br />

      <input
        type="password"
        placeholder="كلمة المرور"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />

      <br /><br />

      <button className="btn" onClick={login}>
        تسجيل الدخول
      </button>

      <br /><br />

      <button
        className="btn"
        onClick={() => setPage("login")}
      >
        ⬅️ رجوع
      </button>
    </div>
  );
}