# Quality gates

## Автоматический gate

Финальная команда:

```bash
bun run quality
```

Она должна завершиться с exit code 0 и включает Astro Check, Biome, unit tests, production
build, Playwright acceptance tests и React Doctor.

До реализации используйте `bun run quality:setup`: acceptance tests намеренно красные.

## Обязательные скриншоты

Сохранить в `artifacts/qa/` и вручную открыть каждый файл:

1. `desktop-light-oauth.png` — 1440×900, light, default.
2. `desktop-dark-oauth.png` — 1440×900, dark, default.
3. `desktop-light-email-login.png` — 1440×900.
4. `desktop-dark-email-register.png` — 1440×900 с валидным длинным password hint/state.
5. `mobile-light-oauth.png` — 390×844.
6. `mobile-dark-email-register.png` — 390×844.

Дополнительно проверить 1280×720, 1024×768 и 320×568 без обязательного сохранения.

Для каждого скриншота заполнить `artifacts/qa/fidelity-ledger.md`:

| Проверка | Ожидание | Что видно | Исправление/статус |
|---|---|---|---|
| Hierarchy | OAuth доминирует, email доступен | … | … |
| Layout | История слева, auth справа | … | … |
| Typography | Нет случайных размеров/переносов | … | … |
| Theme | Сохранена иерархия и contrast | … | … |
| Motion/state | Переход объясняет изменение | … | … |
| Responsive | Нет crop/overflow | … | … |

Снимок не считается проверенным, пока он не был открыт и визуально просмотрен.

## Functional checklist

- [ ] Все provider buttons дают честный demo loading + notice.
- [ ] Email form не видна и не находится в tab order по умолчанию.
- [ ] Email action открывает login mode.
- [ ] Tabs переключают login/register без потери общих значений email/password.
- [ ] Back возвращает OAuth state и focus на email action.
- [ ] Show/hide password работает и меняет accessible name.
- [ ] Validation появляется после blur/submit и фокусирует первое invalid field.
- [ ] Forgot password показывает demo notice.
- [ ] Theme system/light/dark работает и сохраняет override.
- [ ] System theme реагирует на изменение OS preference.
- [ ] Нет console errors, failed requests и `href="#"`.

## Accessibility checklist

- [ ] axe не находит violations в default, login и registration states.
- [ ] Все элементы достижимы клавиатурой в логичном порядке.
- [ ] Видимый focus проходит WCAG contrast и не обрезан overflow.
- [ ] Labels программно связаны с controls.
- [ ] Errors имеют `aria-describedby`; invalid controls — `aria-invalid`.
- [ ] Loading state объявляется screen reader и блокирует повторный submit.
- [ ] Provider icons декоративны при наличии полного button label.
- [ ] Theme control и password visibility имеют однозначные accessible names.
- [ ] При 200% zoom содержание остается доступным.
- [ ] Reduced motion выключает декоративное движение.

## Visual hard stops

Работа не принимается при любом из условий:

- email fields видны на стартовом экране;
- provider buttons оказались icon-only на mobile;
- left story исчезла на mobile;
- desktop 1280×720 требует скролла до email action;
- есть horizontal overflow на 320 px;
- copy обрезана, случайно переносится или заменена английской;
- dark theme теряет borders, focus или muted text contrast;
- generic gradient/orbs/stock photo стали главным визуальным приемом;
- весь интерфейс заключен в giant Card;
- controls используют разные радиусы, heights или typography без причины;
- motion продолжает работать при reduced motion;
- кнопки inert или имитируют реальную отправку данных.

## Оценочная рубрика

| Область | Баллы |
|---|---:|
| Бренд и ясность назначения | 15 |
| OAuth-first hierarchy | 15 |
| Композиция и responsive | 15 |
| Fidelity дизайн-системе | 15 |
| Типографика и микрокопия | 10 |
| Состояния и motion | 10 |
| Accessibility | 10 |
| Инженерная дисциплина и TDD | 10 |

Минимум для handoff — 90/100 и отсутствие visual hard stops. Самооценку с одним
предложением evidence на каждый пункт сохранить в `artifacts/qa/scorecard.md`.

