import { z } from "zod";

export const DateISO = z.string().refine((s) => !Number.isNaN(Date.parse(s)), {
  message: "Invalid ISO date",
});

const statusEnum = z.enum(["available", "reserved", "booked"]);

export const Customer = z.object({
  id: z.string(),
  name: z.string().optional(),
  path: z.string().optional(),
  createdAt: DateISO,
  updatedAt: DateISO,
  size: z.number().optional(),
  description: z.string().optional(),
  isPublic: z.boolean().optional(),
  url: z.string().optional(),
});

/**
 * Slot schema reflecting the full slot object structure.
 */
export const SlotStatus = z.object({
  id: z.string(),
  createdAt: DateISO,
  updatedAt: DateISO,
  name: z.string(),
  slug: z.string(),
  color: z.string(),
  shapeCode: z.string(),
  order: z.number(),
});

const SlotCopy = z.object({
  markdown: z.string(),
  html: z.string(),
});

const SlotLink = z.object({
  id: z.string(),
  createdAt: DateISO,
  updatedAt: DateISO,
  title: z.string(),
  url: z.string(),
});

const SlotTag = z.object({
  id: z.string(),
  createdAt: DateISO,
  updatedAt: DateISO,
  text: z.string(),
  color: z.string(),
});

const SlotFile = z.object({
  id: z.string(),
  createdAt: DateISO,
  updatedAt: DateISO,
  name: z.string(),
  path: z.string(),
  size: z.number(),
  description: z.string(),
  isPublic: z.boolean(),
  url: z.string(),
});

const PlacementField = z.object({
  id: z.string(),
  createdAt: DateISO,
  updatedAt: DateISO,
  type: z.array(z.unknown()), // No type info for type array
  label: z.string(),
  slug: z.string(),
  order: z.number(),
  isRequired: z.boolean(),
  helperText: z.string(),
  isLocked: z.boolean(),
  isPrivate: z.boolean(),
  maxLength: z.number(),
  maxWords: z.number(),
  maxFileSize: z.number(),
  selectOptions: z.array(z.string()),
  defaultSelectOption: z.string(),
  height: z.number(),
  width: z.number(),
  convertImageFormat: z.boolean(),
  imageFormat: z.record(z.unknown()), // No type info for imageFormat
});

const PlacementFieldValue = z.object({
  id: z.string(),
  createdAt: DateISO,
  updatedAt: DateISO,
  placementField: z.array(PlacementField),
  value: z.string(),
  workspaceFile: z.array(PlacementField),
});

export const Slot = z.object({
  id: z.string(),
  createdAt: DateISO,
  updatedAt: DateISO,
  date: z.string(),
  price: z.number(),
  status: SlotStatus,
  placement: z.record(z.unknown()), // No type info for placement
  customer: Customer.optional(),
  copy: SlotCopy,
  links: z.array(SlotLink),
  notes: z.string(),
  tags: z.array(SlotTag),
  files: z.array(SlotFile),
  placementFieldValues: z.array(PlacementFieldValue),
});

export const Deal = z.object({
  id: z.string(),
  name: z.string().optional(),
  stage: z.string().optional(),
  amount: z.number().optional(),
  currency: z.string().optional(),
});
export type Deal = z.infer<typeof Deal>;

/**
 * Publication schema and types.
 */

export const Publication = z.object({
  id: z.string(),
  createdAt: DateISO,
  updatedAt: DateISO,
  name: z.string(),
  slug: z.string(),
  type: z.enum(["NEWSLETTER"]),
  days: z.array(z.unknown()), // No type info for days, so keep as unknown[]
  order: z.number(),
  blockedDates: z.array(z.string()),
  totalSends: z.number(),
  uniqueOpened: z.number(),
  totalUniqueOpened: z.number(),
  totalClicks: z.number(),
  targetedCategories: z.array(z.string()),
  defaultDueDate: z.record(z.unknown()), // No type info, so use record
});

/**
 * Generic Sponsy API response schema factory.
 * @param schema - Zod schema for the data array items
 * @returns Zod schema for Sponsy paginated response
 */
export function createGenericSponsyResponse<T extends z.ZodTypeAny>(schema: T) {
  return z.object({
    cursor: z.object({
      beforeCursor: z.string(),
      afterCursor: z.string(),
    }),
    data: z.array(schema),
  });
}

/**
 * Publication list response schema and types.
 */

export const SlotMetrics = z.object({
  impressions: z.number().default(0),
  clicks: z.number().default(0),
  ctr: z.number().optional(),
});
export type SlotMetrics = z.infer<typeof SlotMetrics>;

export const ListPublicationsInput = z.object({
  apiKey: z.string().optional(),
});

export const ListSlotsInput = z.object({
  apiKey: z.string().optional(),
  publicationId: z
    .string()
    .optional()
    .describe("Required if publicationName is not provided"),
  from: z.string().optional(),
  to: z.string().optional(),
  status: statusEnum.optional(),
  publicationName: z.string().optional(),
});

export const GetSlotMetricsInput = z.object({
  apiKey: z.string().optional(),
  slotId: z.string(),
  publicationId: z.string(),
  from: DateISO.optional(),
  to: DateISO.optional(),
});

export const ListDealsInput = z.object({
  apiKey: z.string().optional(),
  stage: z.string().optional(),
  updatedSince: DateISO.optional(),
});

export const SearchCustomersInput = z.object({
  apiKey: z.string().optional(),
  name: z.string(),
  limit: z.string().optional(),
  orderBy: z.string().optional(),
});

export const ListSlotsByCustomerInput = z.object({
  apiKey: z.string().optional(),
  publicationId: z.string(),
  customerName: z.string().optional(),
  customerId: z.string().optional(),
  from: z.string().optional(),
  to: z.string().optional(),
  status: statusEnum.optional(),
  limit: z.string().optional(),
  orderBy: z.string().optional(),
});
