import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth } from "./Firebase";

export async function createStudentAccount(student) {
  try {
    const userCredential = await createUserWithEmailAndPassword(
      auth,
      student.email,
      "123456"
    );

    return userCredential.user.uid;
  } catch (error) {
    console.log(error);
    return null;
  }
}