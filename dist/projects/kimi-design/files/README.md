# Обучалкинская слабода — prepared design handoff

Этот репозиторий подготовлен для эксперимента с агентской разработкой auth-экрана.
Продуктовый интерфейс намеренно **не реализован**: здесь есть только технический каркас,
дизайн-система, UX-контракт, контент, тесты и критерии приемки.

## Что уже подготовлено

- Astro + React + Tailwind CSS v4;
- shadcn/ui (Radix, Nova, Lucide) и семантические design tokens;
- Bun как единственный package manager и основной runtime;
- Biome, Astro Check, Vitest, Playwright, axe и React Doctor;
- обязательные инструкции для агента в `AGENTS.md`;
- активные black-box acceptance-тесты, которые должны стать зелеными после реализации.

## Порядок чтения для агента

1. `AGENTS.md`
2. `docs/01-product-brief.md`
3. `docs/02-design-direction.md`
4. `docs/03-ux-contract.md`
5. `docs/04-content.md`
6. `docs/05-quality-gates.md`
7. `docs/06-decisions.md`
8. `docs/07-references.md`
9. `design/tokens.json`

## Команды

```bash
bun install
bun run dev
bun run quality:setup  # зеленая проверка подготовленного каркаса
bun run test:e2e      # сейчас красная: это acceptance contract будущего UI
bun run quality       # финальный gate после реализации
```

Первоначальная краснота `tests/e2e/auth.spec.ts` ожидаема: пустая страница — осознанный
sentinel, подтверждающий, что дизайн не был заранее реализован за следующего агента.
