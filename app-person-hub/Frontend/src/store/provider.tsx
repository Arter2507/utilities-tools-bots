import type { ReactNode } from "react";
import { NotificationProvider } from "./notifications";
import { TaskProvider } from "./tasks";
import { CalendarProvider } from "./calendar";
import { FinanceProvider } from "./finance";
import { HealthProvider } from "./health";
import { JourneyProvider } from "./journey";
import { LoveProvider } from "./love";

export function StoreProvider({ children }: { children: ReactNode }) {
  return (
    <NotificationProvider>
      <TaskProvider>
        <CalendarProvider>
          <FinanceProvider>
            <HealthProvider>
              <JourneyProvider>
                <LoveProvider>{children}</LoveProvider>
              </JourneyProvider>
            </HealthProvider>
          </FinanceProvider>
        </CalendarProvider>
      </TaskProvider>
    </NotificationProvider>
  );
}
