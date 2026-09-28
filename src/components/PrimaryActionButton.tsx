"use client";

import React from "react";
import { PlusCircle } from "lucide-react";

interface PrimaryActionButtonProps {
  onClick: () => void;
}

export function PrimaryActionButton({ onClick }: PrimaryActionButtonProps) {
  return (
    <div className="fixed bottom-0 inset-x-0 z-20 pointer-events-none">
      {/* 
        Safari search bar clearance:
        iOS Safari's floating bottom address/tab bar occupies ~44px to 64px plus home indicator safe area.
        Using calc(3.25rem + env(safe-area-inset-bottom)) guarantees the button floats cleanly 
        above the search bar and never gets clipped.
      */}
      <div className="w-full bg-gradient-to-t from-zinc-950 via-zinc-950/95 to-transparent pt-8 pb-[calc(3.25rem+env(safe-area-inset-bottom,0px))] px-4">
        <div className="max-w-md mx-auto pointer-events-auto">
          <button
            onClick={onClick}
            type="button"
            className="w-full min-h-[56px] py-4 px-6 rounded-2xl bg-emerald-500 hover:bg-emerald-400 active:bg-emerald-600 text-zinc-950 font-black text-lg sm:text-xl tracking-wider uppercase transition-all duration-150 shadow-2xl shadow-emerald-500/30 active:scale-98 flex items-center justify-center space-x-2.5 border-2 border-emerald-400/50 cursor-pointer select-none"
          >
            <PlusCircle className="w-6 h-6 stroke-[2.5]" />
            <span>Job Done</span>
          </button>
        </div>
      </div>
    </div>
  );
}
