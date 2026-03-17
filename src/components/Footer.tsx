"use client";

import { Instagram, Youtube, Twitch } from "lucide-react";

/* Discord Icon */
const DiscordIcon = ({ size = 18 }: { size?: number }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="currentColor"
  >
    <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057 19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028 14.09 14.09 0 0 0 1.226-1.994.076.076 0 0 0-.041-.106 13.107 13.107 0 0 1-1.872-.892.077.077 0 0 1-.008-.128 10.2 10.2 0 0 0 .372-.292.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.892.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.956-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.955-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.946 2.418-2.157 2.418z" />
  </svg>
);

/* X (Twitter) Icon */
const XIcon = ({ size = 18 }: { size?: number }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="currentColor"
  >
    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
  </svg>
);

const Footer = () => {
  return (
    <footer id="about" className="py-12 border-t border-border/50">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">

          {/* Logo */}
          <div className="flex items-center gap-2">
            <span className="font-display text-xl font-bold tracking-wider">
              OldGreatDemon<span className="text-primary"></span>
            </span>
          </div>

          {/* Navigation Links */}
          <div className="flex items-center gap-8">
            <a href="#" className="text-muted-foreground hover:text-primary transition-colors duration-300 text-sm font-display uppercase tracking-wider">
              Home
            </a>
            <a href="#clips" className="text-muted-foreground hover:text-primary transition-colors duration-300 text-sm font-display uppercase tracking-wider">
              Clips
            </a>
            <a href="#stats" className="text-muted-foreground hover:text-primary transition-colors duration-300 text-sm font-display uppercase tracking-wider">
              Stats
            </a>
            <a href="#about" className="text-muted-foreground hover:text-primary transition-colors duration-300 text-sm font-display uppercase tracking-wider">
              About
            </a>
          </div>

          {/* Social Links */}
          <div className="flex items-center gap-4">
            <a href="https://discord.com/users/865151140060332033" aria-label="Discord" className="p-2 text-muted-foreground hover:text-primary transition-colors duration-300">
              <DiscordIcon />
            </a>
            <a href="https://x.com/oldgreatdemon" aria-label="X" className="p-2 text-muted-foreground hover:text-primary transition-colors duration-300">
              <XIcon />
            </a>
            <a href="https://www.instagram.com/oldgreatdemon/" aria-label="Instagram" className="p-2 text-muted-foreground hover:text-primary transition-colors duration-300">
              <Instagram size={18} />
            </a>
            <a href="https://www.youtube.com/@oldgreatdemon" aria-label="YouTube" className="p-2 text-muted-foreground hover:text-primary transition-colors duration-300">
              <Youtube size={18} />
            </a>
            <a href="https://www.twitch.tv/oldgreatdemon" aria-label="Twitch" className="p-2 text-muted-foreground hover:text-primary transition-colors duration-300">
              <Twitch size={18} />
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
