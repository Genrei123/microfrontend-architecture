import { type FormEvent, useState } from 'react';
import { useAuth } from '../context/AuthContext';

export default function LoginForm() {
  const { login } = useAuth();
  const [error, setError] = useState('');

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const didLogin = login({
      username: String(formData.get('username') ?? ''),
      password: String(formData.get('password') ?? ''),
    });

    if (!didLogin) {
      setError('Invalid username or password.');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div>
        <label htmlFor="username" className="mb-2 block text-sm font-bold text-slate-800">
          Username
        </label>
        <input
          className="min-h-12 w-full rounded-xl border border-stone-300 bg-white px-4 text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-teal-700"
          type="text"
          id="username"
          name="username"
          autoComplete="username"
          placeholder="Enter your username"
          required
        />
      </div>
      <div>
        <label htmlFor="password" className="mb-2 block text-sm font-bold text-slate-800">
          Password
        </label>
        <input
          className="min-h-12 w-full rounded-xl border border-stone-300 bg-white px-4 text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-teal-700"
          type="password"
          id="password"
          name="password"
          autoComplete="current-password"
          placeholder="Enter your password"
          required
        />
      </div>
      {error && (
        <p role="alert" className="rounded-xl bg-red-50 px-4 py-3 text-sm font-medium text-red-700">
          {error}
        </p>
      )}
      <button
        type="submit"
        className="min-h-12 w-full rounded-xl bg-teal-800 px-4 text-sm font-bold text-white transition hover:bg-teal-700 active:scale-[.99]"
      >
        Sign in securely
      </button>
    </form>
  );
}
