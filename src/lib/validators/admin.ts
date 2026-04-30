import { z } from "zod";

const trimmedString = (max: number) =>
  z.string().trim().max(max);

export const projectSchema = z.object({
  slug: trimmedString(120).regex(/^[a-z0-9-]+$/, "Lowercase letters, digits, and hyphens only"),
  titleEn: trimmedString(200).min(2),
  titleAr: trimmedString(200).min(2),
  summaryEn: trimmedString(500).min(10),
  summaryAr: trimmedString(500).min(10),
  descriptionEn: trimmedString(8000).optional().or(z.literal("")),
  descriptionAr: trimmedString(8000).optional().or(z.literal("")),
  clientName: trimmedString(200).optional().or(z.literal("")),
  locationEn: trimmedString(200).optional().or(z.literal("")),
  locationAr: trimmedString(200).optional().or(z.literal("")),
  year: z.coerce.number().int().min(1990).max(2100).optional(),
  coverImage: trimmedString(500).min(1, "Cover image is required"),
  serviceId: trimmedString(60).optional().or(z.literal("")),
  isFeatured: z.coerce.boolean().optional().default(false),
  isVisible: z.coerce.boolean().optional().default(false),
  order: z.coerce.number().int().optional().default(0),
});

export const partnerSchema = z.object({
  nameEn: trimmedString(120).min(1),
  nameAr: trimmedString(120).min(1),
  logoText: trimmedString(20).optional().or(z.literal("")),
  logoUrl: trimmedString(500).optional().or(z.literal("")),
  websiteUrl: trimmedString(500).url().optional().or(z.literal("")),
  isVisible: z.coerce.boolean().optional().default(false),
  order: z.coerce.number().int().optional().default(0),
});

export const clientSchema = z.object({
  nameEn: trimmedString(120).min(1),
  nameAr: trimmedString(120).min(1),
  logoText: trimmedString(20).optional().or(z.literal("")),
  logoUrl: trimmedString(500).optional().or(z.literal("")),
  industryEn: trimmedString(120).optional().or(z.literal("")),
  industryAr: trimmedString(120).optional().or(z.literal("")),
  isVisible: z.coerce.boolean().optional().default(false),
  order: z.coerce.number().int().optional().default(0),
});

export const settingPatchSchema = z.object({
  key: trimmedString(120).min(1),
  value: trimmedString(8000),
  category: trimmedString(60).optional().or(z.literal("")),
});

export const visibilityPatchSchema = z.object({
  isVisible: z.boolean(),
});

export type ProjectInput = z.infer<typeof projectSchema>;
export type PartnerInput = z.infer<typeof partnerSchema>;
export type ClientInput = z.infer<typeof clientSchema>;
export type SettingInput = z.infer<typeof settingPatchSchema>;
