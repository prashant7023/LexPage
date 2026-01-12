import { Moon, Sun, FileText } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useTheme } from '@/hooks/useTheme';
import Link from 'next/link';

interface HeaderProps {
  showSearch?: boolean;
  children?: React.ReactNode;
}

export function Header({ showSearch = false, children }: HeaderProps) {
  const { theme, toggleTheme } = useTheme();

  return (
    <header className="h-14 border-b border-border bg-card px-4 flex items-center justify-between">
      <div className="flex items-center gap-3">
        <Link href="/" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
          <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
            <FileText className="w-4 h-4 text-primary-foreground" />
          </div>
          <span className="font-semibold text-foreground text-sm">LexPage</span>
        </Link>
      </div>

      <div className="flex items-center gap-2">
        {children}
        <Button
          variant="ghost"
          size="icon"
          onClick={toggleTheme}
          className="h-8 w-8"
        >
          {theme === 'light' ? (
            <Moon className="h-4 w-4" />
          ) : (
            <Sun className="h-4 w-4" />
          )}
        </Button>
      </div>
    </header>
  );
}
