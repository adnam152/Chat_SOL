import { Navigate, Route, Routes } from "react-router-dom";
import axios from 'axios';
import 'react-toastify/dist/ReactToastify.css';

import LoginPage from "./pages/auth/LoginPage";
import HomePage from "./pages/home/HomePage";

import { useEffect, useRef } from "react";
import authService from "./services/authService";
import Loading from "./components/Loading";
import { useLoaderStore } from "./store/useLoaderStore";
import { ToastContainer } from "react-toastify";
import { useAuthStore } from "./store/useAuthStore";
import { useModalStore } from "./store/useModalStore";
import { useSocketStore } from "./store/useSocketStore";
import { useGameStore } from "./store/useGameStore";
import GamePlay from "./components/GamePlay";

// axios.defaults.baseURL = 'http://localhost:5000';
axios.defaults.withCredentials = true;
axios.defaults.timeout = 3000;

export default function App() {
  const { checkLogin } = authService();
  const isLoading = useLoaderStore(state => state.isLoading);
  const setLoading = useLoaderStore(state => state.setLoading);
  const authUser = useAuthStore(state => state.authUser);
  const setAuthUser = useAuthStore(state => state.setAuthUser);
  const modalRef = useRef(null);
  const isModalOpen = useModalStore(state => state.isModalOpen);
  const modalContent = useModalStore(state => state.modalContent);
  const closeModal = useModalStore(state => state.closeModal);
  const connectSocket = useSocketStore(state => state.connectSocket);
  const disconnectSocket = useSocketStore(state => state.disconnectSocket);
  const isShowGame = useGameStore(state => state.isShowGame);
  const game = useGameStore(state => state.game);

  // Check login
  useEffect(() => {
    (async () => {
      setLoading(true);
      try {
        const res = await checkLogin();
        if (!res?.data) throw new Error(res.message);
        setAuthUser(res.data);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  useEffect(() => {
    isModalOpen ? modalRef.current.showModal() : modalRef.current.close();
  }, [isModalOpen]);

  // Socket
  useEffect(() => {
    authUser ? connectSocket(authUser._id) : disconnectSocket();
  }, [authUser]);

  return (
    <div className="p-4 flex items-center justify-center h-screen text-gray-200">
      <Routes>

        <Route path="/" element={authUser ? <HomePage /> : <Navigate to={'/login'} />} />
        <Route path="/login" element={authUser ? <Navigate to={'/'} /> : <LoginPage />} />

      </Routes>

      <ToastContainer />

      {game && isShowGame && (<GamePlay game={game} key={game._id} />)}
      {/* <GamePlay /> */}

      {isLoading && (<Loading />)}

      <dialog id="my_modal_2" className="modal text-neutral" ref={modalRef} onClose={closeModal}>
        <div className="modal-box w-max max-w-max">
          {modalContent}
        </div>
        <form method="dialog" className="modal-backdrop">
          <button>close</button>
        </form>
      </dialog>
    </div>
  )
}