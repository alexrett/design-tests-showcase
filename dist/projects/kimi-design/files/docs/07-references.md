# Reference notes

Исследование проведено до подготовки design contract, чтобы не изобретать базовую
структуру auth screen и не путать design-only slice с будущей backend-интеграцией.

## Готовые UI-решения

- [shadcn authentication blocks](https://ui.shadcn.com/blocks/authentication) — официальный
  набор адаптивных auth blocks. `login-02` выбран как anatomy reference; конечный дизайн
  должен зеркалировать колонки и заменить visible-by-default password form на OAuth-first
  disclosure flow.
- [shadcn registry examples](https://ui.shadcn.com/docs/registry/examples) — официальный
  способ ставить и проверять blocks через registry, а не копировать случайный gist.

## Framework

- [Astro React integration](https://docs.astro.build/en/guides/integrations-guide/react/) —
  React components поддерживаются официальной integration и могут гидратироваться
  точечно.
- [Astro framework components](https://docs.astro.build/en/guides/framework-components/) —
  статические части не обязаны становиться React runtime.

## Auth и password safety

- [OWASP Authentication Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/Authentication_Cheat_Sheet.html) —
  length-first password policy, passphrases, paste/password managers, generic auth errors,
  отсутствие принудительных composition rules и периодической смены.
- [Better Auth email/password](https://better-auth.com/docs/authentication/email-password) —
  будущий integration reference; текущий slice его не устанавливает.
- [Better Auth Astro integration](https://better-auth.com/docs/integrations/astro) —
  подтверждает, что backend можно добавить позже без смены выбранного framework.

## Вывод

Готовое решение существует для структуры, но не для нужной продуктовой иерархии.
Поэтому используем официальный block как проверенный набор primitives и responsive anatomy,
а brand story, OAuth-first state machine, theme и визуальную систему проектируем отдельно.
