import { useState, useEffect } from "react";
import {
  collection,
  addDoc,
  getDocs,
  deleteDoc,
  doc,
  updateDoc,
} from "firebase/firestore";
import { db } from "./Firebase";

import Login from "./Login";
import Student from "./Student";
import Parent from "./Parent";
import Teacher from "./Teacher";
import Teachers from "./Teachers";
import AddTeacher from "./AddTeacher";
import Admin from "./Admin";
import Students from "./Students";
import AddStudent from "./AddStudent";
import Memorization from "./Memorization";
import StudentRecord from "./StudentRecord";
import Attendance from "./Attendance";
import Halaqas from "./Halaqas";
import AddHalaqa from "./AddHalaqa";
import TeacherPanel from "./TeacherPanel";
import Notes from "./Notes";
import AdminLogin from "./AdminLogin";
import StudentLogin from "./StudentLogin";
import ParentLogin from "./ParentLogin";
import StudentHistory from "./StudentHistory";
import "./App.css";

export default function App() {
  const [page, setPage] = useState("login");
const [selectedStudent, setSelectedStudent] = useState(null);
  const [students, setStudents] = useState([]);
  const [teachers, setTeachers] = useState([]);
  const [halaqas, setHalaqas] = useState([]);

  const [editingStudent, setEditingStudent] = useState(null);
  const [editingTeacher, setEditingTeacher] = useState(null);
  const [editingHalaqa, setEditingHalaqa] = useState(null);



  useEffect(() => {
    loadStudents();
    loadTeachers();
    loadHalaqas();
  }, []);

  async function loadStudents() {
    const querySnapshot = await getDocs(collection(db, "students"));

    const list = [];

    querySnapshot.forEach((docItem) => {
      list.push({
        id: docItem.id,
        ...docItem.data(),
      });
    });

    setStudents(list);
  }

  async function loadTeachers() {
    const querySnapshot = await getDocs(collection(db, "teachers"));

    const list = [];

    querySnapshot.forEach((docItem) => {
      list.push({
        id: docItem.id,
        ...docItem.data(),
      });
    });

    setTeachers(list);
  }

  async function loadHalaqas() {
    const querySnapshot = await getDocs(collection(db, "halaqas"));

    const list = [];

    querySnapshot.forEach((docItem) => {
      list.push({
        id: docItem.id,
        ...docItem.data(),
      });
    });

    setHalaqas(list);
  }

  async function addStudent(student) {
  const registrationNumber =
    "S" + Date.now().toString().slice(-8);

  await addDoc(collection(db, "students"), {
    ...student,
    number: registrationNumber,
  });

  loadStudents();
  setPage("students");
}

  async function addTeacher(teacher) {
    await addDoc(collection(db, "teachers"), teacher);
    loadTeachers();
    setPage("teachers");
  }

  async function addHalaqa(halaqa) {
    await addDoc(collection(db, "halaqas"), halaqa);
    loadHalaqas();
    setPage("halaqas");
  }

  async function deleteStudent(id) {
    await deleteDoc(doc(db, "students", id));
    loadStudents();
  }

  async function deleteTeacher(id) {
    await deleteDoc(doc(db, "teachers", id));
    loadTeachers();
  }

  async function deleteHalaqa(id) {
    await deleteDoc(doc(db, "halaqas", id));
    loadHalaqas();
  }

  function editStudent(student) {
    setEditingStudent(student);
    setPage("addStudent");
  }

  function editTeacher(teacher) {
    setEditingTeacher(teacher);
    setPage("addTeacher");
  }

  function editHalaqa(halaqa) {
    setEditingHalaqa(halaqa);
    setPage("addHalaqa");
  }
  async function updateStudent(updatedStudent) {
    const studentRef = doc(db, "students", updatedStudent.id);

    await updateDoc(studentRef, {
      name: updatedStudent.name,
      number: updatedStudent.number,
      birth: updatedStudent.birth,
      gender: updatedStudent.gender,
      parent: updatedStudent.parent,
      phone: updatedStudent.phone,
      halaqa: updatedStudent.halaqa,
      level: updatedStudent.level,
      date: updatedStudent.date,
      notes: updatedStudent.notes,
      photo: updatedStudent.photo,
    });

    loadStudents();
    setEditingStudent(null);
    setPage("students");
  }

  async function updateTeacher(updatedTeacher) {
    const teacherRef = doc(db, "teachers", updatedTeacher.id);

    await updateDoc(teacherRef, {
      name: updatedTeacher.name,
      phone: updatedTeacher.phone,
      email: updatedTeacher.email,
      halaqa: updatedTeacher.halaqa,
      date: updatedTeacher.date,
      notes: updatedTeacher.notes,
    });

    loadTeachers();
    setEditingTeacher(null);
    setPage("teachers");
  }

  async function updateHalaqa(updatedHalaqa) {
    const halaqaRef = doc(db, "halaqas", updatedHalaqa.id);

    await updateDoc(halaqaRef, {
      name: updatedHalaqa.name,
      teacher: updatedHalaqa.teacher,
      students: updatedHalaqa.students,
      notes: updatedHalaqa.notes,
    });

    loadHalaqas();
    setEditingHalaqa(null);
    setPage("halaqas");
  }

  function openStudentRecord(student) {
    setSelectedStudent(student);
    setPage("studentRecord");
  }

  return (
    <div className="app">
      <header className="header">
        <h1>📖 منصة جمعية الإمام مالك الثقافية</h1>
      </header>

      {page === "login" && (
        <Login setPage={setPage} />
      )}


      {page === "studentLogin" && (
  <StudentLogin
    setPage={setPage}
    setSelectedStudent={setSelectedStudent}
  />
)}

{page === "student" && (
  <Student
    setPage={setPage}
    student={selectedStudent}
  />
)}
{page === "adminLogin" && (
  <AdminLogin setPage={setPage} />
)}
      {page === "parent" && (
  <Parent
    setPage={setPage}
    student={selectedStudent}
  />
)}
      {page === "teacher" && (
        <Teacher setPage={setPage} />
      )}
      {page === "teacherPanel" && (
  <TeacherPanel setPage={setPage} />
)}

      {page === "teachers" && (
        <Teachers
          setPage={setPage}
          teachers={teachers}
          editTeacher={editTeacher}
          deleteTeacher={deleteTeacher}
        />
      )}

      {page === "admin" && (
        <Admin
          setPage={setPage}
          students={students}
        />
      )}

      {page === "students" && (
        <Students
          setPage={setPage}
          students={students}
          deleteStudent={deleteStudent}
          editStudent={editStudent}
          openStudentRecord={openStudentRecord}
        />
      )}
      {page === "halaqas" && (
        <Halaqas
          setPage={setPage}
          halaqas={halaqas}
          editHalaqa={editHalaqa}
          deleteHalaqa={deleteHalaqa}
        />
      )}

      {page === "addStudent" && (
        <AddStudent
          setPage={setPage}
          addStudent={addStudent}
          editingStudent={editingStudent}
          updateStudent={updateStudent}
        />
      )}

      {page === "addTeacher" && (
        <AddTeacher
          setPage={setPage}
          addTeacher={addTeacher}
          editingTeacher={editingTeacher}
          updateTeacher={updateTeacher}
        />
      )}

      {page === "addHalaqa" && (
        <AddHalaqa
          setPage={setPage}
          addHalaqa={addHalaqa}
          editingHalaqa={editingHalaqa}
          updateHalaqa={updateHalaqa}
          teachers={teachers}
        />
      )}

      {page === "memorization" && (
        <Memorization
          setPage={setPage}
          students={students}
        />
      )}
      {page === "notes" && (
  <Notes
    setPage={setPage}
    students={students}
  />
)}

{page === "parentLogin" && (
  <ParentLogin
    setPage={setPage}
    setSelectedStudent={setSelectedStudent}
  />
)}

      {page === "attendance" && (
        <Attendance
          setPage={setPage}
          students={students}
        />
      )}

{page === "studentHistory" && (
  <StudentHistory
    setPage={setPage}
    student={selectedStudent}
  />
)}

      {page === "studentRecord" && (
        <StudentRecord
          setPage={setPage}
          student={selectedStudent}
        />
      )}
    </div>
  );
}