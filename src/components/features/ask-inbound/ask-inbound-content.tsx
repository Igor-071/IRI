"use client";

import { useState, useCallback } from "react";
import { askInbound, type AskAnswer as AskAnswerType } from "@/lib/ask";
import { AskPrompt } from "./ask-prompt";
import { AskAnswer } from "./ask-answer";

export function AskInboundContent() {
  const [answer, setAnswer] = useState<AskAnswerType | null>(null);

  const handleSubmit = useCallback((query: string) => {
    const result = askInbound(query);
    setAnswer(result);
  }, []);

  return (
    <div className="space-y-6">
      <AskPrompt onSubmit={handleSubmit} />
      {answer && <AskAnswer answer={answer} onChipClick={handleSubmit} />}
    </div>
  );
}
