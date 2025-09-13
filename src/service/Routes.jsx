import Login from "../pages/Login";
import NotFound from "../components/NotFound";
import ExamplePage from "../pages/ExamplePage";
import UsersCrudPage from "../pages/users/UsersCrudPage";
import AccessGroupCrudPage from "../pages/access-groups/AccessGroupCrudPage";

const routes = [
  { path: "/", element: <Login />, isProtected: false },
  { path: "/example", element: <ExamplePage />, isProtected: true },
  { path: "/users-crud", element: <UsersCrudPage />, isProtected: true },
  { path: "/access-groups-crud", element: <AccessGroupCrudPage />, isProtected: true },
  { path: "*", element: <NotFound />, isProtected: false },
];

export default routes;
