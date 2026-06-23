import { Outlet } from 'react-router-dom';
import { Toaster } from 'sonner';

export default function Layout() {
  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-[1920px] mx-auto px-4 py-6">
        <header className="mb-6">
          <h1 className="text-2xl font-bold text-primary mb-2">燕云十六声模拟器</h1>
          <p className="text-muted-foreground text-sm">伤害计算器 · 和鸣模拟器 · 配装系统</p>
        </header>
        <main>
          <Outlet />
        </main>
      </div>
      <Toaster
        theme="dark"
        toastOptions={{
          style: {
            backgroundColor: 'hsl(var(--card))',
            border: '1px solid hsl(var(--border))',
            color: 'hsl(var(--foreground))',
          },
        }}
      />
    </div>
  );
}
