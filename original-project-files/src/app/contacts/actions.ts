'use server';

import { createClient } from '@/lib/supabase/server';
import { revalidatePath } from 'next/cache';
import { InsertContact } from './contact-form';

export async function addContact(contact: InsertContact) {
  const supabase = createClient();
  const { error } = await supabase.from('contacts').insert(contact);
  if (error) {
    console.error("Error inserting contact:", error.message);
    throw new Error(`Failed to add contact: ${error.message}`);
  }

  revalidatePath('/contacts');
  return { success: true };
}

export async function deleteContact(id: number) {
  const supabase = createClient();
  const { error } = await supabase.from('contacts').delete().eq('id', id);
  if (error) {
    console.error("Error deleting contact:", error.message);
    throw new Error(`Failed to delete contact: ${error.message}`);
  }

  revalidatePath('/contacts');
  return { success: true };
}
