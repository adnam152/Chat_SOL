import { Navigate, Route, Routes } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import axios from 'axios';

import LoginPage from "./pages/auth/LoginPage";
import HomePage from "./pages/home/HomePage";
import SignupPage from "./pages/auth/SignupPage";

import { useAuthContext } from "./contextProvider/useAuthContext";
import { useEffect } from "react";
import authAPI from "./API/auth";

export default function App() {
  axios.defaults.withCredentials = true;
  const {authUser, setAuthUser} = useAuthContext();
  const {checkLogin} = authAPI();

  useEffect(() => {
    checkLogin()
      .catch(error => {
        console.log(error);
        setAuthUser(null);
      });
  }, []);

  return (
    <div className="p-4 flex items-center justify-center h-screen text-gray-200">
      <Routes>

        <Route path="/" element={authUser ? <HomePage /> : <Navigate to={'/login'} />} />
        <Route path="/login" element={authUser ? <Navigate to={'/'} /> : <LoginPage />} />
        <Route path="/signup" element={authUser ? <Navigate to={'/'} /> : <SignupPage />} />

      </Routes>
      <Toaster />
      {/* {loading && <Loading />} */}
    </div>
  )
}