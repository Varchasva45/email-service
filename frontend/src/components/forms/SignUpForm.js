import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

const SignUpForm = () => {
  const navigate = useNavigate();

  const apiPort = process.env.REACT_APP_API_PORT;
  const apiHost = process.env.REACT_APP_API_HOST;
  const authRoute = process.env.REACT_APP_AUTH_ROUTE;
  const registrationRoute = process.env.REACT_APP_REGISTRATION_ROUTE;
  const verifcationRoute = process.env.REACT_APP_VERIFICATION_ROUTE;
  const confirmationRoute = process.env.REACT_APP_CONFIRMATION_ROUTE;
  
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [otp, setOtp] = useState('');

  const handleSubmit = async (event) => {

    event.preventDefault();
    console.log(`Name: ${name} Email: ${email} Password: ${password}`);
  
    try {

      const response = await fetch(`${apiHost}${apiPort}${authRoute}${registrationRoute}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name, email, password }),
      });

      // console.log('response:', response);
  
      if (response.status === 201) {

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

      console.error('An error occurred while processing the registration:', error);
      toast.error('An error occurred during registration');

    }
  };


  const sendOtp = async (event) => {
    event.preventDefault();
    console.log(`Email: ${email}`);
  
    try {
      const response = await fetch(`${apiHost}${apiPort}${confirmationRoute}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      });
  
      if (response.status !== 201) {
        console.error('User registration failed');
        toast.error('User registration failed');
      }else {
        toast.success('OTP sent successfully');
      }
    } catch (error) {
      console.error('An error occurred while processing the registration:', error);
      toast.error('An error occurred during registration');
    }
  }

  const verifyOtp = async (event) => {
    event.preventDefault();
    console.log(`Email: ${email}`);
  
    try {
      const response = await fetch(`${apiHost}${apiPort}${verifcationRoute}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, otp }),
      }); 
  
      if (response.status !== 200) {
        console.error('Invalid OTP');
        toast.error('Invalid OTP');
      }else {
        document.getElementById('register-btn').disabled = false;
        toast.success('OTP verified successfully');
      }
    } catch (error) {
      console.error('An error occurred while processing the registration:', error);
      toast.error('An error occurred during registration');
    }
  }

  return (
    <div className='flex flex-col h-screen bg-gray-300'>
      <div className='text-4xl text-center mb-3 mt-3 text-blue-700 font-bold'>
        SignUp Form
      </div>

      <div className='flex-grow flex items-center justify-center'>
        <form onSubmit={handleSubmit} className='bg-white p-8 rounded shadow-md w-96'>
          <div className='mb-4'>
            <label htmlFor='username' className='block text-sm font-semibold text-gray-700 mb-1'>
              Username:
            </label>
            <input
              type='text'
              id='username'
              name='username'
              className='mt-1 p-2 border border-black rounded w-full focus:outline-none focus:border-blue-500 bg-gray-200'
              onChange={(event) => setName(event.target.value)}
              required
            />
          </div>
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

            <label htmlFor='otp' className='mt-2 block text-sm font-semibold text-gray-700 mb-1'>
              Enter OTP:
            </label>

            <input
              type='text'
              id='otp'
              name='otp'
              className='mt-1 p-2 border border-black rounded w-full focus:outline-none focus:border-blue-500 bg-gray-200'
              onChange={(event) => setOtp(event.target.value)}
              required
            />
        
            <div className='flex justify-between'>
              <button 
                onClick={sendOtp}
                className='mt-2 px-4 py-2 text-white bg-red-500 rounded hover:bg-blue-600 focus:outline-none focus:shadow-outline-blue'
              >
                send OTP
              </button>

              <button 
                className='mt-2 px-4 py-2 text-white bg-blue-500 rounded hover:bg-blue-600 focus:outline-none focus:shadow-outline-blue'
                onClick={verifyOtp}
              >                
                verify OTP
              </button>
            </div>
           
          </div>
          <div className='mb-4'>
            <label htmlFor='password' className='block text-sm font-semibold text-gray-700 mb-1'>
              Password:
            </label>
            <input
              type='password'
              id='password'
              name='password'
              className='mt-1 p-2 border border-black rounded w-full focus:outline-none focus:border-blue-500 bg-gray-200'
              onChange={(event) => setPassword(event.target.value)}
              required
            />
          </div>
          <div className='flex flex-col items-center justify-center'>
            <button
              type='submit'
              id='register-btn'
              className='px-4 py-2 text-white bg-blue-500 rounded hover:bg-blue-600 focus:outline-none focus:shadow-outline-blue'
              disabled = {true}
            >
              Register
            </button>
            <p className='text-red-500'>*verify otp to register</p>
          </div>

          <div className='mt-4 text-center'>
            <p className='text-gray-700'>
              Already registered?{' '}
              <span
                onClick={() => {
                    navigate('/login');
                }}
                className='text-blue-500 cursor-pointer hover:underline'
              >
                Login here
              </span>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
};

export default SignUpForm;
