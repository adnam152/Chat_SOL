import React from 'react'
import { Link } from 'react-router-dom'
import { useState } from 'react'
import toast from 'react-hot-toast';
import authModels from '../../models/auth.model.js';
import { useAuthContext } from '../../context/AuthContext.jsx';

function Login() {
    const [user, setUser] = useState({ username: '', password: '' });
    const { setAuthUser } = useAuthContext();

    // Event handler for login
    const login = async (e) => {
        e.preventDefault();
        if(!validate(user)) return;

        try {
            const res = await authModels.login(user);
            if(res.status === 200){
                const user = res.data.user;
                // Save user data to local storage
                localStorage.setItem('auth-user', JSON.stringify(user));
                // Set user data to context
                setAuthUser(user);
                toast.success(res.data.message);
            }
        } 
        catch (error) {
            toast.error(error.response.data.message)
        }

    }
    return (
        <div className="w-96 bg-gray-300 rounded-md bg-clip-padding backdrop-filter backdrop-blur-lg bg-opacity-10 p-5 ">
            <h1 className='font-semibold p-4 text-3xl text-center'>
                Login <span className='text-blue-500'>Chat App</span>
            </h1>
            <form action="" onSubmit={login}>
                <div className='mt-2'>
                    <label htmlFor="username" className='label px-2 py-1'>Username</label>
                    <input type="text" id='username' placeholder='Enter Username' className='input input-bordered w-full h-10 bg-black bg-opacity-70' 
                        value={user.username}
                        onChange={(e) => setUser({...user, username: e.target.value})}
                    />
                </div>

                <div className='mt-2'>
                    <label htmlFor="password" className='label px-2 py-1'>Password</label>
                    <input type="password" id='password' placeholder='Enter Password' className='input input-bordered w-full h-10 bg-black bg-opacity-70'
                        autoComplete='off'
                        value={user.password}
                        onChange={(e) => setUser({...user, password: e.target.value})}
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

export default Login

function validate({username, password}) {
    if(username.trim() === '' || password.trim() === '') {
        toast.error('Please fill all fields');
        return false;
    }
    if(username.length < 3) {
        toast.error('Username must be at least 3 characters');
        return false;
    }
    if(password.length < 6) {
        toast.error('Password must be at least 6 characters');
        return false;
    }
    return true;
}