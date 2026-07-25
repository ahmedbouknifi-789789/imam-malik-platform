import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth } from "./Firebase";

export async function createStudentAccount(student) {
  try {
    const email =
      student.email ||
      `${student.number}@imam-malik.com`;

    const password = "123456";

    const userCredential =
      await createUserWithEmailAndPassword(
        auth,
        email,
        password
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