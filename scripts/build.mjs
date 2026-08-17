import {
  cpSync,
  existsSync,
  mkdirSync,
  readdirSync,
  readFileSync,
  rmSync,
  writeFileSync,
} from "node:fs";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { spawnSync } from "node:child_process";
import { astroProjects, projects } from "../src/projects.mjs";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const experimentsRoot = resolve(root, "../design-tests");
const outputRoot = join(root, "dist");
const pagesBase = "/design-tests-showcase";

const runtimeAssets = [
  "artifacts/images/mikan-brand-alpha-poster.webp",
  "artifacts/images/mikan-field-day-poster.jpg",
  "artifacts/images/mikan-field-night-poster.jpg",
  "artifacts/videos/mikan-brand-alpha.webm",
  "artifacts/videos/mikan-field-day-loop-48.webm",
  "artifacts/videos/mikan-field-night-loop-48.webm",
];

function ensureParent(path) {
  mkdirSync(dirname(path), { recursive: true });
}

function copyFile(source, destination) {
  ensureParent(destination);
  cpSync(source, destination);
}

function escapeHtml(value) {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;");
}

function projectCard(project) {
  const title = escapeHtml(project.title);
  const description = escapeHtml(project.description);
  const slug = escapeHtml(project.slug);
  const common = `
      <h3>${title}</h3>
      <p class="project-slug">/${slug}/</p>`;

  if (project.kind === "documentation") {
    return `<a class="project-card project-card--documentation" href="./projects/${slug}/" aria-label="${title}. ${description}">
      <div class="project-preview">
        <div class="document-mark">
          <svg viewBox="0 0 64 64" aria-hidden="true">
            <path d="M15 5.5h23l11 11V58.5H15z" fill="none" stroke="currentColor" stroke-width="2"/>
            <path d="M38 5.5v12h11M23 30h18M23 38h18M23 46h12" fill="none" stroke="currentColor" stroke-width="2"/>
          </svg>
          <div><strong>Design handoff</strong><span>Документы, токены и критерии приёмки</span></div>
        </div>
      </div>${common}
    </a>`;
  }

  return `<a class="project-card" href="./projects/${slug}/" target="_blank" rel="noreferrer" aria-label="${title}. ${description}">
      <div class="project-preview">
        <img src="./thumbnails/${slug}.jpg" alt="Превью результата ${title}" width="1280" height="800" loading="lazy" />
      </div>${common}
    </a>`;
}

function postprocessHtml(directory, base) {
  const queue = [directory];

  while (queue.length > 0) {
    const current = queue.pop();
    for (const entry of readdirSync(current, { withFileTypes: true })) {
      const path = join(current, entry.name);
      if (entry.isDirectory()) {
        queue.push(path);
      } else if (entry.isFile() && path.endsWith(".html")) {
        const html = readFileSync(path, "utf8").replace(
          /(src|href|poster|component-url|renderer-url|before-hydration-url)="\/(?!\/)([^"]*)"/g,
          (match, attribute, value) =>
            value.startsWith("design-tests-showcase/")
              ? match
              : `${attribute}="${base}/${value}"`,
        );
        writeFileSync(path, html);
      }
    }
  }
}

function buildAstroProject(slug) {
  const source = join(experimentsRoot, slug);
  const destination = join(outputRoot, "projects", slug);
  const base = `${pagesBase}/projects/${slug}`;

  const result = spawnSync(
    "bunx",
    ["astro", "--base", base, "build", "--outDir", destination],
    { cwd: source, encoding: "utf8", stdio: "pipe" },
  );

  if (result.status !== 0) {
    process.stderr.write(result.stdout ?? "");
    process.stderr.write(result.stderr ?? "");
    throw new Error(`Failed to build ${slug}`);
  }

  console.log(`built ${slug}`);
  postprocessHtml(destination, base);
}

function buildAnimeProject() {
  const source = join(experimentsRoot, "codex-anime");
  const destination = join(outputRoot, "projects", "codex-anime");
  copyFile(join(source, "index.html"), join(destination, "index.html"));

  for (const asset of runtimeAssets) {
    copyFile(join(source, asset), join(destination, asset));
  }

  console.log("copied codex-anime final field version");
}

function buildOpenDesignProject() {
  const destination = join(outputRoot, "projects", "kimi-design");
  copyFile(
    join(root, "src", "kimi-design.html"),
    join(destination, "index.html"),
  );

  console.log("copied kimi-design Open Design artifact");
}

rmSync(outputRoot, { recursive: true, force: true });
mkdirSync(outputRoot, { recursive: true });

const template = readFileSync(join(root, "src", "index.template.html"), "utf8");
const cards = projects.map(projectCard).join("\n");
writeFileSync(join(outputRoot, "index.html"), template.replace("<!--PROJECT_CARDS-->", cards));
copyFile(join(root, "src", "styles.css"), join(outputRoot, "styles.css"));
writeFileSync(join(outputRoot, ".nojekyll"), "");

const thumbnailSource = join(root, "src", "thumbnails");
if (existsSync(thumbnailSource)) {
  cpSync(thumbnailSource, join(outputRoot, "thumbnails"), { recursive: true });
}

for (const slug of astroProjects) {
  buildAstroProject(slug);
}

buildAnimeProject();
buildOpenDesignProject();

console.log(`showcase ready at ${outputRoot}`);
