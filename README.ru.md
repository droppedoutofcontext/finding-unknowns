<div align="center">

# finding-unknowns

**Claude Code skill для случаев, когда промпт ещё не дотягивает до спеки.**

[![License: MIT](https://img.shields.io/badge/license-MIT-blue)](LICENSE)
[![Claude Code plugin](https://img.shields.io/badge/Claude_Code-plugin-7c6cf0)](#установка)
[![Ideas by @trq212](https://img.shields.io/badge/ideas_by-%40trq212-1c9bf0)](https://x.com/trq212/article/2073100352921215386)

[English](README.md) · **Русский**

<img src="docs/four-directions.gif" width="820" alt="Анимация: Claude показывает четыре направления интерфейса, пользователь выбирает понравившиеся части, а артефакт собирает следующий промпт">

</div>

## Зачем

Вайбкодинг часто ломается не на генерации кода, а раньше: агент получает промпт, в котором не хватает
требований, taste constraints, edge cases или критериев ревью. После этого он заполняет пустоты своими
дефолтами и приносит рабочий, но не тот результат.

Типичные запросы:

> «Сделай поприятнее»  
> «Добавь шеринг, детали на твоё усмотрение»  
> «Перенеси как в референсе»  
> «Я готов это мержить?»

`finding-unknowns` добавляет перед дорогой реализацией короткий discovery pass. Агент делает маленький
self-contained HTML-артефакт, где можно выбрать варианты, подтвердить assumptions, отметить риски или
собрать дизайн-направление из частей. Внизу артефакт генерирует следующий промпт для чата.

Петля простая:

**render → choose → assemble prompt → implement.**

## Пример

Если попросить «сделай дашборд лучше», скилл не должен сразу переписывать интерфейс. Он может сначала
отрендерить четыре направления одного экрана: спокойную ops-консоль, плотный аналитический вид,
editorial-стиль и более терминальный вариант.

Ты отмечаешь: «берём density из C, header из A, palette из B, D точно нет». Артефакт собирает это в
реализационный промпт. Агент получает не абстрактное «сделай лучше», а конкретные constraints.

## Установка

```text
/plugin marketplace add droppedoutofcontext/finding-unknowns
/plugin install finding-unknowns@finding-unknowns
```

Либо скопируй скилл напрямую:

```text
cp -r skills/finding-unknowns ~/.claude/skills/
```

## Что внутри

Скилл выбирает технику под тип неизвестности:

- **Blindspot pass** — найти неизвестные требования в чужом модуле или домене.
- **Teach me my unknowns** — дать vocabulary для вкуса, качества или визуальных решений.
- **Four design directions** — показать несколько rendered вариантов и собрать fifth direction из частей.
- **Mock before you wire** — проверить placement и interaction до настоящей реализации.
- **Brainstorm on an effort axis** — разложить варианты от quick win до квартальной ставки.
- **The interview** — вытащить архитектурные решения по blast radius: storage, auth, API, failure modes.
- **Point at a reference** — сверить поведение референса перед портированием.
- **The tweakable plan** — согласовать не линейный todo-list, а места, где likely будут правки.
- **Implementation notes** — фиксировать расхождения плана с реальностью во время длинного билда.
- **The buy-in doc** — заранее ответить на objections ревьюера или стейкхолдера.
- **Quiz me before I merge** — проверить, понимаешь ли ты собственный diff перед merge.

Полные правила и шаблоны техник лежат в [`SKILL.md`](skills/finding-unknowns/SKILL.md) и
[`references/techniques.md`](skills/finding-unknowns/references/techniques.md).

## Как устроен артефакт

Каждый артефакт — один HTML-файл без CDN, fetch и внешних зависимостей. Он должен открываться с `file://`,
держать весь JS/CSS внутри и работать как throwaway UI для принятия решений.

Обязательная часть — assembled reply: textarea с готовым следующим промптом и copy button. Если артефакт
не превращает клики пользователя в конкретный prompt diff, он не закрывает loop.

Перед тем как отдавать артефакт, скилл проверяет его через:

```text
node scripts/verify_artifact.mjs <file>
```

## Когда это не нужно

Если задача маленькая и ясная, скилл только добавляет overhead. Для «исправь опечатку» или «переименуй
переменную» никакой artifact не нужен.

Он полезен там, где стоимость неверного assumption выше, чем пара минут на discovery.

## Проверка

Я прогнал маленький набор evals: четыре реалистичные задачи, по четыре бинарные проверки. Со скиллом
получилось **16/16**, без него — **3/16**.

Это не бенчмарк и не большой научный вывод. Скорее sanity check: ценность здесь не в том, что агент
«становится умнее», а в том, что он переводит assumptions в явные решения пользователя до дорогой
реализации.

Evals лежат в [`skills/finding-unknowns/evals/`](skills/finding-unknowns/evals/).

## Материалы для поста

Черновик поста, короткие версии, CTA и список визуалов лежат в [`docs/post-kit.ru.md`](docs/post-kit.ru.md).

## Благодарности

Идея вдохновлена работой [Thariq Shihipar](https://x.com/trq212):
[`A Field Guide to Fable: Finding Your Unknowns`](https://x.com/trq212/article/2073100352921215386) и
его [демо-артефактами](https://thariqs.github.io/html-effectiveness/unknowns/index.html).

Этот репозиторий — независимая упаковка подхода в Claude Code skill. Не аффилирован с Thariq или
Anthropic. MIT.
