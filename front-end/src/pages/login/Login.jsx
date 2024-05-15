import React from 'react'

function Login() {
    return (
        <div className="w-96 bg-gray-300 rounded-md bg-clip-padding backdrop-filter backdrop-blur-lg bg-opacity-10 p-5 ">
            <h1 className='font-semibold p-4 text-3xl text-center'>
                Login <span className='text-blue-500'>Chat App</span>
            </h1>
            <form action="">
                <div className='mt-2'>
                    <label htmlFor="username" className='label px-2 py-1'>Username</label>
                    <input type="text" id='username' placeholder='Enter Username' className='input input-bordered w-full h-10 bg-black bg-opacity-70' />
                </div>

                <div className='mt-2'>
                    <label htmlFor="password" className='label px-2 py-1'>Password</label>
                    <input type="password" id='password' placeholder='Enter Password' className='input input-bordered w-full h-10 bg-black bg-opacity-70' />
                </div>

                <div className='mt-5 mb-2'>
                    <button type='button' className='btn w-full min-h-10 h-10'>Login</button>
                </div>
                <a href="#" className='text-sm hover:underline hover:text-blue-500'>Don't have account? Register here</a>
            </form>
        </div>
    )
}

export default Login