export const DRIVER_PORTAL_SECTION_QUERY_KEY = "section" as const;
export const DRIVER_PORTAL_ORDER_ID_QUERY_KEY = "orderId" as const;

export const DRIVER_PORTAL_SECTIONS = [
  "overview",
  "new-deliveries",
  "scheduled",
  "history",
  "earnings",
  "account",
] as const;

export type DriverPortalSection = (typeof DRIVER_PORTAL_SECTIONS)[number];

export const DEFAULT_DRIVER_PORTAL_SECTION: DriverPortalSection = "overview";

type SearchParamsLike = Pick<URLSearchParams, "get" | "toString">;

export interface DriverPortalQueryState {
  section: DriverPortalSection;
  orderId?: string;
}

export interface DriverPortalQueryUpdate {
  section?: DriverPortalSection;
  orderId?: string | null;
  preserveOrderId?: boolean;
}

export function isDriverPortalSection(value: string): value is DriverPortalSection {
  return DRIVER_PORTAL_SECTIONS.includes(value as DriverPortalSection);
}

export function getDriverPortalSection(
  value: string | null | undefined,
): DriverPortalSection {
  if (!value) return DEFAULT_DRIVER_PORTAL_SECTION;
  return isDriverPortalSection(value) ? value : DEFAULT_DRIVER_PORTAL_SECTION;
}

export function getDriverPortalOrderId(value: string | null | undefined): string | undefined {
  if (!value) return undefined;
  const trimmed = value.trim();
  return trimmed.length > 0 ? trimmed : undefined;
}

export function getDriverPortalQueryState(searchParams: SearchParamsLike): DriverPortalQueryState {
  return {
    section: getDriverPortalSection(searchParams.get(DRIVER_PORTAL_SECTION_QUERY_KEY)),
    orderId: getDriverPortalOrderId(searchParams.get(DRIVER_PORTAL_ORDER_ID_QUERY_KEY)),
  };
}

export function buildDriverPortalSearchParams(
  searchParams: SearchParamsLike,
  update: DriverPortalQueryUpdate = {},
): URLSearchParams {
  const next = new URLSearchParams(searchParams.toString());
  const current = getDriverPortalQueryState(searchParams);
  const nextSection = update.section ?? current.section;
  const preserveOrderId = update.preserveOrderId ?? false;

  next.set(DRIVER_PORTAL_SECTION_QUERY_KEY, nextSection);

  if (update.orderId !== undefined) {
    const orderId = getDriverPortalOrderId(update.orderId);
    if (orderId) {
      next.set(DRIVER_PORTAL_ORDER_ID_QUERY_KEY, orderId);
    } else {
      next.delete(DRIVER_PORTAL_ORDER_ID_QUERY_KEY);
    }
    return next;
  }

  if (!preserveOrderId && nextSection !== "new-deliveries") {
    next.delete(DRIVER_PORTAL_ORDER_ID_QUERY_KEY);
  }

  return next;
}

export function buildDriverPortalHref(
  pathname: string,
  searchParams: SearchParamsLike,
  update: DriverPortalQueryUpdate = {},
): string {
  const query = buildDriverPortalSearchParams(searchParams, update).toString();
  return query ? `${pathname}?${query}` : pathname;
}
