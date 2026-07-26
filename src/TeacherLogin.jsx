import { useState } from "react";
import { signInWithEmailAndPassword } from "firebase/auth";
import { collection, getDocs } from "firebase/firestore";
import { auth, db } from "./Firebase";

export default function TeacherLogin({
  setPage,
  setLoggedTeacher,
}) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  async function handleLogin(e) {
    e.preventDefault();

    try {
      await signInWithEmailAndPassword(
        auth,
        email,
        password
      );

      const snapshot = await getDocs(
        collection(db, "teachers")
      );

      let teacher = null;

      snapshot.forEach((teacherDoc) => {
        const data = teacherDoc.data();

        if (data.email === email) {
          teacher = {
            id: teacherDoc.id,
            ...data,
          };
        }
      });

      if (!teacher) {
        alert("هذا الحساب غير مربوط بأي أستاذ.");
        return;
      }

      setLoggedTeacher(teacher);

      alert("✅ تم تسجيل الدخول بنجاح");

      setPage("teacherPanel");

    } catch (error) {
      console.log(error);
      alert("❌ البريد الإلكتروني أو كلمة المرور غير صحيحة");
    }
  }

  return (
    <div className="card">
      <h2>👨‍🏫 دخول الأستاذ</h2>

      <form onSubmit={handleLogin}>

        <input
          type="email"
          placeholder="البريد الإلكتروني"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />

        <br />
        <br />

        <input
          type="password"
          placeholder="كلمة المرور"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />

        <br />
        <br />

        <button className="btn" type="submit">
          تسجيل الدخول
        </button>

        <br />
        <br />

        <button
          className="btn"
          style={{ background: "#2563eb" }}
          type="button"
          onClick={() => setPage("forgotTeacherPassword")}
        >
          🔑 نسيت كلمة المرور؟
        </button>

        <br />
        <br />

        <button
          type="button"
          className="btn"
          onClick={() => setPage("login")}
        >
          ⬅️ رجوع
        </button>

      </form>
    </div>
  );
}