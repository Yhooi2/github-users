import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { type ReactNode } from "react";

export type TabItem = {
  value: string;
  label: string;
  content: ReactNode;
  disabled?: boolean;
};

type MainTabsProps = {
  tabs: TabItem[];
  defaultValue?: string;
  onValueChange?: (value: string) => void;
};

export function MainTabs({ tabs, defaultValue, onValueChange }: MainTabsProps) {
  const defaultTab = defaultValue || tabs[0]?.value;

  return (
    <Tabs
      defaultValue={defaultTab}
      onValueChange={onValueChange}
      className="w-full"
    >
      <TabsList
        className="grid w-full"
        style={{ gridTemplateColumns: `repeat(${tabs.length}, 1fr)` }}
      >
        {tabs.map((tab) => (
          <TabsTrigger
            key={tab.value}
            value={tab.value}
            disabled={tab.disabled}
          >
            {tab.label}
          </TabsTrigger>
        ))}
      </TabsList>
      {tabs.map((tab) => (
        <TabsContent key={tab.value} value={tab.value}>
          {tab.content}
        </TabsContent>
      ))}
    </Tabs>
  );
}
