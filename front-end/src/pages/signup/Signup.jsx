import React from 'react'
import { Link } from 'react-router-dom'
import { useState } from 'react'
import useSignUp from '../../hooks/useSignUp.js'
import { useAuthContext } from '../../context/AuthContext.jsx'

function Signup() {
    const { authUser, setAuthUser } = useAuthContext();
    const [inputs, setInputs] = useState({
        fullname: '',
        gender: 'female',
        username: '',
        password: '',
        confirmPassword: ''
    })

    const handleSubmit = async (e) => {
        e.preventDefault();
        const signUp = useSignUp(setAuthUser);
        await signUp(inputs);
    }

    return (
        <div className="w-96 bg-gray-300 rounded-md bg-clip-padding backdrop-filter backdrop-blur-lg bg-opacity-10 p-5 ">
            <h1 className='font-semibold p-4 text-3xl text-center'>
                Sign Up <span className='text-blue-500'>Chat App</span>
            </h1>
            <form action="" onSubmit={handleSubmit}>
                <div className='mt-2'>
                    <label htmlFor="fullname" className='label px-2 py-1'>Full Name</label>
                    <input type="text" id='fullname' placeholder='Enter Fullname' className='input input-bordered w-full h-10 bg-black bg-opacity-70'
                        value={inputs.fullname}
                        onChange={(e) => setInputs({ ...inputs, fullname: e.target.value })}
                    />
                </div>

                <div className='mt-2'>
                    <label htmlFor="gender" className='label px-2 py-1'>Gender</label>
                    <select name="" id="gender" className='select w-full h-10 min-h-10 bg-black bg-opacity-70'
                        value={inputs.gender}
                        onChange={(e) => setInputs({ ...inputs, gender: e.target.value })}
                    >
                        <option value="male">Male</option>
                        <option value="female">Female</option>
                    </select>
                </div>

                <div className='mt-2'>
                    <label htmlFor="username" className='label px-2 py-1'>Username</label>
                    <input type="text" id='username' placeholder='Enter Username' className='input input-bordered w-full h-10 bg-black bg-opacity-70'
                        value={inputs.username}
                        onChange={(e) => setInputs({ ...inputs, username: e.target.value })}
                    />
                </div>

                <div className='mt-2'>
                    <label htmlFor="password" className='label px-2 py-1'>Password</label>
                    <input type="password" id='password' placeholder='Enter Password' className='input input-bordered w-full h-10 bg-black bg-opacity-70'
                        value={inputs.password}
                        onChange={(e) => setInputs({ ...inputs, password: e.target.value })}
                        autoComplete='off'
                    />
                </div>

                <div className='mt-2'>
                    <label htmlFor="confirmPassword" className='label px-2 py-1'>Confirm Password</label>
                    <input type="password" id='confirmPassword' placeholder='Enter Confirm Password' className='input input-bordered w-full h-10 bg-black bg-opacity-70'
                        value={inputs.confirmPassword}
                        onChange={(e) => setInputs({ ...inputs, confirmPassword: e.target.value })}
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

export default Signup