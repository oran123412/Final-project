import { useEffect } from "react";
import ROUTES from "../routes/ROUTES";

const alwaysLinks = [
  { to: ROUTES.HOME, children: "Home page" },
  { to: ROUTES.ABOUT, children: "About us " },
];
const loggedInLinks = [{ to: ROUTES.LIKEDPAGE, children: "Liked page" }];
const bizLinks = [{ to: ROUTES.MYCARDS, children: "My cards" }];

const adminLinks = [{ to: ROUTES.SANDBOX, children: "Sandbox" }];
const loggedOutLinks = [
  { to: ROUTES.REGISTER, children: "Register page" },
  { to: ROUTES.LOGIN, children: "Login page" },
];

export { alwaysLinks, loggedInLinks, loggedOutLinks, bizLinks, adminLinks };
