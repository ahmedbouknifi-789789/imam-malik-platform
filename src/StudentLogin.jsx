import { useState, useEffect } from "react";
import { collection, getDocs } from "firebase/firestore";
import { signInWithEmailAndPassword } from "firebase/auth";
import { db, auth } from "./Firebase";

export default function StudentLogin({
  setPage,
  setSelectedStudent,
}) {
  const [number, setNumber] = useState("");
  const [password, setPassword] = useState("");

  const [rememberMe, setRememberMe] = useState(false);

  // تحميل رقم التسجيل المحفوظ سابقًا
  useEffect(() => {
    const savedNumber =
      localStorage.getItem("studentNumber");

    const savedRemember =
      localStorage.getItem("studentRemember");

    if (savedNumber) {
      setNumber(savedNumber);
    }

    if (savedRemember === "true") {
      setRememberMe(true);
    }
  }, []);

  async function loginStudent() {
    try {
      if (!number || !password) {
        alert("الرجاء إدخال رقم التسجيل وكلمة المرور");
        return;
      }

      const snapshot = await getDocs(
        collection(db, "students")
      );

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

      // تسجيل الدخول عبر Firebase
      await signInWithEmailAndPassword(
        auth,
        found.email,
        password
      );

      // حفظ رقم التسجيل إذا اختار البقاء متصلًا
      if (rememberMe) {
        localStorage.setItem(
          "studentNumber",
          number
        );

        localStorage.setItem(
          "studentRemember",
          "true"
        );
      } else {
        localStorage.removeItem(
          "studentNumber"
        );

        localStorage.removeItem(
          "studentRemember"
        );
      }

      setSelectedStudent(found);
      setPage("student");

    } catch (error) {
      console.log(error);

      alert(
        "كلمة المرور أو رقم التسجيل غير صحيح"
      );
    }
  }

  return (
    <div className="card">

      <h2>
        👨‍🎓 دخول الطالب
      </h2>

      <input
        type="text"
        placeholder="رقم التسجيل"
        value={number}
        onChange={(e) =>
          setNumber(e.target.value)
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
          onChange={(e) =>
            setRememberMe(e.target.checked)
          }
          style={{
            width: "18px",
            height: "18px",
          }}
        />

        ☑️ البقاء متصلًا

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
        style={{
          background: "#2563eb",
        }}
        onClick={() =>
          setPage("forgotPassword")
        }
      >
        🔒 نسيت كلمة المرور؟
      </button>

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