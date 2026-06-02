-- Общая детская база Supabase.
-- Без удаления старых таблиц и данных.

create table if not exists public.app_state_documents (
  family_key text primary key,
  state jsonb not null default '{}'::jsonb,
  updated_at timestamptz not null default now()
);

alter table public.app_state_documents enable row level security;

do $$
begin
  if not exists (
    select 1 from pg_policies
    where schemaname = 'public'
      and tablename = 'app_state_documents'
      and policyname = 'Kids app states are readable'
  ) then
    create policy "Kids app states are readable"
    on public.app_state_documents for select
    to anon
    using (true);
  end if;

  if not exists (
    select 1 from pg_policies
    where schemaname = 'public'
      and tablename = 'app_state_documents'
      and policyname = 'Kids app states are writable'
  ) then
    create policy "Kids app states are writable"
    on public.app_state_documents for all
    to anon
    using (true)
    with check (true);
  end if;
end $$;

-- Перенос текущего состояния Андрея из старого Supabase.
-- Можно запускать повторно: запись с ключом andrey-family обновится.
-- Снимок данных обновлен: 2026-06-02T07:43:05.698Z.

insert into public.app_state_documents (family_key, state, updated_at)
values (
  'andrey-family',
  $andrey_state${
  "books": [
    {
      "id": "book-1780382031495-bio361",
      "pages": 336,
      "title": "Дом роботов",
      "author": "Джеймс Паттерсон",
      "status": "читаю",
      "endDate": "",
      "completed": false,
      "diaryDone": false,
      "startDate": "2026-05-27",
      "diaryXpAwarded": false,
      "completionXpAwarded": false
    }
  ],
  "level": 3,
  "night": 5,
  "roles": [
    {
      "id": "home-1780382031495-eqheus",
      "xp": 10,
      "done": false,
      "title": "Разбор сушильной машины"
    },
    {
      "id": "home-1780382031495-ef16nr",
      "xp": 5,
      "done": true,
      "title": "Вынос мусора"
    },
    {
      "id": "home-1780382031495-crkx9v",
      "xp": 10,
      "done": false,
      "title": "Приготовить завтрак/ обед/ ужин на всех"
    },
    {
      "id": "home-1780382031495-ywmen6",
      "xp": 10,
      "done": false,
      "title": "Почитать брату 15 минут"
    }
  ],
  "skill": {
    "id": "skill-1780382031495-nnwbr6",
    "goal": "Научиться собирать кубик Рубика за 3 минуты",
    "name": "Кубик Рубика",
    "completed": false,
    "practiceDone": false
  },
  "badges": [
    "Не сдался 3 раза",
    "Первые костры",
    "Следопыт"
  ],
  "skills": [
    {
      "id": "skill-1780382031495-nnwbr6",
      "goal": "Научиться собирать кубик Рубика за 3 минуты",
      "name": "Кубик Рубика",
      "completed": false,
      "practiceDone": false
    },
    {
      "id": "skill-1780382031495-ah7kfo",
      "goal": "Подтягиваться 10 раз",
      "name": "Подтягивание",
      "completed": false,
      "practiceDone": false
    },
    {
      "id": "skill-1780382031495-kmt0ro",
      "goal": "Приготовить бабушкин гуляш из индейки",
      "name": "Готовка",
      "completed": false,
      "practiceDone": false
    }
  ],
  "videos": [
    {
      "id": "discovery-1780382031495-0o4d8y",
      "type": "видео",
      "title": "Новое открытие",
      "source": "",
      "status": "запланировано",
      "insight": "",
      "viewedAwarded": false,
      "insightRecorded": false
    }
  ],
  "weekly": {
    "xp": 210,
    "hard": 4,
    "next": "Выбрать маршрут на следующую неделю.",
    "books": 1,
    "proud": "Открыт значок «Не сдался 3 раза».",
    "hardMoment": "Остаться в усилии, когда хотелось бросить."
  },
  "project": {
    "why": "Мне интересно довести идею до показа.",
    "next": "Выбрать следующий маленький шаг.",
    "steps": [
      "Идея",
      "Первые материалы",
      "Черновик",
      "Показ семье"
    ],
    "title": "Летний проект Андрея",
    "status": "в пути",
    "description": "Один проект на 6-8 недель, который семья заполнит вручную."
  },
  "rewards": [
    {
      "id": "reward-1780382031495-fqu4rl",
      "cost": 200,
      "title": "VR с родителем"
    },
    {
      "id": "reward-1780382031495-lr1gw8",
      "cost": 200,
      "title": "30 минут игры на планшете"
    },
    {
      "id": "reward-1780382031495-mheugh",
      "cost": 160,
      "title": "30 минут мультфильм"
    },
    {
      "id": "reward-1780382031495-xhrzxq",
      "cost": 1000,
      "title": "1000 роблоксов"
    }
  ],
  "todayXp": 20,
  "totalXp": 270,
  "missions": [
    {
      "id": "read",
      "xp": 15,
      "done": true,
      "icon": "📘",
      "title": "Прочитать 30 минут"
    },
    {
      "id": "hard",
      "xp": 10,
      "done": false,
      "icon": "🪓",
      "title": "Сложное дело"
    },
    {
      "id": "skill",
      "xp": 10,
      "done": false,
      "icon": "🧩",
      "title": "Сделать шаг по навыку"
    },
    {
      "id": "video",
      "xp": 10,
      "done": false,
      "icon": "🔭",
      "title": "Видео или подкаст"
    },
    {
      "id": "observation",
      "xp": 10,
      "done": false,
      "icon": "🌿",
      "title": "Дневник наблюдений"
    },
    {
      "id": "role",
      "xp": 10,
      "done": false,
      "icon": "🏕️",
      "title": "Помощь по дому"
    },
    {
      "id": "custom-1780214297378",
      "xp": 10,
      "done": false,
      "icon": "💎",
      "title": "День без магазина",
      "custom": true,
      "customTitle": true
    },
    {
      "id": "custom-1780214328112",
      "xp": 10,
      "done": false,
      "icon": "💎",
      "title": "Задания 20 минут",
      "custom": true,
      "customTitle": true
    },
    {
      "id": "custom-1780382073634",
      "xp": 40,
      "done": false,
      "icon": "💎",
      "title": "Лагерь",
      "custom": true,
      "customTitle": true
    }
  ],
  "softMode": true,
  "dailyGoal": 40,
  "parentPin": "9910",
  "bestStreak": 7,
  "hardThings": [
    {
      "id": "hard-1780382031495-qtilfv",
      "kind": "regular",
      "title": "Собрать роботов-боксёров",
      "bonusXp": 50,
      "completed": false,
      "effortDone": false,
      "completedXpAwarded": 0
    },
    {
      "id": "hard-1780382031495-tbloz6",
      "kind": "regular",
      "title": "Собрать миньона",
      "bonusXp": 50,
      "completed": false,
      "effortDone": false,
      "completedXpAwarded": 0
    },
    {
      "id": "hard-1780382031495-vpe82l",
      "kind": "regular",
      "title": "Собрать ламбу",
      "bonusXp": 50,
      "completed": false,
      "effortDone": false,
      "completedXpAwarded": 0
    },
    {
      "id": "hard-1780382031495-tq7rt4",
      "kind": "regular",
      "title": "Flyers",
      "bonusXp": 50,
      "completed": false,
      "effortDone": false,
      "completedXpAwarded": 0
    },
    {
      "id": "hard-1780385206799-6be3hs",
      "kind": "big",
      "title": "Диагностика",
      "bonusXp": 100,
      "completed": false,
      "effortDone": false,
      "completedXpAwarded": 0
    },
    {
      "id": "hard-1780385219399-vtjrnn",
      "kind": "big",
      "title": "Экзамен Flyers",
      "bonusXp": 100,
      "completed": false,
      "effortDone": false,
      "completedXpAwarded": 0
    }
  ],
  "activityLog": [
    {
      "id": "activity-1780383123246-o9rnl7",
      "xp": 40,
      "date": "2026-05-25",
      "icon": "🏕️",
      "bonus": false,
      "daily": true,
      "title": "Лагерь",
      "sourceKey": "history:camp:2026-05-25"
    },
    {
      "id": "activity-1780383123246-tq956e",
      "xp": 40,
      "date": "2026-05-26",
      "icon": "🏕️",
      "bonus": false,
      "daily": true,
      "title": "Лагерь",
      "sourceKey": "history:camp:2026-05-26"
    },
    {
      "id": "activity-1780383123246-gmcu2x",
      "xp": 40,
      "date": "2026-05-27",
      "icon": "🏕️",
      "bonus": false,
      "daily": true,
      "title": "Лагерь",
      "sourceKey": "history:camp:2026-05-27"
    },
    {
      "id": "activity-1780383123246-sl71f7",
      "xp": 40,
      "date": "2026-05-28",
      "icon": "🏕️",
      "bonus": false,
      "daily": true,
      "title": "Лагерь",
      "sourceKey": "history:camp:2026-05-28"
    },
    {
      "id": "activity-1780383123246-6ph973",
      "xp": 40,
      "date": "2026-05-29",
      "icon": "🏕️",
      "bonus": false,
      "daily": true,
      "title": "Лагерь",
      "sourceKey": "history:camp:2026-05-29"
    },
    {
      "id": "activity-1780383123246-4ldcpm",
      "xp": 10,
      "date": "2026-05-30",
      "icon": "🧭",
      "bonus": false,
      "daily": true,
      "title": "День без магазина",
      "sourceKey": "history:no-shop:2026-05-30"
    },
    {
      "id": "activity-1780383123246-wmrr04",
      "xp": 20,
      "date": "2026-05-31",
      "icon": "✏️",
      "bonus": false,
      "daily": true,
      "title": "Задание 20 минут",
      "sourceKey": "history:task-20:2026-05-31"
    },
    {
      "id": "activity-1780383123246-54ugo7",
      "xp": 5,
      "date": "2026-05-31",
      "icon": "🏕️",
      "bonus": false,
      "daily": true,
      "title": "Помощь по дому: вынос мусора",
      "sourceKey": "history:trash:2026-05-31"
    },
    {
      "id": "activity-1780383123246-opevjm",
      "xp": 15,
      "date": "2026-05-31",
      "icon": "📘",
      "bonus": false,
      "daily": true,
      "title": "Прочитал 30 минут",
      "sourceKey": "history:reading:2026-05-31"
    },
    {
      "id": "activity-1780383214170-1ndaha",
      "xp": 15,
      "date": "2026-06-02",
      "icon": "📘",
      "bonus": false,
      "daily": true,
      "title": "Прочитать 30 минут",
      "sourceKey": "mission:read"
    },
    {
      "id": "activity-1780383217586-85d991",
      "xp": 5,
      "date": "2026-06-02",
      "icon": "🏕️",
      "bonus": false,
      "daily": true,
      "title": "Помощь по дому: Вынос мусора",
      "sourceKey": "home:home-1780382031495-ef16nr"
    }
  ],
  "currentDate": "2026-06-02",
  "rewardRules": {
    "skill": 10,
    "video": 10,
    "reading": 15,
    "bookDone": 50,
    "hardThing": 10,
    "skillDone": 50,
    "readingDiary": 15,
    "hardThingDone": 50,
    "responsibility": 10,
    "observationDiary": 10
  },
  "readingGoals": {
    "books": 10,
    "pages": 1200
  },
  "rewardLabels": {
    "bookDone": "Книга прочитана",
    "skillDone": "Умение освоено",
    "readingDiary": "Внесено в дневник чтения",
    "hardThingDone": "Сложное дело доделано"
  },
  "activeSection": "Главный экран",
  "calendarDraft": {
    "date": "2026-05-25",
    "event": "",
    "status": "survived"
  },
  "currentStreak": 4,
  "dayNotCounted": false,
  "parentBonuses": [],
  "parentComment": "Сегодня главное не скорость, а возвращение к маршруту.",
  "rewardHistory": [],
  "calendarEditor": {
    "mode": "edit",
    "text": "Экспедиция",
    "eventIndex": 0
  },
  "calendarEvents": {
    "2026-05-25": [
      "Экспедиция"
    ],
    "2026-05-26": [
      "Экспедиция"
    ],
    "2026-05-27": [
      "Экспедиция"
    ],
    "2026-05-28": [
      "Экспедиция"
    ],
    "2026-05-29": [
      "Экспедиция"
    ],
    "2026-06-15": [
      "Лагерь"
    ],
    "2026-06-16": [
      "Лагерь"
    ],
    "2026-06-17": [
      "Лагерь"
    ],
    "2026-06-18": [
      "Лагерь"
    ],
    "2026-06-19": [
      "Лагерь"
    ],
    "2026-06-20": [
      "Лагерь"
    ],
    "2026-06-21": [
      "Лагерь"
    ],
    "2026-06-22": [
      "Лагерь"
    ],
    "2026-06-23": [
      "Лагерь"
    ],
    "2026-06-24": [
      "Лагерь"
    ],
    "2026-06-25": [
      "Лагерь"
    ],
    "2026-06-26": [
      "Лагерь"
    ],
    "2026-06-27": [
      "Лагерь"
    ],
    "2026-07-10": [
      "Сергей, Маша"
    ],
    "2026-07-11": [
      "Сергей, Маша"
    ],
    "2026-07-12": [
      "Сергей, Маша"
    ],
    "2026-07-13": [
      "Сергей, Маша"
    ],
    "2026-08-15": [
      "Алтай"
    ],
    "2026-08-16": [
      "Алтай"
    ],
    "2026-08-17": [
      "Алтай"
    ],
    "2026-08-18": [
      "Алтай"
    ],
    "2026-08-19": [
      "Алтай"
    ],
    "2026-08-20": [
      "Алтай"
    ],
    "2026-08-21": [
      "Алтай"
    ],
    "2026-08-22": [
      "Алтай"
    ]
  },
  "discoveryGoals": {
    "items": 20
  },
  "manualSurvived": false,
  "parentUnlocked": false,
  "survivedNights": 6,
  "returnedToTrail": false,
  "calendarStatuses": {
    "2026-05-25": "survived",
    "2026-05-26": "survived",
    "2026-05-27": "survived",
    "2026-05-28": "survived",
    "2026-05-29": "survived",
    "2026-05-30": "planned",
    "2026-05-31": "survived",
    "2026-06-01": "planned",
    "2026-06-02": "current",
    "2026-06-03": "planned",
    "2026-06-04": "planned",
    "2026-06-05": "planned",
    "2026-06-06": "planned",
    "2026-06-07": "planned",
    "2026-06-08": "planned",
    "2026-06-09": "planned",
    "2026-06-10": "planned",
    "2026-06-11": "planned",
    "2026-06-12": "planned",
    "2026-06-13": "planned",
    "2026-06-14": "planned",
    "2026-06-15": "planned",
    "2026-06-16": "planned",
    "2026-06-17": "planned",
    "2026-06-18": "planned",
    "2026-06-19": "planned",
    "2026-06-20": "planned",
    "2026-06-21": "planned",
    "2026-06-22": "planned",
    "2026-06-23": "planned",
    "2026-06-24": "planned",
    "2026-06-25": "planned",
    "2026-06-26": "planned",
    "2026-06-27": "planned",
    "2026-06-28": "planned",
    "2026-06-29": "planned",
    "2026-06-30": "planned",
    "2026-07-01": "planned",
    "2026-07-02": "planned",
    "2026-07-03": "planned",
    "2026-07-04": "planned",
    "2026-07-05": "planned",
    "2026-07-06": "planned",
    "2026-07-07": "planned",
    "2026-07-08": "planned",
    "2026-07-09": "planned",
    "2026-07-10": "planned",
    "2026-07-11": "planned",
    "2026-07-12": "planned",
    "2026-07-13": "planned",
    "2026-07-14": "planned",
    "2026-07-15": "planned",
    "2026-07-16": "planned",
    "2026-07-17": "planned",
    "2026-07-18": "planned",
    "2026-07-19": "planned",
    "2026-07-20": "planned",
    "2026-07-21": "planned",
    "2026-07-22": "planned",
    "2026-07-23": "planned",
    "2026-07-24": "planned",
    "2026-07-25": "planned",
    "2026-07-26": "planned",
    "2026-07-27": "planned",
    "2026-07-28": "planned",
    "2026-07-29": "planned",
    "2026-07-30": "planned",
    "2026-07-31": "planned",
    "2026-08-01": "planned",
    "2026-08-02": "planned",
    "2026-08-03": "planned",
    "2026-08-04": "planned",
    "2026-08-05": "planned",
    "2026-08-06": "planned",
    "2026-08-07": "planned",
    "2026-08-08": "planned",
    "2026-08-09": "planned",
    "2026-08-10": "planned",
    "2026-08-11": "planned",
    "2026-08-12": "planned",
    "2026-08-13": "planned",
    "2026-08-14": "planned",
    "2026-08-15": "planned",
    "2026-08-16": "planned",
    "2026-08-17": "planned",
    "2026-08-18": "planned",
    "2026-08-19": "planned",
    "2026-08-20": "planned",
    "2026-08-21": "planned",
    "2026-08-22": "planned",
    "2026-08-23": "planned",
    "2026-08-24": "planned",
    "2026-08-25": "planned",
    "2026-08-26": "planned",
    "2026-08-27": "planned",
    "2026-08-28": "planned",
    "2026-08-29": "planned",
    "2026-08-30": "planned",
    "2026-08-31": "planned"
  },
  "discoverySources": [
    "Источник добавит родитель"
  ],
  "parentBonusDraft": {
    "xp": 100,
    "title": "Особое сложное дело"
  },
  "parentManualDate": "2026-05-29",
  "dailyResetVersion": 3,
  "historySeedVersion": 1,
  "discoverySourceDraft": "",
  "selectedCalendarDate": "2026-05-25",
  "discoveryResetVersion": 2
}$andrey_state$::jsonb,
  '2026-06-02T07:28:19.287+00:00'::timestamptz
)
on conflict (family_key) do update set
  state = excluded.state,
  updated_at = excluded.updated_at;
