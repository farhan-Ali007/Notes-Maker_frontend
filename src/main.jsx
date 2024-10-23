import { CssBaseline } from "@mui/material";
import { createContext, useState } from "react";
import { createRoot } from "react-dom/client";
import App from "./App.jsx";
import "./index.css";

export const Context = createContext({
  isAuthorized: false,
  setIsAuthorized: () => {},
  user: {},
  setUser: () => {},
  searchQuery: "",
  setSearchQuery: () => {},
});

const AppWrapper = () => {
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [user, setUser] = useState({});
  const [searchQuery, setSearchQuery] = useState("");
  // console.log("🚀 ~ AppWrapper ~ user:", user)

  return (
    <Context.Provider
      value={{
        isAuthorized,
        setIsAuthorized,
        user,
        setUser,
        searchQuery,
        setSearchQuery,
      }}
    >
      <CssBaseline>
        <App />
      </CssBaseline>
    </Context.Provider>
  );
};

const container = document.getElementById("root");
const root = createRoot(container);
root.render(<AppWrapper />);
