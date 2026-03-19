import { useEffect, useMemo, useState } from "react";
import { Calendar as CalendarIcon, MapPin, Navigation, Heart, Plus } from "lucide-react";
import { WidgetCard } from "./WidgetCard";
import { DASHBOARD_MOCK_DATA } from "../mockData";
import type { CalendarEventInput } from "@/modules/calendar/types";
import { EventModal } from "@/modules/calendar/components/EventModal";
import { useCalendar } from "@/store/calendar";
import { useJourney } from "@/store/journey";
import { useLove } from "@/store/love";
import { JourneyModal } from "@/modules/journey/components/JourneyModal";
import { LoveModal } from "@/modules/love/components/LoveModal";

export function CalendarWidget() {
  const data = DASHBOARD_MOCK_DATA.calendar;
  const calendarEvents = useCalendar((state) => state.calendarEvents);
  const createEvent = useCalendar((state) => state.createEvent);
  const isLoading = useCalendar((state) => state.isLoading);
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [page, setPage] = useState(0);
  const perPage = 6;

  const upcomingEvents = useMemo(() => {
    if (calendarEvents.length === 0) {
      return data.upcomingEvents.map((event) => ({
        id: String(event.id),
        title: event.title,
        time: event.time,
        dateLabel: event.date,
        priority: "medium",
      }));
    }
    const now = new Date();
    const priorityWeight = { high: 3, medium: 2, low: 1, undefined: 0 } as const;
    const sorted = [...calendarEvents].sort((a, b) => {
      const aWeight = priorityWeight[(a.priority ?? "undefined") as keyof typeof priorityWeight] ?? 0;
      const bWeight = priorityWeight[(b.priority ?? "undefined") as keyof typeof priorityWeight] ?? 0;
      if (aWeight !== bWeight) return bWeight - aWeight;
      if (aWeight === 0) {
        const aDate = new Date(`${a.date}T${a.startTime}`);
        const bDate = new Date(`${b.date}T${b.startTime}`);
        return aDate.getTime() - bDate.getTime();
      }
      return b.createdAt.localeCompare(a.createdAt);
    });
    return sorted
      .filter((event) => new Date(`${event.date}T${event.startTime}`) >= now)
      .map((event) => ({
        id: event.id,
        title: event.title,
        time: event.startTime,
        dateLabel: new Date(event.date).toLocaleDateString("en-US", {
          month: "short",
          day: "numeric",
        }),
        priority: event.priority ?? "medium",
      }));
  }, [calendarEvents, data.upcomingEvents]);

  const pageCount = Math.max(1, Math.ceil(upcomingEvents.length / perPage));
  const pageEvents = upcomingEvents.slice(page * perPage, page * perPage + perPage);

  useEffect(() => {
    if (page > pageCount - 1) {
      setPage(0);
    }
  }, [page, pageCount]);

  return (
    <WidgetCard
      title="Calendar"
      icon={<CalendarIcon size={20} />}
      action={(
        <button
          type="button"
          onClick={() => {
            setSelectedDate(new Date());
            setModalOpen(true);
          }}
          className="flex items-center gap-1 rounded-md border border-border px-2 py-1 text-xs text-muted-foreground hover:text-foreground"
        >
          <Plus size={14} /> Quick add
        </button>
      )}
    >
      <div className="space-y-3">
        {isLoading && (
          <div className="text-sm text-muted-foreground">Loading events...</div>
        )}
        {!isLoading && upcomingEvents.length === 0 && (
          <div className="text-sm text-muted-foreground">No upcoming events.</div>
        )}
        {!isLoading && upcomingEvents.length > 0 && (
          <>
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              {pageEvents.map((event) => (
                <div key={event.id} className="p-3 bg-secondary rounded-lg border border-border/50 flex flex-col gap-1 hover:border-primary/50 transition-colors">
                  <div className="flex items-center justify-between gap-2">
                    <h4 className="font-semibold">{event.title}</h4>
                    <span className="rounded-full border border-border px-2 py-0.5 text-[10px] uppercase tracking-wide text-muted-foreground">
                      {event.priority}
                    </span>
                  </div>
                  <div className="flex items-center gap-3 text-sm text-muted-foreground">
                    <span className="flex items-center gap-1"><CalendarIcon size={14}/> {event.dateLabel}</span>
                    <span className="flex items-center gap-1"><span className="w-1.5 h-1.5 bg-primary rounded-full"></span> {event.time}</span>
                  </div>
                </div>
              ))}
            </div>

            <div className="flex items-center justify-between pt-1 text-xs text-muted-foreground">
              <button
                type="button"
                onClick={() => setPage((prev) => Math.max(0, prev - 1))}
                className="rounded-md border border-border px-2 py-1 hover:text-foreground"
                disabled={page === 0}
              >
                Prev
              </button>
              <span>
                Page {page + 1} / {pageCount}
              </span>
              <button
                type="button"
                onClick={() => setPage((prev) => Math.min(pageCount - 1, prev + 1))}
                className="rounded-md border border-border px-2 py-1 hover:text-foreground"
                disabled={page >= pageCount - 1}
              >
                Next
              </button>
            </div>
          </>
        )}
      </div>

      <EventModal
        open={modalOpen}
        date={selectedDate}
        event={null}
        onClose={() => setModalOpen(false)}
        onSave={async (payload: CalendarEventInput) => {
          await createEvent(payload);
          setModalOpen(false);
        }}
      />
    </WidgetCard>
  );
}

export function JourneyWidget() {
  const data = DASHBOARD_MOCK_DATA.journey;
  const journeyEntries = useJourney((state) => state.journeyEntries);
  const createJourneyEntry = useJourney((state) => state.createJourneyEntry);
  const [modalOpen, setModalOpen] = useState(false);
  const latestEntry = journeyEntries[0];

  return (
    <WidgetCard
      title="Journey & Travel"
      icon={<Navigation size={20} />}
      action={(
        <button
          type="button"
          onClick={() => setModalOpen(true)}
          className="flex items-center gap-1 rounded-md border border-border px-2 py-1 text-xs text-muted-foreground hover:text-foreground"
        >
          <Plus size={14} /> Quick add
        </button>
      )}
    >
      <div className="flex flex-col h-full justify-between gap-4">
        <div>
          <p className="text-sm text-muted-foreground mb-2">Latest Entry</p>
          <div className="flex items-center justify-between bg-primary/10 text-primary p-3 rounded-lg border border-primary/20">
            <h3 className="font-bold flex items-center gap-2">
              <MapPin size={18} /> {latestEntry?.title ?? data.nextTrip}
            </h3>
            <span className="font-mono font-bold">{latestEntry?.date ?? `${data.daysUntil} days`}</span>
          </div>
        </div>
        
        <div className="space-y-2">
          <p className="text-xs font-semibold text-muted-foreground uppercase">Highlights</p>
          <div className="flex flex-wrap gap-2">
            {data.places.map((place, idx) => (
              <span key={idx} className="text-xs bg-secondary px-2 py-1 rounded-md border border-border">
                {place}
              </span>
            ))}
          </div>
        </div>
      </div>

      <JourneyModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        onSave={(payload) => createJourneyEntry(payload)}
      />
    </WidgetCard>
  );
}

export function LoveTrackerWidget() {
  const data = DASHBOARD_MOCK_DATA.loveTracker;
  const loveData = useLove((state) => state.loveData);
  const createLoveAnniversary = useLove((state) => state.createLoveAnniversary);
  const [modalOpen, setModalOpen] = useState(false);
  const daysTogether = Math.max(
    0,
    Math.floor((Date.now() - new Date(loveData.startDate).getTime()) / (1000 * 60 * 60 * 24))
  );
  const latestAnniversary = loveData.anniversaries[0];

  return (
    <WidgetCard
      title="Love Tracker"
      icon={<Heart size={20} className="text-pink-500" />}
      className="border-pink-500/20"
      action={(
        <button
          type="button"
          onClick={() => setModalOpen(true)}
          className="flex items-center gap-1 rounded-md border border-border px-2 py-1 text-xs text-muted-foreground hover:text-foreground"
        >
          <Plus size={14} /> Quick add
        </button>
      )}
    >
      <div className="flex items-center justify-center p-4 bg-pink-500/5 rounded-xl border border-pink-500/10 mb-4">
        <div className="text-center">
          <p className="text-4xl font-black text-pink-500 mb-1">{daysTogether}</p>
          <p className="text-xs font-bold uppercase tracking-widest text-pink-500/70">Days Together</p>
        </div>
      </div>
      
      <div className="space-y-2 text-sm">
        <div className="flex justify-between border-b border-border pb-1">
          <span className="text-muted-foreground">Anniversary</span>
          <span className="font-medium">{loveData.startDate}</span>
        </div>
        <div className="flex justify-between border-b border-border pb-1">
          <span className="text-muted-foreground">Current Mood</span>
          <span className="font-medium">{data.mood}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-muted-foreground">Last Date</span>
          <span className="font-medium">{latestAnniversary?.date ?? data.lastDate}</span>
        </div>
      </div>

      <LoveModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        onSave={(payload) => createLoveAnniversary(payload)}
      />
    </WidgetCard>
  );
}
