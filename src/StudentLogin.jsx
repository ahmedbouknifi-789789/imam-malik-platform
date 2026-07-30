import { useState, useEffect } from "react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "./Firebase";

export default function StudentLogin({
  setPage,
  setSelectedStudent,
}) {
  const [number, setNumber] = useState("");
  const [rememberMe, setRememberMe] = useState(false);

  useEffect(() => {
    const savedNumber = localStorage.getItem("studentNumber");
    const savedRemember = localStorage.getItem("studentRemember");

    if (savedNumber) {
      setNumber(savedNumber);
    }

    if (savedRemember === "true") {
      setRememberMe(true);
    }
  }, []);

  async function loginStudent() {
    try {
      if (!number) {
        alert("الرجاء إدخال رقم التسجيل");
        return;
      }

      const snapshot = await getDocs(collection(db, "students"));
      snapshot.forEach((item) => {
  console.log(item.data().number);
});

      let found = null;

      snapshot.forEach((item) => {
        const student = {
          id: item.id,
          ...item.data(),
        };

        if (student.number === number.trim()) {
          found = student;
        }
      });

      if (!found) {
        alert("رقم التسجيل غير صحيح");
        return;
      }

      if (rememberMe) {
        localStorage.setItem("studentNumber", number);
        localStorage.setItem("studentRemember", "true");
      } else {
        localStorage.removeItem("studentNumber");
        localStorage.removeItem("studentRemember");
      }

      setSelectedStudent(found);
      setPage("student");

    } catch (error) {
      console.log(error);
      alert("حدث خطأ أثناء تسجيل الدخول");
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

      <br />
      <br />

      <label
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          gap: "8px",
          cursor: "pointer",
          marginBottom: "15px",
          fontSize: "16px",
        }}
      >
        <input
          type="checkbox"
          checked={rememberMe}
          onChange={(e) => setRememberMe(e.target.checked)}
        />

        ☑️ البقاء متصلاً
      </label>

      <button
        className="btn"
        onClick={loginStudent}
      >
        🔐 دخول
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