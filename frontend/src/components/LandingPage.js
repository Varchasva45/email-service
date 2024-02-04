import { useNavigate } from "react-router-dom";

const LandingPage = () => {

    const navigate = useNavigate();

    return (
        <div className="flex flex-col h-screen bg-gray-300 items-center justify-center">
            
            <div className="text-4xl text-center mb-8 text-blue-700 font-bold">
                Email-Service
            </div>

            <div className="bg-white p-8 rounded shadow-md w-96">
                
                <p className="mb-4 font-bold text-gray-700 text-center">
                    Welcome to our Email MicroService, send Emails directly from here!
                </p>

                <div className="flex justify-center space-x-4">
                    <button
                        type="button"
                        className="px-4 py-2 bg-blue-500 rounded hover:bg-blue-600 focus:outline-none focus:shadow-outline-blue text-white"
                        onClick={() => navigate('/signup')}
                    >
                        Sign Up
                    </button>
                    <button
                        type="button"
                        className="px-6 py-2 bg-blue-500 rounded hover:bg-blue-600 focus:outline-none focus:shadow-outline-blue text-white"
                        onClick={() => navigate('/login')}
                    >
                        Login
                    </button>
                </div>

            </div>
        </div>
    );
}

export default LandingPage;
