import { Heart } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="border-t border-orange-200/50 bg-white/50 py-6">
      <div className="container mx-auto px-4 text-center">
        <p className="text-sm text-muted-foreground">
          © 2025. Built with <Heart className="inline h-4 w-4 fill-orange-500 text-orange-500" /> using{' '}
          <a
            href="https://caffeine.ai"
            target="_blank"
            rel="noopener noreferrer"
            className="font-medium text-orange-600 hover:text-orange-700"
          >
            caffeine.ai
          </a>
        </p>
      </div>
    </footer>
  );
}
