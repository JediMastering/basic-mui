import Login from "../pages/Login";
import NotFound from "../components/NotFound";
import ExamplePage from "../pages/ExamplePage";
import UsersCrudPage from "../pages/users/UsersCrudPage";

const routes = [
  { path: "/", element: <Login />, isProtected: false },
  { path: "/example", element: <ExamplePage />, isProtected: true },
  { path: "/users-crud", element: <UsersCrudPage />, isProtected: true },
  { path: "*", element: <NotFound />, isProtected: false },
];

export default routes;
