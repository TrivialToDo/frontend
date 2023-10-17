import React, { useState } from "react";
import ReactDOM from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { Self } from "./data/interface";
import { StateProvider } from "./state";
import { Home, Login, Schedule } from "./pages";
import { NoSchedule, NotFound } from "./pages/Error";

const readSelf = (): Self | null => {
  const self = localStorage.getItem("self");

  if (self === null) {
    return null;
  }

  return JSON.parse(self);
};

const App = () => {
  const [self, rawSetSelf] = useState(readSelf());

  const setSelf = (self: Self | null) => {
    if (self === null) {
      localStorage.removeItem("self");
    } else {
      localStorage.setItem("self", JSON.stringify(self));
    }

    rawSetSelf(self);
  };

  const router = createBrowserRouter([
    {
      path: "/",
      element: <Home.Page />,
    },
    {
      path: "/login",
      element: <Login.Page />,
      // loader: () => Login.loader(self),
    },
    {
      path: "/schedule",
      element: <Schedule.Page />,
      errorElement: <NoSchedule />,
    },
    {
      path: "*",
      element: <NotFound />,
    },
  ]);

  return (
    <React.StrictMode>
      <StateProvider self={self} setSelf={setSelf}>
        <RouterProvider router={router} />
      </StateProvider>
    </React.StrictMode>
  );
};

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(<App />);
