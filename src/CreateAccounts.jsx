import { collection, getDocs, updateDoc, doc } from "firebase/firestore";
import { db } from "./Firebase";
import { createStudentAccount } from "./CreateStudentAccount";

export default function CreateAccounts({ setPage }) {
  async function createAccounts() {
    try {
      const snapshot = await getDocs(collection(db, "students"));

      let created = 0;

      for (const document of snapshot.docs) {
        const student = {
          id: document.id,
          ...document.data(),
        };

        // إذا كان لديه حساب مسبقاً نتجاوزه
        if (student.uid) continue;

        // إذا لم يكن لديه رقم تسجيل نتجاوزه
        if (!student.number) continue;

        const email = `${student.number}@imam-malik.com`;

        const uid = await createStudentAccount({
          email: email,
        });

        if (uid) {
          await updateDoc(doc(db, "students", student.id), {
            uid: uid,
            email: email,
          });

          created++;
        }
      }

      alert(`✅ تم إنشاء ${created} حساباً بنجاح`);

    } catch (error) {
      console.log(error);
      alert("❌ حدث خطأ أثناء إنشاء الحسابات");
    }
  }

  return (
    <div className="card">
      <h2>👤 إنشاء حسابات الطلاب</h2>

      <p>
        سيتم إنشاء حساب لكل طالب لا يملك حساباً في النظام.
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