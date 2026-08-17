# Design direction — «Свет в окнах»

## Одна визуальная идея

Знание складывается из небольших регулярных шагов, как вечерний свет постепенно
появляется в окнах общего учебного пространства. Левая часть экрана интерпретирует эту
идею через спокойную архитектурную сетку: линии страниц, несколько теплых «окон» и один
маршрут прогресса. Это абстракция, не буквальная деревня и не иллюстрация школы.

Эффект должен быть редакционным и дорогим: много воздуха, сильная типографика, один
акцентный сюжет. Не добавлять россыпь декоративных объектов.

## Композиция

### Desktop, 1024 px и шире

```text
┌──────────────────────────── 56% ───────────────────────────┬────── 44% ──────┐
│ бренд                                                      │ theme control   │
│                                                            │                 │
│ крупная фраза + короткое объяснение                        │ auth cluster    │
│                                                            │ max-width 400   │
│ абстрактная «сетка окон» / путь обучения                   │                 │
│                                                            │ legal copy      │
└────────────────────────────────────────────────────────────┴─────────────────┘
```

- Левая часть — цельная брендовая поверхность, не Card.
- Правая часть — открытый спокойный canvas. Auth cluster не оборачивать в большую
  floating card; допустима только локальная поверхность у конкретного state/message.
- Минимальная высота — `100svh`; на низком desktop приоритет у действий, не у декора.
- Form/content width: 360–400 px; правый gutter визуально не меньше 32 px.

### Tablet, 768–1023 px

- Две части переходят в вертикальную композицию.
- Брендовая часть занимает примерно 260–320 px и сохраняет headline + сокращенный motif.
- Auth часть центрируется по горизонтали и не выглядит отдельной модалкой.

### Mobile, до 767 px

- Компактный branded intro сверху: знак, название и одна содержательная строка.
- Большая декоративная сетка сокращается до одного фрагмента или фонового ритма.
- Auth занимает основной поток страницы с минимум 20 px side gutters.
- Provider buttons остаются полноширинными и подписанными; не превращать их в три
  непонятные icon-only кнопки.

## Цвет

Источник истины — `design/tokens.json` и соответствующие переменные
`src/styles/global.css`.

- Основа light theme: слегка теплый бумажный фон, глубокие чернильные буквы.
- Основа dark theme: не абсолютный black, а глубокий сине-чернильный фон.
- Primary cobalt — действие и focus, не декоративная заливка половины интерфейса.
- Warm amber — редкий сигнал «света в окне», не второй CTA color.
- Hero surface темнее и насыщеннее canvas; текст на ней почти белый.
- Цвета компонентов только semantic: `background`, `foreground`, `primary`, `muted`,
  `accent`, `border`, `hero`, `hero-accent`.

Темная тема — самостоятельная настройка иерархии. Не применять blanket filter,
`brightness`, grayscale или непродуманную инверсию.

## Типографика

- UI, controls, labels, body: **Manrope Variable**.
- Ключевая брендовая строка слева: **Lora Variable**; максимум один serif level.
- Все шрифты локальны через Fontsource; не делать runtime-запрос к Google Fonts.
- Основной headline desktop: 48–60 px, line-height 0.98–1.08, не более трех строк.
- Headline mobile: 30–36 px.
- Auth heading: 28–32 px; body 15–16 px; labels/controls 14–15 px.
- Не использовать all caps и letter-spacing как декоративную компенсацию слабой иерархии.

## Бренд и иконки

- Логомарк: `LibraryBig` из `lucide-react`.
- Контейнер логомарка простой, 32–36 px, без gradient и псевдогеральдики.
- Stroke и optical weight едины во всех interface icons.
- Google/Microsoft/GitHub получают узнаваемые brand glyphs. Не подменять Microsoft
  `PanelsTopLeft`, а Google — `Chrome`.
- Provider glyph может быть полноцветным только если это не разрушает иерархию light/dark;
  предпочтителен аккуратный brand-correct treatment на нейтральной кнопке.

## Компонентный характер

- Radius: 12 px base; небольшие controls не превращать в pills.
- Border — тонкий, низкоконтрастный, но видимый в обеих темах.
- Shadow — редкий и широкий; основной depth создается фоном и border.
- OAuth buttons — одинаковый размер и визуальный вес; full width, 46–48 px height.
- Email action — full-width outline/secondary button после `FieldSeparator`.
- Focus ring заметнее hover. Hover не двигает layout.

## Motion

- Вход контента: opacity + 8–12 px translate, 220–360 ms, один раз.
- Переключение OAuth ↔ email: 180–220 ms; высота меняется контролируемо без прыжка всей
  страницы. Focus перемещается после завершения state transition.
- Decorative «окна»: очень медленное изменение opacity, 10–16 s; не все элементы сразу.
- Button loading: spinner без изменения ширины label container.
- `prefers-reduced-motion: reduce`: убрать translate, parallax и бесконечную анимацию,
  оставить мгновенную смену состояния или короткий fade.

## Запрещенные shortcuts

- generic purple/blue gradient background;
- aurora mesh, floating blobs/orbs, excessive glow;
- glassmorphism и backdrop blur без функциональной причины;
- stock photo человека за ноутбуком;
- буквальные книги, карандаши, graduation caps россыпью;
- card-in-card и bento grid;
- fake testimonial, rating, student count или course metrics;
- decorative badge/eyebrow над headline;
- default shadcn login block без переосмысления.

