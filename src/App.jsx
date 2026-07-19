import { useState } from "react";
import Login from "./Login";
import Student from "./Student";
import Parent from "./Parent";
import Teacher from "./Teacher";
import Admin from "./Admin";
import Students from "./Students";
import AddStudent from "./AddStudent";
import "./App.css";

export default function App() {
  const [page, setPage] = useState("login");

  const [students, setStudents] = useState([]);
  const [editingStudent, setEditingStudent] = useState(null);

  function addStudent(student) {
    const newStudent = {
      id: Date.now(),
      ...student,
    };

    setStudents([...students, newStudent]);
    setPage("students");
  }

  function deleteStudent(id) {
    setStudents(students.filter((student) => student.id !== id));
  }

  function editStudent(student) {
    setEditingStudent(student);
    setPage("addStudent");
  }

  function updateStudent(updatedStudent) {
    setStudents(
      students.map((student) =>
        student.id === updatedStudent.id
          ? updatedStudent
          : student
      )
    );

    setEditingStudent(null);
    setPage("students");
  }

  return (
    <div className="app">
      <header className="header">
        <h1>📖 منصة جمعية الإمام مالك الثقافية</h1>
      </header>

      {page === "login" && (
        <Login setPage={setPage} />
      )}

      {page === "student" && (
        <Student setPage={setPage} />
      )}

      {page === "parent" && (
        <Parent setPage={setPage} />
      )}

      {page === "teacher" && (
        <Teacher setPage={setPage} />
      )}

      {page === "admin" && (
        <Admin setPage={setPage} />
      )}

      {page === "students" && (
        <Students
          setPage={setPage}
          students={students}
          deleteStudent={deleteStudent}
          editStudent={editStudent}
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
    </div>
  );
}