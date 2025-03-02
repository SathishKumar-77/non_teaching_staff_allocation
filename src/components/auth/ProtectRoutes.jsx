import { Navigate, Outlet, useLocation } from "react-router-dom";

const ProtectedRoute = ({ allowedRoles }) => {
  const user = JSON.parse(localStorage.getItem("user"));
  const location = useLocation();

  // List of public routes that anyone can visit (even without login)
  const publicRoutes = ["/", "/login", "/job_application"];

  // Allow access to public routes for everyone
  if (publicRoutes.includes(location.pathname)) {
    return <Outlet />;
  }

  // If no user is logged in, redirect to login page
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // If logged-in user doesn't have permission for the route, redirect to home
  if (!allowedRoles.includes(user.role)) {
    return <Navigate to="/" replace />;
  }

  return <Outlet />;
};

export default ProtectedRoute;
