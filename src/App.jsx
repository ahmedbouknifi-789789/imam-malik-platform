import { useState, useEffect } from "react";

import {
  collection,
  addDoc,
  getDocs,
  deleteDoc,
  doc,
  updateDoc,
} from "firebase/firestore";

import { onAuthStateChanged } from "firebase/auth";

import { db, auth } from "./Firebase";

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
import TeacherRegister from "./TeacherRegister";
import CreateTeacherAccounts from "./CreateTeacherAccounts";
import Notifications from "./Notifications";
import StudentCard from "./StudentCard";
import StudentReport from "./StudentReport";
import AdminResults from "./AdminResults";
import TeacherRegistrationRequests from "./TeacherRegistrationRequests";
import Statistics from "./Statistics";
import "./App.css";


// ==================================================
// البريد الإلكتروني الخاص بالإدارة
// ==================================================

const ADMIN_EMAIL = "admin@example.com";


export default function App() {

  // ==================================================
  // الصفحة الحالية
  // ==================================================

  const [page, setPage] = useState("login");


  // ==================================================
  // الصفحة السابقة
  // ==================================================

  const [previousPage, setPreviousPage] =
    useState("login");


  // ==================================================
  // حالة تحميل الجلسة
  // ==================================================

  const [checkingAuth, setCheckingAuth] =
    useState(true);


  // ==================================================
  // الطالب
  // ==================================================

  const [selectedStudent, setSelectedStudent] =
    useState(null);

  const [studentPoints, setStudentPoints] =
    useState(0);

  const [studentLevel, setStudentLevel] =
    useState("🥉 مبتدئ");


  // ==================================================
  // الأستاذ
  // ==================================================

  const [loggedTeacher, setLoggedTeacher] =
    useState(null);


  // ==================================================
  // البيانات
  // ==================================================

  const [students, setStudents] =
    useState([]);

  const [teachers, setTeachers] =
    useState([]);

  const [halaqas, setHalaqas] =
    useState([]);

const [selectedHalaqa, setSelectedHalaqa] =
  useState("");

useEffect(() => {
  const saved = localStorage.getItem("teacherSelectedHalaqa");

  if (saved) {
    setSelectedHalaqa(saved);
  }
}, []);

  // ==================================================
  // التعديل
  // ==================================================

  const [editingStudent, setEditingStudent] =
    useState(null);

  const [editingTeacher, setEditingTeacher] =
    useState(null);

  const [editingHalaqa, setEditingHalaqa] =
    useState(null);


  // ==================================================
  // التنقل بين الصفحات
  // ==================================================
function navigateTo(newPage) {
  setPreviousPage(page);

  // لا تمسح الحلقة عند التنقل داخل صفحات الأستاذ
  if (
    [
      "teacherPanel",
      "attendance",
      "memorization",
      "notes",
      "statistics",
    ].includes(newPage)
  ) {
    // لا شيء
  }

  setPage(newPage);
}


  // ==================================================
  // تحميل البيانات عند تشغيل التطبيق
  // ==================================================

  useEffect(() => {

    loadStudents();

    loadTeachers();

    loadHalaqas();

  }, []);


  // ==================================================
  // حفظ الدخول تلقائيًا
  // ==================================================

  useEffect(() => {

    const unsubscribe =
      onAuthStateChanged(
        auth,
        async (user) => {

          // لا يوجد مستخدم مسجل
          if (!user) {

            setCheckingAuth(false);

            return;

          }


          // ==========================================
          // إذا كان المستخدم هو الإدارة
          // ==========================================

          if (
            user.email === ADMIN_EMAIL
          ) {

            setPage("admin");

            setCheckingAuth(false);

            return;

          }


          // ==========================================
          // البحث عن الأستاذ
          // ==========================================

          try {

            const snapshot =
              await getDocs(
                collection(
                  db,
                  "teachers"
                )
              );


            let teacherFound = null;


            snapshot.forEach(
              (docItem) => {

                const teacher = {

                  id: docItem.id,

                  ...docItem.data(),

                };


                if (
                  teacher.email ===
                  user.email
                ) {

                  teacherFound =
                    teacher;

                }

              }
            );


            // ==========================================
            // إذا وجدنا الأستاذ
            // ==========================================

            if (
              teacherFound
            ) {

              setLoggedTeacher(
                teacherFound
              );

              setPage(
                "teacherPanel"
              );

            }


          } catch (error) {

            console.log(
              "خطأ في استعادة جلسة الأستاذ:",
              error
            );

          }


          setCheckingAuth(false);

        }
      );


    return () => {

      unsubscribe();

    };

  }, []);


  // ==================================================
  // تحميل الطلاب
  // ==================================================

  async function loadStudents() {

    try {

      const querySnapshot =
        await getDocs(
          collection(
            db,
            "students"
          )
        );


      const list = [];


      querySnapshot.forEach(
        (docItem) => {

          list.push({

            id: docItem.id,

            ...docItem.data(),

          });

        }
      );


      setStudents(list);


    } catch (error) {

      console.log(
        "خطأ في تحميل الطلاب:",
        error
      );

    }

  }


  // ==================================================
  // تحميل الأساتذة
  // ==================================================

  async function loadTeachers() {

    try {

      const querySnapshot =
        await getDocs(
          collection(
            db,
            "teachers"
          )
        );


      const list = [];


      querySnapshot.forEach(
        (docItem) => {

          list.push({

            id: docItem.id,

            ...docItem.data(),

          });

        }
      );


      setTeachers(list);


    } catch (error) {

      console.log(
        "خطأ في تحميل الأساتذة:",
        error
      );

    }

  }


  // ==================================================
  // تحميل الحلقات
  // ==================================================

  async function loadHalaqas() {

    try {

      const querySnapshot =
        await getDocs(
          collection(
            db,
            "halaqas"
          )
        );


      const list = [];


      querySnapshot.forEach(
        (docItem) => {

          list.push({

            id: docItem.id,

            ...docItem.data(),

          });

        }
      );


      setHalaqas(list);


    } catch (error) {

      console.log(
        "خطأ في تحميل الحلقات:",
        error
      );

    }

  }


  // ==================================================
  // إضافة طالب
  // ==================================================

  async function addStudent(student) {

    try {

      const registrationNumber =
        "S" +
        Date.now()
          .toString()
          .slice(-8);


      await addDoc(

        collection(
          db,
          "students"
        ),

        {

          ...student,

          number:
            registrationNumber,

        }

      );


      await loadStudents();


      navigateTo(
        "students"
      );


    } catch (error) {

      console.log(error);

      alert(
        "حدث خطأ أثناء إضافة الطالب"
      );

    }

  }


  // ==================================================
  // إضافة أستاذ
  // ==================================================

  async function addTeacher(teacher) {

    try {

      await addDoc(

        collection(
          db,
          "teachers"
        ),

        teacher

      );


      await loadTeachers();


      navigateTo(
        "teachers"
      );


    } catch (error) {

      console.log(error);

      alert(
        "حدث خطأ أثناء إضافة الأستاذ"
      );

    }

  }


  // ==================================================
  // إضافة حلقة
  // ==================================================

  async function addHalaqa(halaqa) {

    try {

      await addDoc(

        collection(
          db,
          "halaqas"
        ),

        halaqa

      );


      await loadHalaqas();


      navigateTo(
        "halaqas"
      );


    } catch (error) {

      console.log(error);

      alert(
        "حدث خطأ أثناء إضافة الحلقة"
      );

    }

  }


  // ==================================================
  // حذف طالب
  // ==================================================

  async function deleteStudent(id) {

    try {

      await deleteDoc(

        doc(
          db,
          "students",
          id
        )

      );


      await loadStudents();


    } catch (error) {

      console.log(error);

    }

  }


  // ==================================================
  // حذف أستاذ
  // ==================================================

  async function deleteTeacher(id) {

    try {

      await deleteDoc(

        doc(
          db,
          "teachers",
          id
        )

      );


      await loadTeachers();


    } catch (error) {

      console.log(error);

    }

  }


  // ==================================================
  // حذف حلقة
  // ==================================================

  async function deleteHalaqa(id) {

    try {

      await deleteDoc(

        doc(
          db,
          "halaqas",
          id
        )

      );


      await loadHalaqas();


    } catch (error) {

      console.log(error);

    }

  }


  // ==================================================
  // تعديل طالب
  // ==================================================

  function editStudent(student) {

    setEditingStudent(
      student
    );


    navigateTo(
      "addStudent"
    );

  }


  // ==================================================
  // تعديل أستاذ
  // ==================================================

  function editTeacher(teacher) {

    setEditingTeacher(
      teacher
    );


    navigateTo(
      "addTeacher"
    );

  }


  // ==================================================
  // تعديل حلقة
  // ==================================================

  function editHalaqa(halaqa) {

    setEditingHalaqa(
      halaqa
    );


    navigateTo(
      "addHalaqa"
    );

  }


  // ==================================================
  // تحديث الطالب
  // ==================================================

  async function updateStudent(
    updatedStudent
  ) {

    try {

      const studentRef =
        doc(
          db,
          "students",
          updatedStudent.id
        );


      await updateDoc(

        studentRef,

        {

          name:
            updatedStudent.name,

          number:
            updatedStudent.number,

          age:
            updatedStudent.age,

          gender:
            updatedStudent.gender,

          city:
            updatedStudent.city,

          phone:
            updatedStudent.phone,

          email:
            updatedStudent.email,

          riwaya:
            updatedStudent.riwaya,

          educationType:
            updatedStudent.educationType,

          onlineDays:
            updatedStudent.onlineDays || [],

          halaqa:
            updatedStudent.halaqa,

          canPayFees:
            updatedStudent.canPayFees,

          feesReason:
            updatedStudent.feesReason,

          notes:
            updatedStudent.notes,

          photo:
            updatedStudent.photo,

          status:
            updatedStudent.status || "active",

        }

      );


      await loadStudents();


      setEditingStudent(
        null
      );


      navigateTo(
        "students"
      );


    } catch (error) {

      console.log(error);

      alert(
        "حدث خطأ أثناء تحديث الطالب"
      );

    }

  }


  // ==================================================
  // تحديث الأستاذ
  // ==================================================

  async function updateTeacher(
    updatedTeacher
  ) {

    try {

      const teacherRef =
        doc(
          db,
          "teachers",
          updatedTeacher.id
        );


      await updateDoc(

        teacherRef,

        {
  name:
    updatedTeacher.name,

  phone:
    updatedTeacher.phone,

  email:
    updatedTeacher.email,

  halaqas:
    updatedTeacher.halaqas || [],

  date:
    updatedTeacher.date,

  notes:
    updatedTeacher.notes,
}

      );


      await loadTeachers();


      setEditingTeacher(
        null
      );


      navigateTo(
        "teachers"
      );


    } catch (error) {

      console.log(error);

      alert(
        "حدث خطأ أثناء تحديث الأستاذ"
      );

    }

  }


  // ==================================================
  // تحديث الحلقة
  // ==================================================

  async function updateHalaqa(
    updatedHalaqa
  ) {

    try {

      const halaqaRef =
        doc(
          db,
          "halaqas",
          updatedHalaqa.id
        );


      await updateDoc(

        halaqaRef,

        {

          name:
            updatedHalaqa.name,

          teacher:
            updatedHalaqa.teacher,

          students:
            updatedHalaqa.students,

          notes:
            updatedHalaqa.notes,

        }

      );


      await loadHalaqas();


      setEditingHalaqa(
        null
      );


      navigateTo(
        "halaqas"
      );


    } catch (error) {

      console.log(error);

      alert(
        "حدث خطأ أثناء تحديث الحلقة"
      );

    }

  }


  // ==================================================
  // فتح سجل الطالب
  // ==================================================

  function openStudentRecord(
    student
  ) {

    setSelectedStudent(
      student
    );


    navigateTo(
      "studentRecord"
    );

  }


  // ==================================================
  // فتح طلاب الحلقة
  // ==================================================
async function openHalaqaStudents(halaqa) {
  await loadStudents(); // تحديث الطلاب أولاً
  setSelectedHalaqa(halaqa);
  navigateTo("halaqaStudents");
}

  // ==================================================
  // فتح سجل الحفظ من QR
  // ==================================================

  async function openStudentHistoryByNumber(
    studentNumber
  ) {

    try {

      if (!studentNumber) {
        return;
      }


      const snapshot =
        await getDocs(
          collection(
            db,
            "students"
          )
        );


      let foundStudent = null;


      snapshot.forEach(
        (docItem) => {

          const data =
            docItem.data();


          if (
            String(data.number || "")
              .trim()
              .toLowerCase() ===
            String(studentNumber)
              .trim()
              .toLowerCase()
          ) {

            foundStudent = {

              id: docItem.id,

              ...data,

            };

          }

        }
      );


      if (!foundStudent) {

        alert(
          "❌ لم يتم العثور على الطالب بهذا الرقم"
        );

        setPage("login");

        return;

      }


      setSelectedStudent(
        foundStudent
      );


      setPage(
        "studentHistory"
      );


    } catch (error) {

      console.error(
        "خطأ في فتح سجل الحفظ:",
        error
      );

      alert(
        "❌ تعذر فتح سجل الحفظ"
      );

    }

  }


  // ==================================================
  // فحص رابط QR
  // ==================================================

  useEffect(() => {

    const path =
      window.location.pathname;


    if (
      path.startsWith(
        "/memorization/"
      )
    ) {

      const studentNumber =
        decodeURIComponent(
          path
            .split(
              "/memorization/"
            )[1] || ""
        );


      if (
        studentNumber
      ) {

        openStudentHistoryByNumber(
          studentNumber
        );

      }

    }

  }, []);


  // ==================================================
  // انتظار التحقق من تسجيل الدخول
  // ==================================================

  if (
    checkingAuth
  ) {

    return (

      <div
        className="card"
        style={{
          textAlign:
            "center",
        }}
      >

        <h2>
          ⏳ جاري التحقق من تسجيل الدخول...
        </h2>

      </div>

    );

  }


  // ==================================================
  // واجهة التطبيق
  // ==================================================

  return (

    <div
      className="app"
    >

      <header
        className="header"
      >

        <h1>
          📖 منصة جمعية الإمام مالك الثقافية
        </h1>

      </header>


      {/* تسجيل الدخول */}

      {page === "login" && (

        <Login
          setPage={
            navigateTo
          }
        />

      )}


      {/* تسجيل طالب جديد */}

      {page === "studentRegister" && (

        <StudentRegister
          setPage={
            navigateTo
          }
          halaqas={
            halaqas
          }
        />

      )}


      {/* طلب تسجيل أستاذ */}

      {page === "teacherRegister" && (

        <TeacherRegister
          setPage={
            navigateTo
          }
          halaqas={
            halaqas
          }
        />

      )}


      {/* دخول الطالب */}

      {page === "studentLogin" && (

        <StudentLogin
          setPage={
            navigateTo
          }
          setSelectedStudent={
            setSelectedStudent
          }
        />

      )}


      {/* صفحة الطالب */}

      {page === "student" && (

        <Student
          setPage={
            navigateTo
          }
          student={
            selectedStudent
          }
          returnPage={
            previousPage
          }
          setStudentPoints={
            setStudentPoints
          }
          setStudentLevel={
            setStudentLevel
          }
        />

      )}


      {/* تقرير الطالب */}

      {page === "studentReport" && (

        <StudentReport
          setPage={
            navigateTo
          }
          student={
            selectedStudent
          }
        />

      )}


      {/* دخول الإدارة */}

      {page === "adminLogin" && (

        <AdminLogin
          setPage={
            navigateTo
          }
        />

      )}


      {/* ولي الأمر */}

      {page === "parent" && (

        <Parent
          setPage={
            navigateTo
          }
          student={
            selectedStudent
          }
        />

      )}


      {/* دخول الأستاذ */}

      {page === "teacherLogin" && (

  <TeacherLogin
    setPage={navigateTo}
    setLoggedTeacher={setLoggedTeacher}
    setSelectedHalaqa={setSelectedHalaqa}
  />

)}


      {/* لوحة الأستاذ */}

      {page === "teacherPanel" && (

       <TeacherPanel
  setPage={navigateTo}
  loggedTeacher={loggedTeacher}
  selectedHalaqa={selectedHalaqa}
  setSelectedHalaqa={setSelectedHalaqa}
/>
      )}


      {/* الأساتذة */}

      {page === "teachers" && (

        <Teachers
          setPage={
            navigateTo
          }
          teachers={
            teachers
          }
          editTeacher={
            editTeacher
          }
          deleteTeacher={
            deleteTeacher
          }
        />

      )}


      {/* الإدارة */}

      {page === "admin" && (

        <Admin
          setPage={
            navigateTo
          }
          students={
            students
          }
          teachers={
            teachers
          }
          halaqas={
            halaqas
          }
        />

      )}


      {/* طلبات تسجيل الطلاب */}

      {page === "registrationRequests" && (

        <RegistrationRequests
          setPage={
            navigateTo
          }
        />

      )}


      {/* الطلاب */}

      {page === "students" && (

        <Students
          setPage={
            navigateTo
          }
          students={
            students
          }
          deleteStudent={
            deleteStudent
          }
          editStudent={
            editStudent
          }
          openStudentRecord={
            openStudentRecord
          }
        />

      )}


      {/* الحلقات */}

      {page === "halaqas" && (

        <Halaqas
          setPage={
            navigateTo
          }
          halaqas={
            halaqas
          }
          students={
            students
          }
          editHalaqa={
            editHalaqa
          }
          deleteHalaqa={
            deleteHalaqa
          }
          openHalaqaStudents={
            openHalaqaStudents
          }
        />

      )}


      {/* طلاب الحلقة */}

      {page === "halaqaStudents" && (

        <HalaqaStudents
          setPage={
            navigateTo
          }
          selectedHalaqa={
            selectedHalaqa
          }
          students={
            students
          }
          loadStudents={
            loadStudents
          }
        />

      )}


      {/* إضافة أو تعديل طالب */}

      {page === "addStudent" && (

        <AddStudent
          setPage={
            navigateTo
          }
          addStudent={
            addStudent
          }
          editingStudent={
            editingStudent
          }
          updateStudent={
            updateStudent
          }
          halaqas={
            halaqas
          }
        />

      )}


      {/* إضافة أو تعديل أستاذ */}

      {page === "addTeacher" && (

        <AddTeacher
  setPage={navigateTo}
  addTeacher={addTeacher}
  editingTeacher={editingTeacher}
  updateTeacher={updateTeacher}
  halaqas={halaqas}
/>
      )}


      {/* إنشاء حسابات الأساتذة */}

      {page === "createTeacherAccounts" && (

        <CreateTeacherAccounts
          setPage={
            navigateTo
          }
        />

      )}


      {/* إضافة أو تعديل حلقة */}

      {page === "addHalaqa" && (

        <AddHalaqa
          setPage={
            navigateTo
          }
          addHalaqa={
            addHalaqa
          }
          editingHalaqa={
            editingHalaqa
          }
          updateHalaqa={
            updateHalaqa
          }
          teachers={
            teachers
          }
        />

      )}


      {/* الحفظ */}

      {page === "memorization" && (

        <Memorization
  setPage={navigateTo}
  students={students}
  loggedTeacher={loggedTeacher}
  selectedHalaqa={selectedHalaqa}
  returnPage={previousPage}
/>

      )}


      {/* الملاحظات */}

      {page === "notes" && (

        <Notes
          setPage={
            navigateTo
          }
          students={
            students
          }
        />

      )}
{page === "statistics" && (
  <Statistics
    setPage={navigateTo}
    students={students}
    loggedTeacher={loggedTeacher}
    selectedHalaqa={selectedHalaqa}
  />
)}

      {/* دخول ولي الأمر */}

      {page === "parentLogin" && (

        <ParentLogin
          setPage={
            navigateTo
          }
          setSelectedStudent={
            setSelectedStudent
          }
        />

      )}


      {/* الحضور */}

      {page === "attendance" && (

        <Attendance
  setPage={navigateTo}
  students={students}
  loggedTeacher={loggedTeacher}
  selectedHalaqa={selectedHalaqa}
/>

      )}


      {/* سجل الحفظ */}

      {page === "studentHistory" && (

        <StudentHistory
          setPage={
            navigateTo
          }
          student={
            selectedStudent
          }
        />

      )}


      {/* نتائج الإدارة */}

      {page === "adminResults" && (

        <AdminResults
          setPage={
            navigateTo
          }
          students={
            students
          }
        />

      )}


      {/* نسيت كلمة المرور */}

      {page === "forgotPassword" && (

        <ForgotPassword
          setPage={
            navigateTo
          }
        />

      )}


      {/* إنشاء الحسابات */}

      {page === "createAccounts" && (

        <CreateAccounts
          setPage={
            navigateTo
          }
        />

      )}


      {/* طلبات تسجيل الأساتذة */}

      {page === "teacherRegistrationRequests" && (

        <TeacherRegistrationRequests
          setPage={
            navigateTo
          }
        />

      )}


      {/* الإشعارات */}

      {page === "notifications" && (

        <Notifications
          setPage={
            navigateTo
          }
          student={
            selectedStudent
          }
        />

      )}


      {/* بطاقة الطالب */}

      {page === "studentCard" && (

        <StudentCard
          student={
            selectedStudent
          }
          points={
            studentPoints
          }
          level={
            studentLevel
          }
          setPage={
            navigateTo
          }
        />

      )}


      {/* سجل الطالب */}

      {page === "studentRecord" && (

        <StudentRecord
          setPage={
            navigateTo
          }
          student={
            selectedStudent
          }
        />

      )}

    </div>

  );

}