import { redirect } from "next/navigation";

export default function AddMenuItemPage({ searchParams }: any) {
  const typeParam = Array.isArray(searchParams?.type)
    ? searchParams?.type[0]
    : searchParams?.type;
  const menuTab =
    typeParam === "drink" ? "DRINKS" : typeParam === "deal" ? "SPECIAL DEALS" : "Main Dishes";

  redirect(`/restaurant-owner?view=MENU&menuTab=${encodeURIComponent(menuTab)}`);
}
