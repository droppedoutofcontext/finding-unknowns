# Post kit: finding-unknowns

Набор материалов для поста о `finding-unknowns`: основной черновик, короткие версии, варианты заголовков,
визуалы, CTA и чеклист перед публикацией.

## Главный тезис

Вайбкодинг часто ломается не на генерации кода, а на входе: промпт ещё не стал спецификацией, но агент
уже начал строить. `finding-unknowns` добавляет короткий discovery pass: отрендерить варианты, вытащить
assumptions, дать человеку выбрать и собрать из выбора следующий промпт.

## One-liner

`finding-unknowns` — Claude Code skill для промптов, которые ещё не дотягивают до спеки.

## Короткий питч

Когда пользователь пишет «сделай красивее» или «добавь фичу, детали сам», агент заполняет пустоты своими
дефолтами: storage model, UX density, edge cases, reviewer expectations. `finding-unknowns` вставляет
перед реализацией маленький self-contained HTML-артефакт: четыре дизайн-направления, мини-интервью,
кликабельный мок, tweakable plan, buy-in doc или quiz before merge. Пользователь кликает то, что попало
в цель, а артефакт пишет следующий prompt diff за него.

## Черновик поста

Я собрал `finding-unknowns` — Claude Code skill для промптов, которые ещё не дотягивают до спеки.

Проблема простая: vibe coding часто ломается не на генерации кода, а на входе. Запрос беднее результата,
который человек держит в голове. Особенно в задачах вроде «сделай поприятнее», «добавь шеринг», «перенеси
как в референсе», «готово ли это к мержу?». В таких местах модель может быть сильной и всё равно
промахнуться, потому что половина важных constraints не сказана вслух.

`finding-unknowns` меняет порядок работы. Вместо «сразу строить» агент делает короткий discovery pass:
маленький self-contained HTML-артефакт без CDN/fetch/external deps. Это может быть четыре дизайн-
направления, интервью по архитектурным решениям, кликабельный мок, план с переключаемыми альтернативами,
buy-in doc или quiz before merge.

Идея в том, что люди плохо формулируют свои стандарты, но хорошо их узнают. Спросить «какой стиль нужен?»
часто бесполезно. Показать четыре честных варианта одного экрана — полезно: человек сразу видит, что
берет из одного, что выкидывает из другого, и какие слова ему вообще нужны.

Главное правило скилла: артефакт не просто показывает информацию. Он пишет следующее сообщение
пользователя. Ты кликаешь steal/skip, выбираешь answers, отмечаешь risks — внизу собирается prompt diff,
который можно вставить обратно в чат. Петля такая: render → choose → assemble prompt → implement.

Внутри сейчас 11 техник:

- blindspot pass: найти hidden requirements до старта;
- teach me my unknowns: дать vocabulary для вкуса или качества;
- four design directions: показать rendered варианты и собрать fifth direction;
- mock before you wire: проверить placement и interaction до кода;
- brainstorm on an effort axis: разложить идеи от quick win до квартальной ставки;
- interview: собрать архитектурные решения по blast radius;
- point at a reference: доказать, что reference behavior понят до портирования;
- tweakable plan: согласовать не линейный todo-list, а likely-to-change места;
- implementation notes: фиксировать plan-vs-reality gaps;
- buy-in doc: заранее ответить на objections ревьюера или стейкхолдера;
- quiz me before I merge: проверить, понимаешь ли ты собственный diff.

Я также прогнал маленькие evals: 4 реалистичные задачи, по 4 бинарные проверки. Со скиллом получилось
16/16, без него — 3/16. Это не доказывает «магии», выборка маленькая. Но хорошо показывает сам механизм:
модель часто и без скилла видит часть проблем, но скилл заставляет превратить их в решения пользователя
и следующий точный промпт.

Установка:

```text
/plugin marketplace add droppedoutofcontext/finding-unknowns
/plugin install finding-unknowns@finding-unknowns
```

Репозиторий: https://github.com/droppedoutofcontext/finding-unknowns

Идея вдохновлена Thariq Shihipar и его `A Field Guide to Fable: Finding Your Unknowns`; это независимая
упаковка подхода в Claude Code skill.

## Короткая версия

Собрал `finding-unknowns` — Claude Code skill про один конкретный провал агентов: они начинают строить,
хотя промпт ещё не стал спецификацией.

Вместо угадывания агент делает self-contained HTML-артефакт: четыре дизайн-направления, interview, mock,
tweakable plan, buy-in doc или quiz before merge. Пользователь кликает варианты, а артефакт собирает
следующий prompt diff.

Идея: люди плохо формулируют стандарты, но хорошо их узнают.

Установка:

```text
/plugin marketplace add droppedoutofcontext/finding-unknowns
/plugin install finding-unknowns@finding-unknowns
```

https://github.com/droppedoutofcontext/finding-unknowns

## Версия для X / Threads

Собрал `finding-unknowns` — Claude Code skill для промптов, которые ещё не стали спеками.

Он сначала делает self-contained HTML artifact: 4 design directions, interview, mock, tweakable plan или
quiz before merge. Ты кликаешь choices, он собирает prompt diff для следующего шага.

https://github.com/droppedoutofcontext/finding-unknowns

## Варианты заголовков

- Finding Unknowns: discovery pass перед вайбкодингом
- Когда промпт ещё не спека
- Маленький HTML перед большим билдом
- Claude Code skill, который превращает assumptions в prompt diff
- Почему агенту иногда нужно сначала отрендерить, а не строить

## Визуалы

- `docs/four-directions.gif` — основной визуал для поста. Показывает технику four design directions.
- `docs/merge-quiz.webp` — дополнительный визуал для секции про post-implementation проверки.

Рекомендуемый порядок: начать с `four-directions.gif`, потому что он быстро объясняет петлю
«показать варианты → выбрать куски → собрать следующий промпт».

## CTA

- Установить:

```text
/plugin marketplace add droppedoutofcontext/finding-unknowns
/plugin install finding-unknowns@finding-unknowns
```

- Посмотреть README: https://github.com/droppedoutofcontext/finding-unknowns
- Перезапустить evals: `skills/finding-unknowns/evals/evals.json`
- Источник идеи: https://x.com/trq212/article/2073100352921215386

## Что проверить перед публикацией

- Подставить реальную ссылку на репозиторий, если он будет опубликован не под
  `droppedoutofcontext/finding-unknowns`.
- Убедиться, что marketplace-команды уже работают для публичного пользователя.
- Решить, писать ли `Claude Code skill` или более широко `agent skill`, если пост идет не только в
  Claude Code-аудиторию.
- Не делать из evals слишком сильный claim: формулировать как маленький sanity check, а не benchmark.
- Упомянуть Thariq Shihipar как источник идеи и оставить ссылку на field guide.
