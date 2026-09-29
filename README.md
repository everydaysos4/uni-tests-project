# Team Directory

![Lines](badges/coverage-lines.svg)
![Branches](badges/coverage-branches.svg)
![Statements](badges/coverage-statements.svg)

Team Directory — приложение для просмотра сотрудников и рабочих групп.

## Возможности

- поиск сотрудников по имени и username;
- сортировка таблицы;
- добавление и удаление сотрудников;
- просмотр состава групп;
- отображение состояний загрузки и ошибок API.

## Стек

- React 19;
- React Router 7;
- Vite 8;
- Axios;
- JSON Server;
- ESLint;
- Prettier;
- CSS Modules;
- JavaScript.

## Технологии тестирования

- Vitest;
- React Testing Library;
- `jest-dom`;
- `user-event` и `fireEvent`;
- jsdom;
- V8 Coverage;
- mock-объекты и подмена API-границы.

Подробнее: [сценарии и покрытие](docs/testing.md).

## Что тестируется

- функции API `getUsersData`, `getGroupsData`, `addUser` и `deleteUser` с подменённым HTTP-клиентом;
- чистые функции `filterUsers` и `sortUsers`;
- хуки `useAddUserModal`, `useSortHook` и `useUsersState`;
- компоненты страниц сотрудников и групп, форма добавления, таблица и маршрутизация приложения.

## Запуск

Установить зависимости:

```bash
npm ci
```

Запустить API:

```bash
npm run server
```

Запустить frontend:

```bash
npm run dev
```

- frontend: `http://localhost:5173`;
- API: `http://localhost:3001`.

## Проверки

```bash
npm run test:run
npm run test:coverage
npm run lint
npm run format:check
npm run build
```

Тесты не требуют запущенного API. HTML-отчёт создаётся в `coverage/index.html`.

## Покрытие

| Lines | Branches | Statements | Functions |
| ----: | -------: | ---------: | --------: |
|  100% |     100% |       100% |      100% |

Покрытие считается для прикладных JavaScript/JSX-файлов в `src`; техническая точка входа `main.jsx`
исключена.

## CI

[GitHub Actions](https://github.com/everydaysos4/uni-tests-project/actions/workflows/ci.yml) при каждом push запускает установку
зависимостей, lint, проверку форматирования, тесты с покрытием и production build.
