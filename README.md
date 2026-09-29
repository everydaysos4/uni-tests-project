# PERSKY SAFEBOARD\_ — лабораторная работа № 1

![Lines](badges/coverage-lines.svg)
![Branches](badges/coverage-branches.svg)
![Statements](badges/coverage-statements.svg)

Учебное React-приложение моделирует внутреннюю директорию специалистов платформы
безопасности SafeBoard. В [лабораторной работе № 1](docs/lab-report.md) проект
рефакторингован для тестируемости, покрыт модульными и интеграционными тестами,
добавлены автоматические бейджи и CI.

## Что умеет приложение

- `/` — приветственная страница;
- `/users` — загрузка, поиск, сортировка, добавление и удаление сотрудников;
- `/groups` — состав, счётчики и пустые состояния рабочих групп.

Данные загружаются из `db.json` через `json-server`. В тестах HTTP-граница подменяется,
поэтому backend для их запуска не нужен.

## Стек

React 19, React Router 7, Vite 8, Vitest 4, React Testing Library, Axios,
JSON Server, ESLint, Prettier, JavaScript.

## Запуск

Требуется Node.js 22. Установка зависимостей:

```bash
npm ci
```

В двух терминалах:

```bash
npm run server
npm run dev
```

- frontend: `http://localhost:5173`;
- mock API: `http://localhost:3001`.

## Тесты и проверки

| Модуль                                       | Тесты                                                                                                   | Проверяемое поведение                                                        |
| -------------------------------------------- | ------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------- |
| `UserDirectory`, `UserSorter`, `useSortHook` | [user-directory](tests/unit/user-directory.test.js), [use-sort-hook](tests/unit/use-sort-hook.test.jsx) | Поиск по имени/username, регистр, asc/desc, `groupId`, равные значения       |
| `UserDraft`, `AddUserModal`                  | [user-draft](tests/unit/user-draft.test.js), [add-user-modal](tests/unit/add-user-modal.test.jsx)       | `trim`, числовой ID/`null`, отправка и способы закрытия модалки              |
| `UsersApi`, `useUsersState`                  | [users-api](tests/unit/users-api.test.js), [use-users-state](tests/unit/use-users-state.test.jsx)       | Подменяемый HTTP/API-контракт, успех и ошибки add/delete                     |
| `UsersPage`                                  | [users-page](tests/integration/users-page.test.jsx)                                                     | Загрузка, поиск, сортировка, форма, сохранение формы при ошибке, add/delete  |
| `GroupsPage`                                 | [groups-page](tests/integration/groups-page.test.jsx)                                                   | Загрузка/ошибка, сортировка, счётчики, пустая группа и сотрудники без группы |
| Маршруты и навигация                         | [app-navigation](tests/integration/app-navigation.test.jsx)                                             | Home, Users, Groups и активные ссылки                                        |

Основные команды:

```bash
npm run test:run       # однократный запуск 28 тестов
npm run test:coverage  # тесты, coverage/ и пересоздание SVG-бейджей
npm run coverage:badges
npm run lint
npm run format:check
npm run build
npm run benchmark
```

После `npm run test:coverage` HTML-отчёт доступен в `coverage/index.html`. На macOS:

```bash
open coverage/index.html
```

## Покрытие

Итоговое локальное измерение: **2026-09-29**, коммит `aaf22f7`.

|          Lines |     Branches |     Statements |    Functions |
| -------------: | -----------: | -------------: | -----------: |
| 100% (182/182) | 100% (85/85) | 100% (190/190) | 100% (76/76) |

Область измерения — все прикладные `src/**/*.{js,jsx}`, включая неимпортированные тестами файлы.
Исключён только `src/app/main.jsx`: это техническая точка входа, которая связывает React с DOM.
Тесты, конфиги, скрипты, стили и сторонний код не входят в `coverage.include`.
Отчёт и бейджи используют один `coverage/coverage-summary.json`.

## CI и pre-push

[`CI`](.github/workflows/ci.yml) запускается на каждый `push` и `pull_request` и выполняет:

1. `npm ci`;
2. lint и проверку Prettier;
3. тесты с покрытием и порогом не ниже 98%;
4. проверку актуальности бейджей;
5. production build;
6. публикацию HTML coverage как artifact.

Запуски в GitHub: [Actions / CI](https://github.com/everydaysos4/uni-tests-project/actions/workflows/ci.yml).
Контрольный [push-run для `aaf22f7`](https://github.com/everydaysos4/uni-tests-project/actions/runs/36558746481)
завершён со статусом `success`.

Локальный hook подключается только для этого клона:

```bash
git config --local core.hooksPath .githooks
```

`pre-push` выполняет lint и быстрые тесты. Он не заменяет CI.

Обязательный check для `main` настраивается в GitHub после первого запуска workflow:

1. `Settings` → `Rules` → `Rulesets` → `New branch ruleset`;
2. target branch — `main`, enforcement — `Active`;
3. включить `Require status checks to pass before merging`;
4. добавить check `quality`.

Подробнее: [GitHub Docs — Creating rulesets](https://docs.github.com/en/repositories/configuring-branches-and-merges-in-your-repository/managing-rulesets/creating-rulesets-for-a-repository).
В рамках работы required check не включался: добавление YAML само по себе не блокирует merge.

## Структура

```text
src/                    прикладной код
tests/unit/             модульные тесты
tests/integration/      интеграционные RTL-тесты
scripts/                бейджи и benchmark
badges/                 сгенерированные SVG
.github/workflows/      GitHub Actions
.githooks/              версионируемые Git hooks
docs/lab-report.md      отчёт по лабораторной
db.json                 данные json-server
```
