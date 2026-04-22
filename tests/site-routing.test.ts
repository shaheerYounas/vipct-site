import { describe, expect, it } from "vitest";
import { legacyRedirectPath, pageHref, resolvePublicSlug, rootHref } from "@/lib/site-data";

describe("clean public routing", () => {
  it("maps legacy slugs to clean public hrefs", () => {
    expect(rootHref("services.html")).toBe("/services");
    expect(pageHref("cs", "quote.html")).toBe("/cs/quote");
    expect(rootHref("prague-to-vienna-transfer.html")).toBe("/prague-to-vienna-transfer");
  });

  it("resolves clean segments and redirects legacy html paths", () => {
    expect(resolvePublicSlug("prague-to-dresden-transfer")).toBe("prague-to-dresden-transfer.html");
    expect(legacyRedirectPath("/services.html")).toBe("/services");
    expect(legacyRedirectPath("/ar/programs.html")).toBe("/ar/programs");
  });
});
