# AGENTS.md

## Миссия

Создать не шаблонную страницу авторизации, а законченный, выразительный и спокойный
вход в образовательный продукт «Обучалкинская слабода». Репозиторий содержит контракт,
но не содержит готового продуктового UI. Реализация начинается только после чтения всех
файлов из раздела «Порядок работы».

## Порядок работы — обязателен

1. Прочитать `README.md` и все документы `docs/01`–`docs/07` по порядку.
2. Изучить `design/tokens.json` и текущий `components.json`.
3. Запустить `bun run quality:setup` и зафиксировать зеленый baseline.
4. Запустить `bun run test:e2e` и убедиться, что acceptance-тесты красные именно из-за
   отсутствующего UI, а не из-за сломанного окружения.
5. До JSX составить краткий implementation inventory: компоненты, состояния, адаптивные
   переходы, анимации и список скриншотов. Положить его в `artifacts/qa/implementation-plan.md`.
6. Работать через TDD: красный тест → минимальная реализация → зеленый тест → рефакторинг.
7. Проверять UI в настоящем браузере после каждого законченного состояния, а не только
   через build и DOM-тесты.
8. Перед завершением выполнить весь чек-лист `docs/05-quality-gates.md` и `bun run quality`.

Если входящий пользовательский запрос явно противоречит этому файлу, запрос пользователя
имеет приоритет. Не отменяй ограничения молча: коротко зафиксируй принятое отклонение.

## Scope

Текущий срез — **исключительно дизайн и локальные интерактивные состояния** экрана входа
и регистрации.

Нужно:

- один production-quality auth screen;
- OAuth-first стартовое состояние: Google, Microsoft, GitHub;
- доступный, но закрытый по умолчанию email login/register flow;
- светлая, темная и системная темы;
- responsive desktop/tablet/mobile;
- локально работающие loading/error/success демонстрации без реального auth;
- визуальные и accessibility evidence.

Не нужно:

- backend, API routes, Better Auth, Elysia, Drizzle, БД, OAuth credentials;
- фейковые сетевые запросы, секреты, `.env` и заглушки серверных контрактов;
- dashboard, onboarding после входа, маркетинговый лендинг;
- лишние зависимости и абстракции «на будущее».

Если backend не нужен для видимого поведения, его не существует в этом срезе.

## Зафиксированный стек

- Bun — package manager, scripts и test runner orchestration.
- Astro + официальная React integration. Слово `astrajs` в исходной постановке трактуется
  как Astro, не как отдельный неизвестный framework.
- React только для интерактивного auth island; статическая оболочка остается Astro.
- Tailwind CSS v4 + shadcn/ui, preset Radix Nova.
- Lucide — интерфейсные и брендовые пиктограммы. Брендовые знаки OAuth-провайдеров
  должны быть узнаваемыми provider glyphs, а не случайными Lucide-заменами.
- Biome + Astro Check + React Doctor.
- Vitest/Testing Library для unit/component behavior, Playwright + axe для black-box QA.

Не заменять этот стек standalone Vite SPA, Next.js, CSS-in-JS или другим UI kit.

## Сначала готовые реализации

Перед созданием компонента проверь официальный registry:

```bash
bunx --bun shadcn@latest info
bunx --bun shadcn@latest search @shadcn -q "login"
bunx --bun shadcn@latest view @shadcn/login-02
```

`@shadcn/login-02` — разрешенная структурная референсная база: две колонки, responsive
collapse, `FieldGroup`/`Field`. Ее нельзя копировать как конечный дизайн: колонки надо
зеркалировать (история слева, auth справа), provider-first hierarchy и email disclosure
отличаются от блока. Registry всегда указывать явно. Перед добавлением компонента читать
актуальную документацию через `bunx --bun shadcn@latest docs <component>`.

## Компонентные правила

- Сначала shadcn primitives, затем композиция; custom primitive — только если аналога нет.
- Формы: `FieldGroup`, `Field`, `FieldLabel`, `FieldDescription`, `FieldSeparator`, `Input`.
- Переключение «Вход / Регистрация»: `Tabs`, где `TabsTrigger` находится в `TabsList`.
- Состояния и ошибки: inline field errors; общий mock-result — `Alert` или `sonner`.
- Loading button: `Spinner` + `disabled`, без выдуманного `isLoading` prop.
- `Separator`, `Alert`, `Button`, `Tabs` не заменять стилизованными `div`.
- Использовать built-in variants и semantic colors. Не писать raw `blue-*`, `gray-*`,
  произвольные `dark:` цвета и ручные z-index для overlay.
- `className` служит прежде всего layout-композиции; повторяемый внешний вид оформлять
  токеном или variant.
- В flex/grid использовать `gap-*`, не `space-x-*`/`space-y-*`.
- Иконки в `Button` получают `data-icon`; размер внутри shadcn controls не переопределять.
- Не собирать весь экран в одном `App.tsx`. Нужны небольшие компоненты по состояниям и
  одна ясная точка владения state machine.

## UX-инварианты — нарушение блокирует приемку

- На первом кадре видны все три OAuth action и одна явная email action.
- Поля email/password/name на первом кадре не видны.
- OAuth визуально доминирует, но ни один провайдер не выглядит обязательным.
- Email action не прячется в меню, мелкую ссылку или нижний край экрана.
- После открытия email режима доступны «Вход», «Регистрация» и возврат к быстрому входу.
- Регистрация не требует подтверждения пароля и не вводит composition rules.
- Password contract: минимум 15, максимум 128 символов, разрешены пробелы/Unicode,
  paste не блокируется, есть show/hide и понятная подсказка.
- Все controls работают локально; никаких inert buttons. Mock-поведение явно маркируется
  как демонстрация и не притворяется успешной серверной авторизацией.
- Системная тема — default; ручной выбор light/dark/system сохраняется локально.
- Keyboard focus логичен и возвращается к email trigger при закрытии email режима.

Полный state contract: `docs/03-ux-contract.md`.

## Визуальные инварианты

- Арт-дирекция «Свет в окнах» из `docs/02-design-direction.md` — источник истины.
- Desktop: содержательная брендовая часть слева, auth справа. Не менять стороны.
- Форма живет на открытом спокойном canvas; не заключать весь auth в гигантскую карточку.
- Никаких generic purple gradient, floating orb wallpaper, стеклянных карточек ради эффекта,
  bento-grid, stock photo студента, фейковых метрик или отзывов.
- Не добавлять eyebrow/badge над главным заголовком.
- Использовать только semantic tokens из `src/styles/global.css` и `design/tokens.json`.
- Типографика: Manrope Variable для UI, Lora Variable для ключевой брендовой строки.
- Логомарк: `LibraryBig` из Lucide. Не рисовать новый логотип и не использовать emoji.
- Motion помогает понять переходы. Максимальный UI transition 240 ms; decorative motion
  медленный и едва заметный; `prefers-reduced-motion` отключает необязательное движение.
- На mobile левая история сжимается в брендовый intro, но не исчезает полностью.

## Качество и завершение

До handoff обязательны:

```bash
bun run quality
```

А также реальные скриншоты шести состояний из `docs/05-quality-gates.md`, ручное сравнение,
проверка клавиатуры, reduced motion, system theme и отсутствие horizontal overflow.

Нельзя объявлять работу законченной, если:

- `quality` не зеленый;
- есть серьезные замечания React Doctor или axe;
- отсутствует хотя бы один обязательный state/viewport screenshot;
- email form видна по умолчанию;
- темная тема является инверсией с потерей иерархии;
- mobile выглядит как обрезанный desktop;
- остались placeholder copy, `href="#"`, console errors или неработающие controls.
