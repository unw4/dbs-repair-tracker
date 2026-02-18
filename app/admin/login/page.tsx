import { loginAction } from "./actions";

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  const { error } = await searchParams;

  return (
    <div className="min-h-screen bg-brand-subtle flex flex-col items-center justify-center px-4">
      {/* Logo / başlık */}
      <div className="mb-8 text-center">
        <h1 className="text-2xl font-bold tracking-widest uppercase text-brand-dark">
          Tamir Takip
        </h1>
        <p className="text-xs text-brand-muted uppercase tracking-widest mt-1">
          Yönetim Paneli
        </p>
      </div>

      <div className="w-full max-w-sm border-2 border-brand-dark bg-white">
        {/* Kart başlığı */}
        <div className="bg-brand-dark text-white px-4 py-3">
          <span className="text-xs font-bold uppercase tracking-widest">
            Giriş Yap
          </span>
        </div>

        <form action={loginAction} className="p-6 flex flex-col gap-4">
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-brand-dark mb-1">
              Kullanıcı Adı
            </label>
            <input
              name="username"
              type="text"
              required
              autoComplete="username"
              className="w-full border border-brand-border px-3 py-2 text-sm focus:outline-none focus:border-brand-dark text-brand-dark"
              placeholder="admin"
            />
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-brand-dark mb-1">
              Şifre
            </label>
            <input
              name="password"
              type="password"
              required
              autoComplete="current-password"
              className="w-full border border-brand-border px-3 py-2 text-sm focus:outline-none focus:border-brand-dark text-brand-dark"
              placeholder="••••••••"
            />
          </div>

          {error && (
            <p className="text-xs font-bold uppercase tracking-wider text-red-600 border border-red-300 bg-red-50 px-3 py-2">
              Kullanıcı adı veya şifre hatalı.
            </p>
          )}

          <button
            type="submit"
            className="w-full bg-brand-dark text-white py-2 text-sm font-bold uppercase tracking-widest hover:bg-brand-hover transition-colors"
          >
            Giriş Yap
          </button>
        </form>
      </div>
    </div>
  );
}
