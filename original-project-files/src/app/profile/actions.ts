"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

interface ProfileData {
  name: string;
  title: string;
  phone: string;
}

export async function saveProfile(profile: ProfileData) {
  const supabase = createClient();
  const { data } = await supabase.auth.getUser();
  const { data: user, error: userError } = await supabase.auth.getUser();

  if (userError || !user) {
    console.error("Failed to get authenticated user:", userError?.message);
    return { message: userError?.message || "No authenticated user available." };
  }

  const { name, title, phone } = profile;
  const { error } = await supabase
    .from("profiles")
    .upsert(
      [{ name, title, phone, user_id: data.user?.id }],
      { onConflict: "user_id" }
    );

  if (error) {
    console.error("Failed to save profile:", error.message);
    return { message: error.message };
  }

  revalidatePath("/profile");
  return { message: "Profile updated successfully" };
}
