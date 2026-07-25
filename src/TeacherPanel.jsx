import { useState } from "react";
import {
  updatePassword,
  reauthenticateWithCredential,
  EmailAuthProvider,
} from "firebase/auth";
import { auth } from "./Firebase";

export default function TeacherPanel({
  setPage,
  loggedTeacher,
}) {
  const [showPasswordForm, setShowPasswordForm] = useState(false);
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");

  async function changePassword(e) {
    e.preventDefault();

    const user = auth.currentUser;

    if (!user) {
      alert("❌ لا يوجد أستاذ مسجل الدخول");
      return;
    }

    try {
      const credential = EmailAuthProvider.credential(
        user.email,
        oldPassword
      );

      await reauthenticateWithCredential(user, credential);

      await updatePassword(user, newPassword);

      alert("✅ تم تغيير كلمة المرور بنجاح");

      setOldPassword("");
      setNewPassword("");
      setShowPasswordForm(false);

    } catch (error) {
      console.log(error);
      alert("❌ كلمة المرور الحالية غير صحيحة");
    }
  }

  return (
    <div className="card">

      <h2>👨‍🏫 لوحة الأستاذ</h2>

      <hr />

      <p><strong>الاسم:</strong> {loggedTeacher?.name}</p>

      <p><strong>الحلقة:</strong> {loggedTeacher?.halaqa}</p>

      <hr />

      <button
        className="btn"
        onClick={() => setPage("attendance")}
      >
        📋 حضور طلاب الحلقة
      </button>

      <br /><br />

      <button
        className="btn"
        onClick={() => setPage("memorization")}
      >
        📖 حفظ طلاب الحلقة
      </button>

      <br /><br />

      <button
        className="btn"
        onClick={() => setPage("notes")}
      >
        📝 ملاحظات طلاب الحلقة
      </button>

      <br /><br />

      <button
        className="btn"
        onClick={() => setShowPasswordForm(!showPasswordForm)}
      >
        🔑 تغيير كلمة المرور
      </button>

      {showPasswordForm && (

        <form onSubmit={changePassword}>

          <br />

          <input
            type="password"
            placeholder="كلمة المرور الحالية"
            value={oldPassword}
            onChange={(e) => setOldPassword(e.target.value)}
            required
          />

          <br /><br />

          <input
            type="password"
            placeholder="كلمة المرور الجديدة"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            required
            minLength={6}
          />

          <br /><br />

          <button
            type="submit"
            className="btn"
          >
            💾 حفظ
          </button>

        </form>

      )}

      <br /><br />

      <button
  className="btn"
  onClick={() => setPage("login")}
>
  🚪 تسجيل الخروج
</button>

</div>
);
}