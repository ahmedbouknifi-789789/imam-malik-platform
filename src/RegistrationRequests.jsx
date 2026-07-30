import { useEffect, useState } from "react";
import {
  collection,
  getDocs,
  addDoc,
  deleteDoc,
  doc,
} from "firebase/firestore";
import { db } from "./Firebase";
import { createStudentAccount } from "./CreateStudentAccount";

export default function RegistrationRequests({ setPage }) {
  const [requests, setRequests] = useState([]);
  const [processingId, setProcessingId] = useState(null);

  useEffect(() => {
    loadRequests();
  }, []);

  // ==========================================
  // تحميل الطلبات
  // ==========================================

  async function loadRequests() {
    try {
      const snapshot = await getDocs(
        collection(db, "registrationRequests")
      );

      const list = snapshot.docs.map((item) => ({
        id: item.id,
        ...item.data(),
      }));

      // الأحدث أولاً
      list.sort((a, b) => {
        const dateA = a.createdAt?.toDate
          ? a.createdAt.toDate()
          : new Date(a.createdAt || 0);

        const dateB = b.createdAt?.toDate
          ? b.createdAt.toDate()
          : new Date(b.createdAt || 0);

        return dateB - dateA;
      });

      setRequests(list);
    } catch (error) {
      console.error(
        "خطأ في تحميل طلبات التسجيل:",
        error
      );

      alert("❌ تعذر تحميل طلبات التسجيل");
    }
  }

  // ==========================================
  // قبول الطالب
  // ==========================================

  async function acceptRequest(student) {
    const confirmed = window.confirm(
      `هل تريد قبول تسجيل الطالب:\n\n${student.name}؟`
    );

    if (!confirmed) return;

    try {
      setProcessingId(student.id);

      // ======================================
      // إنشاء رقم الطالب
      // ======================================

      const studentNumber =
        "S" + Date.now().toString().slice(-8);

      // ======================================
      // إنشاء حساب الطالب
      // ======================================

      const account = await createStudentAccount({
        ...student,
        number: studentNumber,
      });

      if (!account || !account.uid) {
        alert("❌ فشل إنشاء حساب الطالب");
        return;
      }

      // ======================================
      // إضافة الطالب إلى students
      // ======================================

      await addDoc(collection(db, "students"), {
        uid: account.uid,

        // معلومات الطالب
        name: student.name || "",
        age: student.age || "",
        gender: student.gender || "",
        city: student.city || "",

        // الاتصال
        phone: student.phone || "",
        email: account.email || student.email || "",

        // القرآن
        riwaya: student.riwaya || "",

        // التعليم
        educationType:
          student.educationType || "",

        onlineDays:
          student.onlineDays || [],

        // الحلقة
        halaqa: student.halaqa || "",

        // الرسوم
        canPayFees:
          student.canPayFees || "",

        feesReason:
          student.feesReason || "",

        // الملاحظات
        notes: student.notes || "",

        // رقم الطالب
        number: studentNumber,

        // معلومات إضافية
        status: "active",
        registrationRequestId: student.id,

        createdAt: new Date(),
      });

      // ======================================
      // رسالة واتساب
      // ======================================

      const daysText =
        student.onlineDays &&
        student.onlineDays.length > 0
          ? student.onlineDays.join("، ")
          : "غير محددة";

      const message = `
السلام عليكم ورحمة الله وبركاته 👋

تم قبول تسجيل الطالب: ${student.name} ✅

📖 منصة جمعية الإمام مالك الثقافية

━━━━━━━━━━━━━━

👤 رقم الطالب:
${studentNumber}

📧 البريد الإلكتروني:
${account.email || student.email}

🔑 كلمة المرور:
123456

📚 الحلقة:
${student.halaqa || "غير محددة"}

📖 الرواية:
${student.riwaya || "غير محددة"}

🏫 نوع التعليم:
${student.educationType || "غير محدد"}

📅 الأيام المناسبة عن بعد:
${daysText}

💰 دفع الرسوم:
${student.canPayFees || "غير محدد"}

━━━━━━━━━━━━━━

🌐 رابط المنصة:
https://imam-malik-platform.vercel.app/

وشكراً لكم.
`;

      // ======================================
      // تحويل الهاتف المغربي
      // ======================================

      let phone = String(
        student.phone || ""
      ).replace(/\D/g, "");

      if (phone.startsWith("0")) {
        phone =
          "212" +
          phone.substring(1);
      }

      // ======================================
      // فتح واتساب
      // ======================================

      if (phone) {
        const whatsappUrl =
          `https://wa.me/${phone}?text=${encodeURIComponent(
            message
          )}`;

        window.open(
          whatsappUrl,
          "_blank"
        );
      }

      // ======================================
      // حذف الطلب
      // ======================================

      await deleteDoc(
        doc(
          db,
          "registrationRequests",
          student.id
        )
      );

      alert(
        "✅ تم قبول الطالب وإنشاء حسابه بنجاح."
      );

      await loadRequests();

    } catch (error) {
      console.error(
        "خطأ في قبول الطالب:",
        error
      );

      alert(
        "❌ حدث خطأ أثناء قبول الطالب:\n" +
        error.message
      );
    } finally {
      setProcessingId(null);
    }
  }

  // ==========================================
  // رفض الطلب
  // ==========================================

  async function rejectRequest(student) {
    const confirmed = window.confirm(
      `هل تريد رفض طلب الطالب:\n\n${student.name}؟`
    );

    if (!confirmed) return;

    try {
      setProcessingId(student.id);

      await deleteDoc(
        doc(
          db,
          "registrationRequests",
          student.id
        )
      );

      alert("❌ تم رفض طلب التسجيل.");

      await loadRequests();
    } catch (error) {
      console.error(
        "خطأ في رفض الطلب:",
        error
      );

      alert(
        "❌ حدث خطأ أثناء رفض الطلب."
      );
    } finally {
      setProcessingId(null);
    }
  }

  // ==========================================
  // عرض الأيام
  // ==========================================

  function showDays(days) {
    if (!days || days.length === 0) {
      return "غير محددة";
    }

    return days.join("، ");
  }

  // ==========================================
  // عرض التاريخ
  // ==========================================

  function formatDate(createdAt) {
    if (!createdAt) {
      return "غير محدد";
    }

    try {
      const date = createdAt.toDate
        ? createdAt.toDate()
        : new Date(createdAt);

      return date.toLocaleDateString(
        "ar-MA"
      );
    } catch {
      return "غير محدد";
    }
  }

  // ==========================================
  // الواجهة
  // ==========================================

  return (
    <div className="card">

      <h2>
        📥 طلبات تسجيل الطلاب
      </h2>

      <p>
        مراجعة طلبات التسجيل الجديدة
      </p>

      <hr />

      {requests.length === 0 ? (

        <div
          style={{
            textAlign: "center",
            padding: "30px",
          }}
        >
          <h3>
            📭 لا توجد طلبات تسجيل
          </h3>

          <p>
            ستظهر هنا الطلبات الجديدة.
          </p>
        </div>

      ) : (

        requests.map((student) => (

          <div
            key={student.id}
            className="card"
            style={{
              marginBottom: "20px",
            }}
          >

            {/* ============================= */}
            {/* رأس الطلب */}
            {/* ============================= */}

            <h3>
              👨‍🎓 {student.name}
            </h3>

            <p>
              📅 تاريخ الطلب:
              {" "}
              {formatDate(
                student.createdAt
              )}
            </p>

            <hr />

            {/* ============================= */}
            {/* معلومات الطالب */}
            {/* ============================= */}

            <h4>
              👤 معلومات الطالب
            </h4>

            <p>
              🎂 العمر:
              {" "}
              {student.age || "غير محدد"}
            </p>

            <p>
              ⚧ الجنس:
              {" "}
              {student.gender || "غير محدد"}
            </p>

            <p>
              🌍 الدولة / المدينة:
              {" "}
              {student.city || "غير محددة"}
            </p>

            {/* ============================= */}
            {/* الاتصال */}
            {/* ============================= */}

            <h4>
              📞 معلومات الاتصال
            </h4>

            <p>
              📱 الهاتف:
              {" "}
              {student.phone || "غير موجود"}
            </p>

            <p>
              📧 البريد الإلكتروني:
              {" "}
              {student.email || "غير موجود"}
            </p>

            {/* ============================= */}
            {/* معلومات القرآن */}
            {/* ============================= */}

            <h4>
              📖 معلومات القرآن
            </h4>

            <p>
              📖 الرواية:
              {" "}
              {student.riwaya || "غير محددة"}
            </p>

            {/* ============================= */}
            {/* التعليم */}
            {/* ============================= */}

            <h4>
              🏫 نوع التعليم
            </h4>

            <p>
              {student.educationType ||
                "غير محدد"}
            </p>

            {(student.educationType ===
              "عن بعد" ||
              student.educationType ===
                "حضوري وعن بعد") && (

              <p>
                📅 الأيام المناسبة:
                {" "}
                {showDays(
                  student.onlineDays
                )}
              </p>
            )}

            {/* ============================= */}
            {/* الحلقة */}
            {/* ============================= */}

            <h4>
              📚 الحلقة
            </h4>

            <p>
              {student.halaqa ||
                "غير محددة"}
            </p>

            {/* ============================= */}
            {/* الرسوم */}
            {/* ============================= */}

            <h4>
              💰 الرسوم
            </h4>

            <p>
              يستطيع دفع الرسوم:
              {" "}
              <strong>
                {student.canPayFees ||
                  "غير محدد"}
              </strong>
            </p>

            {student.canPayFees ===
              "لا" && (

              <p
                style={{
                  background: "#fff7ed",
                  padding: "10px",
                  borderRadius: "8px",
                }}
              >
                📝 سبب عدم القدرة على دفع
                الرسوم:
                <br />
                {student.feesReason ||
                  "لم يذكر السبب"}
              </p>
            )}

            {/* ============================= */}
            {/* الملاحظات */}
            {/* ============================= */}

            {student.notes && (

              <>
                <h4>
                  📝 ملاحظات
                </h4>

                <p>
                  {student.notes}
                </p>
              </>
            )}

            <hr />

            {/* ============================= */}
            {/* الأزرار */}
            {/* ============================= */}

            <button
              className="btn"
              disabled={
                processingId === student.id
              }
              onClick={() =>
                acceptRequest(student)
              }
            >
              {processingId === student.id
                ? "⏳ جاري المعالجة..."
                : "✅ قبول وإنشاء الحساب وإرسال واتساب"}
            </button>

            <button
              className="btn"
              style={{
                background: "#b91c1c",
              }}
              disabled={
                processingId === student.id
              }
              onClick={() =>
                rejectRequest(student)
              }
            >
              ❌ رفض الطلب
            </button>

          </div>

        ))
      )}

      {/* ============================= */}
      {/* الرجوع */}
      {/* ============================= */}

      <button
        className="btn"
        onClick={() =>
          setPage("admin")
        }
      >
        ⬅ العودة إلى لوحة الإدارة
      </button>

    </div>
  );
}