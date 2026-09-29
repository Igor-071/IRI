import { describe, it, expect } from "vitest";
import { formatMoney, formatMoneyFull } from "@/lib/formatting/money";
import { formatDuration } from "@/lib/formatting/duration";
import { formatPercent } from "@/lib/formatting/percent";
import { formatRelativeDate, formatDate } from "@/lib/formatting/dates";

describe("formatMoney", () => {
  it("formats thousands with K suffix", () => {
    expect(formatMoney(120000)).toBe("€120K");
  });

  it("formats millions with M suffix", () => {
    expect(formatMoney(1250000)).toBe("€1.25M");
  });

  it("formats exact millions without decimal", () => {
    expect(formatMoney(2000000)).toBe("€2M");
  });

  it("formats values under 1000 without suffix", () => {
    expect(formatMoney(500)).toBe("€500");
  });

  it("formats fractional thousands", () => {
    expect(formatMoney(55000)).toBe("€55K");
  });
});

describe("formatMoneyFull", () => {
  it("formats with full currency notation", () => {
    const result = formatMoneyFull(120000);
    expect(result).toContain("120,000");
    expect(result).toContain("€");
  });
});

describe("formatDuration", () => {
  it("formats minutes under 60", () => {
    expect(formatDuration(17)).toBe("17m");
  });

  it("formats hours and minutes", () => {
    expect(formatDuration(138)).toBe("2h 18m");
  });

  it("formats exact hours without minutes", () => {
    expect(formatDuration(120)).toBe("2h");
  });

  it("formats days and hours", () => {
    expect(formatDuration(4560)).toBe("3d 4h");
  });

  it("formats exact days", () => {
    expect(formatDuration(1440)).toBe("1d");
  });
});

describe("formatPercent", () => {
  it("formats whole percentages", () => {
    expect(formatPercent(0.73)).toBe("73%");
  });

  it("formats fractional percentages", () => {
    expect(formatPercent(0.325)).toBe("32.5%");
  });

  it("formats 100%", () => {
    expect(formatPercent(1)).toBe("100%");
  });
});

describe("formatRelativeDate", () => {
  it("formats recent times as minutes ago", () => {
    const thirtyMinAgo = new Date("2026-09-27T11:30:00+02:00");
    expect(formatRelativeDate(thirtyMinAgo)).toBe("30m ago");
  });

  it("formats hours ago", () => {
    const twoHoursAgo = new Date("2026-09-27T10:00:00+02:00");
    expect(formatRelativeDate(twoHoursAgo)).toBe("2h ago");
  });

  it("formats days ago", () => {
    const threeDaysAgo = new Date("2026-09-24T12:00:00+02:00");
    expect(formatRelativeDate(threeDaysAgo)).toBe("3d ago");
  });
});

describe("formatDate", () => {
  it("produces locale-consistent output", () => {
    const result = formatDate("2026-09-14T10:00:00+02:00");
    expect(result).toContain("Sept");
    expect(result).toContain("2026");
    expect(result).toContain("14");
  });
});
