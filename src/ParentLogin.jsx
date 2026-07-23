import { useState } from "react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "./Firebase";

export default function ParentLogin({ setPage, setSelectedStudent }) {
  const [number, setNumber] = useState("");

  async function loginParent() {
    const snapshot = await getDocs(collection(db, "students"));

    let found = null;

    snapshot.forEach((doc) => {
      const student = { id: doc.id, ...doc.data() };

      if (student.number === number) {
        found = student;
      }
    });

    if (found) {
      setSelectedStudent(found);
      setPage("parent");
    } else {
      alert("رقم التسجيل غير صحيح");
    }
  }

  return (
    <div className="card">
      <h2>👨‍👩‍👦 دخول ولي الأمر</h2>

      <input
        type="text"
        placeholder="رقم تسجيل الطالب"
        value={number}
        onChange={(e) => setNumber(e.target.value)}
      />

      <br />
      <br />

      <button className="btn" onClick={loginParent}>
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