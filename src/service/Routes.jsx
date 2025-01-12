import React from "react";
import Home from "../components/Home";
import Login from "../pages/Login";
import NotFound from "../components/NotFound";
import System from "../layout/System";
import Settings from "../pages/Settings";
import Profile from "../pages/Profile";
import Dashboard from "../pages/Dashboard";
import TableExample from "../pages/TableExample";
import Test from "../pages/Test";

const routes = [
  { path: "/", element: <Login />, isProtected: false },
  { path: "/home", element: <System><Home /></System>, isProtected: true },
  { path: "/dashboard", element: <System><Dashboard /></System>, isProtected: true },
  { path: "/settings", element: <System><Settings /></System>, isProtected: true },
  { path: "/profile", element: <System><Profile /></System>, isProtected: true },
  { path: "/table", element: <System><TableExample /></System>, isProtected: true },
  { path: "/test", element: <Test />, isProtected: false },
  { path: "*", element: <NotFound />, isProtected: false },
];

export default routes;
