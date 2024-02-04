import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

const LoginForm = () => {
  const navigate = useNavigate();

  const apiPort = process.env.REACT_APP_API_PORT;
  const apiHost = process.env.REACT_APP_API_HOST;
  const authRoute = process.env.REACT_APP_AUTH_ROUTE;
  const loginRoute = process.env.REACT_APP_LOGIN_ROUTE;

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');


  const handleSubmit = async (event) => {

    event.preventDefault();
    console.log(`Email: ${email} Password: ${password}`);

    try {

        const response = await fetch(`${apiHost}${apiPort}${authRoute}${loginRoute}`, {
          method: 'POST',
          headers: {
              'Content-Type': 'application/json',
          },
          body: JSON.stringify({ email, password }),
        });

        // console.log('response:', response);

        if (response.status === 200) {

          const data = await response.json();
          const refresh_token = data?.tokens?.refresh?.token;
          const userEmail = data?.user?.email;
          const username = data?.user?.name;

          localStorage.setItem('userEmail', userEmail);
          localStorage.setItem('refresh_token', refresh_token);
          localStorage.setItem('username', username);

          navigate('/email-page');
          toast.success('User registered successfully');

        } else {

          console.error('User registration failed');
          toast.error('User registration failed');

        }

    } catch (error) {

      console.error('An error occurred while processing the login:', error);
      toast.error('An error occurred during logging in');

    }

  };
  

  return (
    <div className='flex flex-col h-screen bg-gray-300'>

      <div className='text-4xl text-center mb-3 mt-3 text-blue-700 font-bold'>
        Login Form
      </div>

      <div className='flex-grow flex items-center justify-center'>

        <form
          onSubmit={handleSubmit}
          className='bg-white p-8 rounded shadow-md w-96'
        >
          <div className='mb-4'>
            <label htmlFor='email' className='block text-sm font-semibold text-gray-700 mb-1'>
              Email:
            </label>
            <input
              type='text'
              id='email'
              name='email'
              className='mt-1 p-2 border border-black rounded w-full focus:outline-none focus:border-blue-500 bg-gray-200'
              onChange={(event) => setEmail(event.target.value)}
              required
            />
          </div>

          <div className='mb-4'>
            <label htmlFor='password' className='block text-sm font-semibold text-gray-700 mb-1'>
              Password:
            </label>
            <input
              type='password'
              id='password'
              name='password'
              className='mt-1 p-2 border border-black rounded w-full focus:outline-none focus:border-blue-500  bg-gray-200'
              onChange={(event) => setPassword(event.target.value)}
              required
            />
          </div>

          <div className='flex justify-center'>
            <button
              type='submit'
              className='px-4 py-2 text-white bg-blue-500 rounded hover:bg-blue-600 focus:outline-none focus:shadow-outline-blue'
            >
              Login
            </button>
          </div>


          <div className='mt-4 text-center'>
            <p className='text-gray-700'>
              Not registered?{' '}
              <span
                onClick={() => {
                    navigate('/signup');
                }}
                className='text-blue-500 cursor-pointer hover:underline'
              >
                Register here
              </span>
            </p>
          </div>

        </form>

      </div>
    </div>
  );
};

export default LoginForm;
