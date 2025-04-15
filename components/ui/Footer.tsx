"use client"

import { Brain } from "lucide-react";

export default function Footer(){
  return (
    <div className="border-t py-6">
      <div className=" mx-auto w-[90%] flex items-center justify-between gap-4 flex-row">
        <div className="flex items-center gap-2 text-[#6C5CE7]">
          <Brain className="h-5 w-5" />
          <span className="font-semibold">QuizMaster</span>
        </div>
        <p className="text-center text-[12px] md:text-sm text-muted-foreground">
          © {new Date().getFullYear()} QuizMaster.
        </p>
      </div>
    </div>
  );
};
