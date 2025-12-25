import { Button } from "@/components/ui/button";
import { Moon, Palette, Sun } from "lucide-react";
import { useTheme } from "shadcn-glass-ui";

export function ThemeToggle() {
  const { theme, cycleTheme } = useTheme();

  const icons = {
    light: <Sun className="h-5 w-5" />,
    glass: <Moon className="h-5 w-5" />,
    aurora: <Palette className="h-5 w-5" />,
  };

  const labels = {
    light: "Light",
    glass: "Glass (Dark)",
    aurora: "Aurora",
  };

  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={cycleTheme}
      aria-label={`Current theme: ${labels[theme]}. Click to cycle themes.`}
      title={`Current: ${labels[theme]}`}
    >
      {icons[theme]}
    </Button>
  );
}
