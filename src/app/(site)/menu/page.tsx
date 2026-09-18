import type { Metadata } from "next";
import { getProvider } from "@/lib/data-provider";
import { MenuExperience } from "@/components/menu/menu-experience";

// Admin availability changes must be reflected immediately — no caching.
export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Menu",
};

export default async function MenuPage() {
  const provider = getProvider();
  const [categories, items, locations] = await Promise.all([
    provider.getCategories(),
    provider.getMenuItems(),
    provider.getLocations(),
  ]);

  return <MenuExperience categories={categories} items={items} locations={locations} />;
}
