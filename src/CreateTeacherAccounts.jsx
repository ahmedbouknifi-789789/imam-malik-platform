import { collection, getDocs, updateDoc, doc } from "firebase/firestore";
import { db } from "./Firebase";
import { createTeacherAccount } from "./CreateTeacherAccount";

export default function CreateTeacherAccounts({ setPage }) {
  async function createAccounts() {
    try {
      const snapshot = await getDocs(collection(db, "teachers"));

      let created = 0;

      for (const document of snapshot.docs) {
        const teacher = {
          id: document.id,
          ...document.data(),
        };

        // إذا كان لديه حساب مسبقاً نتجاوزه
        if (teacher.uid) continue;

        // إذا لم يكن لديه بريد إلكتروني نتجاوزه
        if (!teacher.email) continue;

        const account = await createTeacherAccount(teacher);

        if (account) {
          await updateDoc(doc(db, "teachers", teacher.id), {
            uid: account.uid,
            email: account.email,
          });

          created++;
        }
      }

      alert(`✅ تم إنشاء ${created} حساباً للأستاذ بنجاح`);

    } catch (error) {
      console.log(error);
      alert("❌ حدث خطأ أثناء إنشاء حسابات الأساتذة");
    }
  }

  return (
    <div className="card">
      <h2>👨‍🏫 إنشاء حسابات الأساتذة</h2>

      <p>
        سيتم إنشاء حساب لكل أستاذ لا يملك حساباً في النظام.
      </p>

      <button
        className="btn"
        onClick={createAccounts}
      >
        إنشاء الحسابات
      </button>

      <br />
      <br />

      <button
        className="btn"
        onClick={() => setPage("admin")}
      >
        ⬅ رجوع
      </button>
    </div>
  );
}