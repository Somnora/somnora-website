#!/usr/bin/env node

import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const scriptDirectory = path.dirname(fileURLToPath(import.meta.url));
const siteRoot = path.resolve(scriptDirectory, "..");
const errors = [];
const warnings = [];

function walk(directory) {
  return fs.readdirSync(directory, { withFileTypes: true }).flatMap((entry) => {
    if (entry.name === ".git" || entry.name === "screenshots") return [];
    const absolute = path.join(directory, entry.name);
    return entry.isDirectory() ? walk(absolute) : [absolute];
  });
}

function relative(file) {
  return path.relative(siteRoot, file).replaceAll(path.sep, "/");
}

function capture(html, pattern) {
  return html.match(pattern)?.[1]?.trim() || "";
}

function resolveInternalLink(pagePath, href) {
  const cleanHref = href.split("#")[0].split("?")[0];
  if (!cleanHref) return null;

  const candidate = cleanHref.startsWith("/")
    ? path.join(siteRoot, cleanHref)
    : path.resolve(path.dirname(pagePath), cleanHref);

  const possibilities = [
    candidate,
    `${candidate}.html`,
    path.join(candidate, "index.html")
  ];
  return possibilities.find((item) => fs.existsSync(item)) || "";
}

const htmlFiles = walk(siteRoot).filter((file) => file.endsWith(".html"));
const indexablePages = new Map();
const titles = new Map();
const descriptions = new Map();

for (const file of htmlFiles) {
  const html = fs.readFileSync(file, "utf8");
  const label = relative(file);
  const title = capture(html, /<title>([\s\S]*?)<\/title>/i).replace(/&amp;/g, "&");
  const description = capture(html, /<meta\s+name=["']description["']\s+content=["']([^"']*)["']/i);
  const robots = capture(html, /<meta\s+name=["']robots["']\s+content=["']([^"']*)["']/i).toLowerCase();
  const canonical = capture(html, /<link\s+rel=["']canonical["']\s+href=["']([^"']+)["']/i);
  const noindex = robots.includes("noindex");
  const h1Count = (html.match(/<h1(?:\s|>)/gi) || []).length;

  if (!title) errors.push(`${label}: missing title`);
  if (!noindex && (title.length < 20 || title.length > 65)) {
    warnings.push(`${label}: title length is ${title.length}`);
  }
  if (!noindex && !description) errors.push(`${label}: missing meta description`);
  if (!noindex && description && (description.length < 90 || description.length > 170)) {
    warnings.push(`${label}: description length is ${description.length}`);
  }
  if (!noindex && !canonical) errors.push(`${label}: missing canonical URL`);
  if (!noindex && !robots.includes("index")) errors.push(`${label}: missing explicit index directive`);
  if (!noindex && h1Count !== 1) errors.push(`${label}: expected one h1, found ${h1Count}`);
  if (!noindex && !html.includes('type="application/ld+json"')) {
    errors.push(`${label}: missing JSON-LD`);
  }
  if (!noindex && !html.includes('property="og:title"')) errors.push(`${label}: missing Open Graph title`);
  if (!noindex && !html.includes('name="twitter:card"')) errors.push(`${label}: missing Twitter card`);

  if (!noindex && canonical) {
    if (indexablePages.has(canonical)) errors.push(`${label}: duplicate canonical ${canonical}`);
    indexablePages.set(canonical, label);
  }
  if (!noindex && title) {
    if (titles.has(title)) errors.push(`${label}: duplicate title also used by ${titles.get(title)}`);
    titles.set(title, label);
  }
  if (!noindex && description) {
    if (descriptions.has(description)) errors.push(`${label}: duplicate description also used by ${descriptions.get(description)}`);
    descriptions.set(description, label);
  }

  for (const match of html.matchAll(/<img\b([^>]*)>/gi)) {
    if (!/\balt=["'][^"']*["']/i.test(match[1])) errors.push(`${label}: image missing alt attribute`);
  }

  for (const match of html.matchAll(/<script\s+type=["']application\/ld\+json["'][^>]*>([\s\S]*?)<\/script>/gi)) {
    try {
      JSON.parse(match[1]);
    } catch (error) {
      errors.push(`${label}: invalid JSON-LD (${error.message})`);
    }
  }

  for (const match of html.matchAll(/\bhref=["']([^"']+)["']/gi)) {
    const href = match[1];
    if (href === "#") {
      errors.push(`${label}: empty placeholder link`);
      continue;
    }
    if (href.startsWith("#")) {
      const fragment = href.slice(1);
      const escapedFragment = fragment.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
      const fragmentPattern = new RegExp(`(?:id|name)=["']${escapedFragment}["']`, "i");
      if (!fragmentPattern.test(html)) errors.push(`${label}: missing fragment target ${href}`);
      continue;
    }
    if (/^(?:https?:|mailto:|tel:|data:)/i.test(href)) continue;
    if (!resolveInternalLink(file, href)) errors.push(`${label}: broken internal link ${href}`);
  }
}

const sitemapPath = path.join(siteRoot, "sitemap.xml");
const sitemap = fs.readFileSync(sitemapPath, "utf8");
const sitemapUrls = new Set([...sitemap.matchAll(/<loc>([^<]+)<\/loc>/g)].map((match) => match[1]));

for (const canonical of indexablePages.keys()) {
  if (!sitemapUrls.has(canonical)) errors.push(`sitemap.xml: missing ${canonical}`);
}
for (const url of sitemapUrls) {
  if (!indexablePages.has(url)) errors.push(`sitemap.xml: non-indexable or unknown URL ${url}`);
}

if (!fs.readFileSync(path.join(siteRoot, "robots.txt"), "utf8").includes("https://somnora.app/sitemap.xml")) {
  errors.push("robots.txt: missing absolute sitemap URL");
}

console.log(`Audited ${htmlFiles.length} HTML files and ${indexablePages.size} indexable canonical URLs.`);
for (const warning of warnings) console.warn(`WARN ${warning}`);
for (const error of errors) console.error(`ERROR ${error}`);

if (errors.length) {
  console.error(`SEO audit failed with ${errors.length} error(s) and ${warnings.length} warning(s).`);
  process.exit(1);
}

console.log(`SEO audit passed with ${warnings.length} warning(s).`);
