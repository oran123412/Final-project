import { useEffect } from "react";

const AUTO_LOGOUT_TIME = 4 * 60 * 60 * 1000;

const useAutoLogout = () => {
  useEffect(() => {
    const events = [
      "load",
      "mousemove",
      "mousedown",
      "click",
      "scroll",
      "keypress",
    ];

    const resetTimer = () => {
      clearTimeout(window.logoutTimer);
      window.logoutTimer = setTimeout(() => {
        alert("You have been logged out due to inactivity.");

        localStorage.removeItem("token");

        window.location.href = "/login";
      }, AUTO_LOGOUT_TIME);
    };

    events.forEach((event) => {
      window.addEventListener(event, resetTimer);
    });

    return () => {
      clearTimeout(window.logoutTimer);
      events.forEach((event) => {
        window.removeEventListener(event, resetTimer);
      });
    };
  }, []);
};

export default useAutoLogout;
