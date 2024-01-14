import supabase from "./supabase";

export interface SettingsTable {
  id: number;
  minBookingLength: number;
  maxBookingLength: number;
  maxGuestsPerBooking: number;
  breakfastPrice: number;
}

export async function getSettings() {
  const { data, error } = await supabase
    .from("settings")
    .select("*")
    .single<SettingsTable>();

  if (error) {
    console.error(error);
    throw new Error("Settings could not be loaded");
  }
  return data;
}

// We expect a newSetting object that looks like {setting: newValue}
export async function updateSetting(newSetting: SettingsTable) {
  const { data, error } = await supabase
    .from("settings")
    .update(newSetting)
    // There is only ONE row of settings, and it has the ID=1, and so this is the updated one
    .eq("id", 1)
    .single<SettingsTable>();

  if (error) {
    console.error(error);
    throw new Error("Settings could not be updated");
  }
  return data;
}
