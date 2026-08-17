import { describe, expect, test } from "bun:test";
import { existsSync, readFileSync } from "node:fs";
import { resolve } from "node:path";
import { astroProjects, projects } from "../src/projects.mjs";

const root = resolve(import.meta.dir, "..");

describe("project catalog", () => {
  test("contains every independent folder exactly once", () => {
    expect(projects).toHaveLength(8);
    expect(new Set(projects.map(({ folder }) => folder)).size).toBe(8);
    expect(projects.map(({ folder }) => folder).sort()).toEqual([
      "codex-anime",
      "codex-detailed",
      "deepseek-clean",
      "deepseek-detailed",
      "deepseek-prepared",
      "kimi-clean",
      "kimi-design",
      "kimi-prepared",
    ]);
  });

  test("keeps the documentation-only result honest", () => {
    const handoff = projects.find(({ slug }) => slug === "kimi-design");
    expect(handoff?.kind).toBe("documentation");
    expect(handoff?.description).toContain("без реализации");
  });

  test("builds six Astro apps and keeps the anime case static", () => {
    expect(astroProjects).toHaveLength(6);
    expect(astroProjects).not.toContain("codex-anime");
    expect(projects.filter(({ kind }) => kind === "runtime")).toHaveLength(7);
  });
});

describe("assembled site", () => {
  test("contains all routes after a build", () => {
    if (!existsSync(resolve(root, "dist/index.html"))) return;

    const index = readFileSync(resolve(root, "dist/index.html"), "utf8");
    for (const project of projects) {
      expect(index).toContain(`./projects/${project.slug}/`);
      expect(existsSync(resolve(root, `dist/projects/${project.slug}/index.html`))).toBe(true);
    }
  });

  test("packages only the selected anime runtime media", () => {
    if (!existsSync(resolve(root, "dist/projects/codex-anime"))) return;

    expect(
      existsSync(
        resolve(root, "dist/projects/codex-anime/artifacts/videos/mikan-field-day-loop-48.webm"),
      ),
    ).toBe(true);
    expect(
      existsSync(
        resolve(root, "dist/projects/codex-anime/artifacts/videos/mikan-brand-bg-master.mov"),
      ),
    ).toBe(false);
  });
});
