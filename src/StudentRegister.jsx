import { useState } from "react";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { db } from "./Firebase";

export default function StudentRegister({
  setPage,
  halaqas = [],
}) {
  const [student, setStudent] = useState({
    name: "",
    age: "",
    gender: "",
    city: "",
    phone: "",
    email: "",
    riwaya: "",
    plan: "",
    educationType: "",
    onlineDays: [],
    halaqa: "",
    canPayFees: "",
    feesReason: "",
    notes: "",
  });

  const [loading, setLoading] = useState(false);

  function handleChange(e) {
    const { name, value } = e.target;

    setStudent((prev) => ({
      ...prev,
      [name]: value,
    }));
  }

  function handleDayChange(day) {
    setStudent((prev) => {
      const exists = prev.onlineDays.includes(day);

      return {
        ...prev,
        onlineDays: exists
          ? prev.onlineDays.filter((item) => item !== day)
          : [...prev.onlineDays, day],
      };
    });
  }

  async function handleSubmit(e) {
    e.preventDefault();

    // التحقق من الحقول الأساسية
    if (!student.name.trim()) {
      alert("المرجو إدخال الاسم الكامل");
      return;
    }

    if (!student.age) {
      alert("المرجو إدخال عمر الطالب");
      return;
    }

    if (!student.gender) {
      alert("المرجو اختيار الجنس");
      return;
    }

    if (!student.city.trim()) {
      alert("المرجو إدخال الدولة أو المدينة");
      return;
    }

    if (!student.phone.trim()) {
      alert("المرجو إدخال رقم الهاتف");
      return;
    }

    if (!student.email.trim()) {
      alert("المرجو إدخال البريد الإلكتروني");
      return;
    }

    if (!student.riwaya) {
      alert("المرجو اختيار الرواية");
      return;
    }
if (!student.plan) {
  alert("المرجو اختيار خطة الحفظ");
  return;
}
    if (!student.educationType) {
      alert("المرجو اختيار نوع التعليم");
      return;
    }

    // إذا كان التعليم عن بعد أو حضوري وعن بعد
    if (
      (student.educationType === "عن بعد" ||
        student.educationType === "حضوري وعن بعد") &&
      student.onlineDays.length === 0
    ) {
      alert("المرجو اختيار يوم واحد على الأقل للتعليم عن بعد");
      return;
    }

    if (!student.halaqa) {
      alert("المرجو اختيار الحلقة");
      return;
    }

    if (!student.canPayFees) {
      alert("المرجو تحديد القدرة على دفع الرسوم");
      return;
    }

    // إذا اختار لا، يجب إدخال السبب
    if (
      student.canPayFees === "لا" &&
      !student.feesReason.trim()
    ) {
      alert("المرجو إدخال سبب عدم القدرة على دفع الرسوم");
      return;
    }

    try {
      setLoading(true);

      await addDoc(
        collection(db, "registrationRequests"),
        {
          name: student.name.trim(),
          age: student.age,
          gender: student.gender,
          city: student.city.trim(),
          phone: student.phone.trim(),
          email: student.email.trim(),

        riwaya: student.riwaya,
plan: student.plan,

dailyAmount:
  student.plan === "ثمن يومياً"
    ? "ثمن"
    : student.plan === "نصف ثمن يومياً"
    ? "نصف ثمن"
    : student.plan === "ربع حزب يومياً"
    ? "ربع حزب"
    : "حزب",

completedDays: 0,
progress: 0,
memorizedPages: 0,

educationType: student.educationType,

          onlineDays:
            student.educationType === "حضوري"
              ? []
              : student.onlineDays,

          halaqa: student.halaqa,

          canPayFees: student.canPayFees,

          feesReason:
            student.canPayFees === "لا"
              ? student.feesReason.trim()
              : "",

          notes: student.notes.trim(),

          status: "pending",

          createdAt: serverTimestamp(),
        }
      );

      alert(
        "✅ تم إرسال طلب التسجيل بنجاح، وسيتم مراجعته من طرف الإدارة."
      );

      setPage("login");

    } catch (error) {
      console.error(
        "خطأ في إرسال طلب الطالب:",
        error
      );

      alert(
        "❌ حدث خطأ أثناء إرسال الطلب. حاول مرة أخرى."
      );

    } finally {
      setLoading(false);
    }
  }

  const showOnlineDays =
    student.educationType === "عن بعد" ||
    student.educationType === "حضوري وعن بعد";

  const days = [
    "الإثنين",
    "الثلاثاء",
    "الأربعاء",
    "الخميس",
    "الجمعة",
    "السبت",
    "الأحد",
  ];

  return (
    <div className="card student-register">

      {/* ========================= */}
      {/* رأس الاستمارة */}
      {/* ========================= */}

      <div className="registration-header">

        <h2>
          📝 جمعية الإمام مالك الثقافية
        </h2>

        <h3>
          استمارة تسجيل طالب جديد
        </h3>

        <p>
          نظام إدارة الحلقات القرآنية
        </p>

      </div>

      <form onSubmit={handleSubmit}>

        {/* ========================= */}
        {/* معلومات الطالب */}
        {/* ========================= */}

        <h3 className="section-title">
          👨‍🎓 معلومات الطالب
        </h3>

        <input
          type="text"
          name="name"
          placeholder="الاسم الكامل"
          value={student.name}
          onChange={handleChange}
          required
        />

        <input
          type="number"
          name="age"
          placeholder="عمر الطالب (ة)"
          value={student.age}
          onChange={handleChange}
          min="3"
          max="100"
          required
        />

        <select
          name="gender"
          value={student.gender}
          onChange={handleChange}
          required
        >
          <option value="">
            اختر الجنس
          </option>

          <option value="ذكر">
            👦 ذكر
          </option>

          <option value="أنثى">
            👧 أنثى
          </option>
        </select>

        <input
          type="text"
          name="city"
          placeholder="الدولة أو المدينة"
          value={student.city}
          onChange={handleChange}
          required
        />

        {/* ========================= */}
        {/* معلومات الاتصال */}
        {/* ========================= */}

        <h3 className="section-title">
          📞 معلومات الاتصال
        </h3>

        <input
          type="tel"
          name="phone"
          placeholder="رقم الهاتف للطالب أو ولي الأمر"
          value={student.phone}
          onChange={handleChange}
          required
        />

        <input
          type="email"
          name="email"
          placeholder="البريد الإلكتروني للطالب أو ولي الأمر"
          value={student.email}
          onChange={handleChange}
          required
        />

        {/* ========================= */}
        {/* معلومات القرآن */}
        {/* ========================= */}

        <h3 className="section-title">
          📖 معلومات القرآن والحلقة
        </h3>

        <select
          name="riwaya"
          value={student.riwaya}
          onChange={handleChange}
          required
        >
          <option value="">
            اختر الرواية
          </option>

          <option value="ورش عن نافع">
            ورش عن نافع
          </option>

          <option value="حفص عن عاصم">
            حفص عن عاصم
          </option>

          <option value="قالون عن نافع">
            قالون عن نافع
          </option>

          <option value="أخرى">
            أخرى
          </option>
        </select>

        {/* ========================= */}
        {/* نوع التعليم */}
        {/* ========================= */}

        <select
          name="educationType"
          value={student.educationType}
          onChange={handleChange}
          required
        >
          <option value="">
            اختر نوع التعليم
          </option>

          <option value="حضوري">
            🏫 حضوري
          </option>

          <option value="عن بعد">
            💻 عن بعد
          </option>

          <option value="حضوري وعن بعد">
            🔄 حضوري وعن بعد
          </option>
        </select>

        {/* ========================= */}
        {/* الأيام المناسبة عن بعد */}
        {/* ========================= */}

        {showOnlineDays && (

          <div className="online-days-box">

            <h4>
              📅 الأيام المناسبة للتعليم عن بعد
            </h4>

            <p>
              يمكنك اختيار أكثر من يوم:
            </p>

            <div className="days-list">

              {days.map((day) => (

                <label
                  key={day}
                  className="day-option"
                >

                  <input
                    type="checkbox"
                    checked={student.onlineDays.includes(day)}
                    onChange={() =>
                      handleDayChange(day)
                    }
                  />

                  <span>
                    {day}
                  </span>

                </label>

              ))}

            </div>

          </div>

        )}

        {/* ========================= */}
        {/* اختيار الحلقة */}
        {/* ========================= */}

        <select
          name="halaqa"
          value={student.halaqa}
          onChange={handleChange}
          required
        >
          <option value="">
            اختر الحلقة
          </option>

          {halaqas.length === 0 ? (

            <option value="" disabled>
              لا توجد حلقات متاحة حاليا
            </option>

          ) : (

            halaqas.map((halaqa) => (

              <option
                key={halaqa.id}
                value={halaqa.name}
              >
                {halaqa.name}
              </option>

            ))

          )}

        </select>
        
<select
  name="plan"
  value={student.plan}
  onChange={handleChange}
  required
>
  <option value="">اختر خطة الحفظ</option>
  <option value="ثمن يومياً">ثمن يومياً</option>
  <option value="نصف ثمن يومياً">نصف ثمن يومياً</option>
  <option value="ربع حزب يومياً">ربع حزب يومياً</option>
  <option value="حزب يومياً">حزب يومياً</option>
</select>
        {/* ========================= */}
        {/* الرسوم */}
        {/* ========================= */}

        <h3 className="section-title">
          💰 الرسوم
        </h3>

        <select
          name="canPayFees"
          value={student.canPayFees}
          onChange={handleChange}
          required
        >
          <option value="">
            هل تستطيع دفع الرسوم؟
          </option>

          <option value="نعم">
            ✅ نعم
          </option>

          <option value="لا">
            ❌ لا
          </option>

        </select>

        {/* سبب عدم دفع الرسوم */}

        {student.canPayFees === "لا" && (

          <div className="fees-reason-box">

            <label>
              سبب عدم القدرة على دفع الرسوم:
            </label>

            <textarea
              name="feesReason"
              placeholder="المرجو ذكر السبب..."
              value={student.feesReason}
              onChange={handleChange}
              rows="4"
              required
            />

          </div>

        )}

        {/* ========================= */}
        {/* ملاحظات */}
        {/* ========================= */}

        <h3 className="section-title">
          📝 ملاحظات إضافية
        </h3>

        <textarea
          name="notes"
          placeholder="ملاحظات إضافية (اختياري)"
          value={student.notes}
          onChange={handleChange}
          rows="4"
        />

        {/* ========================= */}
        {/* التعهد */}
        {/* ========================= */}

        <div className="declaration">

          <h3>
            📜 التعهد
          </h3>

          <p>
            أتعهد بصحة المعلومات المقدمة في هذه
            الاستمارة، والحرص على متابعة الطالب
            والالتزام بنظام الحلقة.
          </p>

        </div>

        <br />

        {/* ========================= */}
        {/* الأزرار */}
        {/* ========================= */}

        <div className="no-print">

          <button
            className="btn"
            type="submit"
            disabled={loading}
          >
            {loading
              ? "⏳ جاري إرسال الطلب..."
              : "📨 إرسال طلب التسجيل"}
          </button>

          <button
            type="button"
            className="btn"
            onClick={() => window.print()}
          >
            🖨️ طباعة الاستمارة
          </button>

          <button
            type="button"
            className="btn"
            onClick={() => setPage("login")}
          >
            ⬅ العودة
          </button>

        </div>

      </form>

    </div>
  );
}