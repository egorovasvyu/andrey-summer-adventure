# Что будет сохраняться в Supabase

Важно: файл `supabase-schema.sql` подготавливает базу. Сам сайт пока ещё нужно подключить к Supabase в коде. После подключения сохраняться должно так:

## Первый слой сохранения

Добавлена таблица `app_state_documents`.

Она хранит полный JSON-снимок приложения:

- все поля календаря;
- все статусы;
- все книги;
- все умения;
- все открытия;
- все сложные дела;
- всю помощь по дому;
- все награды;
- родительские настройки;
- баланс;
- серии;
- текущий экран.

Это самый надёжный слой для прототипа: даже если в интерфейсе появится новое поле, оно тоже сохранится внутри полного состояния.

Отдельные таблицы ниже нужны для следующего этапа: нормальной истории, фильтров, итогов и аналитики.

## Главный экран и сегодняшний день

- Баланс алмазов: `adventure_state.total_diamonds`
- Алмазы за сегодня: `adventure_state.today_diamonds`
- Номер ночи: `adventure_state.current_night`
- Пройденные ночи: `adventure_state.survived_nights`
- Текущая серия: `adventure_state.current_streak`
- Лучшая серия: `adventure_state.best_streak`
- Статус сегодняшнего дня: `day_statuses`
- Каждое выполненное действие: `day_actions`

## Календарь

- События по датам: `calendar_events`
- Удаление события: `calendar_events.deleted_at`
- Статус даты: `day_statuses.status`
- Пройдена/пропущена ночь: `day_statuses.survived`, `day_statuses.status`

## Миссии дня

- Текущие галочки миссий: `daily_missions`
- История нажатий `Сделал` / `Отменить`: `day_actions`
- Итог дня считается из `day_actions` за выбранную дату.

## Чтение

- Книги: `books`
- Название, автор, страницы: `books`
- Даты начала и окончания: `books.start_date`, `books.end_date`
- Статус книги: `books.status`
- Дневник чтения: `books.diary_done`
- Прочитано: `books.completed`
- Удаление книги: `books.deleted_at`
- Алмазы за дневник и завершение: `day_actions`

## Новое умение

- Список умений: `skills`
- Название и цель: `skills.name`, `skills.goal`
- Занятие 15 минут: `skills.practice_done` + `day_actions`
- Умение освоено: `skills.completed` + `day_actions`
- Удаление умения: `skills.deleted_at`

## Открытия: видео и подкасты

- Источники родителя: `discovery_sources`
- Видео/подкасты: `discoveries`
- Название, источник, тип, статус: `discoveries`
- Записанное открытие: `discoveries.insight_recorded`
- Удаление: `discoveries.deleted_at`
- Алмазы за открытие: `day_actions`

## Сложное дело

- Список сложных дел: `hard_things`
- Усилие 15 минут: `hard_things.effort_done` + `day_actions`
- Дело доделано: `hard_things.completed` + `day_actions`
- Удаление: `hard_things.deleted_at`

## Помощь по дому

- Список дел: `home_tasks`
- Цена дела в алмазах: `home_tasks.diamonds`
- Сделано сегодня: `home_tasks.done_today` + `day_actions`
- Удаление: `home_tasks.deleted_at`

## Награды

- Список наград: `rewards`
- Цена награды: `rewards.cost`
- Получение награды: `reward_history` + `day_actions`
- Возврат алмазов: `reward_history.returned`, `reward_history.returned_at` + `day_actions`
- Удаление награды: `rewards.deleted_at`

## Родитель

- Дневная цель: `app_settings.daily_goal`
- Мягкий режим: `app_settings.soft_mode`
- Цель по книгам: `app_settings.reading_goal_books`
- Цель по страницам: `app_settings.reading_goal_pages`
- Цель по открытиям: `app_settings.discovery_goal_items`
- Комментарий родителя: `app_settings.parent_comment`

## Итог дня

Считается из `day_actions`:

- `action_date` — дата
- `action_type` — тип действия
- `title` — что именно сделал
- `diamonds` — сколько алмазов
- `counts_for_daily_goal` — идёт ли в дневной костёр
- `undone` — действие отменено или нет

## Итог за всё время

Считается из:

- `day_actions` — сколько раз и что сделал
- `books` — книги и страницы
- `skills` — освоенные умения
- `hard_things` — сложные дела
- `discoveries` — открытия
- `home_tasks` — помощь по дому
- `reward_history` — траты и возвраты наград

## Страховочная копия

Пока приложение ещё прототип, можно дополнительно сохранять полный снимок состояния в:

- `state_snapshots`

Это поможет восстановить данные, если в логике сохранения будет ошибка.
