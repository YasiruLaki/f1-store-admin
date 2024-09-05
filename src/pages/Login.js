import React from 'react';
import InputField from '../components/InputField';
import Button from '../components/Button';

const LoginPage = () => {

  const handleSubmit = async (event) => {
    event.preventDefault();
    const email = event.target.email.value;
    const password = event.target.password.value;

    try {
      const response = await fetch(`https://f1-store-backend.netlify.app/.netlify/functions/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ email, password })
      });

      let data;
      try {
        data = await response.json();
      } catch (jsonError) {
        console.error('Invalid JSON response:', jsonError);
        alert('An error occurred. Please try again.');
        return;
      }

      if (response.ok) {
        localStorage.setItem('token', data.token);
        alert('Login successful');
        window.location.href = '/';
      } else {
        alert(data.error || 'Login failed. Please check your credentials.');
      }
    } catch (error) {
      console.error('Error during login:', error);
      alert('An error occurred. Please try again.');
    }
  };

  return (
    <div className="flex min-h-screen flex-col justify-center items-center px-6 py-12 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-sm text-center">
        <div className="flex items-center justify-center">
          <span className="nav-bar-txt-1 !text-[18px] !font-[700]">F1MADNESS</span>
          <span className="nav-bar-txt-2 px-1 !text-[14px] !font-[600] !-translate-y-[2px]">Store</span>
        </div>
        <p className="nav-bar-txt-1 !text-[25px] !font-[800] mt-[20px]">ADMIN LOGIN</p>
      </div>

      <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm w-[98%]">
        <form onSubmit={handleSubmit} className="space-y-3">
          <InputField id="email" label="Email address" type="email" autoComplete="email" />
          <InputField id="password" label="Password" type="password" autoComplete="current-password" />
          <Button type="submit">Sign in</Button>
        </form>
      </div>
    </div>
  );
};

export default LoginPage;