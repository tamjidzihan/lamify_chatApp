import { FcGoogle } from "react-icons/fc";
import useAuthStore from "../stateProviders/AuthStore";


const SignInLinks = () => {
    const { signInWithGoogle } = useAuthStore()
    return (
        // <div className="mt-6 grid grid-cols-3 gap-3">
        <div className="mt-6 flex ">
            {/* <button
                type="button"
                className="w-full inline-flex justify-center py-2 px-4 border border-gray-300 rounded-lg shadow-sm bg-white text-sm font-medium text-gray-500 hover:bg-gray-50"
            >
                <Github className="h-5 w-5" />
            </button>
            <button
                type="button"
                className="w-full inline-flex justify-center py-2 px-4 border border-gray-300 rounded-lg shadow-sm bg-white text-sm font-medium text-gray-500 hover:bg-gray-50"
            >
                <Facebook className="h-5 w-5" />
            </button>
            <button
                type="button"
                className="w-full inline-flex justify-center py-2 px-4 border border-gray-300 rounded-lg shadow-sm bg-white text-sm font-medium text-gray-500 hover:bg-gray-50"
            >
                <Twitter className="h-5 w-5" />
            </button> */}
            <button
                type="button"
                onClick={signInWithGoogle}
                className="w-full inline-flex justify-center py-2 px-4 border border-gray-300 rounded-lg shadow-sm bg-white text-sm font-medium text-gray-500 hover:bg-gray-350"
            >
                <FcGoogle className="h-7 w-7" /> <span className=" mx-6  font-bold text-xl">Sign in with Google</span>
            </button>
        </div>

    )
}

export default SignInLinks