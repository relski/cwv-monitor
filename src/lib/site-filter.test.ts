import { describe, expect, it } from "vitest";
import { filterSites } from "./site-filter";

// each test builds only the fields filterSites reads
const site = (name: string | null, url: string) => ({ name, url });

describe("filterSites", () => {
	const shop = site("My Shop", "https://www.shop.example.com/");
	const blog = site(null, "https://www.blog.test/");
	const docs = site("Docs", "https://example.org/Pricing");
	const sites = [shop, blog, docs];

	it("returns every site when the query is empty", () => {
		expect(filterSites(sites, "")).toEqual(sites);
	});

	it("returns every site when the query is only spaces", () => {
		expect(filterSites(sites, "   ")).toEqual(sites);
	});

	it("matches on the name", () => {
		expect(filterSites(sites, "shop")).toEqual([shop]);
	});

	it("matches on the short URL", () => {
		expect(
			filterSites(
				[
					site(null, "https://www.example.com/"),
					site(null, "https://other.test/"),
				],
				"example",
			),
		).toEqual([site(null, "https://www.example.com/")]);
	});

	it("ignores capital letters in the query", () => {
		expect(filterSites(sites, "MY SHOP")).toEqual([shop]);
	});

	it("ignores capital letters in the name and the path", () => {
		expect(filterSites(sites, "pricing")).toEqual([docs]);
		expect(filterSites(sites, "docs")).toEqual([docs]);
	});

	it("trims spaces around the query", () => {
		expect(filterSites(sites, "  shop  ")).toEqual([shop]);
	});

	it("still matches a site without a name on its URL", () => {
		expect(filterSites(sites, "blog")).toEqual([blog]);
	});

	it("does not search the protocol, which the short URL leaves out", () => {
		expect(filterSites(sites, "https")).toEqual([]);
	});

	it("does not search the www prefix, which the short URL leaves out", () => {
		expect(filterSites(sites, "www")).toEqual([]);
	});

	it("returns an empty list when nothing matches", () => {
		expect(filterSites(sites, "zzz")).toEqual([]);
	});

	it("keeps the original order and the extra fields of each site", () => {
		const withChecks = [
			{
				...site("Alpha shop", "https://alpha.test/"),
				latest: { fieldLcp: 1800 },
			},
			{ ...site("Beta", "https://beta.test/"), latest: null },
			{
				...site("Gamma shop", "https://gamma.test/"),
				latest: { fieldLcp: 5000 },
			},
		];

		const result = filterSites(withChecks, "shop");

		expect(result).toEqual([withChecks[0], withChecks[2]]);
		expect(result[0]).toBe(withChecks[0]);
		expect(result[1]?.latest).toEqual({ fieldLcp: 5000 });
	});
});
