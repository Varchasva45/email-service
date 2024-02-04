import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

const EmailForm = () => {
    const navigate = useNavigate();

    const apiPort = process.env.REACT_APP_API_PORT;
    const apiHost = process.env.REACT_APP_API_HOST;
    const emailRoute = process.env.REACT_APP_SEND_EMAIL_ROUTE;
    const authRoute = process.env.REACT_APP_AUTH_ROUTE;
    const logoutRoute = process.env.REACT_APP_LOGOUT_ROUTE;
    const fileUploadRoute = process.env.REACT_APP_FILE_UPLOAD_ROUTE;

    const [from, setFrom] = useState('');
    const [to, setTo] = useState('');
    const [appPassword, setAppPassword] = useState(''); 
    const [cc, setCC] = useState([]);
    const [bcc, setBCC] = useState([]);
    const [subject, setSubject] = useState('');
    const [message, setMessage] = useState('');
    const [attachment, setAttachment] = useState([]);
    
    const username = localStorage.getItem('username');

    const handleSubmit = async (e) => {

        e.preventDefault();
        setFrom(localStorage.getItem('userEmail'));

        try {

            const response = await fetch(`${apiHost}${apiPort}${emailRoute}`, {
                method: 'POST',
                headers: {
                'Content-Type': 'application/json',
                },
                body: JSON.stringify({ from, to, appPassword, cc, bcc, subject, message, attachment}),
            });
            
            if (response.status === 200) {
                toast.success('Email sent successfully!');
            } else {
                toast.error('Failed to send email. Please try again.');
            }

        } catch (error) {

            console.error('Error sending email:', error);
            toast.error('An error occurred while sending the email. Please try again.');

        }
        
    };

    const handleFileChange = async (e) => {

        const file = e.target.files?.[0];
        const fileType = file?.name.split('.').pop();
        const fileName = file?.name.split('.')[0];
        
        if (file) {
            try {
                const formData = new FormData();
                formData.append('file', file);
        
                const response = await fetch(`${apiHost}${apiPort}${fileUploadRoute}`, {
                    method: 'POST',
                    body: formData,
                });
        
                if (response.ok) {
                    const url = await response.json();
                    setAttachment([url, fileName, fileType]);
                } else {
                    console.error('Error uploading file:', response.statusText);
                }
        
            } catch (error) {
                console.error('Error uploading file:', error.message);
            }
        }        
    };

    const handleLogout = async (e) => {

        e.preventDefault();

        try {

            const response = await fetch(`${apiHost}${apiPort}${authRoute}${logoutRoute}`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                refreshToken: localStorage.getItem('refresh_token'),
            }),

        });

        if(response.status === 204) {

            localStorage.removeItem('userEmail');
            localStorage.removeItem('refresh_token');
            localStorage.removeItem('username');

            toast.success('Logged out successfully');
            navigate('/login');

        } else {

            console.error('Logout failed');
            toast.error('Logout failed');

        }

        } catch (error) {

            console.error('Error logging out:', error); 
            toast.error('An error occurred while logging out. Please try again.');
        
        }

    };


    if (!localStorage.getItem('username')) {
        return <>

            <div className='flex bg-gray-700 h-screen w-screen text-white font-bold flex-col gap-5 justify-center items-center text-5xl'>
                
                <div>
                    You are not Loggged In!
                </div>
                
                <div>
                    <button
                        onClick={() => navigate('/login')}
                        className='px-4 py-2 flex bg-blue-500 rounded hover:bg-blue-600 focus:outline-none focus:shadow-outline-blue justify-center items-center'
                    >
                        Login
                    </button>
                </div>
                
            </div>
        </>
    }
  

    return (
        <div className='flex flex-col h-screen bg-gray-300'>
            
            <div className='bg-gray-500 px-4 p-1 flex justify-between items-center text-white text-center'>
                
                <div className='text-2xl'>Hello, {username}</div>

                <div className='text-2xl text-center mb-3 mt-3 font-bold pr-32'>
                    Email Form
                </div>

                <button
                    onClick={handleLogout}
                    className='pr-3 px-4 py-2 bg-red-500 rounded hover:bg-red-600 focus:outline-none focus:shadow-outline-red'
                >
                    Logout
                </button>

            </div>

        
            <div className='flex-grow flex items-center justify-center'>
                
                <div className='flex bg-white p-8 rounded shadow-md w-full gap-5 px-12'>

                    <div className='w-1/4'>
                        
                        <div className='mb-3'>
                            <label htmlFor='to' className='block text-sm font-semibold text-gray-700 mb-1'>
                            To:
                            </label>
                            <input
                            required = {true}
                            type='text'
                            id='to'
                            value={to}
                            onChange={(e) => setTo(e.target.value)}
                            className='mt-1 p-2 border border-black rounded w-full focus:outline-none focus:border-blue-500 bg-gray-200'
                            />
                        </div>

                        <div className='mb-3'>
                            <label htmlFor='appPassword' className='block text-sm font-semibold text-gray-700 mb-1'>
                            App Password:
                            </label>
                            <input
                            type='password'
                            id='appPassword'
                            value={appPassword}
                            required = {true}
                            onChange={(e) => setAppPassword(e.target.value)}
                            className='mt-1 p-2 border border-black rounded w-full focus:outline-none focus:border-blue-500 bg-gray-200'
                            />
                        </div>

                        <div className='mb-3'>
                            <label htmlFor='cc' className='block text-sm font-semibold text-gray-700 mb-1'>
                            CC:
                            </label>
                            <input
                            type='text'
                            id='cc'
                            value={cc}
                            onChange={(e) => setCC(e.target.value)}
                            className='mt-1 p-2 border border-black rounded w-full focus:outline-none focus:border-blue-500 bg-gray-200'
                            />
                        </div>

                        <div className='mb-3'>
                            <label htmlFor='bcc' className='block text-sm font-semibold text-gray-700 mb-1'>
                            BCC:
                            </label>
                            <input
                            type='text'
                            required = {true}
                            id='bcc'
                            value={bcc}
                            onChange={(e) => setBCC(e.target.value)}
                            className='mt-1 p-2 border border-black rounded w-full focus:outline-none focus:border-blue-500 bg-gray-200'
                            />
                        </div>

                        <div className='mb-3'>
                            <label htmlFor='subject' className='block text-sm font-semibold text-gray-700 mb-1'>
                            Subject:
                            </label>
                            <input
                            type='text'
                            id='subject'
                            required = {true}
                            value={subject}
                            onChange={(e) => setSubject(e.target.value)}
                            className='mt-1 p-2 border border-black rounded w-full focus:outline-none focus:border-blue-500 bg-gray-200'
                            />
                        </div>

                        <div className='flex gap-3 relative mt-10'>
                            <input
                                type='file'
                                id='attachments'
                                onChange={handleFileChange}
                                multiple
                                className='absolute opacity-0'
                            />

                        
                            <label
                                htmlFor='attachments'
                                className='px-4 py-2 text-white bg-blue-500 rounded cursor-pointer'
                            >
                                Attachments
                            </label>

                            
                            
                            <div className='flex flex-col gap-1 items-center justify-center'>
                            
                                <span className='text-red-700 font-bold'>
                                    {attachment[1]}.{attachment[2]}
                                </span>
                            
                            </div>

                        </div>

                    </div>

                    <div className='w-3/4'>

                        <div className='mb-3'>
                            <label htmlFor='message' className='block text-sm font-semibold text-gray-700 mb-1'>
                            Message:
                            </label>
                            <textarea
                            id='message'
                            value={message}
                            onChange={(e) => setMessage(e.target.value)}
                            className='mt-1 p-2 border border-black rounded w-full focus:outline-none focus:border-blue-500 bg-gray-200 h-96'
                            ></textarea>
                        </div>

                        <div className='flex justify-center items-center mt-6'>
                            <button
                                type='submit'
                                onClick={handleSubmit}
                                className='px-4 py-2 text-white bg-blue-500 rounded hover:bg-blue-600 focus:outline-none focus:shadow-outline-blue'
                            >
                                Send Email
                            </button>
                        </div>    
                                   
                    </div>

                </div>
            </div>
        </div>
    );
};

export default EmailForm;
