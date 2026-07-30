# Smart Logistics

SPA для работы с грузовыми аукционами. Проект строится по OpenAPI-контракту;
целевой стек включает React, TypeScript, Vite, TanStack Router/Query, Zod, React
Hook Form, MSW, Feature-Sliced Design и MobX для точечного UI-state.

## Текущий статус

Завершена фундаментальная веха: настроены сборка, проверки качества, тесты,
Tailwind CSS, shadcn/ui, FSD-структура, TanStack Router, QueryClient и MobX.
Стартовый маршрут `/` показывает адаптивный каркас будущего списка аукционов.

Функциональность аукционов, API-клиент и MSW-моки пока не реализованы: в
репозитории отсутствует обязательный контракт `openapi.auctions.v0.json`.
Без него нельзя корректно описать DTO, enum-значения, nullable-поля и ошибки.

## Запуск

Проверено на Node.js `24.12.0` и npm `11.6.2`.

```bash
npm ci
npm run dev
```

Vite выведет адрес локального сервера в терминал.

## Команды

```bash
# Статическая проверка TypeScript
npm run typecheck

# ESLint
npm run lint

# Проверка форматирования Prettier
npm run format:check

# Unit и component-тесты Vitest
npm run test

# Production-сборка
npm run build
```

## Что проверено

На текущей вехе успешно выполнены `typecheck`, `lint`, `format:check`, `test` и
`build`.

Тесты покрывают два базовых сценария:

- маршрут `/` рендерится через приложенческие Router/Query-провайдеры;
- страница будущего списка отображает заголовок «Аукционы».

## Структура

- `src/app` — инициализация, глобальная конфигурация и провайдеры;
- `src/pages` — страницы маршрутов;
- `src/widgets` — составные элементы интерфейса;
- `src/shared` — UI-примитивы, utilities и assets.

Правила разработки и порядок дальнейших вех описаны в
[DEVELOPMENT_GUIDELINES.md](./DEVELOPMENT_GUIDELINES.md),
[WORK_PLAN.md](./WORK_PLAN.md) и [MILESTONE_1_COMMITS.md](./MILESTONE_1_COMMITS.md).
