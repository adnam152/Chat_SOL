import React from 'react'

function Signup() {
    return (
        <div className="w-96 bg-gray-300 rounded-md bg-clip-padding backdrop-filter backdrop-blur-lg bg-opacity-10 p-5 ">
            <h1 className='font-semibold p-4 text-3xl text-center'>
                Sign Up <span className='text-blue-500'>Chat App</span>
            </h1>
            <form action="">
                <div className='mt-2'>
                    <label htmlFor="fullname" className='label px-2 py-1'>Full Name</label>
                    <input type="text" id='fullname' placeholder='Enter Fullname' className='input input-bordered w-full h-10 bg-black bg-opacity-70' />
                </div>

                <div className='mt-2'>
                    <label htmlFor="gender" className='label px-2 py-1'>Gender</label>
                    <select name="" id="gender" className='select w-full h-10 min-h-10 bg-black bg-opacity-70'>
                        <option value="male">Male</option>
                        <option value="female">Female</option>
                    </select>
                </div>

                <div className='mt-2'>
                    <label htmlFor="username" className='label px-2 py-1'>Username</label>
                    <input type="text" id='username' placeholder='Enter Username' className='input input-bordered w-full h-10 bg-black bg-opacity-70' />
                </div>

                <div className='mt-2'>
                    <label htmlFor="password" className='label px-2 py-1'>Password</label>
                    <input type="password" id='password' placeholder='Enter Password' className='input input-bordered w-full h-10 bg-black bg-opacity-70' />
                </div>

                <div className='mt-2'>
                    <label htmlFor="confirmPassword" className='label px-2 py-1'>Confirm Password</label>
                    <input type="password" id='confirmPassword' placeholder='Enter Confirm Password' className='input input-bordered w-full h-10 bg-black bg-opacity-70' />
                </div>

                <div className='mt-5 mb-2'>
                    <button type='button' className='btn w-full min-h-10 h-10'>Sign Up</button>
                </div>
                <a href="#" className='text-sm hover:underline hover:text-blue-500'>Already have an account? Login here.</a>
            </form>
        </div>
    )
}

export default Signup