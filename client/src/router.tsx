import { createBrowserRouter } from "react-router-dom";
import HomePage from "./pages/HomePage";
import Layout from "./pages/Layout";
import AuthPage from "./pages/AuthPage";
import AuthWrapper from "./context/AuthWrapper";



const router = createBrowserRouter([
    {
        path: '/',
        element: <Layout />,
        children: [
            {
                element: <AuthWrapper />, // Protect routes
                children: [
                    { index: true, element: <HomePage /> }
                ],
            },
            { path: '/login', element: <AuthPage /> }, // Public route
        ]

    }
])



export default router;