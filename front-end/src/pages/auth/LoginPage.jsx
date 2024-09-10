import { useState } from "react";
import { Link } from "react-router-dom";
import { toast } from "react-hot-toast";
import authAPI from "../../API/auth";
import { useAuthContext } from "../../contextProvider/useAuthContext";

export default function LoginPage() {
    const [inputs, setInputs] = useState({ username: '', password: '' });
    const { login } = authAPI();
    const { setAuthUser } = useAuthContext();

    // Event Handlers
    const onInputChange = (e) => {
        setInputs((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    }
    const onSubmitForm = async (e) => {
        e.preventDefault();
        if (!validate(inputs)) return;
        try {
            const res = await login(inputs);
            if (!res.user) {
                throw new Error(res.message);
            }
            setAuthUser(res.user);
            toast.success('Login successful');
        } catch (error) {
            toast.error(error.response.data.message || error.message || 'Login fail');
        }
    }

    return (
        <div className="w-96 bg-gray-300 rounded-md bg-clip-padding backdrop-filter backdrop-blur-lg bg-opacity-10 p-5 ">
            <h1 className='font-semibold p-4 text-3xl text-center'>
                Login <span className='text-blue-500'>Chat App</span>
            </h1>
            <form action="" onSubmit={onSubmitForm}>
                <div className='mt-2'>
                    <label htmlFor="username" className='label px-2 py-1'>Username</label>
                    <input type="text" id='username' placeholder='Enter Username' className='input input-bordered w-full h-10 bg-black bg-opacity-70'
                        value={inputs.username} name='username'
                        onChange={onInputChange}
                    />
                </div>

                <div className='mt-2'>
                    <label htmlFor="password" className='label px-2 py-1'>Password</label>
                    <input type="password" id='password' placeholder='Enter Password' className='input input-bordered w-full h-10 bg-black bg-opacity-70'
                        autoComplete='off'
                        value={inputs.password} name='password'
                        onChange={onInputChange}
                    />
                </div>

                <div className='mt-5 mb-2'>
                    <button className='btn w-full min-h-10 h-10'>Login</button>
                </div>
                <Link to="/signup" className='text-sm hover:underline hover:text-blue-500'>Don't have account? Register here</Link>
            </form>
        </div>
    )
}

function validate({ username, password }) {
    if (username.trim() === '' || password.trim() === '') {
        toast.error('Please fill all fields');
        return false;
    }
    if (username.length < 3) {
        toast.error('Username must be at least 4 characters');
        return false;
    }
    if (password.length < 6) {
        toast.error('Password must be at least 6 characters');
        return false;
    }
    return true;
}