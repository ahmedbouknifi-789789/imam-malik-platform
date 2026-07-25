import { createUserWithEmailAndPassword } from "firebase/auth";
import {
  doc,
  setDoc,
} from "firebase/firestore";

import { auth, db } from "./Firebase";

export async function createTeacherAccount(teacher) {
  try {
    const email = teacher.email;
    const password = "123456";

    const userCredential =
      await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );

    await setDoc(
      doc(db, "teacherAccounts", userCredential.user.uid),
      {
        uid: userCredential.user.uid,
        teacherId: teacher.id,
        name: teacher.name,
        email: teacher.email,
        halaqa: teacher.halaqa,
      }
    );

    return {
      uid: userCredential.user.uid,
      email,
      password,
    };
  } catch (error) {
    console.log(error);
    return null;
  }
}