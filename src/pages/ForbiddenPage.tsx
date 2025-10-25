import { Link } from "react-router-dom";

// src/pages/ForbiddenPage.tsx
const ForbiddenPage = () => (
  <div className="p-8 text-center">
    <h1>دسترسی ممنوع</h1>
    <p>شما مجوز لازم برای مشاهده این صفحه را ندارید.</p>
    <Link to="/dashboard">بازگشت به داشبورد</Link>
  </div>
);

export default ForbiddenPage;
