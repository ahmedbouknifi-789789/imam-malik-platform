import { useState } from "react";
import { collection, getDocs } from "firebase/firestore";
import { signInWithEmailAndPassword } from "firebase/auth";
import { db, auth } from "./Firebase";

export default function StudentLogin({ setPage, setSelectedStudent }) {
  const [number, setNumber] = useState("");
  const [password, setPassword] = useState("");

  async function loginStudent() {
    try {
      const snapshot = await getDocs(collection(db, "students"));

      let found = null;

      snapshot.forEach((doc) => {
        const student = {
          id: doc.id,
          ...doc.data(),
        };

        if (student.number === number) {
          found = student;
        }
      });

      if (!found) {
        alert("رقم التسجيل غير صحيح");
        return;
      }

      await signInWithEmailAndPassword(
  auth,
  found.email,
  password
);

      setSelectedStudent(found);
      setPage("student");
    } catch (error) {
      alert("كلمة المرور أو رقم التسجيل غير صحيح");
    }
  }

  return (
    <div className="card">
      <h2>👨‍🎓 دخول الطالب</h2>

      <input
        type="text"
        placeholder="رقم التسجيل"
        value={number}
        onChange={(e) => setNumber(e.target.value)}
      />

      <br /><br />

      <input
        type="password"
        placeholder="كلمة المرور"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />

      <br /><br />

      <button className="btn" onClick={loginStudent}>
        دخول
      </button>
<br />
<br />

<button
  className="btn"
  style={{ background: "#2563eb" }}
  onClick={() => setPage("forgotPassword")}
>
  🔒 نسيت كلمة المرور؟
</button>
      <button
        className="btn"
        onClick={() => setPage("login")}
      >
        رجوع
      </button>
    </div>
  );
}