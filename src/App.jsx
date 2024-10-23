import { ThemeProvider } from "@mui/material/styles";
import axios from "axios";
import { useContext, useEffect, useState, Suspense, lazy } from "react";
import { Toaster } from "react-hot-toast";
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import Footer from "./components/Footer";
import Header from "./components/Header";
import { Context } from "./main";
import { darkTheme, lightTheme } from "./theme";
import Loader from "./styles/Loader";

const Favorites = lazy(() => import("./pages/Favorites"));
const Home = lazy(() => import("./pages/Home"));
const Notes = lazy(() => import("./pages/Notes"));
const Notfound = lazy(() => import("./pages/Notfound"));
const Login = lazy(() => import("./pages/auth/Login"));
const Signup = lazy(() => import("./pages/auth/Signup"));
const ForgotPassword = lazy(() => import("./pages/auth/ForgotPassword"));
const ResetPassword = lazy(() => import("./pages/auth/ResetPassword"));
const NoteForm = lazy(() => import("./forms/NoteForm"));
const ViewNote = lazy(() => import("./pages/ViewNote"));
const EditNote = lazy(() => import("./pages/EditNote"));
const About = lazy(() => import("./pages/About"));

const App = () => {
  const { isAuthorized, setIsAuthorized, setUser } = useContext(Context);

  const [loading, setLoading] = useState(true);
  const [darkMode, setDarkMode] = useState(() => {
    const savedTheme = localStorage.getItem("theme");
    return savedTheme === "dark" ? true : false;
  });

  useEffect(() => {
    localStorage.setItem("theme", darkMode ? "dark" : "light");
  }, [darkMode]);

  if (typeof global === "undefined") {
    window.global = window;
  }

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const token = localStorage.getItem("token");

        if (!token) {
          setIsAuthorized(false);
          setLoading(false);
          return;
        }
        const response = await axios.get(
          "https://chambray-warp-runner.glitch.me/api/user/current",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
            withCredentials: true,
          }
        );
        setUser(response.data.user);
        setIsAuthorized(true);
      } catch (error) {
        setIsAuthorized(false);
        setUser({});
        console.error("Fetch user error:", error?.response?.data?.error);
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, [setIsAuthorized, setUser]);

  if (loading) {
    return (
      <div>
        <Loader />
      </div>
    );
  }

  return (
    <ThemeProvider theme={darkMode ? darkTheme : lightTheme}>
      <BrowserRouter>
        <Header
          handleThemeToggle={() => setDarkMode((prev) => !prev)}
          darkMode={darkMode}
        />
        <Suspense fallback={<Loader />}>
          <Routes>
            <Route
              path="/"
              element={
                isAuthorized ? (
                  <Home darkMode={darkMode} />
                ) : (
                  <Navigate to={"/login"} />
                )
              }
            />
            <Route path="/about" element={<About darkMode={darkMode} />} />
            <Route
              path="/signup"
              element={
                !isAuthorized ? (
                  <Signup darkMode={darkMode} />
                ) : (
                  <Navigate to={"/"} />
                )
              }
            />
            <Route
              path="/login"
              element={
                !isAuthorized ? (
                  <Login darkMode={darkMode} />
                ) : (
                  <Navigate to={"/"} />
                )
              }
            />
            <Route
              path="/notes"
              element={
                isAuthorized ? (
                  <Notes darkMode={darkMode} />
                ) : (
                  <Navigate to={"/login"} />
                )
              }
            />
            <Route
              path="/create"
              element={
                isAuthorized ? (
                  <NoteForm darkMode={darkMode} />
                ) : (
                  <Navigate to={"/login"} />
                )
              }
            />
            <Route
              path="/edit/:id"
              element={
                isAuthorized ? (
                  <EditNote darkMode={darkMode} />
                ) : (
                  <Navigate to={"/login"} />
                )
              }
            />
            <Route
              path="/favorites"
              element={
                isAuthorized ? (
                  <Favorites darkMode={darkMode} />
                ) : (
                  <Navigate to={"/login"} />
                )
              }
            />
            <Route
              path="/note/:id"
              element={isAuthorized ? <ViewNote /> : <Navigate to={"/login"} />}
            />
            <Route
              path="/forgot-password"
              element={<ForgotPassword darkMode={darkMode} />}
            />
            <Route
              path="/reset-password/:token"
              element={<ResetPassword darkMode={darkMode} />}
            />
            <Route path="*" element={<Notfound darkMode={darkMode} />} />
          </Routes>
        </Suspense>
        <Footer darkMode={darkMode} />
      </BrowserRouter>
      <Toaster />
    </ThemeProvider>
  );
};

export default App;
