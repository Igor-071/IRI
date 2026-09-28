import { describe, it, expect } from "vitest";
import {
  getPipelineBySource,
  getRevenueBySource,
  getOverviewMetrics,
} from "@/lib/metrics";

describe("getPipelineBySource", () => {
  const result = getPipelineBySource();

  it("returns entries sorted by value descending", () => {
    for (let i = 1; i < result.length; i++) {
      expect(result[i - 1].value).toBeGreaterThanOrEqual(result[i].value);
    }
  });

  it("Google Organic pipeline is €260K", () => {
    const entry = result.find((r) => r.source === "google_organic");
    expect(entry?.value).toBe(260000);
  });

  it("LinkedIn Ads pipeline is €220K", () => {
    const entry = result.find((r) => r.source === "linkedin_ads");
    expect(entry?.value).toBe(220000);
  });

  it("Referral pipeline is €210K", () => {
    const entry = result.find((r) => r.source === "referral");
    expect(entry?.value).toBe(210000);
  });

  it("LinkedIn Organic pipeline is €200K", () => {
    const entry = result.find((r) => r.source === "linkedin_organic");
    expect(entry?.value).toBe(200000);
  });

  it("Unknown pipeline is €160K", () => {
    const entry = result.find((r) => r.source === "unknown");
    expect(entry?.value).toBe(160000);
  });

  it("Google Ads pipeline is €140K", () => {
    const entry = result.find((r) => r.source === "google_ads");
    expect(entry?.value).toBe(140000);
  });

  it("Event pipeline is €60K", () => {
    const entry = result.find((r) => r.source === "event");
    expect(entry?.value).toBe(60000);
  });

  it("total pipeline sums to €1,250,000", () => {
    const total = result.reduce((sum, r) => sum + r.value, 0);
    expect(total).toBe(1250000);
  });
});

describe("getRevenueBySource", () => {
  const result = getRevenueBySource();

  it("returns entries sorted by value descending", () => {
    for (let i = 1; i < result.length; i++) {
      expect(result[i - 1].value).toBeGreaterThanOrEqual(result[i].value);
    }
  });

  it("Referral won revenue is €180K (2 deals)", () => {
    const entry = result.find((r) => r.source === "referral");
    expect(entry?.value).toBe(180000);
    expect(entry?.count).toBe(2);
  });

  it("Unknown won revenue is €180K (1 deal)", () => {
    const entry = result.find((r) => r.source === "unknown");
    expect(entry?.value).toBe(180000);
    expect(entry?.count).toBe(1);
  });

  it("Event won revenue is €140K (1 deal)", () => {
    const entry = result.find((r) => r.source === "event");
    expect(entry?.value).toBe(140000);
    expect(entry?.count).toBe(1);
  });

  it("Google Organic won revenue is €105K (2 deals)", () => {
    const entry = result.find((r) => r.source === "google_organic");
    expect(entry?.value).toBe(105000);
    expect(entry?.count).toBe(2);
  });

  it("LinkedIn Organic won revenue is €55K (1 deal)", () => {
    const entry = result.find((r) => r.source === "linkedin_organic");
    expect(entry?.value).toBe(55000);
    expect(entry?.count).toBe(1);
  });

  it("Google Ads won revenue is €55K (2 deals)", () => {
    const entry = result.find((r) => r.source === "google_ads");
    expect(entry?.value).toBe(55000);
    expect(entry?.count).toBe(2);
  });

  it("LinkedIn Ads won revenue is €25K (1 deal)", () => {
    const entry = result.find((r) => r.source === "linkedin_ads");
    expect(entry?.value).toBe(25000);
    expect(entry?.count).toBe(1);
  });

  it("total won revenue sums to €740,000", () => {
    const total = result.reduce((sum, r) => sum + r.value, 0);
    expect(total).toBe(740000);
  });
});

describe("getOverviewMetrics().leadToOpportunity", () => {
  it("equals 0.325 (26 ÷ 80)", () => {
    const metrics = getOverviewMetrics();
    expect(metrics.leadToOpportunity).toBe(0.325);
  });
});
