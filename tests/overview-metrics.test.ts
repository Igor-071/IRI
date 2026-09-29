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

  it("total pipeline sums to €1,250,000", () => {
    const total = result.reduce((sum, r) => sum + r.value, 0);
    expect(total).toBe(1250000);
  });

  it("Vector (unknown first touch) contributes €160K", () => {
    const entry = result.find((r) => r.source === "unknown");
    // Vector's €160K should be in unknown since Anna Keller has direct-only session
    expect(entry).toBeDefined();
    expect(entry!.value).toBeGreaterThanOrEqual(160000);
  });
});

describe("getRevenueBySource", () => {
  const result = getRevenueBySource();

  it("returns entries sorted by value descending", () => {
    for (let i = 1; i < result.length; i++) {
      expect(result[i - 1].value).toBeGreaterThanOrEqual(result[i].value);
    }
  });

  it("total won revenue sums to €740,000", () => {
    const total = result.reduce((sum, r) => sum + r.value, 0);
    expect(total).toBe(740000);
  });

  it("Atlas €180K appears under unknown (direct-only session, no marketing touch)", () => {
    const entry = result.find((r) => r.source === "unknown");
    expect(entry).toBeDefined();
    expect(entry!.value).toBeGreaterThanOrEqual(180000);
  });

  it("Event won revenue includes Meridian €140K", () => {
    const entry = result.find((r) => r.source === "event");
    expect(entry).toBeDefined();
    expect(entry!.value).toBeGreaterThanOrEqual(140000);
  });
});

describe("getOverviewMetrics", () => {
  it("leadToOpportunity equals 0.325 (26 ÷ 80)", () => {
    const metrics = getOverviewMetrics();
    expect(metrics.leadToOpportunity).toBe(0.325);
  });

  it("inboundLeads = 80", () => {
    const metrics = getOverviewMetrics();
    expect(metrics.inboundLeads).toBe(80);
  });
});
