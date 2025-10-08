import Login from "../pages/Login";
import NotFound from "../components/NotFound";
import ExamplePage from "../pages/ExamplePage";
import UsersCrudPage from "../pages/users/UsersCrudPage";
import AccessGroupCrudPage from "../pages/access-groups/AccessGroupCrudPage";
import ForgotPassword from "../pages/auth/ForgotPassword"; // New import
import ResetPassword from "../pages/auth/ResetPassword";   // New import
import { CategoryListPage } from '../modules/category';

const routes = [
  { path: "/", element: <Login />, isProtected: false },
  { path: "/forgot-password", element: <ForgotPassword />, isProtected: false }, // New route
  { path: "/reset-password", element: <ResetPassword />, isProtected: false },   // New route
  { path: "/example", element: <ExamplePage />, isProtected: true },
  { path: "/users-crud", element: <UsersCrudPage />, isProtected: true },
  { path: "/access-groups-crud", element: <AccessGroupCrudPage />, isProtected: true },
  { path: "/categories", element: <CategoryListPage />, isProtected: true },
  { path: "*", element: <NotFound />, isProtected: false },
];

export default routes;
