import { useState } from "react";
import type { ComprehensivePartyResearchReport } from "@/types/party-research";

export function usePartyResearch() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [data, setData] = useState<ComprehensivePartyResearchReport | null>(null);

  const researchParty = async (partyName: string) => {
    setIsLoading(true);
    setError(null);
    setData(null);

    try {
      const response = await fetch("/api/research-party-ai", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ partyName }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to research party");
      }

      const result = await response.json();
      if (result.success && result.data) {
        setData(result.data);
        return result.data;
      } else {
        throw new Error("Invalid response format");
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Unknown error occurred";
      setError(errorMessage);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  return {
    researchParty,
    isLoading,
    error,
    data,
  };
}