import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

import "./App.css";
import { BrowserRouter, Route, Routes } from "react-router";
import { routes } from "./routes";

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <Routes>
          {routes.map((route, index) => (
            <Route key={index} path={route.path} element={route.element} />
          ))}
        </Routes>
      </BrowserRouter>
    </QueryClientProvider>
  );
}

export default App;
