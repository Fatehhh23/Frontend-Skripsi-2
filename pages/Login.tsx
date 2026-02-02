import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Eye, EyeOff } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const Login: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const { login } = useAuth();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Simulasi login sukses (bisa diganti dengan API call nanti)
    if (email && password) {
      login(email, 'Pengguna');
    }
  };

  const handleSocialLogin = (provider: string) => {
    console.log(`Login with ${provider}`);
    // Implementasi social login nanti
  };

  return (
    <div className="min-h-screen flex">
      {/* Left Side - Form */}
      <div className="flex-1 flex items-center justify-center bg-gradient-to-br from-gray-50 to-white px-4 sm:px-6 lg:px-20 xl:px-24">
        <div className="max-w-md w-full space-y-8">
          <div>
            <h2 className="text-4xl font-bold text-gray-900">Welcome Back</h2>
          </div>

          <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
            <div className="space-y-4">
              <div>
                <input
                  type="email"
                  required
                  className="appearance-none relative block w-full px-4 py-3.5 border-0 bg-gray-200 placeholder-gray-600 text-gray-900 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-gray-100 transition-all sm:text-sm"
                  placeholder="Enter email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>

              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  className="appearance-none relative block w-full px-4 py-3.5 border-0 bg-gray-200 placeholder-gray-600 text-gray-900 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-gray-100 transition-all sm:text-sm pr-12"
                  placeholder="Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-4 flex items-center text-gray-600 hover:text-gray-900"
                >
                  {showPassword ? (
                    <EyeOff className="h-5 w-5" />
                  ) : (
                    <Eye className="h-5 w-5" />
                  )}
                </button>
              </div>
            </div>

            <div>
              <button
                type="submit"
                className="w-full flex justify-center py-3.5 px-4 border border-transparent text-base font-semibold rounded-lg text-white bg-gradient-to-r from-blue-800 to-blue-900 hover:from-blue-900 hover:to-blue-950 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all duration-200 shadow-lg"
              >
                Login
              </button>
            </div>
          </form>

          {/* Social Login */}
          <div className="mt-6">
            <div className="text-center mb-4">
              <span className="text-sm text-gray-900 font-medium">Sign in with</span>
            </div>
            <div className="flex justify-center gap-4">
              <button
                onClick={() => handleSocialLogin('Facebook')}
                className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                aria-label="Login with Facebook"
              >
                <svg className="w-8 h-8" viewBox="0 0 48 48">
                  <path fill="#1877F2" d="M24 0C10.745 0 0 10.745 0 24s10.745 24 24 24 24-10.745 24-24S37.255 0 24 0z" />
                  <path fill="#FFF" d="M26.5 38.5v-14h4.7l0.7-5.5h-5.4v-3.5c0-1.6 0.4-2.7 2.7-2.7h2.9V8.1c-0.5-0.1-2.2-0.2-4.2-0.2-4.1 0-7 2.5-7 7.1v4h-4.7V24.5h4.7v14H26.5z" />
                </svg>
              </button>
              <button
                onClick={() => handleSocialLogin('Google')}
                className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                aria-label="Login with Google"
              >
                <svg className="w-8 h-8" viewBox="0 0 48 48">
                  <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z" />
                  <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z" />
                  <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z" />
                  <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z" />
                </svg>
              </button>
              <button
                onClick={() => handleSocialLogin('Apple')}
                className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                aria-label="Login with Apple"
              >
                <svg className="w-8 h-8" viewBox="0 0 48 48">
                  <path d="M38.71 20.07C38.37 20.17 32.72 22.71 32.78 29.54 32.85 37.67 39.69 40.43 40 40.52 39.94 40.75 38.82 44.49 36.24 48.31 34 51.61 31.66 54.89 28.06 54.96 24.56 55.03 23.44 52.82 19.49 52.82 15.55 52.82 14.28 54.89 11 54.96 7.45 55.03 4.84 51.37 2.6 48.07 -2.15 41.12 -6.42 28.19 -1.42 19.27 1.03 14.87 5.22 12 9.71 11.93 13.11 11.85 16.26 14.27 18.3 14.27 20.26 14.27 23.93 11.93 28 11.93 29.66 11.93 34.71 12.16 38.71 20.07ZM26.12 7.84C27.95 5.56 29.22 2.42 28.9 -0.71 26.25 -0.59 22.97 1.29 21.05 3.57 19.34 5.56 17.81 8.79 18.21 11.86 21.19 12.09 24.24 10.19 26.12 7.84Z" transform="scale(0.75) translate(8, 8)" fill="#000" />
                </svg>
              </button>
            </div>
          </div>

          <div className="text-center mt-6">
            <p className="text-sm text-gray-900">
              Don't have an account?{' '}
              <Link to="/register" className="font-semibold text-gray-900 hover:text-blue-600">
                Sign Up
              </Link>
            </p>
          </div>
        </div>
      </div>

      {/* Right Side - Logo */}
      <div className="hidden lg:flex lg:flex-1 bg-white items-center justify-center px-12">
        <div className="max-w-lg text-center">
          <img
            src="/avatar-logo.png"
            alt="AVATAR Logo"
            className="w-full max-w-md mx-auto mb-6 object-contain"
          />
          <h1 className="text-5xl font-bold text-gray-900 mb-3">AVATAR</h1>
          <p className="text-xl text-gray-700 font-medium">Mitigasi Bencana Berbasis AI</p>
        </div>
      </div>
    </div>
  );
};

export default Login;
