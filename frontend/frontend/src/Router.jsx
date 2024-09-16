import { createBrowserRouter, Navigate } from "react-router-dom";
import { Explorer } from "./Pages/Explorer";
import { Home } from "./Pages/Home";
import { Layout } from "./Pages/Layout";
import { Mine } from "./Pages/Mine";
import { NotFound } from "./Pages/NotFound";
import { Transact } from "./Pages/Transact";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <Navigate to="/gochain/home" replace />,
  },
  {
    path: "/gochain/",
    element: <Layout />,
    errorElement: <NotFound />,
    children: [
      {
        index: true,
        element: <Home />
      },
      {
        path: "home",
        element: <Home />
      },
      {
        path: "transact",
        element: <Transact />
      },
      {
        path: "mine",
        element: <Mine />
      },
      {
        path: "explorer",
        element: <Explorer />
      }
    ],
  },
]);