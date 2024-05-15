import Login from "./pages/login/Login"
import Signup from './pages/signup/Signup'
import Home from "./pages/home/Home"

export default function App() {
  return (
    <>
      <div className="p-4 flex items-center justify-center h-screen text-gray-200">
        <Home />
      </div>

      {/* <div role="alert" className="alert alert-warning fixed top-4 end-4 w-auto">
        <svg xmlns="http://www.w3.org/2000/svg" className="stroke-current shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
        <span>Your purchase has been confirmed!</span>
      </div> */}
    </>
    
    
  )
}