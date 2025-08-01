import { Route, Routes } from "react-router-dom";
import "./App.css";
import Layout from "./components/Layout";
import Profile from "./pages/Profile";
import Settings from "./pages/Settings";
import LoginPage from "./pages/Login";
import Post from "./pages/Post";
import NotFoundPage from "./components/NotFoundPage";
import { Toaster } from "./components/ui/sonner";
import TagSearchPage from "./Models/Tag/TagSearchPage";
import TagCreatePage from "./Models/Tag/TagCreatePage";
import TagDisplayPage from "./Models/Tag/TagDisplayPage";
import GlobalLoaderProvider from "./components/GlobalLoaderProvider";

function App() {
  return (
    <>
      <GlobalLoaderProvider />
      {/* <Toaster richColors position="top-center" /> */}
      <Toaster />
      <Routes>
        {/* صفحه ورود بدون Layout */}
        <Route path="/login" element={<LoginPage />} />

        {/* سایر صفحات با Layout */}
        <Route path="/" element={<Layout />}>
          <Route path="profile" element={<Profile />} />
          <Route path="settings" element={<Settings />} />
          <Route path="posts" element={<Post />} />

          <Route path="portal">
            <Route path="tags" element={<TagSearchPage />} />
            <Route path="tags/create" element={<TagCreatePage />} />
            <Route path="tags/:id" element={<TagDisplayPage />} />
          </Route>

          {/* صفحه خانه */}
          <Route index element={<div className="p-4">خانه</div>} />
          <Route path="*" element={<NotFoundPage />} />
        </Route>
      </Routes>
    </>
  );
}

export default App;
