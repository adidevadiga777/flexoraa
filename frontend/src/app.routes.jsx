import { createBrowserRouter } from "react-router";
import Register from "./features/auth/pages/Register";
import Login from "./features/auth/pages/Login";
import Protected from "./features/auth/components/Protected";
import Home from "./Home";
import PortfolioPage from "./pages/PortfolioPage";
import PaymentPage from "./pages/PaymentPage";
import SuccessPage from "./pages/SuccessPage";

export const router = createBrowserRouter([
    {
        path: "/",
        element: <Protected><Home /></Protected>
    },
    {
        path: "/register",
        element: <Register />
    },
    {
        path: "/login",
        element: <Login />
    },
    {
        path: "/me",
        element: <Protected><Home /></Protected>
    },
    {
        path: "/portfolio/:slug",        // ADD THIS
        element: <PortfolioPage />         // no <Protected> wrapper — public route
    },
    {
        path: "/payment",
        element: <Protected><PaymentPage /></Protected>
    },
    {
        path: "/success",
        element: <Protected><SuccessPage /></Protected>
    }
])

