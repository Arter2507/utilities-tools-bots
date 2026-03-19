import { useMemo, useState } from "react";
import type { ListChildComponentProps } from "react-window";
import { VariableSizeList } from "react-window";
import { Image, Plus, Route } from "lucide-react";
import { useJourney } from "@/store/journey";
import { JourneyModal } from "./components/JourneyModal";

function renderRichText(text: string) {
  const parts = text.split(/(\*\*[^*]+\*\*|_[^_]+_)/g);
  return parts.map((part, index) => {
    if (part.startsWith("**") && part.endsWith("**")) {
      return <strong key={index}>{part.slice(2, -2)}</strong>;
    }
    if (part.startsWith("_") && part.endsWith("_")) {
      return <em key={index}>{part.slice(1, -1)}</em>;
    }
    return <span key={index}>{part}</span>;
  });
}

export default function JourneyModule() {
  const journeyEntries = useJourney((state) => state.journeyEntries);
  const createJourneyEntry = useJourney((state) => state.createJourneyEntry);
  const [modalOpen, setModalOpen] = useState(false);

  const entries = useMemo(() => {
    return [...journeyEntries].sort((a, b) => b.date.localeCompare(a.date));
  }, [journeyEntries]);

  const getItemSize = (index: number) => {
    const entry = entries[index];
    if (!entry) return 200;
    const base = entry.imageUrl ? 220 : 180;
    const extra = Math.min(120, Math.floor(entry.content.length / 4));
    return base + extra;
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Route className="h-4 w-4" />
            <span>Journey</span>
          </div>
          <h1 className="mt-2 text-3xl font-bold tracking-tight">Journey Timeline</h1>
          <p className="text-muted-foreground">A minimal log of your highlights and milestones.</p>
        </div>
        <button
          type="button"
          onClick={() => setModalOpen(true)}
          className="flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground"
        >
          <Plus className="h-4 w-4" /> New entry
        </button>
      </div>

      <div className="rounded-2xl border border-border/70 bg-card/50 p-2">
        {entries.length === 0 ? (
          <div className="p-6 text-sm text-muted-foreground">No journey entries yet.</div>
        ) : (
          <VariableSizeList
            height={560}
            width="100%"
            itemCount={entries.length}
            itemSize={getItemSize}
            itemData={entries}
          >
            {({ index, style, data }: ListChildComponentProps<typeof entries>) => {
              const entry = data[index];
              return (
                <div style={style} className="px-4 py-3">
                  <div className="relative pl-10">
                    <div className="absolute left-3 top-1 h-full w-px bg-border/60" />
                    <div className="absolute left-0 top-1 flex h-6 w-6 items-center justify-center rounded-full border border-border bg-card">
                      <span className="h-2.5 w-2.5 rounded-full bg-primary" />
                    </div>
                    <div className="rounded-2xl border border-border/70 bg-card/60 p-4 shadow-sm">
                      <div className="flex items-center justify-between gap-2">
                        <h3 className="text-lg font-semibold">{entry.title}</h3>
                        <span className="text-xs text-muted-foreground">{entry.date}</span>
                      </div>
                      <p className="mt-2 text-sm text-muted-foreground whitespace-pre-wrap">
                        {renderRichText(entry.content)}
                      </p>
                      {entry.imageUrl && (
                        <div className="mt-3 flex items-center gap-2 rounded-lg border border-border/60 bg-background/70 p-2 text-xs text-muted-foreground">
                          <Image className="h-4 w-4" />
                          <span className="truncate">{entry.imageUrl}</span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              );
            }}
          </VariableSizeList>
        )}
      </div>

      <JourneyModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        onSave={(payload) => createJourneyEntry(payload)}
      />
    </div>
  );
}
