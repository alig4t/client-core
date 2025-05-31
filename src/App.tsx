import { Route, Routes } from "react-router-dom";
import "./App.css";
import Layout from "./components/Layout";
import Profile from "./pages/Profile";
import Settings from "./pages/Settings";
import LoginPage from "./pages/Login";
import Post from "./pages/Post";
import NotFoundPage from "./components/NotFoundPage";

function App() {
  return (
    <>
      <Routes>
        {/* صفحه ورود بدون Layout */}
        <Route path="/login" element={<LoginPage />} />

        {/* سایر صفحات با Layout */}
        <Route path="/" element={<Layout />}>
          <Route path="profile" element={<Profile />} />
          <Route path="settings" element={<Settings />} />
          <Route path="posts" element={<Post />} />
          {/* صفحه خانه */}
          <Route index element={<div className="p-4">خانه</div>} />
          <Route path="*" element={<NotFoundPage />} />
        </Route>
      </Routes>
    </>
  );
}

export default App;
