'use server';

import { createClient } from '@/lib/supabase/server';
import { revalidatePath } from 'next/cache';
import { InsertFamily } from './family-form';

export async function addFamily(contact: InsertFamily) {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    throw new Error('User not authenticated');
  }

  const familyData = {
    ...contact,
    admin_id: user.id,
  };

  const { error } = await supabase.from('families').insert(familyData);
  if (error) {
    console.error("Error inserting family:", error.message);
    throw new Error(`Failed to add family: ${error.message}`);
  }

  revalidatePath('/family-management');
  return { success: true };
}

export async function deleteFamily(id: number) {
  const supabase = createClient();

  const { error: updateError } = await supabase
    .from('profiles')
    .update({ family_id: null })
    .eq('family_id', id);

  if (updateError) {
    console.error("Error updating profiles:", updateError.message);
    throw new Error(`Failed to update profiles: ${updateError.message}`);
  }

  const { error } = await supabase.from('families').delete().eq('id', id);
  if (error) {
    console.error("Error deleting family:", error.message);
    throw new Error(`Failed to delete family: ${error.message}`);
  }

  revalidatePath('/family-management');
  return { success: true };
}

export async function updateFamily(id: number, data: { name: string }) {
  const supabase = createClient();

  const { error: updateError } = await supabase
    .from('families')
    .update({ name: data.name })
    .eq('id', id);

  if (updateError) {
    console.error("Error updating family name:", updateError.message);
    throw new Error(`Failed to update family name: ${updateError.message}`);
  }

  revalidatePath('/family-management');
  return { success: true };
}

export async function loadFamilyMembers(family_id: number) {
  const supabase = createClient();

  const { data: familyMembers, error: familyError } = await supabase
    .from('profiles')
    .select('*')
    .eq('family_id', family_id);

  if (familyError) {
    throw new Error(familyError.message);
  }

  return familyMembers;
}

export async function addFamilyMember(contact: { email: string; family_id: number; }) {
  const supabase = createClient();
  const { error } = await supabase
    .from('profiles')
    .update({ family_id: contact.family_id })
    .eq('email', contact.email);

  if (error) {
    console.error("Error updating user:", error.message);
    throw new Error(`Failed to add contact: ${error.message}`);
  }

  revalidatePath('/family-management');
  return { success: true };
}

export async function removeFamilyMember(id: number) {
  const supabase = createClient();
  const { error } = await supabase
  .from('profiles')
  .update( {'family_id': null })
  .eq('id', id);
  if (error) {
    console.error("Error removing family member:", error.message);
    throw new Error(`Failed to remove family member: ${error.message}`);
  }

  revalidatePath('/family-management');
  return { success: true };
}