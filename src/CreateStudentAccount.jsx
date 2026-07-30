import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth } from "./Firebase";

export async function createStudentAccount(student) {
  try {
    // البريد الإلكتروني الذي أدخله الطالب أو ولي الأمر
    const email = student.email?.trim();

    if (!email) {
      console.error("لا يوجد بريد إلكتروني للطالب");
      return null;
    }

    // كلمة المرور الأولية
    const password = "123456";

    const userCredential =
      await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );

    return {
      uid: userCredential.user.uid,
      email: userCredential.user.email,
      password,
    };

  } catch (error) {

    console.error(
      "خطأ في إنشاء حساب الطالب:",
      error
    );

    return null;
  }
}