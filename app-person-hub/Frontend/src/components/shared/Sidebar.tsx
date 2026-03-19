import { Compass, LayoutDashboard, Calendar, CreditCard, Activity, Heart, Menu, X, LayoutGrid } from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";

interface SidebarProps {
  isExpanded: boolean;
  setIsExpanded: (expanded: boolean) => void;
  isMobileOpen: boolean;
  setIsMobileOpen: (open: boolean) => void;
}

const MENU_ITEMS = [
  { icon: LayoutDashboard, label: "Dashboard", href: "/" },
  { icon: LayoutGrid, label: "Project Board", href: "/project-board" },
  { icon: Compass, label: "Journey", href: "/journey" },
  { icon: CreditCard, label: "Finance", href: "/finance" },
  { icon: Calendar, label: "Calendar", href: "/calendar" },
  { icon: Activity, label: "Health", href: "/health" },
  { icon: Heart, label: "Love Tracker", href: "/love-tracker" },
];

export function Sidebar({ isExpanded, setIsExpanded, isMobileOpen, setIsMobileOpen }: SidebarProps) {
  const location = useLocation();

  const toggleExpand = () => setIsExpanded(!isExpanded);

  const containerClasses = cn(
    "fixed bg-card border-r border-border transition-all duration-300 z-50 h-full flex flex-col",
    isExpanded ? "w-56" : "w-14",
    // Mobile classes
    isMobileOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"
  );

  return (
    <>
      {/* Mobile Backdrop */}
      {isMobileOpen && (
        <div 
          className="fixed inset-0 bg-background/80 backdrop-blur-sm z-40 md:hidden"
          onClick={() => setIsMobileOpen(false)}
        />
      )}
      
      <aside className={containerClasses}>
        <div className="flex items-center justify-between p-4 h-16 border-b border-border">
          {isExpanded && <span className="font-bold text-lg text-primary truncate">Personal Hub</span>}
          <button 
            onClick={toggleExpand} 
            className="p-1 rounded-md hover:bg-secondary text-muted-foreground hidden md:flex hover:text-foreground"
          >
            {isExpanded ? <X size={20} /> : <Menu size={20} />}
          </button>

          <button 
            onClick={() => setIsMobileOpen(false)} 
            className="p-1 rounded-md hover:bg-secondary text-muted-foreground md:hidden hover:text-foreground ml-auto"
          >
            <X size={20} />
          </button>
        </div>

        <nav className="flex-1 py-4 overflow-y-auto space-y-1 px-2">
          {MENU_ITEMS.map((item) => {
            const isActive = location.pathname === item.href;
            return (
              <Link
                key={item.href}
                to={item.href}
                onClick={() => setIsMobileOpen(false)}
                className={cn(
                  "flex items-center rounded-lg px-3 py-2 transition-colors cursor-pointer group",
                  isActive 
                    ? "bg-primary text-primary-foreground" 
                    : "text-muted-foreground hover:bg-secondary hover:text-foreground"
                )}
                title={!isExpanded ? item.label : undefined}
              >
                <item.icon size={20} className={cn("shrink-0", isExpanded && "mr-3")} />
                {isExpanded && <span className="truncate">{item.label}</span>}
              </Link>
            )
          })}
        </nav>
      </aside>
    </>
  );
}
