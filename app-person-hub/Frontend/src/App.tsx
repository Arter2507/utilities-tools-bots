import { Suspense, lazy } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { MainLayout } from "./layouts/MainLayout";
import Dashboard from "./modules/dashboard/Dashboard";
import { ErrorBoundary } from "./components/shared/ErrorBoundary";

const CalendarManager = lazy(() => import("./modules/calendar/CalendarManager"));
const ProjectBoard = lazy(() => import("./modules/project-board/ProjectBoard"));
const FinanceBudget = lazy(() => import("./modules/finance/FinanceBudget"));
const HealthTracker = lazy(() => import("./modules/health/HealthTracker"));
const JourneyModule = lazy(() => import("./modules/journey/JourneyModule"));
const LoveTrackerModule = lazy(() => import("./modules/love/LoveTrackerModule"));

function App() {
  return (
    <BrowserRouter>
      <ErrorBoundary>
        <Suspense fallback={<div className="flex items-center justify-center p-12 text-muted-foreground">Loading module...</div>}>
          <Routes>
            <Route path="/" element={<MainLayout />}>
              <Route index element={<Dashboard />} />
              <Route path="calendar" element={<CalendarManager />} />
              <Route path="project-board" element={<ProjectBoard />} />
              <Route path="finance" element={<FinanceBudget />} />
              <Route path="health" element={<HealthTracker />} />
              <Route path="journey" element={<JourneyModule />} />
              <Route path="love-tracker" element={<LoveTrackerModule />} />
              <Route path="*" element={<div className="flex items-center justify-center p-12 text-muted-foreground">Module in construction</div>} />
            </Route>
          </Routes>
        </Suspense>
      </ErrorBoundary>
    </BrowserRouter>
  );
}

export default App;
