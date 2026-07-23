import { useState } from "react";
import { collection, getDocs } from "firebase/firestore";
import { sendPasswordResetEmail } from "firebase/auth";
import { db, auth } from "./Firebase";

export default function ForgotPassword({ setPage }) {
  const [number, setNumber] = useState("");
  const [phone, setPhone] = useState("");

  async function resetPassword() {
    try {
      const snapshot = await getDocs(collection(db, "students"));

      let found = null;

      snapshot.forEach((doc) => {
        const student = {
          id: doc.id,
          ...doc.data(),
        };

        if (
          student.number === number &&
          student.phone === phone
        ) {
          found = student;
        }
      });

      if (!found) {
        alert("رقم الطالب أو رقم هاتف ولي الأمر غير صحيح.");
        return;
      }

      await sendPasswordResetEmail(auth, found.email);

      alert(
        "✅ تم إرسال رابط إعادة تعيين كلمة المرور إلى البريد الإلكتروني المرتبط بالحساب."
      );

      setPage("studentLogin");

    } catch (error) {
      console.log(error);
      alert("تعذر إرسال رابط إعادة التعيين.");
    }
  }

  return (
    <div className="card">
      <h2>🔒 نسيت كلمة المرور</h2>

      <input
        type="text"
        placeholder="رقم الطالب"
        value={number}
        onChange={(e) => setNumber(e.target.value)}
      />

      <br /><br />

      <input
        type="text"
        placeholder="رقم هاتف ولي الأمر"
        value={phone}
        onChange={(e) => setPhone(e.target.value)}
      />

      <br /><br />

      <button className="btn" onClick={resetPassword}>
        إرسال رابط إعادة التعيين
      </button>

      <button
        className="btn"
        onClick={() => setPage("studentLogin")}
      >
        ⬅ رجوع
      </button>
    </div>
  );
}