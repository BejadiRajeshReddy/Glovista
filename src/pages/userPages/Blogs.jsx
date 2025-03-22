import { Settings } from "lucide-react";
import { Link } from "react-router-dom";

export default function Blogs() {
  return (
    <div className="container mx-auto px-4 py-8">
      <nav className="flex items-center space-x-2 text-sm text-gray-500 mb-8">
        <Link href="/" className="hover:text-gray-700">
          Home
        </Link>
        <span>/</span> &#160; Blogs
      </nav>

      <div className="flex flex-col items-center justify-center py-20 text-center">
        <div className="relative mb-8 h-32 w-full">
          <div className="absolute left-1/2 top-1/2 -ml-16 -mt-16 animate-spin-slow">
            <Settings size={64} className="text-primary" />
          </div>

          <div className="absolute left-1/2 top-1/2 ml-4 -mt-8 animate-spin-reverse">
            <Settings size={48} className="text-primary/80" />
          </div>
        </div>

        <h1 className="mb-4 text-4xl font-bold tracking-tight">Coming Soon</h1>
        <p className="max-w-md text-muted-foreground">
          Our blog section is currently under construction. We're working hard
          to bring you valuable content. Please check back soon!
        </p>
      </div>
    </div>
  );
}
