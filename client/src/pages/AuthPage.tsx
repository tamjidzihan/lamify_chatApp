import { useNavigate } from 'react-router-dom';
import SignInForm from '../components/SignInForm';
import SignInLinks from '../components/SignInLinks';
import useAuthStore from '../stateProviders/AuthStore';
import { useEffect } from 'react';
import logo from '../assets/logo_v1.png'

const AuthPage = () => {
    const { currentUser } = useAuthStore();
    const navigate = useNavigate();

    useEffect(() => {
        if (currentUser) {
            navigate('/');
        }
    }, [currentUser, navigate]);

    return (
        <main className="h-screen w-screen flex items-center justify-center bg-gradient-to-br from-blue-400 via-purple-500 to-pink-400 animate-gradient overflow-hidden">
            <div className="max-w-md w-full bg-white p-8 rounded-xl shadow-2xl">
                <div className="flex flex-col items-center">
                    {/* Logo Section */}
                    <div className="mb-3">
                        <img
                            src={logo} // Replace with your logo's path
                            alt="Logo"
                            className="h-40 w-auto"
                        />
                    </div>

                    {/* Welcome Message */}
                    <div className="text-center">
                        <h2 className="text-3xl font-bold text-gray-900">
                            Welcome To Lamify
                        </h2>
                        <p className="mt-2 text-sm text-gray-600">
                            Sign in to your account to continue
                        </p>
                    </div>

                    {/* Sign-In Form */}
                    {/* <div className=" w-full">
                        <SignInForm />
                    </div> */}

                    {/* Divider with Links */}
                    <div className="mt-8 w-full">
                        <div className="relative">
                            <div className="absolute inset-0 flex items-center">
                                <div className="w-full border-t border-gray-300"></div>
                            </div>
                            <div className="relative flex justify-center text-sm">
                                <span className="bg-white px-2 text-gray-500">
                                    sign in with
                                </span>
                            </div>
                        </div>
                        <SignInLinks />
                    </div>
                </div>
            </div>
        </main>
    );
};

export default AuthPage;
