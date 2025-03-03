import { Twitter } from "lucide-react";

export const Footer = () => {
  return (
    <footer className="container mx-auto px-4 py-6 border-t border-gray-800">
      <div className="flex justify-between items-center">
        <a
          href="https://x.com/tapir_protocol"
          target="_blank"
          rel="noopener noreferrer"
          className="text-gray-400 hover:text-white transition-colors flex items-center gap-2 text-sm"
        >
          <Twitter className="h-4 w-4" />
          <span>Follow us on X</span>
        </a>
        <span className="text-gray-400 text-sm">v0.0.1</span>
      </div>
    </footer>
  );
};
