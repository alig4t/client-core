import { useLocation } from "react-router-dom";
import { useEffect } from "react";
import NProgress from "nprogress";
import "nprogress/nprogress.css";

NProgress.configure({ showSpinner: false });

const ProgressBar = () => {
  const location = useLocation();
  console.log(location);
  useEffect(() => {
    console.log("ProgressBar");
    NProgress.start();
    // Finish in a short time to be seen quickly
    const timer = setTimeout(() => {
      NProgress.done();
    }, 1000);

    return () => {
      clearTimeout(timer);
      NProgress.done();
    };
  }, [location.pathname]);

  return null;
};

export default ProgressBar;
