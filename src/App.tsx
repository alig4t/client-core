import { Route, Routes } from "react-router-dom";
import "./App.css";
import Layout from "./components/Layout";
import Profile from "./pages/Profile";
import Settings from "./pages/Settings";

function App() {
  return (
    <>
      
      <Routes>
        {/* صفحه ورود بدون Layout */}
        {/* <Route path="/login" element={<Login />} /> */}

        {/* سایر صفحات با Layout */}
        <Route path="/" element={<Layout />}>
          <Route path="profile" element={<Profile />} />
          <Route path="settings" element={<Settings />} />
          {/* صفحه خانه */}
          <Route index element={<div className="p-4">خانه</div>} />
        </Route>
      </Routes>
    </>
  );
}

export default App;
