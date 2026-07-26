import { useEffect, useState } from "react";
import {
  collection,
  getDocs,
} from "firebase/firestore";
import { db } from "./Firebase";

export default function Student({ setPage, student }) {
  const [record, setRecord] = useState(null);
  const [notifications, setNotifications] = useState([]);

  const [stats, setStats] = useState({
    total: 0,
    excellent: 0,
    absent: 0,
    memorized: 0,
  });

  const [points, setPoints] = useState(0);
  const [level, setLevel] = useState("🥉 مبتدئ");
  const [achievements, setAchievements] = useState([]);

  useEffect(() => {
    if (student) {
      loadData();
    }
  }, [student]);

  async function loadData() {
    try {
      // ================= نتائج الحفظ =================

      const recordsSnapshot = await getDocs(
        collection(db, "memorization")
      );

      const studentRecords = [];

      recordsSnapshot.forEach((doc) => {
        const item = doc.data();

        if (item.studentId === student.id) {
          studentRecords.push({
            id: doc.id,
            ...item,
          });
        }
      });

      // ترتيب النتائج من الأحدث إلى الأقدم
      studentRecords.sort((a, b) => {
        return new Date(b.date) - new Date(a.date);
      });

      const lastRecord =
        studentRecords.length > 0
          ? studentRecords[0]
          : null;

      setRecord(lastRecord);

      // ================= الإحصائيات =================

      const excellent = studentRecords.filter(
        (item) => item.rate === "ممتاز"
      ).length;

      const absent = studentRecords.filter(
        (item) =>
          item.new === "غائب" ||
          item.new === "غائب بعذر"
      ).length;

      const memorized = studentRecords.filter(
        (item) =>
          item.new &&
          item.new !== "غائب" &&
          item.new !== "غائب بعذر" &&
          item.new !== "حضر ولم يحفظ"
      ).length;

      setStats({
        total: studentRecords.length,
        excellent,
        absent,
        memorized,
      });

      // ================= حساب النقاط =================

      let totalPoints = 0;

      studentRecords.forEach((item) => {

        // نقاط التقييم
        if (item.rate === "ممتاز") {
          totalPoints += 10;
        } else if (item.rate === "جيد جدًا") {
          totalPoints += 7;
        } else if (item.rate === "جيد") {
          totalPoints += 5;
        } else if (item.rate === "متوسط") {
          totalPoints += 3;
        } else if (item.rate === "ضعيف") {
          totalPoints += 1;
        }

        // نقاط المحفوظ الجديد
        if (
          item.new &&
          item.new !== "غائب" &&
          item.new !== "غائب بعذر" &&
          item.new !== "حضر ولم يحفظ"
        ) {
          totalPoints += 5;
        }

        // نقاط المراجعة
        if (item.review && item.review !== "") {
          totalPoints += 3;
        }

      });

      setPoints(totalPoints);

      // ================= مستوى الطالب =================

      let studentLevel = "🥉 مبتدئ";

      if (totalPoints >= 1000) {
        studentLevel = "🌟 نجم الحلقة";
      } else if (totalPoints >= 500) {
        studentLevel = "🏆 حافظ مجتهد";
      } else if (totalPoints >= 250) {
        studentLevel = "🥇 متقدم";
      } else if (totalPoints >= 100) {
        studentLevel = "🥈 مجتهد";
      }

      setLevel(studentLevel);

      // ================= الإنجازات =================

      const newAchievements = [];

      if (studentRecords.length >= 1) {
        newAchievements.push("🎯 أول نتيجة");
      }

      if (memorized >= 10) {
        newAchievements.push("📖 10 مرات حفظ");
      }

      if (memorized >= 50) {
        newAchievements.push("🏅 50 مرة حفظ");
      }

      if (excellent >= 10) {
        newAchievements.push("⭐ 10 تقييمات ممتازة");
      }

      if (totalPoints >= 100) {
        newAchievements.push("💯 100 نقطة");
      }

      if (totalPoints >= 500) {
        newAchievements.push("🏆 500 نقطة");
      }

      if (totalPoints >= 1000) {
        newAchievements.push("🌟 نجم الحلقة");
      }

      setAchievements(newAchievements);

      // ================= الإشعارات =================

      const notificationsSnapshot = await getDocs(
        collection(db, "notifications")
      );

      const studentNotifications = [];

      notificationsSnapshot.forEach((doc) => {
        const item = doc.data();

        if (item.studentId === student.id) {
          studentNotifications.push({
            id: doc.id,
            ...item,
          });
        }
      });

      setNotifications(
        studentNotifications.reverse().slice(0, 5)
      );

    } catch (error) {
      console.log("حدث خطأ:", error);
    }
  }

  if (!student) {
    return (
      <div className="card">
        <h2>لا يوجد طالب مسجل الدخول</h2>

        <button
          className="btn"
          onClick={() => setPage("login")}
        >
          ⬅️ رجوع
        </button>
      </div>
    );
  }

  return (
    <div className="student-dashboard">

      {/* ================= الرأس ================= */}

      <div className="student-header">

        <div className="student-avatar">

          {student.photo ? (
            <img
              src={student.photo}
              alt={student.name}
            />
          ) : (
            "👨‍🎓"
          )}

        </div>

        <h2>
          مرحبًا {student.name} 👋
        </h2>

        <p>
          نتمنى لك التوفيق والنجاح 🌟
        </p>

      </div>


      {/* ================= معلومات الطالب ================= */}

      <div className="student-info-card">

        <h3>👨‍🎓 معلومات الطالب</h3>

        <p>
          <strong>رقم التسجيل:</strong>
          <br />
          {student.number || "غير متوفر"}
        </p>

        <p>
          <strong>الحلقة:</strong>
          <br />
          {student.halaqa || "غير محددة"}
        </p>

        <p>
          <strong>المستوى:</strong>
          <br />
          {student.level || "غير محدد"}
        </p>

        <p>
          <strong>نوع الحلقة:</strong>
          <br />
          {student.halaqaType || "حضوري"}
        </p>

      </div>


      {/* ================= النقاط والمستوى ================= */}

      <div className="points-card">

        <div className="points-icon">
          🏆
        </div>

        <h3>
          {points} نقطة
        </h3>

        <p>
          مستواك الحالي
        </p>

        <div className="student-level">
          {level}
        </div>

        <div className="progress-container">

          <div
            className="progress-bar"
            style={{
              width: `${Math.min(
                (points % 100) || (points > 0 ? 100 : 0),
                100
              )}%`,
            }}
          />

        </div>

        <small>
          استمر في الحفظ والمراجعة لتحصل على المزيد من النقاط 🚀
        </small>

      </div>


      {/* ================= الإنجازات ================= */}

      <div className="achievements-card">

        <h3>
          🏅 إنجازاتي
        </h3>

        {achievements.length === 0 ? (

          <p className="empty-message">
            واصل التعلم لتحصل على أول إنجاز لك 🎯
          </p>

        ) : (

          <div className="achievements-list">

            {achievements.map((achievement, index) => (

              <div
                className="achievement-item"
                key={index}
              >
                {achievement}
              </div>

            ))}

          </div>

        )}

      </div>


      {/* ================= الإحصائيات ================= */}

      <div className="stats-grid">

        <div className="stat-card blue">
          <span>📖</span>
          <h3>{stats.memorized}</h3>
          <p>مرات الحفظ</p>
        </div>

        <div className="stat-card green">
          <span>⭐</span>
          <h3>{stats.excellent}</h3>
          <p>تقييم ممتاز</p>
        </div>

        <div className="stat-card orange">
          <span>📊</span>
          <h3>{stats.total}</h3>
          <p>إجمالي النتائج</p>
        </div>

        <div className="stat-card red">
          <span>⚠️</span>
          <h3>{stats.absent}</h3>
          <p>أيام الغياب</p>
        </div>

      </div>


      {/* ================= الحلقة عن بعد ================= */}

      {student.halaqaType === "عن بعد" && (

        <div className="online-card">

          <div className="online-icon">
            💻
          </div>

          <h3>
            الحلقة عن بعد
          </h3>

          <p>
            اضغط على الزر للدخول إلى الحلقة المباشرة
          </p>

          <a
            href="https://meet.google.com/ksq-dbwh-izx"
            target="_blank"
            rel="noopener noreferrer"
            className="online-btn"
          >
            🎥 دخول الحلقة الآن
          </a>

        </div>

      )}


      {/* ================= آخر نتيجة ================= */}

      <div className="last-result-card">

        <h3>
          📖 آخر نتيجة للحفظ
        </h3>

        {record ? (

          <>

            <div className="result-row">
              <span>📚 المحفوظ الجديد</span>

              <strong>
                {record.new || "لا يوجد"}
              </strong>
            </div>

            <div className="result-row">
              <span>🔄 المراجعة</span>

              <strong>
                {record.review || "لا يوجد"}
              </strong>
            </div>

            <div className="result-row">
              <span>⭐ التقييم</span>

              <strong>
                {record.rate || "لا يوجد"}
              </strong>
            </div>

            <div className="result-row">
              <span>📝 الملاحظات</span>

              <strong>
                {record.notes || "لا توجد"}
              </strong>
            </div>

            <div className="result-date">
              📅 {record.date}
            </div>

          </>

        ) : (

          <p className="empty-message">
            لا توجد نتائج مسجلة بعد 📭
          </p>

        )}

      </div>


      {/* ================= الإشعارات ================= */}

      <div className="notifications-card">

        <h3>
          🔔 آخر الإشعارات
        </h3>

        {notifications.length === 0 ? (

          <p className="empty-message">
            لا توجد إشعارات جديدة 🔕
          </p>

        ) : (

          notifications.map((notification) => (

            <div
              className="notification-item"
              key={notification.id}
            >

              <strong>
                {notification.title}
              </strong>

              <p>
                {notification.message}
              </p>

              <small>
                📅 {notification.date}
              </small>

            </div>

          ))

        )}

      </div>


      {/* ================= سجل الحفظ ================= */}

      <button
        className="btn"
        onClick={() =>
          setPage("studentHistory")
        }
      >
        📚 سجل الحفظ الكامل
      </button>


      {/* ================= تسجيل الخروج ================= */}

      <button
        className="btn logout-btn"
        onClick={() =>
          setPage("login")
        }
      >
        🚪 تسجيل الخروج
      </button>

    </div>
  );
}