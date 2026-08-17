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

  test("publishes the Open Design auth artifact as a runtime result", () => {
    const openDesign = projects.find(({ slug }) => slug === "kimi-design");
    expect(openDesign?.kind).toBe("runtime");
    expect(openDesign?.title).toContain("Open Design");

    const artifact = resolve(root, "src/kimi-design.html");
    expect(existsSync(artifact)).toBe(true);
    expect(readFileSync(artifact, "utf8")).toContain("Вход · Обучалкинская слабода");
    expect(existsSync(resolve(root, "src/thumbnails/kimi-design.jpg"))).toBe(true);
  });

  test("builds six Astro apps and keeps two standalone artifacts static", () => {
    expect(astroProjects).toHaveLength(6);
    expect(astroProjects).not.toContain("codex-anime");
    expect(astroProjects).not.toContain("kimi-design");
    expect(projects.filter(({ kind }) => kind === "runtime")).toHaveLength(8);
  });
});

describe("assembled site", () => {
  test("contains all routes after a build", () => {
    if (!existsSync(resolve(root, "dist/index.html"))) return;

    const index = readFileSync(resolve(root, "dist/index.html"), "utf8");
    expect(index).not.toContain("дизайн-handoff");
    expect(index.replace(/\s+/g, " ")).toContain(
      "один интерактивный дизайн-прототип",
    );
    for (const project of projects) {
      expect(index).toContain(`./projects/${project.slug}/`);
      expect(existsSync(resolve(root, `dist/projects/${project.slug}/index.html`))).toBe(true);
    }

    expect(
      readFileSync(resolve(root, "dist/projects/kimi-design/index.html"), "utf8"),
    ).toContain("Вход · Обучалкинская слабода");
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
