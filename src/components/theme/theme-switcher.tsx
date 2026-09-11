"use client";

import { useSyncExternalStore } from "react";
import { Button, Dropdown, Label, type Selection } from "@heroui/react";
import { Monitor, Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";

const THEME_OPTIONS = [
  { id: "light", label: "Light", icon: Sun },
  { id: "dark", label: "Dark", icon: Moon },
  { id: "system", label: "System", icon: Monitor },
] as const;

type ThemeId = (typeof THEME_OPTIONS)[number]["id"];

const noopSubscribe = () => () => {};

/** True after hydration; the stored theme is unknown during prerendering. */
function useIsClient() {
  return useSyncExternalStore(
    noopSubscribe,
    () => true,
    () => false,
  );
}

export function ThemeSwitcher() {
  const isClient = useIsClient();
  const { theme, setTheme } = useTheme();

  const current: ThemeId = isClient && (theme === "light" || theme === "dark") ? theme : "system";
  const active = THEME_OPTIONS.find((option) => option.id === current) ?? THEME_OPTIONS[2];
  const ActiveIcon = active.icon;

  const handleSelectionChange = (keys: Selection) => {
    if (keys === "all") return;
    const [next] = keys;
    if (next) setTheme(String(next));
  };

  return (
    <Dropdown>
      <Button isIconOnly aria-label={`Theme: ${active.label}. Change theme`} size="sm" variant="ghost">
        <ActiveIcon aria-hidden="true" className="size-[18px]" />
      </Button>
      <Dropdown.Popover className="min-w-40" placement="bottom end">
        <Dropdown.Menu
          disallowEmptySelection
          aria-label="Theme"
          selectedKeys={new Set([current])}
          selectionMode="single"
          onSelectionChange={handleSelectionChange}
        >
          {THEME_OPTIONS.map(({ id, label, icon: Icon }) => (
            <Dropdown.Item key={id} id={id} textValue={label}>
              <Icon aria-hidden="true" className="size-4 shrink-0 text-muted" />
              <Label>{label}</Label>
              <Dropdown.ItemIndicator />
            </Dropdown.Item>
          ))}
        </Dropdown.Menu>
      </Dropdown.Popover>
    </Dropdown>
  );
}
