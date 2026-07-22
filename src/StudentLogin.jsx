import { useState } from "react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "./Firebase";

export default function StudentLogin({ setPage, setSelectedStudent }) {
const [number, setNumber] = useState("");

async function loginStudent() {
const snapshot = await getDocs(collection(db, "students"));

let found = null;  

snapshot.forEach((doc) => {  
  const student = { id: doc.id, ...doc.data() };  

  if (student.number === number) {  
    found = student;  
  }  
});  

if (found) {
  console.log(found);
  setSelectedStudent(found);
  setPage("student");
} else {
  console.log("الرقم المدخل:", number);

  snapshot.forEach((doc) => {
    console.log(doc.data());
  });

  alert("رقم التسجيل غير صحيح");
}

}

return (

<div className="card">  
<h2 style={{ color: "red" }}> ادخل رقم الطالب</h2> 
 <input
    type="text"  
    placeholder="رقم التسجيل"  
    value={number}  
    onChange={(e) => setNumber(e.target.value)}  
  />  

  <br />  
  <br />  

  <button className="btn" onClick={loginStudent}>  
    دخول  
  </button>  

  <button className="btn" onClick={() => setPage("login")}>  
    رجوع  
  </button>  
</div>

);
}