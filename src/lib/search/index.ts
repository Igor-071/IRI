import { companies, people, ledger } from "@/data";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export interface SearchResult {
  type: "company" | "person" | "opportunity";
  id: string;
  title: string;
  subtitle: string;
  matchField: string;
}

// ---------------------------------------------------------------------------
// Constants
// ---------------------------------------------------------------------------

const MAX_RESULTS = 20;

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

interface ScoredResult extends SearchResult {
  score: number;
}

/**
 * Score a match: exact name match gets highest priority (0),
 * starts-with gets mid priority (1), partial/contains gets lowest (2).
 */
function scoreMatch(
  fieldValue: string,
  query: string
): { matches: boolean; score: number } {
  const lower = fieldValue.toLowerCase();
  if (lower === query) return { matches: true, score: 0 };
  if (lower.startsWith(query)) return { matches: true, score: 1 };
  if (lower.includes(query)) return { matches: true, score: 2 };
  return { matches: false, score: Infinity };
}

// ---------------------------------------------------------------------------
// Public API
// ---------------------------------------------------------------------------

export function globalSearch(query: string): SearchResult[] {
  const trimmed = query.trim().toLowerCase();
  if (!trimmed) return [];

  const scored: ScoredResult[] = [];

  // Search companies: name, domain
  for (const company of companies) {
    let bestScore = Infinity;
    let matchField = "";

    const nameMatch = scoreMatch(company.name, trimmed);
    if (nameMatch.matches && nameMatch.score < bestScore) {
      bestScore = nameMatch.score;
      matchField = "name";
    }

    const domainMatch = scoreMatch(company.domain, trimmed);
    if (domainMatch.matches && domainMatch.score < bestScore) {
      bestScore = domainMatch.score;
      matchField = "domain";
    }

    if (bestScore < Infinity) {
      scored.push({
        type: "company",
        id: company.id,
        title: company.name,
        subtitle: `${company.industry} \u00B7 ${company.location}`,
        matchField,
        score: bestScore,
      });
    }
  }

  // Search people: name, email, title
  for (const person of people) {
    let bestScore = Infinity;
    let matchField = "";

    const nameMatch = scoreMatch(person.name, trimmed);
    if (nameMatch.matches && nameMatch.score < bestScore) {
      bestScore = nameMatch.score;
      matchField = "name";
    }

    const emailMatch = scoreMatch(person.email, trimmed);
    if (emailMatch.matches && emailMatch.score < bestScore) {
      bestScore = emailMatch.score;
      matchField = "email";
    }

    const titleMatch = scoreMatch(person.title, trimmed);
    if (titleMatch.matches && titleMatch.score < bestScore) {
      bestScore = titleMatch.score;
      matchField = "title";
    }

    if (bestScore < Infinity) {
      const company = companies.find((c) => c.id === person.companyId);
      scored.push({
        type: "person",
        id: person.id,
        title: person.name,
        subtitle: `${person.title}${company ? ` at ${company.name}` : ""}`,
        matchField,
        score: bestScore,
      });
    }
  }

  // Search opportunities (ledger): opportunityName, companyName
  for (const entry of ledger) {
    let bestScore = Infinity;
    let matchField = "";

    const oppMatch = scoreMatch(entry.opportunityName, trimmed);
    if (oppMatch.matches && oppMatch.score < bestScore) {
      bestScore = oppMatch.score;
      matchField = "opportunityName";
    }

    const companyMatch = scoreMatch(entry.companyName, trimmed);
    if (companyMatch.matches && companyMatch.score < bestScore) {
      bestScore = companyMatch.score;
      matchField = "companyName";
    }

    if (bestScore < Infinity) {
      scored.push({
        type: "opportunity",
        id: entry.id,
        title: entry.opportunityName,
        subtitle: `${entry.companyName} \u00B7 \u20AC${entry.value.toLocaleString("en-GB")} \u00B7 ${entry.stage}`,
        matchField,
        score: bestScore,
      });
    }
  }

  // Sort by score (exact first, then starts-with, then partial)
  // Within the same score, preserve insertion order (companies, people, opps)
  scored.sort((a, b) => a.score - b.score);

  // Strip score and limit results
  return scored.slice(0, MAX_RESULTS).map(({ score: _score, ...result }) => result);
}
