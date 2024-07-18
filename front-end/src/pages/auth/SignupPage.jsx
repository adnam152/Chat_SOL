import React, { useState } from 'react';
import toast from 'react-hot-toast';
import { Link } from 'react-router-dom';
import authAPI from '../../API/auth';
import { useAuthContext } from '../../contextProvider/useAuthContext';

function SignupPage() {
    const [inputs, setInputs] = useState({ fullname: '', gender: 'male', username: '', password: '', confirmPassword: '' });
    const { signup } = authAPI();
    const { setAuthUser } = useAuthContext();

    // Event Handlers
    const onInputChange = (e) => {
        setInputs((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    }
    const onSubmitForm = async (e) => {
        e.preventDefault();
        if (!validate(inputs)) return;
        try {
            const res = await signup(inputs);
            if (res) {
                toast.success('Signup successfully');
                const user = res.user;
                setAuthUser(user);
            }
        } catch (error) {
            toast.error(error.response.data.message || 'Signup failed');
        }
    }

    return (
        <div className="w-96 bg-gray-300 rounded-md bg-clip-padding backdrop-filter backdrop-blur-lg bg-opacity-10 p-5 ">
            <h1 className='font-semibold p-4 text-3xl text-center'>
                Sign Up <span className='text-blue-500'>Chat App</span>
            </h1>
            <form action="" method='post'
                onSubmit={onSubmitForm}
            >
                <div className='mt-2'>
                    <label htmlFor="fullname" className='label px-2 py-1'>Full Name</label>
                    <input type="text" id='fullname' placeholder='Enter Fullname' className='input input-bordered w-full h-10 bg-black bg-opacity-70'
                        value={inputs.fullname} name='fullname'
                        onChange={onInputChange}
                    />
                </div>

                <div className='mt-2'>
                    <label htmlFor="gender" className='label px-2 py-1'>Gender</label>
                    <select id="gender" className='select w-full h-10 min-h-10 bg-black bg-opacity-70'
                        value={inputs.gender} name='gender'
                        onChange={onInputChange}
                    >
                        <option value="male">Male</option>
                        <option value="female">Female</option>
                    </select>
                </div>

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
                        value={inputs.password} name='password'
                        onChange={onInputChange}
                        autoComplete='off'
                    />
                </div>

                <div className='mt-2'>
                    <label htmlFor="confirmPassword" className='label px-2 py-1'>Confirm Password</label>
                    <input type="password" id='confirmPassword' placeholder='Enter Confirm Password' className='input input-bordered w-full h-10 bg-black bg-opacity-70'
                        value={inputs.confirmPassword} name='confirmPassword'
                        onChange={onInputChange}
                        autoComplete='off'
                    />
                </div>

                <div className='mt-5 mb-2'>
                    <button className='btn w-full min-h-10 h-10'>Sign Up</button>
                </div>
                <Link to='/login' className='text-sm hover:underline hover:text-blue-500'>Already have an account? Login here.</Link>
            </form>
        </div>
    )
}

export default SignupPage

function validate({ username, password, confirmPassword, fullname, gender }) {
    if (!username || !password || !confirmPassword || !fullname || !gender) {
        toast.error('All fields are required');
        return false;
    }
    if (password !== confirmPassword) {
        toast.error('Password does not match');
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