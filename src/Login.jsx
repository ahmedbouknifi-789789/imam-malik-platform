export default function Login({ setPage }) {
return (
<div className="card">
<h2>📖 منصة جمعية الإمام مالك الثقافية</h2>

<p>اختر نوع الحساب:</p>  

  <button  
    className="btn"  
   onClick={() => setPage("studentLogin")}  
  >  
    👨‍🎓 الطالب  
  </button>  

  <br /><br />  

  <button  
    className="btn"  
    onClick={() => setPage("parentLogin")}  
  >  
    👨‍👩‍👦 ولي الأمر  
  </button>  

  <br /><br />  

  <button  
    className="btn"  
    onClick={() => setPage("teacher")}  
  >  
    👨‍🏫 الأستاذ  
  </button>  

  <br /><br />  

  <button  
    className="btn"  
    onClick={() => setPage("adminLogin")}  
  >  
    🛠️ الإدارة  
  </button>  
</div>

);
}