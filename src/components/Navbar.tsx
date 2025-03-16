
import { Link, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";
import { BarChart3, LineChart, PieChart, Home } from "lucide-react";

// Navbar Component
const Navbar = () => {
  const location = useLocation();
  const pathname = location.pathname;

  const navItems = [
    {
      name: "Home",
      path: "/",
      icon: <Home className="w-5 h-5" />,
    },
    {
      name: "Dashboard",
      path: "/dashboard",
      icon: <BarChart3 className="w-5 h-5" />,
    },
    {
      name: "Predict",
      path: "/predict",
      icon: <LineChart className="w-5 h-5" />,
    },
    {
      name: "Analysis",
      path: "/analysis",
      icon: <PieChart className="w-5 h-5" />,
    },
  ];

  return (
    <nav className="fixed top-0 left-0 right-0 z-10 bg-background/80 backdrop-blur-md border-b border-border">
      <div className="container mx-auto flex justify-between items-center h-16 px-4">
        <Link to="/" className="font-bold text-xl">
          StockPredict<span className="text-primary">LSTM</span>
        </Link>

        <div className="flex items-center space-x-1">
          {navItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={cn(
                "px-3 py-2 rounded-md text-sm flex items-center gap-2 transition-colors",
                pathname === item.path
                  ? "bg-primary text-primary-foreground"
                  : "hover:bg-muted"
              )}
            >
              {item.icon}
              <span className="hidden md:inline">{item.name}</span>
            </Link>
          ))}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
