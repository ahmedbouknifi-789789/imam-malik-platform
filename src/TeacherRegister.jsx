import { useState } from "react";
import { collection, addDoc } from "firebase/firestore";
import { db } from "./Firebase";

export default function TeacherRegister({ setPage }) {
  const [form, setForm] = useState({
    name: "",
    age: "",
    gender: "",
    location: "",
    phone: "",
    email: "",
    riwaya: "",
    volunteer: "",
  });

  const [loading, setLoading] = useState(false);

  function handleChange(e) {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  }

  async function submitRequest(e) {
    e.preventDefault();

    if (!form.name.trim()) {
      alert("المرجو إدخال الاسم الكامل");
      return;
    }

    if (!form.age) {
      alert("المرجو إدخال العمر");
      return;
    }

    if (!form.gender) {
      alert("المرجو اختيار الجنس");
      return;
    }

    if (!form.location.trim()) {
      alert("المرجو إدخال الدولة أو المدينة");
      return;
    }

    if (!form.phone.trim()) {
      alert("المرجو إدخال رقم الهاتف");
      return;
    }

    if (!form.email.trim()) {
      alert("المرجو إدخال البريد الإلكتروني");
      return;
    }

    if (!form.riwaya) {
      alert("المرجو اختيار الرواية");
      return;
    }

    if (!form.volunteer) {
      alert("المرجو تحديد إمكانية العمل بدون أجرة");
      return;
    }

    try {
      setLoading(true);

      await addDoc(collection(db, "teacherRequests"), {
        name: form.name.trim(),
        age: Number(form.age),
        gender: form.gender,
        location: form.location.trim(),
        phone: form.phone.trim(),
        email: form.email.trim(),
        riwaya: form.riwaya,
        volunteer: form.volunteer,

        status: "pending",

        date: new Date().toLocaleDateString("fr-CA"),

        createdAt: new Date().toISOString(),
      });

      alert(
        "✅ تم إرسال طلب تسجيل الأستاذ بنجاح.\n\nسيتم مراجعة الطلب من طرف الإدارة."
      );

      setPage("login");
    } catch (error) {
      console.error(
        "خطأ في إرسال طلب الأستاذ:",
        error
      );

      alert(
        "❌ حدث خطأ أثناء إرسال الطلب.\nيرجى المحاولة مرة أخرى."
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="card">

      <h2>👨‍🏫 طلب تسجيل أستاذ</h2>

      <p>
        المرجو إدخال معلوماتك بدقة لإرسال طلب التسجيل إلى الإدارة.
      </p>

      <form onSubmit={submitRequest}>

        {/* الاسم */}
        <label>الاسم الكامل</label>

        <input
          type="text"
          name="name"
          placeholder="مثال: أحمد محمد"
          value={form.name}
          onChange={handleChange}
        />

        {/* العمر */}
        <label>العمر</label>

        <input
          type="number"
          name="age"
          placeholder="العمر"
          min="15"
          max="100"
          value={form.age}
          onChange={handleChange}
        />

        {/* الجنس */}
        <label>الجنس</label>

        <select
          name="gender"
          value={form.gender}
          onChange={handleChange}
        >
          <option value="">
            اختر الجنس
          </option>

          <option value="ذكر">
            ذكر
          </option>

          <option value="أنثى">
            أنثى
          </option>
        </select>

        {/* الدولة أو المدينة */}
        <label>الدولة أو المدينة</label>

        <input
          type="text"
          name="location"
          placeholder="مثال: المغرب - الدار البيضاء"
          value={form.location}
          onChange={handleChange}
        />

        {/* الهاتف */}
        <label>رقم الهاتف</label>

        <input
          type="tel"
          name="phone"
          placeholder="رقم الهاتف"
          value={form.phone}
          onChange={handleChange}
        />

        {/* البريد */}
        <label>البريد الإلكتروني</label>

        <input
          type="email"
          name="email"
          placeholder="example@email.com"
          value={form.email}
          onChange={handleChange}
        />

        {/* الرواية */}
        <label>الرواية</label>

        <select
          name="riwaya"
          value={form.riwaya}
          onChange={handleChange}
        >
          <option value="">
            اختر الرواية
          </option>

          <option value="حفص عن عاصم">
            حفص عن عاصم
          </option>

          <option value="ورش عن نافع">
            ورش عن نافع
          </option>

          <option value="قالون عن نافع">
            قالون عن نافع
          </option>

          <option value="الدوري">
            الدوري
          </option>

          <option value="أخرى">
            أخرى
          </option>
        </select>

        {/* العمل بدون أجرة */}
        <label>
          هل تستطيع العمل بدون أجرة في البداية؟
        </label>

        <select
          name="volunteer"
          value={form.volunteer}
          onChange={handleChange}
        >
          <option value="">
            اختر الإجابة
          </option>

          <option value="نعم">
            نعم
          </option>

          <option value="لا">
            لا
          </option>
        </select>

        {/* إرسال */}
        <button
          className="btn"
          type="submit"
          disabled={loading}
        >
          {loading
            ? "⏳ جاري إرسال الطلب..."
            : "📨 إرسال طلب التسجيل"}
        </button>

      </form>

      {/* الرجوع */}
      <button
        className="btn"
        type="button"
        onClick={() => setPage("login")}
      >
        ⬅️ الرجوع
      </button>

    </div>
  );
}