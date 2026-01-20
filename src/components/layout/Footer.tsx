import { Heart } from "lucide-react";
import { WEDDING_CONFIG } from "@/config/wedding";

export function Footer() {
  return (
    <footer className="bg-stone-800 text-cream-100 pt-8 pb-12 sm:py-8 mt-auto">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 text-center">
        <div className="flex items-center justify-center gap-2 mb-3">
          <span className="font-display text-lg">
            {WEDDING_CONFIG.couple.partner1}
          </span>
          <Heart className="w-4 h-4 text-gold-300 fill-gold-300" aria-hidden="true" />
          <span className="font-display text-lg">
            {WEDDING_CONFIG.couple.partner2}
          </span>
        </div>

        <p className="text-cream-300 text-sm mb-3">
          {WEDDING_CONFIG.date.display}
        </p>

        {WEDDING_CONFIG.social.hashtag && (
          <p className="text-gold-300 text-sm font-medium mb-4">
            {WEDDING_CONFIG.social.hashtag}
          </p>
        )}

        <p className="text-cream-400 text-xs">
          Gracias por ser parte de nuestra historia
        </p>
      </div>
    </footer>
  );
}
