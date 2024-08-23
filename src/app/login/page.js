'use client';
import LoginButton from '../components/Login';

export default function LoginPage() {

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-500 to-purple-600 p-4">
            <div className="bg-white rounded-lg shadow-xl p-8 w-full max-w-md">
                <div className=" text-center">
                    <h1 className="text-gray-600">Sign-in to your account with Auth0</h1>
                    <div className="mt-4">
                        <LoginButton />
                    </div>
                </div>

            </div>
        </div>
    );
}