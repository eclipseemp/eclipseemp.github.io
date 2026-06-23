import { Link } from 'react-router-dom';
import { Home } from 'lucide-react';
import { Button } from '../components/ui/button';

export default function NotFoundPage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] text-center">
      <h1 className="text-6xl font-bold text-primary mb-4">404</h1>
      <p className="text-xl text-muted-foreground mb-8">页面未找到</p>
      <Link to="/">
        <Button>
          <Home className="size-4 mr-2" />
          返回首页
        </Button>
      </Link>
    </div>
  );
}
