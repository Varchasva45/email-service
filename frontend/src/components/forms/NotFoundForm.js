import React from 'react';
import { useNavigate } from 'react-router-dom';

const NotFoundForm = () => {

    const navigate = useNavigate();

    return (
        <div className='flex bg-gray-700 h-screen w-screen text-white font-bold flex-col gap-5 justify-center items-center text-5xl'>
            
            <div>
                Invalid Route!
            </div>

            <div>
                <button
                    onClick={() => navigate('/login')}
                    className='px-4 py-2 flex bg-blue-500 rounded hover:bg-blue-600 focus:outline-none focus:shadow-outline-blue justify-center items-center'
                >
                    Go Back 
                </button>
            </div>
            
        </div>
    );
}

export default NotFoundForm;

