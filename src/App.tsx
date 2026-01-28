import { QueryClient } from "@tanstack/react-query";
import { createAsyncStoragePersister } from "@tanstack/query-async-storage-persister";

import "./App.css";
import { BrowserRouter, Route, Routes, useNavigate } from "react-router";
import { routes } from "./routes";
import { Header } from "./components/Header/Header";
import { PersistQueryClientProvider } from "@tanstack/react-query-persist-client";
import { useEffect } from "react";
import { getSpaceToken } from "./services/token";
import { ThemeProvider } from "./theme";
import { BackLink } from "./components/BackLink/BackLink";
import { UiProvider } from "./ui";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 60 * 24, // 24 hours
    },
  },
});

// This code is only for TypeScript
declare global {
  interface Window {
    __TANSTACK_QUERY_CLIENT__: import("@tanstack/query-core").QueryClient;
  }
}

// This code is for all users
window.__TANSTACK_QUERY_CLIENT__ = queryClient;

const persister = createAsyncStoragePersister({
  // storage: window.localStorage,
  storage: null,
});

function Redirect() {
  const navigate = useNavigate();
  useEffect(() => {
    const spaceToken = getSpaceToken();
    if (!spaceToken) {
      persister.removeClient();
      navigate("/");
    }
  }, []);
  return null;
}

function App() {
  return (
    <ThemeProvider>
      <PersistQueryClientProvider
        client={queryClient}
        persistOptions={{ persister }}
      >
        <BrowserRouter>
          <UiProvider>
            <Header />
            <Redirect />
            <Routes>
              {routes.map((route, index) => (
                <Route key={index} path={route.path} element={route.element} />
              ))}
            </Routes>
          </UiProvider>
        </BrowserRouter>
      </PersistQueryClientProvider>
    </ThemeProvider>
  );
}

export default App;
