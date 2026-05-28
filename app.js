const XP_RULES = {
  reading: 10,
  hardThing: 15,
  hardThingDone: 50,
  skill: 15,
  skillDone: 50,
  video: 10,
  responsibility: 10,
  observationDiary: 10,
  project: 20,
  readingDiary: 15,
  bookDone: 50,
  projectDone: 100,
};

const GEM = "💎";

function gemLabel(value) {
  return `${value} ${GEM}`;
}

function signedGem(value) {
  return `${value > 0 ? "+" : ""}${value} ${GEM}`;
}

function todayIso() {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, "0");
  const day = String(now.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

const TODAY_ISO = todayIso();
const STORAGE_KEY = "andreySummerAdventureState.v5";

const initialState = {
  activeSection: "Главный экран",
  level: 3,
  totalXp: 210,
  night: 3,
  survivedNights: 2,
  dailyGoal: 40,
  readingGoals: {
    books: 6,
    pages: 1200,
  },
  discoveryGoals: {
    items: 20,
  },
  discoverySources: ["Источник добавит родитель"],
  discoverySourceDraft: "",
  todayXp: 25,
  currentStreak: 2,
  bestStreak: 7,
  softMode: true,
  parentComment: "Сегодня главное не скорость, а возвращение к маршруту.",
  manualSurvived: false,
  dayNotCounted: false,
  returnedToTrail: false,
  selectedCalendarDate: TODAY_ISO,
  calendarDraft: {
    date: TODAY_ISO,
    event: "",
    status: "current",
  },
  calendarEditor: {
    mode: "add",
    eventIndex: 0,
    text: "",
  },
  calendarEvents: {},
  calendarStatuses: {
    "2026-05-25": "survived",
    "2026-05-26": "survived",
    "2026-05-27": "current",
  },
  badges: ["Не сдался 3 раза", "Первые костры", "Следопыт"],
  missions: [
    { id: "read", icon: "📘", title: "Прочитать 30 минут", xp: XP_RULES.reading, done: false },
    { id: "hard", icon: "🪓", title: "Сложное дело", xp: XP_RULES.hardThing, done: true },
    { id: "skill", icon: "🧩", title: "Сделать шаг по навыку", xp: XP_RULES.skill, done: false },
    { id: "video", icon: "🔭", title: "Видео или подкаст", xp: XP_RULES.video, done: false },
    { id: "observation", icon: "🌿", title: "Дневник наблюдений", xp: XP_RULES.observationDiary, done: false },
    { id: "role", icon: "🏕️", title: "Помощь по дому", xp: XP_RULES.responsibility, done: false },
  ],
  books: [
    {
      title: "Дом роботов",
      author: "Джеймс Паттерсон",
      pages: 336,
      status: "читаю",
      startDate: "2026-05-27",
      endDate: "",
      diaryDone: false,
      completed: false,
      diaryXpAwarded: false,
      completionXpAwarded: false,
    },
  ],
  skill: {
    name: "Кубик Рубика",
    goal: "Научиться собирать кубик Рубика за 3 минуты.",
    practiceDone: false,
    completed: false,
  },
  skills: [
    {
      name: "Кубик Рубика",
      goal: "Научиться собирать кубик Рубика за 3 минуты.",
      practiceDone: false,
      completed: false,
    },
  ],
  videos: [
    { title: "Открытие 1", source: "Источник добавит родитель", type: "видео", status: "просмотрено", insight: "Сначала идея, потом проверка.", insightRecorded: true },
    { title: "Собирал миньона", source: "Источник добавит родитель", type: "подкаст", status: "прослушано", insight: "Сначала каркас, потом детали.", insightRecorded: true },
    { title: "Открытие 3", source: "Источник добавит родитель", type: "видео", status: "просмотрено", insight: "Важно идти по шагам.", insightRecorded: true },
  ],
  hardThings: [
    { title: "Собрать роботов-боксёров", effortDone: false, completed: false },
  ],
  project: {
    title: "Летний проект Андрея",
    description: "Один проект на 6-8 недель, который семья заполнит вручную.",
    why: "Мне интересно довести идею до показа.",
    steps: ["Идея", "Первые материалы", "Черновик", "Показ семье"],
    status: "в пути",
    next: "Выбрать следующий маленький шаг.",
  },
  roles: [
    { title: "Разбор стиральной машины", xp: 5, done: false },
    { title: "Вынос мусора", xp: 5, done: false },
    { title: "Убрать со стола", xp: 5, done: false },
    { title: "Собрать вещи на место", xp: 5, done: false },
  ],
  rewards: [
    { title: "Выбор семейной активности", cost: 120 },
    { title: "Небольшая покупка", cost: 180 },
    { title: "Творческий набор", cost: 240 },
  ],
  rewardHistory: [],
  weekly: {
    books: 1,
    hard: 4,
    xp: 210,
    hardMoment: "Остаться в усилии, когда хотелось бросить.",
    proud: "Открыт значок «Не сдался 3 раза».",
    next: "Выбрать маршрут на следующую неделю.",
  },
};

function loadState() {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (!saved) return prepareState(structuredClone(initialState));
    const parsed = JSON.parse(saved);
    return prepareState({
      ...structuredClone(initialState),
      ...parsed,
      calendarDraft: { ...initialState.calendarDraft, ...(parsed.calendarDraft || {}) },
      calendarEditor: { ...initialState.calendarEditor, ...(parsed.calendarEditor || {}) },
      calendarEvents: { ...initialState.calendarEvents, ...(parsed.calendarEvents || {}) },
      calendarStatuses: { ...initialState.calendarStatuses, ...(parsed.calendarStatuses || {}) },
      readingGoals: { ...initialState.readingGoals, ...(parsed.readingGoals || {}) },
      discoveryGoals: { ...initialState.discoveryGoals, ...(parsed.discoveryGoals || {}) },
      discoverySources: parsed.discoverySources || initialState.discoverySources,
    });
  } catch (error) {
    return prepareState(structuredClone(initialState));
  }
}

function prepareState(nextState) {
  if (nextState.activeSection === "Видео и открытия") nextState.activeSection = "Открытия";
  if (nextState.activeSection === "Самостоятельность") nextState.activeSection = "Помощь по дому";
  if (nextState.activeSection === "Сложное дело дня") nextState.activeSection = "Сложное дело";
  if (nextState.activeSection === "Сегодняшняя ночь" || nextState.activeSection === "Летний проект") {
    nextState.activeSection = "Главный экран";
  }
  if (TODAY_ISO >= "2026-05-25" && TODAY_ISO <= "2026-08-31") {
    Object.keys(nextState.calendarStatuses || {}).forEach((date) => {
      if (nextState.calendarStatuses[date] === "current" && date !== TODAY_ISO) {
        nextState.calendarStatuses[date] = "planned";
      }
    });
    if (!["survived", "skipped"].includes(nextState.calendarStatuses?.[TODAY_ISO])) {
      nextState.calendarStatuses[TODAY_ISO] = "current";
    }
    if (!nextState.selectedCalendarDate || nextState.selectedCalendarDate === initialState.selectedCalendarDate) {
      nextState.selectedCalendarDate = TODAY_ISO;
      nextState.calendarDraft = {
        ...(nextState.calendarDraft || initialState.calendarDraft),
        date: TODAY_ISO,
        status: nextState.calendarStatuses[TODAY_ISO],
      };
    }
  }

  initialState.missions.forEach((mission) => {
    const savedMission = nextState.missions.find((item) => item.id === mission.id);
    if (!savedMission) {
      nextState.missions.push({ ...mission });
      return;
    }
    savedMission.icon = mission.icon;
    savedMission.title = mission.title;
    savedMission.xp = mission.xp;
  });

  nextState.discoverySources = nextState.discoverySources?.length ? nextState.discoverySources : initialState.discoverySources;
  nextState.videos = (nextState.videos || []).map((item) => {
    const type = item.type || "видео";
    const oldInsight = item.insight || "";
    const title = item.title === "Открытие 2" && type === "подкаст" ? "Собирал миньона" : (item.title || "Новое открытие");
    return {
      title,
      source: item.source || nextState.discoverySources[0],
      type,
      status: item.status || "запланировано",
      insight: meaningfulInsight(oldInsight),
      insightRecorded: Boolean(item.insightRecorded || oldInsight),
    };
  });

  const migratedSkill = {
    ...initialState.skill,
    ...(nextState.skill || {}),
  };
  if (migratedSkill.name === "Главный навык на лето") migratedSkill.name = "Кубик Рубика";
  if (!migratedSkill.goal || migratedSkill.goal === "Сделать заметный финальный результат и показать семье.") {
    migratedSkill.goal = "Научиться собирать кубик Рубика за 3 минуты.";
  }
  const savedSkills = Array.isArray(nextState.skills) && nextState.skills.length ? nextState.skills : [migratedSkill];
  nextState.skills = savedSkills.map((skill) => ({
    name: skill.name || "Новое умение",
    goal: skill.goal || "Цель на лето",
    practiceDone: Boolean(skill.practiceDone),
    completed: Boolean(skill.completed),
  }));
  nextState.skill = nextState.skills[0] || structuredClone(initialState.skill);
  nextState.hardThings = (nextState.hardThings || initialState.hardThings).map((item) => (
    typeof item === "string" ? { title: item, done: false } : {
      title: item.title || "Сложное дело",
      effortDone: Boolean(item.effortDone || item.done),
      completed: Boolean(item.completed),
    }
  ));

  const defaultHomeTasks = structuredClone(initialState.roles);
  const savedRoles = nextState.roles || [];
  const looksLikeOldRoles = savedRoles.some((role) => role.frequency || role.comment || role.status);
  nextState.roles = looksLikeOldRoles ? defaultHomeTasks : savedRoles.map((role) => ({
    title: role.title || "Домашнее дело",
    xp: Number(role.xp) || 5,
    done: Boolean(role.done || Number(role.todayCount)),
  }));

  const oldDemoEvents = {
    "2026-06-10": "Лагерь",
    "2026-06-11": "Лагерь",
    "2026-06-12": "Лагерь",
    "2026-07-18": "Отпуск",
    "2026-07-19": "Отпуск",
    "2026-07-20": "Отпуск",
    "2026-07-21": "Отпуск",
  };

  Object.entries(oldDemoEvents).forEach(([date, demoTitle]) => {
    if (!nextState.calendarEvents[date]) return;
    nextState.calendarEvents[date] = nextState.calendarEvents[date].filter((event) => event !== demoTitle);
    if (!nextState.calendarEvents[date].length) delete nextState.calendarEvents[date];
  });

  for (let day = 15; day <= 22; day += 1) {
    const date = `2026-08-${String(day).padStart(2, "0")}`;
    if (!nextState.calendarEvents[date]) nextState.calendarEvents[date] = [];
    if (!nextState.calendarEvents[date].includes("Алтай")) {
      nextState.calendarEvents[date].push("Алтай");
    }
  }

  addEventRange(nextState, "2026-05-25", "2026-05-29", "Экспедиция");
  addEventRange(nextState, "2026-06-15", "2026-06-27", "Лагерь");
  addEventRange(nextState, "2026-07-10", "2026-07-13", "Сергей, Маша");

  return nextState;
}

function addEventRange(nextState, startIso, endIso, title) {
  for (let day = new Date(`${startIso}T12:00:00`); day <= new Date(`${endIso}T12:00:00`); day.setDate(day.getDate() + 1)) {
    const date = isoDate(day);
    if (!nextState.calendarEvents[date]) nextState.calendarEvents[date] = [];
    if (!nextState.calendarEvents[date].includes(title)) {
      nextState.calendarEvents[date].push(title);
    }
  }
}

function saveState() {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch (error) {
    console.warn("Не удалось сохранить состояние", error);
  }
}

let state = loadState();
let toastTimer;

window.addEventListener("pagehide", saveState);
window.addEventListener("beforeunload", saveState);

function survivalStatus() {
  const enough = state.todayXp >= state.dailyGoal || state.manualSurvived;
  const almost = state.softMode && state.todayXp >= Math.max(0, state.dailyGoal - 10);
  if (enough) {
    return {
      survived: true,
      label: "Ночь пройдена",
      text: "Ты выжил сегодня. Костёр горит.",
      fire: "bright",
      action: "Ночь пройдена",
    };
  }
  if (state.dayNotCounted) {
    return {
      survived: false,
      label: "Ночь не засчитана",
      text: "Сегодня костёр почти погас, завтра можно разжечь снова.",
      fire: "embers",
      action: "Вернуться к миссиям",
    };
  }
  if (almost) {
    return {
      survived: false,
      label: "Почти выжил",
      text: "Костёр почти держится. Родитель может зачесть эту ночь вручную.",
      fire: "small",
      action: "Добрать алмазы",
    };
  }
  return {
    survived: false,
    label: "Костёр ещё нужно поддержать",
    text: "Не каждая ночь лёгкая. Главное — вернуться к маршруту.",
    fire: "small",
    action: "Добрать алмазы",
  };
}

function xpLeft() {
  return Math.max(0, state.dailyGoal - state.todayXp);
}

function progressPercent(value, max) {
  return `${Math.min(100, Math.round((value / max) * 100))}%`;
}

function escapeHtml(value) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function isoDate(date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

function formatDateRu(iso) {
  return new Intl.DateTimeFormat("ru-RU", {
    day: "numeric",
    month: "long",
    weekday: "long",
  }).format(new Date(`${iso}T12:00:00`));
}

function meaningfulInsight(value) {
  const text = (value || "").trim();
  const placeholders = [
    "Записана новая находка.",
    "Короткий вывод Андрея.",
    "Что нового я понял.",
    "Записана новая находка",
    "Короткий вывод",
    "вывод записан",
  ];
  return text && !placeholders.includes(text) ? text : "";
}

function calendarDays() {
  const start = new Date(2026, 4, 25);
  const end = new Date(2026, 7, 31);
  const days = [];
  for (let day = new Date(start), night = 1; day <= end; day.setDate(day.getDate() + 1), night += 1) {
    const iso = isoDate(day);
    if (!state.calendarStatuses[iso]) {
      state.calendarStatuses[iso] = iso === TODAY_ISO ? "current" : "planned";
    }
    if (iso === TODAY_ISO && !["survived", "skipped"].includes(state.calendarStatuses[iso])) {
      state.calendarStatuses[iso] = "current";
    }
    days.push({
      date: new Date(day),
      iso,
      night,
    });
  }
  return days;
}

function calendarMonths() {
  const months = new Map();
  calendarDays().forEach((day) => {
    const key = `${day.date.getFullYear()}-${day.date.getMonth()}`;
    if (!months.has(key)) {
      months.set(key, {
        name: new Intl.DateTimeFormat("ru-RU", { month: "long" }).format(day.date),
        days: [],
      });
    }
    months.get(key).days.push(day);
  });
  return Array.from(months.values());
}

function calendarStatusLabel(status) {
  return {
    survived: "Ночь пройдена",
    skipped: "Пропущена мягко",
    current: "Текущая ночь",
    planned: "Запланировано",
  }[status] || "Без статуса";
}

function calendarStatusIcon(status) {
  return {
    survived: "🔥",
    skipped: "◦",
    current: "⛺",
    planned: "",
  }[status] || "";
}

function selectCalendarDate(iso) {
  state.selectedCalendarDate = iso;
  state.calendarDraft.date = iso;
  state.calendarDraft.status = state.calendarStatuses[iso] || "planned";
  state.calendarDraft.event = "";
  const events = state.calendarEvents[iso] || [];
  state.calendarEditor.mode = events.length ? "edit" : "add";
  state.calendarEditor.eventIndex = 0;
  state.calendarEditor.text = events[0] || "";
  render();
}

function setCalendarDraft(field, value) {
  state.calendarDraft[field] = value;
  if (field === "date") {
    state.selectedCalendarDate = value;
    state.calendarDraft.status = state.calendarStatuses[value] || "planned";
  }
  saveState();
}

function saveCalendarStatus() {
  const { date, status } = state.calendarDraft;
  if (!date) return;
  state.calendarStatuses[date] = status;
  state.selectedCalendarDate = date;
  state.survivedNights = Object.values(state.calendarStatuses).filter((item) => item === "survived").length;
  showToast(status === "survived" ? "Ночь отмечена как пройденная." : "Статус дня обновлён мягко.");
  render();
}

function addCalendarEvent() {
  const date = state.selectedCalendarDate || state.calendarDraft.date;
  const title = (state.calendarDraft.event || "").trim();
  if (!date || !title) {
    showToast("Выбери дату и напиши событие.");
    return;
  }
  if (!state.calendarEvents[date]) state.calendarEvents[date] = [];
  state.calendarEvents[date].push(title);
  state.calendarDraft.event = "";
  state.selectedCalendarDate = date;
  showToast("Событие добавлено на карту лета.");
  render();
}

function openCalendarEditor(mode) {
  const date = state.selectedCalendarDate || state.calendarDraft.date;
  const events = state.calendarEvents[date] || [];
  state.calendarEditor.mode = mode;
  state.calendarEditor.eventIndex = Math.min(state.calendarEditor.eventIndex || 0, Math.max(0, events.length - 1));
  state.calendarEditor.text = mode === "edit" ? (events[state.calendarEditor.eventIndex] || "") : "";
  render();
}

function setCalendarEditor(field, value) {
  state.calendarEditor[field] = field === "eventIndex" ? Number(value) : value;
  if (field === "eventIndex") {
    const events = state.calendarEvents[state.selectedCalendarDate] || [];
    state.calendarEditor.text = events[state.calendarEditor.eventIndex] || "";
    render();
  }
}

function saveCalendarEditor() {
  if (state.calendarEditor.mode === "add") {
    addCalendarEvent();
    return;
  }
  updateCalendarEvent(state.selectedCalendarDate, state.calendarEditor.eventIndex, state.calendarEditor.text);
}

function updateCalendarEvent(date, index, value) {
  if (!state.calendarEvents[date]) return;
  const title = value.trim();
  if (!title) {
    removeCalendarEvent(date, index);
    return;
  }
  state.calendarEvents[date][index] = title;
  showToast("Событие обновлено.");
  render();
}

function updateCalendarEventFromInput(date, index) {
  const input = document.getElementById(`event-${date}-${index}`);
  if (!input) return;
  updateCalendarEvent(date, index, input.value);
}

function saveCalendarEventText(date, index, value) {
  if (!state.calendarEvents[date]) return;
  state.calendarEvents[date][index] = value;
  saveState();
}

function appendCalendarEvent(date, index) {
  const extra = window.prompt("Что дописать к событию?");
  if (!state.calendarEvents[date] || !state.calendarEvents[date][index] || !extra) return;
  state.calendarEvents[date][index] = `${state.calendarEvents[date][index]} · ${extra.trim()}`;
  state.calendarEditor.text = state.calendarEvents[date][index];
  showToast("Событие дополнено.");
  render();
}

function removeCalendarEvent(date, index) {
  if (!state.calendarEvents[date]) return;
  state.calendarEvents[date].splice(index, 1);
  if (!state.calendarEvents[date].length) delete state.calendarEvents[date];
  const events = state.calendarEvents[date] || [];
  state.calendarEditor.eventIndex = 0;
  state.calendarEditor.text = events[0] || "";
  state.calendarEditor.mode = events.length ? "edit" : "add";
  showToast("Событие убрано с даты.");
  render();
}

function showToast(message) {
  const old = document.querySelector(".toast");
  if (old) old.remove();
  const toast = document.createElement("div");
  toast.className = "toast";
  toast.textContent = message;
  document.body.appendChild(toast);
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => toast.remove(), 2600);
}

function addBadge(name) {
  if (!state.badges.includes(name)) {
    state.badges.push(name);
    showToast(`Открыт новый значок: ${name}`);
  }
}

function checkBadges() {
  const badgeMap = [
    [3, "Первые костры"],
    [5, "Следопыт"],
    [7, "Неделя в лесу"],
    [14, "Хранитель лагеря"],
    [21, "Мастер выживания"],
    [30, "Легенда леса"],
  ];
  badgeMap.forEach(([nights, title]) => {
    if (state.currentStreak >= nights) addBadge(title);
  });
  if (state.hardThings.filter((item) => item.effortDone).length >= 3) addBadge("Не сдался 3 раза");
  if (state.returnedToTrail) addBadge("Вернулся на тропу");
}

function completeMission(id) {
  const mission = state.missions.find((item) => item.id === id);
  if (!mission) return;
  if (mission.done) {
    mission.done = false;
    state.todayXp = Math.max(0, state.todayXp - mission.xp);
    state.totalXp = Math.max(0, state.totalXp - mission.xp);
    if (!state.manualSurvived && state.todayXp < state.dailyGoal && state.survivedNights >= state.night) {
      state.survivedNights = Math.max(0, state.night - 1);
      state.currentStreak = Math.max(0, state.currentStreak - 1);
    }
    showToast(`Отменено: ${signedGem(-mission.xp)}.`);
    render();
    return;
  }
  mission.done = true;
  awardXp(mission.xp, `${signedGem(mission.xp)}. Костёр стал ярче.`);
}

function completeHomeTask(index) {
  const task = state.roles[index];
  if (!task) return;
  const xp = Number(task.xp) || 5;
  task.done = !task.done;
  if (task.done) {
    awardXp(xp, `${signedGem(xp)} за помощь по дому.`);
    return;
  }
  state.todayXp = Math.max(0, state.todayXp - xp);
  state.totalXp = Math.max(0, state.totalXp - xp);
  showToast(`Отменено: ${signedGem(-xp)}.`);
  render();
}

function addHomeTask() {
  state.roles.push({ title: "Новое домашнее дело", xp: 5, done: false });
  showToast("Дело добавлено в помощь по дому.");
  render();
}

function updateHomeTask(index, field, value) {
  const task = state.roles[index];
  if (!task) return;
  task[field] = field === "xp" ? Math.max(0, Number(value) || 0) : value;
  render();
}

function saveHomeTaskField(index, field, value) {
  const task = state.roles[index];
  if (!task) return;
  task[field] = field === "xp" ? Math.max(0, Number(value) || 0) : value;
  saveState();
}

function removeHomeTask(index) {
  const task = state.roles[index];
  if (!task) return;
  const xpToRemove = task.done ? (Number(task.xp) || 5) : 0;
  state.todayXp = Math.max(0, state.todayXp - xpToRemove);
  state.totalXp = Math.max(0, state.totalXp - xpToRemove);
  state.roles.splice(index, 1);
  showToast("Дело удалено.");
  render();
}

function updateReward(index, field, value) {
  const reward = state.rewards[index];
  if (!reward) return;
  reward[field] = field === "cost" ? Math.max(0, Number(value) || 0) : value;
  saveState();
}

function updateSkill(index, field, value) {
  const skill = state.skills[index];
  if (!skill) return;
  skill[field] = value;
  state.skill = state.skills[0] || structuredClone(initialState.skill);
  saveState();
}

function toggleSkillPractice(index) {
  const skill = state.skills[index];
  if (!skill) return;
  skill.practiceDone = !skill.practiceDone;
  const mission = state.missions.find((item) => item.id === "skill");
  if (mission) mission.done = state.skills.some((item) => item.practiceDone);
  if (skill.practiceDone) {
    awardXp(XP_RULES.skill, `${signedGem(XP_RULES.skill)} за занятие 15 минут.`);
    return;
  }
  state.todayXp = Math.max(0, state.todayXp - XP_RULES.skill);
  state.totalXp = Math.max(0, state.totalXp - XP_RULES.skill);
  showToast(`Занятие снято: ${signedGem(-XP_RULES.skill)}.`);
  render();
}

function toggleSkillCompleted(index) {
  const skill = state.skills[index];
  if (!skill) return;
  skill.completed = !skill.completed;
  if (skill.completed) {
    state.totalXp += XP_RULES.skillDone;
    showToast(`${signedGem(XP_RULES.skillDone)} в общий баланс за освоенное умение.`);
    render();
    return;
  }
  state.totalXp = Math.max(0, state.totalXp - XP_RULES.skillDone);
  showToast(`Освоение снято: ${signedGem(-XP_RULES.skillDone)} из общего баланса.`);
  render();
}

function addSkill() {
  state.skills.push({
    name: "Новое умение",
    goal: "Цель на лето",
    practiceDone: false,
    completed: false,
  });
  showToast("Новое умение добавлено.");
  render();
}

function deleteSkill(index) {
  const skill = state.skills[index];
  if (!skill) return;
  if (skill.practiceDone) {
    state.todayXp = Math.max(0, state.todayXp - XP_RULES.skill);
    state.totalXp = Math.max(0, state.totalXp - XP_RULES.skill);
  }
  if (skill.completed) {
    state.totalXp = Math.max(0, state.totalXp - XP_RULES.skillDone);
  }
  state.skills.splice(index, 1);
  state.skill = state.skills[0] || structuredClone(initialState.skill);
  const mission = state.missions.find((item) => item.id === "skill");
  if (mission) mission.done = state.skills.some((item) => item.practiceDone);
  showToast("Умение удалено.");
  render();
}

function addHardThing() {
  state.hardThings.push({ title: "Новое сложное дело", effortDone: false, completed: false });
  showToast("Сложное дело добавлено.");
  render();
}

function updateHardThing(index, value) {
  const item = state.hardThings[index];
  if (!item) return;
  item.title = value;
  saveState();
}

function removeHardThing(index) {
  const item = state.hardThings[index];
  if (!item) return;
  if (item.effortDone) {
    state.todayXp = Math.max(0, state.todayXp - XP_RULES.hardThing);
    state.totalXp = Math.max(0, state.totalXp - XP_RULES.hardThing);
  }
  if (item.completed) state.totalXp = Math.max(0, state.totalXp - XP_RULES.hardThingDone);
  state.hardThings.splice(index, 1);
  const mission = state.missions.find((missionItem) => missionItem.id === "hard");
  if (mission) mission.done = state.hardThings.some((hard) => hard.effortDone);
  showToast("Сложное дело удалено.");
  render();
}

function toggleHardThingEffort(index) {
  const item = state.hardThings[index];
  if (!item) return;
  item.effortDone = !item.effortDone;
  const mission = state.missions.find((missionItem) => missionItem.id === "hard");
  if (mission) mission.done = state.hardThings.some((hard) => hard.effortDone);
  if (item.effortDone) {
    awardXp(XP_RULES.hardThing, `${signedGem(XP_RULES.hardThing)} за сложное дело.`);
    return;
  }
  state.todayXp = Math.max(0, state.todayXp - XP_RULES.hardThing);
  state.totalXp = Math.max(0, state.totalXp - XP_RULES.hardThing);
  showToast(`Сложное дело снято: ${signedGem(-XP_RULES.hardThing)}.`);
  render();
}

function toggleHardThingCompleted(index) {
  const item = state.hardThings[index];
  if (!item) return;
  item.completed = !item.completed;
  if (item.completed) {
    state.totalXp += XP_RULES.hardThingDone;
    showToast(`${signedGem(XP_RULES.hardThingDone)} в общий баланс за доделанное дело.`);
    render();
    return;
  }
  state.totalXp = Math.max(0, state.totalXp - XP_RULES.hardThingDone);
  showToast(`Дело снято: ${signedGem(-XP_RULES.hardThingDone)} из общего баланса.`);
  render();
}

function removeReward(index) {
  state.rewards.splice(index, 1);
  showToast("Награда удалена.");
  render();
}

function redeemReward(index) {
  const reward = state.rewards[index];
  if (!reward) return;
  const cost = Number(reward.cost) || 0;
  if (state.totalXp < cost) {
    showToast(`Пока не хватает ${gemLabel(cost - state.totalXp)}.`);
    return;
  }
  state.totalXp = Math.max(0, state.totalXp - cost);
  state.rewardHistory = [
    {
      title: reward.title || "Награда",
      cost,
      redeemedAt: new Date().toISOString(),
      returned: false,
    },
    ...(state.rewardHistory || []),
  ].slice(0, 10);
  showToast(`Награда получена: ${signedGem(-cost)}.`);
  render();
}

function undoReward(index) {
  const item = state.rewardHistory?.[index];
  if (!item || item.returned) return;
  item.returned = true;
  state.totalXp += Number(item.cost) || 0;
  showToast(`Алмазы возвращены: ${signedGem(Number(item.cost) || 0)}.`);
  render();
}

function awardXp(xp, message) {
  const wasSurvived = state.todayXp >= state.dailyGoal || state.manualSurvived;
  state.dayNotCounted = false;
  state.todayXp += xp;
  state.totalXp += xp;
  if (!wasSurvived && state.todayXp >= state.dailyGoal) {
    state.survivedNights = Math.max(state.survivedNights, state.night);
    state.currentStreak += 1;
    state.bestStreak = Math.max(state.bestStreak, state.currentStreak);
  }
  showToast(message.replace("+XP", signedGem(xp)));
  checkBadges();
  render();
}

function setSection(section) {
  state.activeSection = section;
  render();
  if (section !== "Главный экран") {
    document.querySelector(".content")?.scrollIntoView({ behavior: "smooth", block: "start" });
  }
}

function addSimpleItem(type) {
  if (type === "book") {
    state.books.push({
      title: "Новая книга",
      author: "Автор",
      status: "хочу прочитать",
      pages: 0,
      startDate: TODAY_ISO,
      endDate: "",
      diaryDone: false,
      completed: false,
      diaryXpAwarded: false,
      completionXpAwarded: false,
    });
    showToast("Книга добавлена в маршрут чтения.");
    render();
    return;
  }
  if (type === "video") {
    state.videos.push({
      title: "Новое открытие",
      source: state.discoverySources?.[0] || "Источник добавит родитель",
      type: "видео",
      status: "запланировано",
      insight: "",
      insightRecorded: false,
    });
    showToast("Открытие добавлено.");
    render();
    return;
  }
  if (type === "reward") {
    state.rewards.push({ title: "Новая награда", cost: 100 });
    showToast("Награда добавлена.");
    render();
    return;
  }
  if (type === "projectStep") state.project.steps.push("Новый этап проекта");
  showToast("Добавлено. Позже это можно будет редактировать подробно.");
  render();
}

function changeXp(delta, message) {
  state.todayXp = Math.max(0, state.todayXp + delta);
  state.totalXp = Math.max(0, state.totalXp + delta);
  showToast(message);
  render();
}

function toggleReadingDiary(index) {
  const book = state.books[index];
  if (!book) return;
  book.diaryDone = !book.diaryDone;
  if (book.diaryDone) {
    changeXp(XP_RULES.readingDiary, `${signedGem(XP_RULES.readingDiary)} за дневник чтения.`);
  } else {
    changeXp(-XP_RULES.readingDiary, `Дневник чтения снят: ${signedGem(-XP_RULES.readingDiary)}.`);
  }
}

function toggleBookRead(index) {
  const book = state.books[index];
  if (!book) return;
  book.completed = !book.completed;
  book.status = book.completed ? "прочитано" : "читаю";
  if (book.completed && !book.endDate) book.endDate = TODAY_ISO;
  if (book.completed) {
    changeXp(XP_RULES.bookDone, `${signedGem(XP_RULES.bookDone)} за прочитанную книгу.`);
  } else {
    changeXp(-XP_RULES.bookDone, `Статус книги возвращён: ${signedGem(-XP_RULES.bookDone)}.`);
  }
}

function deleteBook(index) {
  const book = state.books[index];
  if (!book) return;
  if (book.diaryDone) {
    state.todayXp = Math.max(0, state.todayXp - XP_RULES.readingDiary);
    state.totalXp = Math.max(0, state.totalXp - XP_RULES.readingDiary);
  }
  if (book.completed) {
    state.todayXp = Math.max(0, state.todayXp - XP_RULES.bookDone);
    state.totalXp = Math.max(0, state.totalXp - XP_RULES.bookDone);
  }
  state.books.splice(index, 1);
  showToast("Книга убрана из маршрута чтения.");
  render();
}

function updateBookField(index, field, value) {
  const book = state.books[index];
  if (!book) return;
  book[field] = field === "pages" ? Number(value) : value;
  render();
}

function updateReadingGoal(field, value) {
  state.readingGoals = {
    ...initialState.readingGoals,
    ...(state.readingGoals || {}),
    [field]: Math.max(0, Number(value) || 0),
  };
  render();
}

function updateDiscoveryGoal(value) {
  state.discoveryGoals = {
    ...initialState.discoveryGoals,
    ...(state.discoveryGoals || {}),
    items: Math.max(0, Number(value) || 0),
  };
  render();
}

function updateDiscovery(index, field, value) {
  const discovery = state.videos[index];
  if (!discovery) return;
  discovery[field] = value;
  render();
}

function markDiscoveryViewed(index) {
  const discovery = state.videos[index];
  if (!discovery) return;
  discovery.status = discovery.type === "подкаст" ? "прослушано" : "просмотрено";
  showToast("Отмечено. Алмазы за это живут в миссии дня.");
  render();
}

function recordDiscoveryInsight(index) {
  const discovery = state.videos[index];
  if (!discovery) return;
  if (!discovery.insight?.trim()) {
    showToast("Сначала запиши короткую находку.");
    return;
  }
  if (discovery.insightRecorded) {
    showToast("Эта находка уже записана.");
    return;
  }
  discovery.insightRecorded = true;
  awardXp(XP_RULES.video, `${signedGem(XP_RULES.video)} за записанное открытие.`);
}

function addDiscoverySource() {
  const source = state.discoverySourceDraft?.trim();
  if (!source) return;
  state.discoverySources = [...(state.discoverySources || []), source];
  state.discoverySourceDraft = "";
  showToast("Источник добавлен.");
  render();
}

function updateDiscoverySource(index, value) {
  if (!state.discoverySources?.[index]) return;
  state.discoverySources[index] = value;
  render();
}

function updateDiscoverySourceDraft(value) {
  state.discoverySourceDraft = value;
  saveState();
}

function updateParentComment(value) {
  state.parentComment = value;
  saveState();
}

function removeDiscoverySource(index) {
  state.discoverySources = (state.discoverySources || []).filter((_, itemIndex) => itemIndex !== index);
  if (!state.discoverySources.length) state.discoverySources = ["Источник добавит родитель"];
  render();
}

function manualSurvive() {
  if (state.todayXp >= state.dailyGoal || state.manualSurvived) {
    showToast("Эта ночь уже держится у костра.");
    return;
  }
  state.manualSurvived = true;
  state.dayNotCounted = false;
  state.survivedNights = Math.max(state.survivedNights, state.night);
  state.currentStreak += 1;
  state.bestStreak = Math.max(state.bestStreak, state.currentStreak);
  checkBadges();
  showToast("Ночь зачтена мягко. Лагерь удержался.");
  render();
}

function resetStreakSoftly() {
  state.currentStreak = 0;
  state.manualSurvived = false;
  state.dayNotCounted = true;
  showToast("Серия начнётся заново. Главное — снова выйти на тропу.");
  render();
}

function returnToTrail() {
  state.returnedToTrail = true;
  state.currentStreak = Math.max(1, state.currentStreak + 1);
  state.bestStreak = Math.max(state.bestStreak, state.currentStreak);
  addBadge("Вернулся на тропу");
  render();
}

function hero() {
  const status = survivalStatus();
  return `
    <section class="hero">
      <div class="topbar">
        <div class="top-stats">
          <span class="stat-chip">Накоплено <strong>${gemLabel(state.totalXp)}</strong></span>
          <span class="stat-chip">Ночей пройдено <strong>${state.survivedNights} / 99</strong></span>
          <button class="stat-chip stat-button reward-stat" onclick="setSection('Награды')">Награды</button>
        </div>
        <button class="parent-link" onclick="setSection('Родитель')">Родитель</button>
      </div>

      <div class="hero-grid">
        <div class="hero-copy">
          <div class="forest-title">99 ночей в лесу</div>
          <h1>Лето Андрея</h1>
          <div class="hero-actions">
            <button class="hero-nav-btn" onclick="setSection('Карта лета')">Карта</button>
            <button class="hero-nav-btn" onclick="document.querySelector('.mission-hub')?.scrollIntoView({ behavior: 'smooth', block: 'start' })">Миссии на лето</button>
            <button class="hero-nav-btn" onclick="setSection('Итог дня')">Итог дня</button>
            <button class="hero-nav-btn" onclick="setSection('Итог за всё время')">Итог за всё время</button>
          </div>
        </div>

        <div class="camp-card">
          <div class="camp-card-title">
            <span>Сегодняшняя ночь</span>
            <strong>${state.todayXp} / ${gemLabel(state.dailyGoal)}</strong>
          </div>
          <div class="camp-scene">
            <div class="fire ${status.fire}">
              <div class="flame"></div>
              <div class="flame small"></div>
              <div class="logs"></div>
            </div>
          </div>
          <div class="progress-row"><span>${status.label}</span><span>осталось ${gemLabel(xpLeft())}</span></div>
          <div class="progress" aria-label="До выживания этой ночью"><span style="--value:${progressPercent(state.todayXp, state.dailyGoal)}"></span></div>
          <div class="camp-missions">
            ${state.missions.map(campMissionRow).join("")}
          </div>
        </div>
      </div>
    </section>
    ${missionHubHtml()}
  `;
}

function missionHubHtml() {
  const routeSections = [
    ["📘", "Чтение", "книги и дневник"],
    ["🧩", "Новое умение", "главный навык лета"],
    ["🔭", "Открытия", "видео и подкасты"],
    ["🪓", "Сложное дело", "15 минут усилия"],
    ["🏕️", "Помощь по дому", "домашние дела"],
  ];
  return `
    <section class="mission-hub">
      <div class="panel-title">
        <h2>Миссии на лето</h2>
      </div>
      <div class="route-grid">
        ${routeSections.map(([icon, title, text]) => `
          <button class="route-card" onclick="setSection('${title}')">
            <span>${icon}</span>
            <strong>${title}</strong>
            <em>${text}</em>
          </button>
        `).join("")}
      </div>
    </section>
  `;
}

function dashboard() {
  return "";
}

function campMissionRow(mission) {
  if (mission.id === "skill") {
    const skillDoneToday = (state.skills || []).some((skill) => skill.practiceDone);
    return `
      <div class="camp-mission-row ${skillDoneToday ? "done" : ""}">
        <span class="camp-mission-icon">${mission.icon}</span>
        <span class="camp-mission-title">${mission.title}</span>
        <span class="camp-mission-xp">${signedGem(mission.xp)}</span>
        <button class="${skillDoneToday ? "secondary-btn" : "primary-btn"}" onclick="setSection('Новое умение')">${skillDoneToday ? "Сделал" : "Выбрать"}</button>
      </div>
    `;
  }
  if (mission.id === "hard") {
    const hardXp = state.hardThings.some((item) => item.effortDone) ? mission.xp : 0;
    return `
      <div class="camp-mission-row ${hardXp ? "done" : ""}">
        <span class="camp-mission-icon">${mission.icon}</span>
        <span class="camp-mission-title">${mission.title}</span>
        <span class="camp-mission-xp">${signedGem(mission.xp)}</span>
        <button class="${hardXp ? "secondary-btn" : "primary-btn"}" onclick="setSection('Сложное дело')">${hardXp ? "Сделал" : "Выбрать"}</button>
      </div>
    `;
  }
  if (mission.id === "role") {
    const homeXp = state.roles.reduce((sum, task) => sum + (task.done ? (Number(task.xp) || 5) : 0), 0);
    return `
      <div class="camp-mission-row ${homeXp ? "done" : ""}">
        <span class="camp-mission-icon">${mission.icon}</span>
        <span class="camp-mission-title">${mission.title}</span>
        <span class="camp-mission-xp">${homeXp ? signedGem(homeXp) : signedGem(mission.xp)}</span>
        <button class="${homeXp ? "secondary-btn" : "primary-btn"}" onclick="setSection('Помощь по дому')">${homeXp ? "Сделал" : "Выбрать"}</button>
      </div>
    `;
  }
  return `
    <div class="camp-mission-row ${mission.done ? "done" : ""}">
      <span class="camp-mission-icon">${mission.icon}</span>
      <span class="camp-mission-title">${mission.title}</span>
      <span class="camp-mission-xp">${signedGem(mission.xp)}</span>
      <button class="${mission.done ? "secondary-btn" : "primary-btn"}" onclick="completeMission('${mission.id}')">${mission.done ? "Отменить" : "Сделал"}</button>
    </div>
  `;
}

function compactMissionCard(mission) {
  return `
    <article class="compact-mission ${mission.done ? "done" : ""}">
      <span class="icon">${mission.icon}</span>
      <div>
        <h3>${mission.title}</h3>
        <p class="muted">${mission.done ? "Уже сделано" : `${signedGem(mission.xp)} к костру`}</p>
      </div>
      <button class="${mission.done ? "secondary-btn" : "primary-btn"}" onclick="completeMission('${mission.id}')">${mission.done ? "Отменить" : "Сделал"}</button>
    </article>
  `;
}

function missionCard(mission) {
  return `
    <article class="mission-card ${mission.done ? "done" : ""}">
      <div class="card-top">
        <span class="icon">${mission.icon}</span>
        <span class="xp-pill">${signedGem(mission.xp)}</span>
      </div>
      <h3>${mission.title}</h3>
      <button class="${mission.done ? "secondary-btn" : "primary-btn"}" onclick="completeMission('${mission.id}')">${mission.done ? "Отменить" : "Сделал"}</button>
    </article>
  `;
}

function challengeHtml() {
  const levels = [
    [3, "Первые костры"],
    [5, "Следопыт"],
    [7, "Неделя в лесу"],
    [14, "Хранитель лагеря"],
    [21, "Мастер выживания"],
    [30, "Легенда леса"],
  ];
  return `<div class="challenge-grid">${levels.map(([nights, badge]) => `
    <div class="challenge-item ${state.currentStreak >= nights ? "open" : ""}">
      <span class="icon">${state.currentStreak >= nights ? "💎" : "🔥"}</span>
      <strong>${nights} ночи подряд — ${badge}</strong>
      <span class="muted">${state.currentStreak >= nights ? "открыто" : `ещё ${nights - state.currentStreak}`}</span>
    </div>`).join("")}</div>`;
}

function mapSection() {
  const months = calendarMonths();
  const selectedIso = state.selectedCalendarDate;
  const selectedEvents = state.calendarEvents[selectedIso] || [];
  const weekDays = ["Пн", "Вт", "Ср", "Чт", "Пт", "Сб", "Вс"];
  return `
    <main class="content">
      <section class="panel full summer-map">
        <div class="panel-title">
          <h2>Карта лета</h2>
          <span class="mini-chip">25 мая — 31 августа · ровно 99 ночей · 🏕️ ${state.survivedNights} ночей пройдено</span>
        </div>

        <div class="calendar-layout calendar-only">
          <div class="calendar-months">
            ${months.map((month) => {
              const firstWeekday = (month.days[0].date.getDay() + 6) % 7;
              return `
                <article class="calendar-month">
                  <h3>${month.name}</h3>
                  <div class="week-row">${weekDays.map((day) => `<span>${day}</span>`).join("")}</div>
                  <div class="calendar-grid" style="--offset:${firstWeekday}">
                    ${month.days.map((day, index) => calendarDayHtml(day, index === 0)).join("")}
                  </div>
                </article>
              `;
            }).join("")}
          </div>
        </div>

        <div class="calendar-tools-bottom">
          <div class="calendar-toolbar">
            <div class="field">
              <label>Дата</label>
              <input type="date" min="2026-05-25" max="2026-08-31" value="${state.calendarDraft.date}" onchange="selectCalendarDate(this.value)" />
            </div>
            <div class="field">
              <label>Статус ночи</label>
              <select onchange="setCalendarDraft('status', this.value)">
                <option value="survived" ${state.calendarDraft.status === "survived" ? "selected" : ""}>Ночь пройдена</option>
                <option value="skipped" ${state.calendarDraft.status === "skipped" ? "selected" : ""}>Пропущена мягко</option>
                <option value="planned" ${state.calendarDraft.status === "planned" ? "selected" : ""}>Запланировано</option>
              </select>
            </div>
            <button class="primary-btn" onclick="saveCalendarStatus()">Добавить статус</button>
          </div>

          <div class="calendar-editor">
            <div class="panel-title">
              <h3>События выбранной даты</h3>
              <span class="mini-chip">${selectedEvents.length} событ.</span>
            </div>
            <div class="field">
              <label>Добавить событие</label>
              <input value="${escapeHtml(state.calendarDraft.event)}" placeholder="Например: Экспедиция" oninput="setCalendarDraft('event', this.value)" />
            </div>
            <div class="row">
              <button class="primary-btn" onclick="addCalendarEvent()">Сохранить событие</button>
            </div>
            ${selectedEvents.length ? `<div class="event-edit-list">${selectedEvents.map((event, index) => `
              <div class="event-edit-item">
                <input id="event-${selectedIso}-${index}" value="${escapeHtml(event)}" oninput="saveCalendarEventText('${selectedIso}', ${index}, this.value)" />
                <div class="event-actions">
                  <button class="secondary-btn" onclick="updateCalendarEventFromInput('${selectedIso}', ${index})">Сохранить</button>
                  <button class="ghost-btn" onclick="appendCalendarEvent('${selectedIso}', ${index})">Дополнить</button>
                  <button class="icon-btn" title="Удалить событие" onclick="removeCalendarEvent('${selectedIso}', ${index})">×</button>
                </div>
              </div>
            `).join("")}</div>` : ""}
          </div>
        </div>

        <div class="map-legend">
          <span class="mini-chip">🔥 ночь пройдена</span>
          <span class="mini-chip">⛺ сегодняшняя ночь</span>
          <span class="mini-chip">◦ пропущена мягко</span>
          <span class="mini-chip">Событие пишется прямо в ячейке</span>
        </div>
      </section>
    </main>
  `;
}

function nightLabelByIso(iso) {
  const day = calendarDays().find((item) => item.iso === iso);
  if (!day) return "День вне летней карты";
  return day.night <= 99 ? `Ночь ${day.night} из 99` : "Дополнительный летний день после 99 ночей";
}

function calendarDayHtml(day, isFirstInMonth) {
  const status = state.calendarStatuses[day.iso] || "planned";
  const events = state.calendarEvents[day.iso] || [];
  const isSelected = state.selectedCalendarDate === day.iso;
  const isWeekend = day.date.getDay() === 0 || day.date.getDay() === 6;
  const tooltip = events.length
    ? `${nightLabelByIso(day.iso)}, событие: ${events.join(", ")}`
    : nightLabelByIso(day.iso);

  return `
    <button
      class="calendar-day ${status} ${isSelected ? "selected" : ""} ${isWeekend ? "weekend" : ""}"
      style="${isFirstInMonth ? `grid-column-start: ${((day.date.getDay() + 6) % 7) + 1}` : ""}"
      title="${escapeHtml(tooltip)}"
      data-tooltip="${escapeHtml(tooltip)}"
      onclick="selectCalendarDate('${day.iso}')"
    >
      <span class="day-number">${day.date.getDate()}</span>
      <span class="day-week">${new Intl.DateTimeFormat("ru-RU", { weekday: "short" }).format(day.date)}</span>
      <span class="day-mark">${calendarStatusIcon(status)}</span>
      ${events.length ? `<span class="event-label">${escapeHtml(events[0])}</span>` : ""}
    </button>
  `;
}

function todayFireSection() {
  const status = survivalStatus();
  return `
    <main class="content">
      <section class="panel full night-panel">
        <div class="panel-title"><h2>Сегодняшняя ночь</h2><span class="mini-chip">${state.todayXp} / ${gemLabel(state.dailyGoal)}</span></div>
        <div class="night-workbench">
          <div class="camp-card embedded">
            <div class="camp-card-title">
              <span>Костёр</span>
              <strong>${state.todayXp} / ${gemLabel(state.dailyGoal)}</strong>
            </div>
            <div class="camp-scene">
              <div class="fire ${status.fire}">
                <div class="flame"></div>
                <div class="flame small"></div>
                <div class="logs"></div>
              </div>
            </div>
            <div class="progress-row"><span>${status.label}</span><span>осталось ${gemLabel(xpLeft())}</span></div>
            <div class="progress" aria-label="До выживания этой ночью"><span style="--value:${progressPercent(state.todayXp, state.dailyGoal)}"></span></div>
          </div>
          <div class="camp-missions night-missions">
            ${state.missions.map(campMissionRow).join("")}
          </div>
        </div>
      </section>
    </main>
  `;
}

function readingSection() {
  const readingGoals = { ...initialState.readingGoals, ...(state.readingGoals || {}) };
  const completedBooks = state.books.filter((book) => book.completed || book.status === "прочитано");
  const completedPages = completedBooks.reduce((sum, book) => sum + (Number(book.pages) || 0), 0);
  const booksProgress = readingGoals.books ? progressPercent(completedBooks.length, readingGoals.books) : "0%";
  const pagesProgress = readingGoals.pages ? progressPercent(completedPages, readingGoals.pages) : "0%";
  const routeProgress = Math.max(parseInt(booksProgress, 10), parseInt(pagesProgress, 10));
  return `
    <main class="content">
      <section class="panel full">
        <div class="panel-title">
          <h2>Чтение</h2>
          <button class="primary-btn" onclick="addSimpleItem('book')">Добавить книгу</button>
        </div>
        <p class="muted">Цель на лето: ${readingGoals.books} книг или ${readingGoals.pages} страниц. Бумажный дневник чтения засчитывается отдельно от завершения книги.</p>
        <div class="reading-stats">
          <div class="reading-stat">
            <span class="stat-icon">📘</span>
            <div><strong>${completedBooks.length} / ${readingGoals.books}</strong><span>книг прочитано</span></div>
          </div>
          <div class="reading-stat">
            <span class="stat-icon">📄</span>
            <div><strong>${completedPages} / ${readingGoals.pages}</strong><span>страниц пройдено</span></div>
          </div>
          <div class="reading-stat">
            <span class="stat-icon">🗺️</span>
            <div><strong>${routeProgress}%</strong><span>пути к цели</span></div>
          </div>
        </div>
        <div class="cards reading-list">${state.books.map((book, index) => `
          <article class="journal-card book-card">
            <div class="book-card-head">
              <span class="xp-pill">${book.status}</span>
            </div>
            <div class="book-facts">
              <div><span>Название</span><input value="${escapeHtml(book.title)}" onchange="updateBookField(${index}, 'title', this.value)" /></div>
              <div><span>Автор</span><input value="${escapeHtml(book.author)}" onchange="updateBookField(${index}, 'author', this.value)" /></div>
              <div><span>Кол-во страниц</span><input type="number" min="0" value="${book.pages || 0}" onchange="updateBookField(${index}, 'pages', this.value)" /></div>
              <div><span>Начал читать</span><input type="date" value="${book.startDate || ""}" onchange="updateBookField(${index}, 'startDate', this.value)" /></div>
              <div><span>Закончил</span><input type="date" value="${book.endDate || ""}" onchange="updateBookField(${index}, 'endDate', this.value)" /></div>
            </div>
            <div class="reading-actions">
              <button class="reading-toggle ${book.diaryDone ? "active" : ""}" onclick="toggleReadingDiary(${index})">
                <span>${book.diaryDone ? "✓ Дневник чтения" : "Дневник чтения"}</span>
                <strong>${book.diaryDone ? signedGem(XP_RULES.readingDiary) : `даёт ${signedGem(XP_RULES.readingDiary)}`}</strong>
              </button>
              <button class="reading-toggle ${book.completed ? "active" : ""}" onclick="toggleBookRead(${index})">
                <span>${book.completed ? "✓ Прочитано" : "Прочитано"}</span>
                <strong>${book.completed ? signedGem(XP_RULES.bookDone) : `даёт ${signedGem(XP_RULES.bookDone)}`}</strong>
              </button>
            </div>
            <button class="delete-book-btn" aria-label="Удалить книгу" title="Удалить книгу" onclick="deleteBook(${index})">×</button>
          </article>
        `).join("")}</div>
      </section>
    </main>
  `;
}

function skillSection() {
  return `
    <main class="content">
      <section class="panel full">
        <div class="panel-title"><h2>Новое умение</h2><button class="primary-btn" onclick="addSkill()">Добавить умение</button></div>
        <div class="cards reading-list">${(state.skills || []).map((skill, index) => `
        <article class="journal-card skill-card book-card">
          <div class="book-card-head"><span class="xp-pill">15 минут = ${gemLabel(XP_RULES.skill)}</span></div>
          <div class="book-facts">
            <div><span>Навык</span><input value="${escapeHtml(skill.name)}" oninput="updateSkill(${index}, 'name', this.value)" /></div>
            <div><span>Цель</span><input value="${escapeHtml(skill.goal)}" oninput="updateSkill(${index}, 'goal', this.value)" /></div>
          </div>
          <div class="reading-actions">
            <button class="reading-toggle ${skill.practiceDone ? "active" : ""}" onclick="toggleSkillPractice(${index})">
              <span>${skill.practiceDone ? "✓ Занятие сделано" : "Занятие 15 минут"}</span>
              <strong>${skill.practiceDone ? signedGem(XP_RULES.skill) : `даёт ${signedGem(XP_RULES.skill)}`}</strong>
            </button>
            <button class="reading-toggle ${skill.completed ? "active" : ""}" onclick="toggleSkillCompleted(${index})">
              <span>${skill.completed ? "✓ Умение освоено" : "Умение освоено"}</span>
              <strong>${skill.completed ? signedGem(XP_RULES.skillDone) : `даёт ${signedGem(XP_RULES.skillDone)}`}</strong>
            </button>
          </div>
          <button class="delete-book-btn" aria-label="Удалить умение" title="Удалить умение" onclick="deleteSkill(${index})">×</button>
        </article>
        `).join("")}</div>
      </section>
    </main>
  `;
}

function videosSection() {
  const discoveryGoals = { ...initialState.discoveryGoals, ...(state.discoveryGoals || {}) };
  const recordedCount = state.videos.filter((item) => item.insightRecorded).length;
  const discoveryProgress = discoveryGoals.items ? progressPercent(recordedCount, discoveryGoals.items) : "0%";
  const sources = state.discoverySources?.length ? state.discoverySources : initialState.discoverySources;
  return `
    <main class="content">
      <section class="panel full">
        <div class="panel-title"><h2>Открытия: видео и подкасты</h2><button class="primary-btn" onclick="addSimpleItem('video')">Добавить открытие</button></div>
        <p class="muted">Цель на лето: ${discoveryGoals.items} открытий. Алмазы даются за записанную находку: что нового понял или заметил.</p>
        <div class="reading-stats discovery-stats">
          <div class="reading-stat">
            <span class="stat-icon">🔭</span>
            <div><strong>${recordedCount} / ${discoveryGoals.items}</strong><span>открытий записано</span></div>
          </div>
          <div class="reading-stat">
            <span class="stat-icon">🎙️</span>
            <div><strong>${state.videos.length}</strong><span>видео и подкастов в списке</span></div>
          </div>
          <div class="reading-stat">
            <span class="stat-icon">🗺️</span>
            <div><strong>${discoveryProgress}</strong><span>пути к цели</span></div>
          </div>
        </div>
        <div class="cards reading-list">${state.videos.map((video, index) => `
          <article class="journal-card discovery-card">
            <div class="card-top"><span class="icon">${video.type === "подкаст" ? "🎙️" : "🔭"}</span><span class="xp-pill">${video.status || "запланировано"}</span></div>
            <div class="book-facts">
              <div><span>Название</span><input value="${escapeHtml(video.title)}" onchange="updateDiscovery(${index}, 'title', this.value)" /></div>
              <div><span>Источник</span><select onchange="updateDiscovery(${index}, 'source', this.value)">
                ${sources.map((source) => `<option value="${escapeHtml(source)}" ${video.source === source ? "selected" : ""}>${escapeHtml(source)}</option>`).join("")}
              </select></div>
              <div><span>Тип</span><select onchange="updateDiscovery(${index}, 'type', this.value)">
                <option value="видео" ${video.type !== "подкаст" ? "selected" : ""}>видео</option>
                <option value="подкаст" ${video.type === "подкаст" ? "selected" : ""}>подкаст</option>
              </select></div>
              <div class="wide-field"><span>Новая находка</span><textarea placeholder="Что нового я понял?" onchange="updateDiscovery(${index}, 'insight', this.value)">${escapeHtml(video.insight || "")}</textarea></div>
            </div>
            <div class="reading-actions">
              <button class="reading-toggle ${video.status === "просмотрено" || video.status === "прослушано" ? "active" : ""}" onclick="markDiscoveryViewed(${index})">
                <span>${video.type === "подкаст" ? "Прослушано" : "Просмотрено"}</span>
                <strong>без алмазов</strong>
              </button>
              <button class="reading-toggle ${video.insightRecorded ? "active" : ""}" ${video.insightRecorded ? "disabled" : ""} onclick="recordDiscoveryInsight(${index})">
                <span>${video.insightRecorded ? "✓ Открытие записано" : "Записать открытие"}</span>
                <strong>${video.insightRecorded ? signedGem(XP_RULES.video) : `даёт ${signedGem(XP_RULES.video)}`}</strong>
              </button>
            </div>
          </article>`).join("")}</div>
      </section>
    </main>
  `;
}

function hardThingSection() {
  return `
    <main class="content">
      <section class="panel full">
        <div class="panel-title"><h2>Сложное дело</h2><button class="primary-btn" onclick="addHardThing()">Добавить</button></div>
        <div class="cards reading-list">${state.hardThings.map((item, index) => `
          <article class="journal-card skill-card book-card">
            <div class="book-card-head"><span class="xp-pill">15 минут = ${gemLabel(XP_RULES.hardThing)}</span></div>
            <div class="book-facts">
              <div><span>Дело</span><input value="${escapeHtml(item.title)}" oninput="updateHardThing(${index}, this.value)" /></div>
            </div>
            <div class="reading-actions">
              <button class="reading-toggle ${item.effortDone ? "active" : ""}" onclick="toggleHardThingEffort(${index})">
                <span>${item.effortDone ? "✓ Усилие сделано" : "Усилие 15 минут"}</span>
                <strong>${item.effortDone ? signedGem(XP_RULES.hardThing) : `даёт ${signedGem(XP_RULES.hardThing)}`}</strong>
              </button>
              <button class="reading-toggle ${item.completed ? "active" : ""}" onclick="toggleHardThingCompleted(${index})">
                <span>${item.completed ? "✓ Дело доделано" : "Дело доделано"}</span>
                <strong>${item.completed ? signedGem(XP_RULES.hardThingDone) : `даёт ${signedGem(XP_RULES.hardThingDone)}`}</strong>
              </button>
            </div>
            <button class="delete-book-btn" aria-label="Удалить дело" title="Удалить дело" onclick="removeHardThing(${index})">×</button>
          </article>
        `).join("")}</div>
      </section>
    </main>
  `;
}

function projectSection() {
  return `
    <main class="content">
      <section class="panel full">
        <div class="panel-title"><h2>Летний проект</h2><button class="primary-btn" onclick="addSimpleItem('projectStep')">Добавить проект</button></div>
        <article class="journal-card">
          <div class="card-top"><span class="icon">🗺️</span><span class="xp-pill">${state.project.status}</span></div>
          <h3>${state.project.title}</h3>
          <p>${state.project.description}</p>
          <p><strong>Почему интересно:</strong> ${state.project.why}</p>
          <div class="trail">${state.project.steps.map((step) => `<span class="mini-chip">🧭 ${step}</span>`).join("")}</div>
          <p><strong>Следующий шаг:</strong> ${state.project.next}</p>
          <p><strong>Финальная демонстрация семье:</strong> место для описания показа.</p>
          <button class="primary-btn" onclick="awardXp(${XP_RULES.project}, '+XP за шаг по проекту. Маршрут стал длиннее.')">Сделать шаг по проекту</button>
        </article>
      </section>
    </main>
  `;
}

function rolesSection() {
  const homeXpToday = state.roles.reduce((sum, role) => sum + (role.done ? (Number(role.xp) || 5) : 0), 0);
  return `
    <main class="content">
      <section class="panel full">
        <div class="panel-title">
          <h2>Помощь по дому</h2>
          <button class="primary-btn" onclick="addHomeTask()">Добавить</button>
        </div>
        <div class="home-summary">
          <span class="mini-chip">Сегодня: ${gemLabel(homeXpToday)}</span>
          <span class="mini-chip">Дел сделано: ${state.roles.filter((role) => role.done).length}</span>
        </div>
        <div class="home-task-list">${state.roles.map((role, index) => `
          <div class="home-task-row ${role.done ? "done" : ""}">
            <span class="camp-mission-icon">🏕️</span>
            <input value="${escapeHtml(role.title)}" oninput="saveHomeTaskField(${index}, 'title', this.value)" />
            <input class="xp-input" type="number" min="0" value="${role.xp || 5}" oninput="saveHomeTaskField(${index}, 'xp', this.value)" />
            <button class="${role.done ? "secondary-btn" : "primary-btn"}" onclick="completeHomeTask(${index})">${role.done ? "Не сделал" : "Сделал"}</button>
            <button class="icon-btn" title="Удалить дело" onclick="removeHomeTask(${index})">×</button>
          </div>`).join("")}</div>
      </section>
    </main>
  `;
}

function rewardsSection() {
  return `
    <main class="content">
      <section class="panel full">
        <div class="panel-title"><h2>Награды</h2><button class="primary-btn" onclick="addSimpleItem('reward')">Добавить награду</button></div>
        <div class="reward-balance">
          <span>Баланс</span>
          <strong>${gemLabel(state.totalXp)}</strong>
        </div>
        <div class="reward-list">${state.rewards.map((reward, index) => `
          <div class="reward-item reward-card">
            <input value="${escapeHtml(reward.title)}" oninput="updateReward(${index}, 'title', this.value)" />
            <input class="xp-input" type="number" min="0" value="${reward.cost || 0}" oninput="updateReward(${index}, 'cost', this.value)" />
            <button class="primary-btn" onclick="redeemReward(${index})">Получить</button>
            <button class="icon-btn" title="Удалить награду" onclick="removeReward(${index})">×</button>
          </div>
        `).join("")}</div>
        ${(state.rewardHistory || []).length ? `
          <div class="reward-history">
            <h3>История наград</h3>
            ${(state.rewardHistory || []).map((item, index) => `
              <div class="reward-history-item ${item.returned ? "returned" : ""}">
                <span><strong>${escapeHtml(item.title)}</strong><br><span class="muted">${signedGem(-item.cost)}</span></span>
                <button class="secondary-btn" ${item.returned ? "disabled" : ""} onclick="undoReward(${index})">${item.returned ? "Алмазы возвращены" : "Вернуть алмазы"}</button>
              </div>
            `).join("")}
          </div>
        ` : ""}
      </section>
    </main>
  `;
}

function weeklySection() {
  return `
    <main class="content">
      <section class="panel full">
        <div class="panel-title"><h2>Итоги недели</h2><span class="mini-chip">🗺️ Выбрать маршрут</span></div>
        <div class="summary-list">
          <div class="summary-item"><strong>Книги продвинул</strong><span>${state.weekly.books}</span></div>
          <div class="summary-item"><strong>Сложных дел сделал</strong><span>${state.weekly.hard}</span></div>
          <div class="summary-item"><strong>Алмазов набрал</strong><span>${gemLabel(state.weekly.xp)}</span></div>
          <div class="summary-item"><strong>Самое трудное</strong><span>${state.weekly.hardMoment}</span></div>
          <div class="summary-item"><strong>Чем гордится</strong><span>${state.weekly.proud}</span></div>
          <div class="summary-item"><strong>На следующую неделю</strong><span>${state.weekly.next}</span></div>
        </div>
      </section>
    </main>
  `;
}

function daySummarySection() {
  const status = survivalStatus();
  const doneMissions = state.missions.filter((mission) => mission.done && !["skill", "hard", "role", "video"].includes(mission.id));
  const skillPractices = (state.skills || []).filter((skill) => skill.practiceDone);
  const completedSkills = (state.skills || []).filter((skill) => skill.completed);
  const hardEfforts = (state.hardThings || []).filter((item) => item.effortDone);
  const hardCompleted = (state.hardThings || []).filter((item) => item.completed);
  const homeTasks = (state.roles || []).filter((role) => role.done);
  const completedBooks = (state.books || []).filter((book) => book.completed || book.status === "прочитано");
  const discoveries = (state.videos || []).filter((item) => item.insightRecorded);
  const todayRewards = (state.rewardHistory || []).filter((item) => !item.returned && item.redeemedAt?.slice(0, 10) === TODAY_ISO);
  const dayRows = [
    ...doneMissions.map((mission) => [`${mission.icon} ${mission.title}`, signedGem(mission.xp)]),
    ...skillPractices.map((skill) => [`🧩 Новое умение: ${skill.name}`, signedGem(XP_RULES.skill)]),
    ...hardEfforts.map((item) => [`🪓 Сложное дело: ${item.title}`, signedGem(XP_RULES.hardThing)]),
    ...homeTasks.map((role) => [`🏕️ Помощь по дому: ${role.title}`, signedGem(role.xp || 5)]),
    ...discoveries.map((item) => [`${item.type === "подкаст" ? "🎙️" : "🔭"} Видео или подкаст: ${item.title}`, signedGem(XP_RULES.video)]),
    ...todayRewards.map((item) => [`🎒 Награда: ${item.title}`, signedGem(-item.cost)]),
  ];
  const bonusRows = [
    ...completedBooks.map((book) => [`📄 Дочитал книгу: ${book.title}`, signedGem(XP_RULES.bookDone)]),
    ...completedSkills.map((skill) => [`🧩 Умение освоено: ${skill.name}`, signedGem(XP_RULES.skillDone)]),
    ...hardCompleted.map((item) => [`🪓 Сложное дело доделано: ${item.title}`, signedGem(XP_RULES.hardThingDone)]),
  ];
  return `
    <main class="content">
      <section class="panel full">
        <div class="panel-title"><h2>Итог дня</h2><span class="mini-chip">${formatDateRu(TODAY_ISO)}</span></div>
        <div class="day-summary-top">
          <div class="metric"><span>Сегодня набрано</span><strong>${state.todayXp} / ${gemLabel(state.dailyGoal)}</strong></div>
          <div class="metric"><span>Статус ночи</span><strong>${status.label}</strong></div>
          <div class="metric"><span>Осталось до костра</span><strong>${gemLabel(xpLeft())}</strong></div>
        </div>
        <div class="summary-list day-summary-list">
          ${dayRows.length ? dayRows.map(([title, value]) => `<div class="summary-item"><strong>${escapeHtml(title)}</strong><span>${escapeHtml(value)}</span></div>`).join("") : `
            <div class="summary-item example"><strong>📘 Прочитать 30 минут</strong><span>${signedGem(10)}</span></div>
            <div class="summary-item example"><strong>🎙️ Видео или подкаст: собирал миньона</strong><span>${signedGem(10)}</span></div>
            <div class="summary-item example"><strong>🪓 Сложное дело: Собрать роботов-боксёров</strong><span>${signedGem(15)}</span></div>
            <div class="summary-item example"><strong>🧩 Новое умение: Кубик Рубика</strong><span>${signedGem(15)}</span></div>
            <div class="summary-item example"><strong>🏕️ Помощь по дому: Разбор стиральной машины</strong><span>${signedGem(5)}</span></div>
          `}
        </div>
      </section>
      <section class="panel full">
        <div class="panel-title"><h2>Бонусы дня</h2><span class="mini-chip">в общий баланс</span></div>
        <div class="summary-list">${bonusRows.length ? bonusRows.map(([title, value]) => `<div class="summary-item bonus"><strong>${escapeHtml(title)}</strong><span>${escapeHtml(value)}</span></div>`).join("") : `
          <div class="summary-item bonus example"><strong>📄 Дочитал книгу: Дом роботов</strong><span>${signedGem(50)}</span></div>
          <div class="summary-item bonus example"><strong>🧩 Умение освоено: Кубик Рубика</strong><span>${signedGem(50)}</span></div>
        `}</div>
      </section>
    </main>
  `;
}

function allTimeSummarySection() {
  const completedBooks = (state.books || []).filter((book) => book.completed || book.status === "прочитано");
  const completedPages = completedBooks.reduce((sum, book) => sum + (Number(book.pages) || 0), 0);
  const diaryCount = (state.books || []).filter((book) => book.diaryDone).length;
  const skillPracticeCount = (state.skills || []).filter((skill) => skill.practiceDone).length;
  const completedSkills = (state.skills || []).filter((skill) => skill.completed);
  const hardEffortCount = (state.hardThings || []).filter((item) => item.effortDone).length;
  const hardCompleted = (state.hardThings || []).filter((item) => item.completed);
  const discoveries = (state.videos || []).filter((item) => item.insightRecorded);
  const homeDone = (state.roles || []).filter((role) => role.done);
  const rewardSpent = (state.rewardHistory || []).filter((item) => !item.returned).reduce((sum, item) => sum + (Number(item.cost) || 0), 0);
  const named = (items, field = "title") => items.map((item) => escapeHtml(item[field] || item.name)).join(", ") || "пока нет";
  return `
    <main class="content">
      <section class="panel full">
        <div class="panel-title"><h2>Итог за всё время</h2><span class="mini-chip">${gemLabel(state.totalXp)} сейчас</span></div>
        <div class="day-summary-top">
          <div class="metric"><span>Ночей пройдено</span><strong>${state.survivedNights} / 99</strong></div>
          <div class="metric"><span>Алмазов накоплено</span><strong>${gemLabel(state.totalXp)}</strong></div>
          <div class="metric"><span>Потрачено на награды</span><strong>${gemLabel(rewardSpent)}</strong></div>
        </div>
        <div class="summary-list">
          <div class="summary-item"><strong>📘 Книги прочитаны</strong><span>${completedBooks.length} книг · ${completedPages} страниц</span></div>
          <div class="summary-item"><strong>📄 Внесено в дневник чтения</strong><span>${diaryCount} записей</span></div>
          <div class="summary-item"><strong>🧩 Занятия по умениям</strong><span>${skillPracticeCount} раз</span></div>
          <div class="summary-item"><strong>🧩 Умения освоены</strong><span>${named(completedSkills, "name")}</span></div>
          <div class="summary-item"><strong>🪓 Сложные дела 15 минут</strong><span>${hardEffortCount} раз</span></div>
          <div class="summary-item"><strong>🪓 Сложные дела доделаны</strong><span>${named(hardCompleted)}</span></div>
          <div class="summary-item"><strong>🔭 Открытия записаны</strong><span>${discoveries.length} открытий</span></div>
          <div class="summary-item"><strong>🏕️ Помощь по дому</strong><span>${homeDone.length} дел: ${named(homeDone)}</span></div>
        </div>
      </section>
      <section class="panel full">
        <div class="panel-title"><h2>Как это собирать дальше</h2><span class="mini-chip">для базы данных</span></div>
        <div class="summary-list">
          <div class="summary-item"><strong>Каждое нажатие “Сделал”</strong><span>сохранять как запись истории: дата, тип дела, название, алмазы</span></div>
          <div class="summary-item"><strong>Итог дня</strong><span>строить из записей за выбранную дату</span></div>
          <div class="summary-item"><strong>Итог за всё время</strong><span>считать суммами по всей истории, а не по текущим галочкам</span></div>
        </div>
      </section>
    </main>
  `;
}

function parentSection() {
  const status = survivalStatus();
  const readingGoals = { ...initialState.readingGoals, ...(state.readingGoals || {}) };
  const discoveryGoals = { ...initialState.discoveryGoals, ...(state.discoveryGoals || {}) };
  return `
    <main class="content">
      <div class="content-grid">
        <section class="panel wide">
          <div class="panel-title"><h2>Настройки родителя</h2><span class="mini-chip">Мягкая рамка</span></div>
          <div class="fields">
            <div class="field">
              <label>Дневная цель в алмазах</label>
              <input type="number" value="${state.dailyGoal}" min="10" max="120" onchange="state.dailyGoal = Number(this.value); render();" />
            </div>
            <div class="field-pair">
              <div class="field">
                <label>Цель чтения: книг за лето</label>
                <input type="number" value="${readingGoals.books}" min="0" max="30" onchange="updateReadingGoal('books', this.value)" />
              </div>
              <div class="field">
                <label>Цель чтения: страниц за лето</label>
                <input type="number" value="${readingGoals.pages}" min="0" max="10000" step="10" onchange="updateReadingGoal('pages', this.value)" />
              </div>
            </div>
            <div class="field">
              <label>Цель открытий: видео и подкастов за лето</label>
              <input type="number" value="${discoveryGoals.items}" min="0" max="100" onchange="updateDiscoveryGoal(this.value)" />
            </div>
            <div class="field source-manager">
              <label>Источники для открытий</label>
              <div class="source-add-row">
                <input value="${escapeHtml(state.discoverySourceDraft || "")}" placeholder="Добавить источник" oninput="updateDiscoverySourceDraft(this.value)" />
                <button class="secondary-btn" onclick="addDiscoverySource()">Добавить</button>
              </div>
              <div class="source-list">${(state.discoverySources || initialState.discoverySources).map((source, index) => `
                <div class="source-item">
                  <input value="${escapeHtml(source)}" onchange="updateDiscoverySource(${index}, this.value)" />
                  <button class="icon-btn" title="Удалить источник" onclick="removeDiscoverySource(${index})">×</button>
                </div>
              `).join("")}</div>
            </div>
            <div class="field">
              <label>Комментарий родителя</label>
              <textarea onchange="updateParentComment(this.value)">${state.parentComment}</textarea>
            </div>
            <label class="row"><input type="checkbox" ${state.softMode ? "checked" : ""} onchange="state.softMode = this.checked; render();" style="width:auto" /> Мягкий режим: 30+ ${GEM} можно зачесть вручную</label>
          </div>
          <div class="row">
            <button class="primary-btn" onclick="manualSurvive()">Вручную отметить день как выживший</button>
            <button class="secondary-btn" onclick="resetStreakSoftly()">Мягко сбросить серию</button>
            <button class="ghost-btn" onclick="returnToTrail()">Вернулся на тропу</button>
          </div>
        </section>
        <aside class="panel side">
          <h3>Статус дня</h3>
          <p><strong>${status.label}</strong></p>
          <p class="muted">${state.parentComment}</p>
          <p>Серия начнётся заново. В лесу так бывает: главное — снова выйти на тропу.</p>
        </aside>
      </div>
    </main>
  `;
}

function sectionHtml() {
  const map = {
    "Главный экран": dashboard,
    "Карта лета": mapSection,
    "Чтение": readingSection,
    "Новое умение": skillSection,
    "Открытия": videosSection,
    "Сложное дело": hardThingSection,
    "Помощь по дому": rolesSection,
    "Награды": rewardsSection,
    "Итог дня": daySummarySection,
    "Итог за всё время": allTimeSummarySection,
    "Итоги недели": weeklySection,
    "Родитель": parentSection,
  };
  return (map[state.activeSection] || dashboard)();
}

function render() {
  document.getElementById("app").innerHTML = `<div class="app-shell">${hero()}${sectionHtml()}</div>`;
  saveState();
}

render();
