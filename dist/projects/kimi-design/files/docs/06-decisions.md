# Architecture and design decisions

## ADR-001 — Astro + React island

**Решение:** Astro отвечает за страницу и shell, React — за интерактивный auth state.

**Почему:** постановка просит React и «astrajs»; официальная React integration Astro
поддерживает hydration ровно там, где она нужна. Полная SPA для одного auth screen добавит
runtime и структуру без пользовательской пользы.

## ADR-002 — shadcn/ui Radix Nova

**Решение:** использовать уже инициализированный официальный shadcn preset и registry.

**Почему:** формы, tabs, alerts, buttons и focus behavior уже имеют качественные primitives.
Custom markup допустим для layout и уникального branded motif, но не для переизобретения
controls.

## ADR-003 — login-02 только как structural reference

**Решение:** изучить `@shadcn/login-02`, затем зеркалировать и переработать.

**Почему:** блок подтверждает жизнеспособную two-column anatomy, но показывает форму по
умолчанию и не решает OAuth-first задачу. `login-04` с центральной большой Card намеренно
не выбран: он ослабляет full-screen split и ведет к шаблонному результату.

## ADR-004 — backend отсутствует

**Решение:** не подключать Better Auth, Elysia, Drizzle, БД и provider credentials.

**Почему:** пользователь просит только дизайн. Локальная state machine дает проверить
loading/error/success без ложной инфраструктуры. Будущая интеграция сможет использовать
Better Auth, но этот контракт не должен определять текущую композицию.

## ADR-005 — password policy 15–128

**Решение:** минимальная длина 15, максимальная 128, без composition rules.

**Почему:** email/password здесь является single-factor fallback. Политика допускает
passphrases, Unicode, пробелы и password managers; требования вида «одна цифра и символ»
не добавляются. Проверка breached passwords остается backend responsibility.

## ADR-006 — test contract до UI

**Решение:** black-box acceptance tests существуют до реализации и сейчас красные.

**Почему:** тесты фиксируют продуктовую иерархию и доступность, не структуру React tree.
Агент может свободно выбрать архитектуру компонентов, но не может случайно показать
email form по умолчанию или потерять provider action.

## ADR-007 — один distinct visual concept

**Решение:** «Свет в окнах», а не набор трех moodboard-вариантов.

**Почему:** задача — довести один экран до agency-level coherence. Много направлений без
этапа пользовательского выбора распыляет решение и возвращает модель к усредненному UI.

