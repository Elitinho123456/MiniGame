import { createBrowserRouter } from "react-router";

//Pages
import Home from "../pages/Home";

const router = createBrowserRouter(
    [
        {
            path: "/",
            element: Home(),
        }
    ]
);

export default router;