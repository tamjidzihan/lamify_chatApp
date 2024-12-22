import { useNavigate } from 'react-router-dom';
import SignInForm from '../components/SignInForm'
import SignInLinks from '../components/SignInLinks'
import useAuthStore from '../stateProviders/AuthStore';
import { useEffect } from 'react';

const AuthPage = () => {
    const { currentUser, signInWithGoogle, loading } = useAuthStore();
    const navigate = useNavigate();

    useEffect(() => {
        if (currentUser) {
            navigate('/'); // Redirect to home page
        }
    }, [currentUser, navigate]);
    return (
        <main className="h-screen w-screen flex items-center justify-center bg-gray-50 overflow-hidden">
            <div className="max-w-md w-full space-y-8 bg-white p-8 rounded-lg shadow-lg">
                <div className="text-center">
                    <h2 className="text-3xl font-extrabold text-gray-900">
                        Welcome back
                    </h2>
                    <p className="mt-2 text-sm text-gray-600">
                        Please sign in to your account
                    </p>
                </div>
                <SignInForm />
                <div className="mt-6">
                    <div className="relative">
                        <div className="absolute inset-0 flex items-center">
                            <div className="w-full border-t border-gray-300"></div>
                        </div>
                        <div className="relative flex justify-center text-sm">
                            <span className="px-2 bg-white text-gray-500">
                                Or continue with
                            </span>
                        </div>
                    </div>
                    <SignInLinks />


                </div>
            </div>
        </main>
    )
}

export default AuthPage