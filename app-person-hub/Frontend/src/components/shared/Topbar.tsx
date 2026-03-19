import { useState } from "react";
import { Menu, Moon, Sun, Bell, User } from "lucide-react";
import { useDarkMode } from "@/hooks/useDarkMode";
import { useNotifications } from "@/store/notifications";

interface TopbarProps {
  onMenuClick: () => void;
}

export function Topbar({ onMenuClick }: TopbarProps) {
  const { isDark, toggleDarkMode } = useDarkMode();
  const notifications = useNotifications((state) => state.notifications);
  const markNotificationRead = useNotifications((state) => state.markNotificationRead);
  const [isOpen, setIsOpen] = useState(false);
  const unreadCount = notifications.filter((item) => !item.read).length;

  return (
    <header className="h-16 border-b border-border bg-card/80 backdrop-blur-md sticky top-0 z-30 px-4 flex items-center justify-between relative">
      <div className="flex items-center gap-4">
        <button 
          onClick={onMenuClick}
          className="p-2 md:hidden hover:bg-secondary rounded-md text-muted-foreground"
        >
          <Menu size={20} />
        </button>
        <div className="font-semibold text-foreground md:hidden">Personal Hub</div>
      </div>

      <div className="flex items-center gap-2">
        <button 
          onClick={toggleDarkMode}
          className="p-2 hover:bg-secondary rounded-full text-muted-foreground transition-colors"
          title="Toggle Theme"
        >
          {isDark ? <Sun size={20} /> : <Moon size={20} />}
        </button>
        <button
          className="p-2 hover:bg-secondary rounded-full text-muted-foreground relative"
          onClick={() => setIsOpen((prev) => !prev)}
        >
          <Bell size={20} />
          {unreadCount > 0 && (
            <span className="absolute top-1 right-2 w-2 h-2 bg-destructive rounded-full"></span>
          )}
        </button>
        <button className="p-2 hover:bg-secondary rounded-full text-muted-foreground ml-2 bg-secondary/50">
          <User size={20} />
        </button>
      </div>

      {isOpen && (
        <div className="absolute right-4 top-16 w-80 rounded-xl border border-border/70 bg-card shadow-xl">
          <div className="flex items-center justify-between border-b border-border/60 px-4 py-3">
            <p className="text-sm font-semibold">Notifications</p>
            <span className="text-xs text-muted-foreground">{unreadCount} unread</span>
          </div>
          <div className="max-h-72 overflow-y-auto">
            {notifications.length === 0 && (
              <p className="px-4 py-3 text-sm text-muted-foreground">No notifications yet.</p>
            )}
            {notifications.map((item) => (
              <button
                key={item.id}
                type="button"
                onClick={() => markNotificationRead(item.id)}
                className="w-full px-4 py-3 text-left hover:bg-secondary/50"
              >
                <p className="text-sm font-semibold">{item.title}</p>
                {item.body && <p className="text-xs text-muted-foreground">{item.body}</p>}
                <p className="text-[11px] text-muted-foreground">{new Date(item.createdAt).toLocaleString()}</p>
              </button>
            ))}
          </div>
        </div>
      )}
    </header>
  );
}
