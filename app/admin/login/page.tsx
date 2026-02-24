import { loginAction } from "./actions";

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  const { error } = await searchParams;

  return (
    <div className="min-h-screen bg-[#F8FAFC] dark:bg-slate-900 flex flex-col items-center justify-center px-4 transition-colors">
      <div className="mb-8 text-center">
        <h1 className="text-2xl font-bold text-brand-dark dark:text-slate-100">Servis Takip</h1>
        <p className="text-sm text-brand-muted dark:text-slate-400 mt-1">Yönetim Paneli</p>
      </div>

      <div className="w-full max-w-sm bg-white dark:bg-slate-800 rounded-2xl shadow-md border border-gray-100 dark:border-slate-700 overflow-hidden">
        <div className="bg-brand-dark text-white px-6 py-4">
          <span className="text-sm font-semibold">Giriş Yap</span>
        </div>

        <form action={loginAction} className="p-6 flex flex-col gap-4">
          <div>
            <label className="block text-sm font-semibold text-brand-dark dark:text-slate-200 mb-1.5">
              Kullanıcı Adı
            </label>
            <input
              name="username"
              type="text"
              required
              autoComplete="username"
              className="w-full rounded-lg border border-gray-200 dark:border-slate-600 px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-brand-light transition-all text-brand-dark dark:text-slate-100 bg-white dark:bg-slate-700"
              placeholder="admin"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-brand-dark dark:text-slate-200 mb-1.5">
              Şifre
            </label>
            <input
              name="password"
              type="password"
              required
              autoComplete="current-password"
              className="w-full rounded-lg border border-gray-200 dark:border-slate-600 px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-brand-light transition-all text-brand-dark dark:text-slate-100 bg-white dark:bg-slate-700"
              placeholder="••••••••"
            />
          </div>

          {error === "ratelimit" && (
            <p className="text-xs text-red-600 bg-red-50 dark:bg-red-900/20 dark:text-red-400 border border-red-200 dark:border-red-800 rounded-lg px-3 py-2">
              Çok fazla başarısız giriş denemesi. 15 dakika sonra tekrar deneyin.
            </p>
          )}
          {error && error !== "ratelimit" && (
            <p className="text-xs text-red-600 bg-red-50 dark:bg-red-900/20 dark:text-red-400 border border-red-200 dark:border-red-800 rounded-lg px-3 py-2">
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
