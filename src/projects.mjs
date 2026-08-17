export const projects = [
  {
    title: "Codex · detailed",
    slug: "codex-detailed",
    folder: "codex-detailed",
    description: "Подробная постановка, UX-контракт и самостоятельная реализация.",
    kind: "runtime",
  },
  {
    title: "DeepSeek · clean",
    slug: "deepseek-clean",
    folder: "deepseek-clean",
    description: "Исходная задача без заранее подготовленного дизайн-контекста.",
    kind: "runtime",
  },
  {
    title: "DeepSeek · detailed",
    slug: "deepseek-detailed",
    folder: "deepseek-detailed",
    description: "Расширенная постановка и более строгие требования к результату.",
    kind: "runtime",
  },
  {
    title: "DeepSeek · prepared",
    slug: "deepseek-prepared",
    folder: "deepseek-prepared",
    description: "Подготовленный harness, токены и критерии приёмки.",
    kind: "runtime",
  },
  {
    title: "Kimi · clean",
    slug: "kimi-clean",
    folder: "kimi-clean",
    description: "Реализация Kimi из минимального исходного контекста.",
    kind: "runtime",
  },
  {
    title: "Kimi · prepared",
    slug: "kimi-prepared",
    folder: "kimi-prepared",
    description: "Подготовленный контекст и обязательные quality gates.",
    kind: "runtime",
  },
  {
    title: "Codex · anime case",
    slug: "codex-anime",
    folder: "codex-anime",
    description: "Персонаж, видео, cursor gaze и анимированное поле день/ночь.",
    kind: "runtime",
  },
  {
    title: "Open Design · auth concept",
    slug: "kimi-design",
    folder: "kimi-design",
    description: "Интерактивный макет экрана входа, собранный в Open Design.",
    kind: "runtime",
  },
];

export const astroProjects = projects
  .filter(
    ({ kind, slug }) =>
      kind === "runtime" && !["codex-anime", "kimi-design"].includes(slug),
  )
  .map(({ slug }) => slug);
