import { Link } from "react-router-dom";
import { TrelloWidget } from "./components/TrelloWidget";
import { FinanceWidget } from "./components/FinanceWidget";
import { HealthWidget } from "./components/HealthWidget";
import { CalendarWidget, JourneyWidget, LoveTrackerWidget } from "./components/OtherWidgets";

export default function Dashboard() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-1">
        <h1 className="text-3xl font-bold tracking-tight">Welcome Back! 👋</h1>
        <p className="text-muted-foreground">Here is your personal overview for today.</p>
      </div>

      <div className="grid grid-cols-1 gap-3 md:grid-cols-3 lg:grid-cols-6">
        {[
          { name: "Calendar", desc: "Lunar + Events", href: "/calendar" },
          { name: "Project Board", desc: "Trello-style tasks", href: "/project-board" },
          { name: "Finance", desc: "Budget overview", href: "/finance" },
          { name: "Health", desc: "Cycle & mood", href: "/health" },
          { name: "Journey", desc: "Timeline notes", href: "/journey" },
          { name: "Love", desc: "Anniversaries", href: "/love-tracker" },
        ].map((item) => (
          <Link
            key={item.name}
            to={item.href}
            className="rounded-xl border border-border/70 bg-card/70 p-4 transition-colors hover:border-primary/40 hover:bg-card"
          >
            <p className="text-sm font-semibold">{item.name}</p>
            <p className="text-xs text-muted-foreground">{item.desc}</p>
          </Link>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
        <FinanceWidget />
        <HealthWidget />
        <TrelloWidget />
        <CalendarWidget />
        <JourneyWidget />
        <LoveTrackerWidget />
      </div>
    </div>
  );
}
