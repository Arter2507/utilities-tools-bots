export const DASHBOARD_MOCK_DATA = {
  trello: {
    tasks: [
      { id: 1, title: "Review UI/UX Pro Max rules", status: "todo" },
      { id: 2, title: "Initialize Frontend Architecture", status: "in-progress" },
      { id: 3, title: "Setup Tailwind & Dark Mode", status: "done" },
    ]
  },
  finance: {
    balance: 12500.50,
    monthlyChange: 5.2,
    transactions: [
      { id: 1, name: "Grocery", amount: -120, date: "2026-03-14" },
      { id: 2, name: "Salary", amount: 4500, date: "2026-03-01" },
    ]
  },
  health: {
    steps: 8450,
    calories: 1240,
    water: 1.5,
    sleep: 7.2
  },
  calendar: {
    upcomingEvents: [
      { id: 1, title: "Weekly Sync", time: "10:00 AM", date: "Today" },
      { id: 2, title: "Review Release Notes", time: "2:00 PM", date: "Tomorrow" },
    ]
  },
  journey: {
    places: ["Kyoto, Japan", "Hanoi, Vietnam", "Paris, France"],
    nextTrip: "Seoul, South Korea",
    daysUntil: 24
  },
  loveTracker: {
    anniversary: "2024-10-15",
    daysTogether: 516,
    mood: "Happy 💖",
    lastDate: "Coffee shop weekend"
  }
};
