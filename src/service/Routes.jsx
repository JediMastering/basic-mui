import Home from "../components/Home";
import Login from "../pages/Login";
import NotFound from "../components/NotFound";
import Settings from "../pages/Settings";
import Profile from "../pages/Profile";
import Dashboard from "../pages/Dashboard";
import UsersPage from "../pages/users/UsersPage";
import Test from "../pages/Test";
import ExamplePage from "../pages/ExamplePage";
import DeliveryPage from "../pages/DeliveryPage";
import TestSidebar from "../pages/TestSidebar";
import TableExamplePage from "../pages/TableExamplePage";

const routes = [
  { path: "/", element: <Login />, isProtected: false },
  { path: "/example", element: <ExamplePage />, isProtected: false },
  { path: "/home", element: <Home />, isProtected: true },
  { path: "/dashboard", element: <Dashboard />, isProtected: true },
  { path: "/settings", element: <Settings />, isProtected: true },
  { path: "/profile", element: <Profile />, isProtected: true },
  { path: "/table", element: <UsersPage />, isProtected: true },
  { path: "/table-example", element: <TableExamplePage />, isProtected: false },
  { path: "/test", element: <Test />, isProtected: false },
  { path: "/delivery", element: <DeliveryPage />, isProtected: false },
  { path: "/test-sidebar", element: <TestSidebar />, isProtected: false },
  { path: "*", element: <NotFound />, isProtected: false },
];

export default routes;
