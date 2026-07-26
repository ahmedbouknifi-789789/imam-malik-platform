import { useEffect, useState } from "react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "./Firebase";

export default function Notifications({
  setPage,
  student,
}) {
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    loadNotifications();
  }, []);

  async function loadNotifications() {
    const snapshot = await getDocs(
      collection(db, "notifications")
    );

    const list = [];

    snapshot.forEach((doc) => {
      const item = doc.data();

      if (item.studentId === student.id) {
        list.push(item);
      }
    });

    list.sort((a, b) => {
      if (a.date === b.date) {
        return b.time.localeCompare(a.time);
      }
      return b.date.localeCompare(a.date);
    });

    setNotifications(list);
  }

  return (
    <div className="card">
      <h2>🔔 الإشعارات</h2>

      {notifications.length === 0 ? (
        <p>لا توجد إشعارات.</p>
      ) : (
        notifications.map((item, index) => (
          <div
            key={index}
            style={{
              border: "1px solid #ddd",
              borderRadius: "10px",
              padding: "10px",
              marginBottom: "10px",
            }}
          >
            <h4>{item.title}</h4>

            <p>{item.message}</p>

            <small>
              {item.date} - {item.time}
            </small>
          </div>
        ))
      )}

      <br />

      <button
        className="btn"
        onClick={() => setPage("parent")}
      >
        ⬅️ رجوع
      </button>
    </div>
  );
}