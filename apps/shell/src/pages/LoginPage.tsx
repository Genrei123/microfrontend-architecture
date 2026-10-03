import LoginForm from '../components/LoginForm';
export default function LoginPage() {
  return (
    <main className="grid min-h-screen bg-stone-50 lg:grid-cols-2">
      <section className="flex flex-col justify-center px-6 py-12 sm:px-16 lg:px-20">
        <div className="mx-auto w-full max-w-md">
          <div className="mb-16 flex items-center gap-3 text-xl font-bold text-teal-950">
            <img
              src="https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=96&h=96&q=80"
              alt=""
              className="size-10 rounded-xl object-cover"
            />
            Bank App
          </div>
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-teal-700">
            Your next chapter
          </p>
          <h1 className="mt-4 font-serif text-5xl text-slate-950">Good to see you.</h1>
          <p className="mb-8 mt-4 leading-7 text-slate-600">
            Sign in and pick up where you left off. Your next financial move starts here.
          </p>
          <LoginForm />
          <p className="mt-10 text-xs text-slate-500">
            Thoughtful choices. Everyday possibilities.
          </p>
        </div>
      </section>
      <aside className="relative min-h-80 overflow-hidden bg-teal-950 lg:min-h-screen">
        <img
          src="https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1400&q=85"
          alt="A peaceful home with a garden and pool"
          className="absolute inset-0 h-full w-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-teal-950/90 via-teal-950/10 to-transparent" />
        <div className="absolute inset-x-0 bottom-0 p-8 text-white sm:p-16">
          <p className="text-xs font-bold uppercase tracking-[0.2em]">Make space for possibility</p>
          <h2 className="mt-4 max-w-lg font-serif text-4xl sm:text-5xl">
            Big dreams begin
            <br />
            with small steps.
          </h2>
        </div>
      </aside>
    </main>
  );
}
