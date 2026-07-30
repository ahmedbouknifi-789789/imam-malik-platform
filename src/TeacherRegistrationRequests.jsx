import { useEffect, useState } from "react";

import {
  collection,
  getDocs,
  doc,
  updateDoc,
  addDoc,
  serverTimestamp,
} from "firebase/firestore";

import { db } from "./Firebase";

export default function TeacherRegistrationRequests({ setPage }) {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [processingId, setProcessingId] = useState(null);

  useEffect(() => {
    loadRequests();
  }, []);

  // ==========================================
  // تحميل طلبات الأساتذة
  // ==========================================

  async function loadRequests() {
    try {
      setLoading(true);

      const snapshot = await getDocs(
        collection(db, "teacherRequests")
      );

      const list = [];

      snapshot.forEach((docItem) => {
        list.push({
          id: docItem.id,
          ...docItem.data(),
        });
      });

      // الأحدث أولاً
      list.sort((a, b) => {
        const dateA = a.createdAt
          ? new Date(a.createdAt).getTime()
          : 0;

        const dateB = b.createdAt
          ? new Date(b.createdAt).getTime()
          : 0;

        return dateB - dateA;
      });

      setRequests(list);
    } catch (error) {
      console.log(
        "خطأ في تحميل طلبات الأساتذة:",
        error
      );

      alert("❌ تعذر تحميل طلبات الأساتذة");
    } finally {
      setLoading(false);
    }
  }

  // ==========================================
  // قبول الطلب
  // ==========================================

  async function approveRequest(request) {
    const confirmed = window.confirm(
      `هل تريد الموافقة على طلب الأستاذ:\n\n${request.name}؟`
    );

    if (!confirmed) return;

    try {
      setProcessingId(request.id);

      // التحقق من وجود الأستاذ مسبقاً
      const teachersSnapshot = await getDocs(
        collection(db, "teachers")
      );

      const alreadyExists =
        teachersSnapshot.docs.some((teacherDoc) => {
          const teacher = teacherDoc.data();

          return (
            teacher.email &&
            request.email &&
            teacher.email.toLowerCase() ===
              request.email.toLowerCase()
          );
        });

      if (alreadyExists) {
        alert(
          "⚠️ يوجد أستاذ مسجل مسبقاً بهذا البريد الإلكتروني."
        );

        return;
      }

      // إضافة الأستاذ إلى teachers
      await addDoc(
        collection(db, "teachers"),
        {
          name: request.name || "",
          age: request.age || "",
          gender: request.gender || "",
          location: request.location || "",
          phone: request.phone || "",
          email: request.email || "",
          riwaya: request.riwaya || "",
          volunteer: request.volunteer || "",

          // معلومات الطلب
          registrationRequestId: request.id,

          status: "active",

          createdAt: serverTimestamp(),

          date:
            request.date ||
            new Date().toLocaleDateString("fr-CA"),
        }
      );

      // تحديث حالة الطلب
      await updateDoc(
        doc(
          db,
          "teacherRequests",
          request.id
        ),
        {
          status: "approved",
          processedAt: serverTimestamp(),
        }
      );

      alert(
        "✅ تمت الموافقة على الطلب وإضافة الأستاذ إلى قائمة الأساتذة."
      );

      await loadRequests();
    } catch (error) {
      console.log(
        "خطأ في قبول طلب الأستاذ:",
        error
      );

      alert(
        "❌ حدث خطأ أثناء قبول الطلب."
      );
    } finally {
      setProcessingId(null);
    }
  }

  // ==========================================
  // رفض الطلب
  // ==========================================

  async function rejectRequest(request) {
    const confirmed = window.confirm(
      `هل تريد رفض طلب الأستاذ:\n\n${request.name}؟`
    );

    if (!confirmed) return;

    try {
      setProcessingId(request.id);

      await updateDoc(
        doc(
          db,
          "teacherRequests",
          request.id
        ),
        {
          status: "rejected",
          processedAt: serverTimestamp(),
        }
      );

      alert("❌ تم رفض طلب الأستاذ.");

      await loadRequests();
    } catch (error) {
      console.log(
        "خطأ في رفض طلب الأستاذ:",
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
  // التاريخ
  // ==========================================

  function formatDate(value) {
    if (!value) return "غير محدد";

    try {
      if (value.toDate) {
        return value
          .toDate()
          .toLocaleDateString("ar-MA");
      }

      return new Date(value).toLocaleDateString(
        "ar-MA"
      );
    } catch {
      return String(value);
    }
  }

  // ==========================================
  // الطلبات قيد المراجعة
  // ==========================================

  const pendingRequests = requests.filter(
    (request) =>
      request.status === "pending"
  );

  // ==========================================
  // الواجهة
  // ==========================================

  return (
    <div className="teacher-requests-page">

      <div className="teacher-requests-header">

        <div>
          <h2>
            👨‍🏫 طلبات تسجيل الأساتذة
          </h2>

          <p>
            مراجعة طلبات الانضمام إلى الأساتذة
          </p>
        </div>

        <div className="teacher-requests-count">
          <span>
            {pendingRequests.length}
          </span>

          <small>
            طلب قيد المراجعة
          </small>
        </div>

      </div>

      {loading ? (
        <div className="teacher-request-empty">
          <h3>
            ⏳ جاري تحميل الطلبات...
          </h3>
        </div>
      ) : requests.length === 0 ? (
        <div className="teacher-request-empty">

          <div className="empty-icon">
            📭
          </div>

          <h3>
            لا توجد طلبات
          </h3>

          <p>
            لم يتم إرسال أي طلب تسجيل أستاذ بعد.
          </p>

        </div>
      ) : (
        <div className="teacher-requests-list">

          {requests.map((request) => (

            <div
              className={`teacher-request-card ${
                request.status === "approved"
                  ? "request-approved"
                  : request.status === "rejected"
                  ? "request-rejected"
                  : ""
              }`}
              key={request.id}
            >

              {/* الرأس */}

              <div className="teacher-request-card-header">

                <div className="teacher-request-avatar">
                  👨‍🏫
                </div>

                <div>

                  <h3>
                    {request.name || "بدون اسم"}
                  </h3>

                  <p>
                    📅 {formatDate(request.createdAt)}
                  </p>

                </div>

                <div className="request-status-box">

                  {request.status === "approved" && (
                    <span className="teacher-request-status approved">
                      ✅ مقبول
                    </span>
                  )}

                  {request.status === "rejected" && (
                    <span className="teacher-request-status rejected">
                      ❌ مرفوض
                    </span>
                  )}

                  {request.status === "pending" && (
                    <span className="teacher-request-status pending">
                      ⏳ قيد المراجعة
                    </span>
                  )}

                </div>

              </div>

              {/* المعلومات */}

              <div className="teacher-request-info">

                <div>
                  <span>🎂</span>

                  <div>
                    <small>العمر</small>

                    <strong>
                      {request.age || "غير محدد"}
                    </strong>
                  </div>
                </div>

                <div>
                  <span>⚧️</span>

                  <div>
                    <small>الجنس</small>

                    <strong>
                      {request.gender || "غير محدد"}
                    </strong>
                  </div>
                </div>

                <div>
                  <span>📍</span>

                  <div>
                    <small>الدولة / المدينة</small>

                    <strong>
                      {request.location || "غير محدد"}
                    </strong>
                  </div>
                </div>

                <div>
                  <span>📱</span>

                  <div>
                    <small>الهاتف</small>

                    <strong>
                      {request.phone || "غير محدد"}
                    </strong>
                  </div>
                </div>

                <div>
                  <span>📧</span>

                  <div>
                    <small>الإيميل</small>

                    <strong>
                      {request.email || "غير محدد"}
                    </strong>
                  </div>
                </div>

                <div>
                  <span>📖</span>

                  <div>
                    <small>الرواية</small>

                    <strong>
                      {request.riwaya || "غير محددة"}
                    </strong>
                  </div>
                </div>

                <div>
                  <span>💰</span>

                  <div>
                    <small>
                      العمل بدون أجرة في البداية
                    </small>

                    <strong>
                      {request.volunteer || "غير محدد"}
                    </strong>
                  </div>
                </div>

              </div>

              {/* الأزرار */}

              {request.status === "pending" && (

                <div className="teacher-request-actions">

                  <button
                    className="teacher-approve-btn"
                    disabled={
                      processingId === request.id
                    }
                    onClick={() =>
                      approveRequest(request)
                    }
                  >
                    {processingId === request.id
                      ? "⏳ جاري المعالجة..."
                      : "✅ قبول الطلب"}
                  </button>

                  <button
                    className="teacher-reject-btn"
                    disabled={
                      processingId === request.id
                    }
                    onClick={() =>
                      rejectRequest(request)
                    }
                  >
                    ❌ رفض الطلب
                  </button>

                </div>

              )}

              {request.status === "approved" && (
                <div className="teacher-request-message approved-message">
                  ✅ تمت الموافقة على هذا الطلب وإضافة الأستاذ إلى قائمة الأساتذة.
                </div>
              )}

              {request.status === "rejected" && (
                <div className="teacher-request-message rejected-message">
                  ❌ تم رفض هذا الطلب.
                </div>
              )}

            </div>

          ))}

        </div>
      )}

      <button
        className="back-admin-btn"
        onClick={() => setPage("admin")}
      >
        ⬅️ الرجوع إلى لوحة الإدارة
      </button>

    </div>
  );
}