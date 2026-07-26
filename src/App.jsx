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
import StudentRegister from "./StudentRegister";
import RegistrationRequests from "./RegistrationRequests";
import ForgotPassword from "./ForgotPassword";
import CreateAccounts from "./CreateAccounts";
import HalaqaStudents from "./HalaqaStudents";
import TeacherLogin from "./TeacherLogin";
import CreateTeacherAccounts from "./CreateTeacherAccounts";
import Notifications from "./Notifications";

import "./App.css";

export default function App() {
  // =========================
  // الصفحات
  // =========================

  const [page, setPage] = useState("login");

  // =========================
  // الطالب والأستاذ
  // =========================

  const [selectedStudent, setSelectedStudent] =
    useState(null);

  const [loggedTeacher, setLoggedTeacher] =
    useState(null);

  // =========================
  // البيانات
  // =========================

  const [students, setStudents] = useState([]);
  const [teachers, setTeachers] = useState([]);
  const [halaqas, setHalaqas] = useState([]);

  const [selectedHalaqa, setSelectedHalaqa] =
    useState(null);

  // =========================
  // التعديل
  // =========================

  const [editingStudent, setEditingStudent] =
    useState(null);

  const [editingTeacher, setEditingTeacher] =
    useState(null);

  const [editingHalaqa, setEditingHalaqa] =
    useState(null);

  // =========================
  // تحميل البيانات
  // =========================

  useEffect(() => {
    loadStudents();
    loadTeachers();
    loadHalaqas();
  }, []);

  // =========================
  // تحميل الطلاب
  // =========================

  async function loadStudents() {
    try {
      const querySnapshot = await getDocs(
        collection(db, "students")
      );

      const list = [];

      querySnapshot.forEach((docItem) => {
        list.push({
          id: docItem.id,
          ...docItem.data(),
        });
      });

      setStudents(list);
    } catch (error) {
      console.log("خطأ في تحميل الطلاب:", error);
    }
  }

  // =========================
  // تحميل الأساتذة
  // =========================

  async function loadTeachers() {
    try {
      const querySnapshot = await getDocs(
        collection(db, "teachers")
      );

      const list = [];

      querySnapshot.forEach((docItem) => {
        list.push({
          id: docItem.id,
          ...docItem.data(),
        });
      });

      setTeachers(list);
    } catch (error) {
      console.log("خطأ في تحميل الأساتذة:", error);
    }
  }

  // =========================
  // تحميل الحلقات
  // =========================

  async function loadHalaqas() {
    try {
      const querySnapshot = await getDocs(
        collection(db, "halaqas")
      );

      const list = [];

      querySnapshot.forEach((docItem) => {
        list.push({
          id: docItem.id,
          ...docItem.data(),
        });
      });

      setHalaqas(list);
    } catch (error) {
      console.log("خطأ في تحميل الحلقات:", error);
    }
  }

  // =========================
  // إضافة طالب
  // =========================

  async function addStudent(student) {
    try {
      const registrationNumber =
        "S" + Date.now().toString().slice(-8);

      await addDoc(collection(db, "students"), {
        ...student,
        number: registrationNumber,
      });

      await loadStudents();

      setPage("students");
    } catch (error) {
      console.log(error);
      alert("حدث خطأ أثناء إضافة الطالب");
    }
  }

  // =========================
  // إضافة أستاذ
  // =========================

  async function addTeacher(teacher) {
    try {
      await addDoc(
        collection(db, "teachers"),
        teacher
      );

      await loadTeachers();

      setPage("teachers");
    } catch (error) {
      console.log(error);
      alert("حدث خطأ أثناء إضافة الأستاذ");
    }
  }

  // =========================
  // إضافة حلقة
  // =========================

  async function addHalaqa(halaqa) {
    try {
      await addDoc(
        collection(db, "halaqas"),
        halaqa
      );

      await loadHalaqas();

      setPage("halaqas");
    } catch (error) {
      console.log(error);
      alert("حدث خطأ أثناء إضافة الحلقة");
    }
  }

  // =========================
  // حذف طالب
  // =========================

  async function deleteStudent(id) {
    try {
      await deleteDoc(
        doc(db, "students", id)
      );

      await loadStudents();
    } catch (error) {
      console.log(error);
    }
  }

  // =========================
  // حذف أستاذ
  // =========================

  async function deleteTeacher(id) {
    try {
      await deleteDoc(
        doc(db, "teachers", id)
      );

      await loadTeachers();
    } catch (error) {
      console.log(error);
    }
  }

  // =========================
  // حذف حلقة
  // =========================

  async function deleteHalaqa(id) {
    try {
      await deleteDoc(
        doc(db, "halaqas", id)
      );

      await loadHalaqas();
    } catch (error) {
      console.log(error);
    }
  }

  // =========================
  // تعديل طالب
  // =========================

  function editStudent(student) {
    setEditingStudent(student);
    setPage("addStudent");
  }

  // =========================
  // تعديل أستاذ
  // =========================

  function editTeacher(teacher) {
    setEditingTeacher(teacher);
    setPage("addTeacher");
  }

  // =========================
  // تعديل حلقة
  // =========================

  function editHalaqa(halaqa) {
    setEditingHalaqa(halaqa);
    setPage("addHalaqa");
  }

  // =========================
  // تحديث الطالب
  // =========================

  async function updateStudent(updatedStudent) {
    try {
      const studentRef = doc(
        db,
        "students",
        updatedStudent.id
      );

      await updateDoc(studentRef, {
        name: updatedStudent.name,
        number: updatedStudent.number,
        birth: updatedStudent.birth,
        gender: updatedStudent.gender,
        parent: updatedStudent.parent,
        phone: updatedStudent.phone,
        parentEmail: updatedStudent.parentEmail,
        halaqa: updatedStudent.halaqa,
        level: updatedStudent.level,
        date: updatedStudent.date,
        notes: updatedStudent.notes,
        photo: updatedStudent.photo,
        halaqaType: updatedStudent.halaqaType,
      });

      await loadStudents();

      setEditingStudent(null);

      setPage("students");
    } catch (error) {
      console.log(error);
      alert("حدث خطأ أثناء تحديث الطالب");
    }
  }

  // =========================
  // تحديث الأستاذ
  // =========================

  async function updateTeacher(updatedTeacher) {
    try {
      const teacherRef = doc(
        db,
        "teachers",
        updatedTeacher.id
      );

      await updateDoc(teacherRef, {
        name: updatedTeacher.name,
        phone: updatedTeacher.phone,
        email: updatedTeacher.email,
        halaqa: updatedTeacher.halaqa,
        date: updatedTeacher.date,
        notes: updatedTeacher.notes,
      });

      await loadTeachers();

      setEditingTeacher(null);

      setPage("teachers");
    } catch (error) {
      console.log(error);
      alert("حدث خطأ أثناء تحديث الأستاذ");
    }
  }

  // =========================
  // تحديث الحلقة
  // =========================

  async function updateHalaqa(updatedHalaqa) {
    try {
      const halaqaRef = doc(
        db,
        "halaqas",
        updatedHalaqa.id
      );

      await updateDoc(halaqaRef, {
        name: updatedHalaqa.name,
        teacher: updatedHalaqa.teacher,
        students: updatedHalaqa.students,
        notes: updatedHalaqa.notes,
      });

      await loadHalaqas();

      setEditingHalaqa(null);

      setPage("halaqas");
    } catch (error) {
      console.log(error);
      alert("حدث خطأ أثناء تحديث الحلقة");
    }
  }

  // =========================
  // فتح سجل الطالب
  // =========================

  function openStudentRecord(student) {
    setSelectedStudent(student);

    setPage("studentRecord");
  }

  // =========================
  // فتح طلاب الحلقة
  // =========================

  function openHalaqaStudents(halaqa) {
    setSelectedHalaqa(halaqa);

    setPage("halaqaStudents");
  }

  // =========================
  // واجهة التطبيق
  // =========================

  return (
    <div className="app">

      {/* رأس التطبيق */}

      <header className="header">
        <h1>
          📖 منصة جمعية الإمام مالك الثقافية
        </h1>
      </header>

      {/* تسجيل الدخول */}

      {page === "login" && (
        <Login setPage={setPage} />
      )}

      {/* تسجيل طالب جديد */}

      {page === "studentRegister" && (
        <StudentRegister
          setPage={setPage}
        />
      )}

      {/* دخول الطالب */}

      {page === "studentLogin" && (
        <StudentLogin
          setPage={setPage}
          setSelectedStudent={
            setSelectedStudent
          }
        />
      )}

      {/* صفحة الطالب */}

      {page === "student" && (
        <Student
          setPage={setPage}
          student={selectedStudent}
        />
      )}

      {/* دخول الإدارة */}

      {page === "adminLogin" && (
        <AdminLogin
          setPage={setPage}
        />
      )}

      {/* صفحة ولي الأمر */}

      {page === "parent" && (
        <Parent
          setPage={setPage}
          student={selectedStudent}
        />
      )}

      {/* دخول الأستاذ */}

      {page === "teacherLogin" && (
        <TeacherLogin
          setPage={setPage}
          setLoggedTeacher={
            setLoggedTeacher
          }
        />
      )}

      {/* لوحة الأستاذ */}

      {page === "teacherPanel" && (
        <TeacherPanel
          setPage={setPage}
          loggedTeacher={loggedTeacher}
        />
      )}

      {/* الأساتذة */}

      {page === "teachers" && (
        <Teachers
          setPage={setPage}
          teachers={teachers}
          editTeacher={editTeacher}
          deleteTeacher={deleteTeacher}
        />
      )}

      {/* الإدارة */}

      {page === "admin" && (
        <Admin
          setPage={setPage}
          students={students}
          teachers={teachers}
          halaqas={halaqas}
        />
      )}

      {/* طلبات التسجيل */}

      {page === "registrationRequests" && (
        <RegistrationRequests
          setPage={setPage}
        />
      )}

      {/* الطلاب */}

      {page === "students" && (
        <Students
          setPage={setPage}
          students={students}
          deleteStudent={deleteStudent}
          editStudent={editStudent}
          openStudentRecord={
            openStudentRecord
          }
        />
      )}

      {/* الحلقات */}

      {page === "halaqas" && (
        <Halaqas
          setPage={setPage}
          halaqas={halaqas}
          students={students}
          editHalaqa={editHalaqa}
          deleteHalaqa={deleteHalaqa}
          openHalaqaStudents={
            openHalaqaStudents
          }
        />
      )}

      {/* طلاب الحلقة */}

      {page === "halaqaStudents" && (
        <HalaqaStudents
          setPage={setPage}
          selectedHalaqa={
            selectedHalaqa
          }
          students={students}
        />
      )}

      {/* إضافة أو تعديل طالب */}

      {page === "addStudent" && (
        <AddStudent
          setPage={setPage}
          addStudent={addStudent}
          editingStudent={
            editingStudent
          }
          updateStudent={
            updateStudent
          }
          halaqas={halaqas}
        />
      )}

      {/* إضافة أو تعديل أستاذ */}

      {page === "addTeacher" && (
        <AddTeacher
          setPage={setPage}
          addTeacher={addTeacher}
          editingTeacher={
            editingTeacher
          }
          updateTeacher={
            updateTeacher
          }
        />
      )}

      {/* إنشاء حسابات الأساتذة */}

      {page === "createTeacherAccounts" && (
        <CreateTeacherAccounts
          setPage={setPage}
        />
      )}

      {/* إضافة أو تعديل حلقة */}

      {page === "addHalaqa" && (
        <AddHalaqa
          setPage={setPage}
          addHalaqa={addHalaqa}
          editingHalaqa={
            editingHalaqa
          }
          updateHalaqa={
            updateHalaqa
          }
          teachers={teachers}
        />
      )}

      {/* الحفظ */}

      {page === "memorization" && (
        <Memorization
          setPage={setPage}
          students={students}
          loggedTeacher={loggedTeacher}
        />
      )}

      {/* الملاحظات */}

      {page === "notes" && (
        <Notes
          setPage={setPage}
          students={students}
        />
      )}

      {/* دخول ولي الأمر */}

      {page === "parentLogin" && (
        <ParentLogin
          setPage={setPage}
          setSelectedStudent={
            setSelectedStudent
          }
        />
      )}

      {/* الحضور */}

      {page === "attendance" && (
        <Attendance
          setPage={setPage}
          students={students}
          loggedTeacher={
            loggedTeacher
          }
        />
      )}

      {/* سجل الطالب */}

      {page === "studentHistory" && (
        <StudentHistory
          setPage={setPage}
          student={selectedStudent}
        />
      )}

      {/* نسيت كلمة المرور */}

      {page === "forgotPassword" && (
        <ForgotPassword
          setPage={setPage}
        />
      )}

      {/* إنشاء الحسابات */}

      {page === "createAccounts" && (
        <CreateAccounts
          setPage={setPage}
        />
      )}

      {/* الإشعارات */}

      {page === "notifications" && (
        <Notifications
          setPage={setPage}
          student={selectedStudent}
        />
      )}

      {/* سجل الطالب */}

      {page === "studentRecord" && (
        <StudentRecord
          setPage={setPage}
          student={selectedStudent}
        />
      )}

    </div>
  );
}