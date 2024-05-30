import { Navigate, Route, Routes } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import axios from 'axios';
import { useEffect } from "react";

import { useAuthContext } from "./context/AuthContext";
import { useLoadingContext } from "./context/LoadingContext";
import authModel from "./models/auth.model";

import LoginElement from "./pages/LoginElement";
import SignupElement from './pages/SignupElement';
import HomeElement from "./pages/HomeElement";
import Loading from "./components/loading/Loading";

export default function App() {
  const { authUser, setAuthUser } = useAuthContext();
  const { loading } = useLoadingContext();
  axios.defaults.withCredentials = true;

  // Check if the user is not logged in when the app starts 
  useEffect(()=>{
    authModel.checkLogin()
    .catch(err => {
        setAuthUser(null);
      })
  },[])

  return (
    <div className="p-4 flex items-center justify-center h-screen text-gray-200">
      <Routes>
        <Route path="/" element={authUser ? <HomeElement /> : <Navigate to={'/login'} />} />
        <Route path="/login" element={authUser ? <Navigate to={'/'} /> : <LoginElement />} />
        <Route path="/signup" element={authUser ? <Navigate to={'/'} /> : <SignupElement />} />
      </Routes>
      <Toaster />
      {loading && <Loading />}
    </div>
  )
}