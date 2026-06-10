"use server";

import { getSiteSettings, getMainMenu } from "@/data/shopify.server";

export async function getSiteSettingsAction() {
  return getSiteSettings();
}

export async function getMainMenuAction() {
  return getMainMenu();
}
