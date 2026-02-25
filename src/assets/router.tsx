import { createBrowserRouter } from "react-router";

//Pages
import Home from "../pages/Home";

//Documentation
import Documentation from "../pages/docs/Documentation";

const router = createBrowserRouter(
    [
        {
            path: "/",
            element: <Home />,
        },
        {
            path: "/documentation",
            element: <Documentation />,
        }
    ]
);

export default router;