import { useState } from "react";
import { signInWithEmailAndPassword } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
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
      const userCredential =
        await signInWithEmailAndPassword(
          auth,
          email,
          password
        );

      const uid = userCredential.user.uid;

      // البحث عن الحساب
      const accountRef = doc(db, "teacherAccounts", uid);
      const accountSnap = await getDoc(accountRef);

      if (!accountSnap.exists()) {
        alert("هذا الحساب غير مربوط بأي أستاذ.");
        return;
      }

      const account = accountSnap.data();

      // جلب بيانات الأستاذ
      const teacherRef = doc(
        db,
        "teachers",
        account.teacherId
      );

      const teacherSnap = await getDoc(teacherRef);

      if (!teacherSnap.exists()) {
        alert("تعذر العثور على بيانات الأستاذ.");
        return;
      }

      const teacher = {
        id: teacherSnap.id,
        ...teacherSnap.data(),
      };

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