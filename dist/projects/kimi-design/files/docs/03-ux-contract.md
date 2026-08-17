# UX contract

## State model

| State | Что видимо | Главный переход |
|---|---|---|
| `oauth` | Google, Microsoft, GitHub, email action, legal copy | email action → `email.login` |
| `oauth.pending` | выбранный provider loading, остальные disabled | mock result → `oauth.notice` |
| `oauth.notice` | честное demo-сообщение, provider actions снова доступны | close/retry → `oauth` |
| `email.login` | Tabs, email, password, forgot link, submit, back | tab → `email.register` |
| `email.register` | Tabs, name, email, password, policy hint, submit, back | tab → `email.login` |
| `email.invalid` | те же поля + inline errors | исправление → соответствующий email state |
| `email.pending` | submit loading, поля disabled, layout стабилен | mock result → `email.notice` |
| `email.notice` | честный demo-result и возможность продолжить | back/retry |

Не хранить одну россыпь несвязанных booleans. Использовать discriminated state или другой
явный конечный автомат, который не допускает одновременно OAuth и две email-формы.

## Default OAuth-first state

- Порядок: Google → Microsoft → GitHub.
- Все кнопки полноширинные, подписанные, одинаковой высоты.
- Email fields отсутствуют из визуального и tab order.
- После provider click кнопка показывает локальный loading state, затем сообщение вроде
  «Демо-режим: в рабочем продукте откроется вход через Google».
- Нельзя делать настоящий redirect, открывать popup или запрашивать credentials.

## Email disclosure

- Label: «Войти или зарегистрироваться по почте».
- Действие визуально слабее provider group, но имеет размер полноценной кнопки.
- После открытия heading и layout не должны прыгать за пределы viewport.
- `email.login` активен по умолчанию.
- Сверху или в естественном месте есть кнопка «К быстрому входу»; это button, не `href="#"`.
- При возврате focus возвращается на email disclosure control.

## Вход по email

- Поля: «Электронная почта», «Пароль».
- `autocomplete="email"` и `autocomplete="current-password"`.
- «Забыли пароль?» остается доступным, но в demo показывает честное локальное сообщение.
- Ошибка credentials формулируется обобщенно и не раскрывает существование аккаунта.

## Регистрация по email

- Поля: «Как вас зовут», «Электронная почта», «Пароль».
- `autocomplete="name"`, `email`, `new-password`.
- Подтверждение пароля не требуется.
- Требования к password:
  - 15–128 символов;
  - Unicode и пробелы разрешены;
  - никаких обязательных uppercase/цифр/спецсимволов;
  - paste и password managers не блокируются;
  - show/hide button имеет меняющийся accessible name;
  - meter или понятный текст помогает, но не обещает точную «энтропию».
- Проверка breached passwords обозначается как будущая backend responsibility и не
  симулируется ложным зеленым статусом.

## Validation

- Ошибки появляются после blur или submit, не при первом keystroke.
- `data-invalid` ставится на `Field`, `aria-invalid` — на control.
- Сообщение конкретное: «Введите адрес в формате name@example.com», а не «Ошибка».
- Error text связан с control через `aria-describedby`.
- После submit с ошибками focus получает первое invalid field.
- Loading не стирает введенные значения.

## Theme behavior

- Первое посещение следует `prefers-color-scheme` без заметного flash неправильной темы.
- Выбор: «Системная», «Светлая», «Темная»; default — «Системная».
- Явный выбор сохраняется в `localStorage`; system option удаляет override.
- Изменение системной темы обновляет UI, пока выбран system mode.
- Theme control имеет accessible label и не конкурирует с auth CTA.

## Keyboard и focus

- Порядок: theme control → Google → Microsoft → GitHub → email → legal links.
- В email mode: back → tabs → fields по естественному порядку → submit → legal.
- Enter отправляет активную email форму; Escape не должен случайно закрывать и терять ввод.
- Focus style видим на hero и auth surfaces.
- Ни один интерактивный элемент не доступен только через hover.

## Responsive и overflow

- Ни одно состояние не создает horizontal scroll на 320 px.
- Ошибки, длинные email и русская копия не ломают ширину кнопок.
- Mobile browser с virtual keyboard сохраняет доступ к submit через обычный page scroll.
- Использовать `svh`, а не полагаться только на `100vh`.

