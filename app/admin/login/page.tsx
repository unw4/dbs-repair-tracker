import { loginAction } from "./actions";

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  const { error } = await searchParams;

  return (
    <div className="min-h-screen bg-[#F8FAFC] flex flex-col items-center justify-center px-4">
      <div className="mb-8 text-center">
        <h1 className="text-2xl font-bold text-brand-dark">Servis Takip</h1>
        <p className="text-sm text-brand-muted mt-1">Yönetim Paneli</p>
      </div>

      <div className="w-full max-w-sm bg-white rounded-2xl shadow-md border border-gray-100 overflow-hidden">
        <div className="bg-brand-dark text-white px-6 py-4">
          <span className="text-sm font-semibold">Giriş Yap</span>
        </div>

        <form action={loginAction} className="p-6 flex flex-col gap-4">
          <div>
            <label className="block text-sm font-semibold text-brand-dark mb-1.5">
              Kullanıcı Adı
            </label>
            <input
              name="username"
              type="text"
              required
              autoComplete="username"
              className="w-full rounded-lg border border-gray-200 px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-brand-light focus:border-brand transition-all text-brand-dark"
              placeholder="admin"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-brand-dark mb-1.5">
              Şifre
            </label>
            <input
              name="password"
              type="password"
              required
              autoComplete="current-password"
              className="w-full rounded-lg border border-gray-200 px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-brand-light focus:border-brand transition-all text-brand-dark"
              placeholder="••••••••"
            />
          </div>

          {error && (
            <p className="text-xs text-red-600 bg-red-50 border border-red-200 rounded-lg px-3 py-2">
              Kullanıcı adı veya şifre hatalı.
            </p>
          )}

          <button
            type="submit"
            className="w-full bg-brand-dark hover:bg-brand-hover text-white py-2.5 rounded-lg text-sm font-semibold transition-colors"
          >
            Giriş Yap
          </button>
        </form>
      </div>
    </div>
  );
}
