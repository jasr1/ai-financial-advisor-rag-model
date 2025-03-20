'use server';

import { createClient } from '@/lib/supabase/server';

export async function loadFamilyMembers() {
  const supabase = createClient();
  const { data: userData, error: userError } = await supabase.auth.getUser();

  if (userError) {
    throw new Error(userError.message);
  }

  const { data: profileData, error: profileError } = await supabase
    .from('profiles')
    .select('family_id')
    .eq('user_id', userData.user?.id)
    .single();

  if (profileError) {
    throw new Error(profileError.message);
  }

  if (profileData?.family_id === null) {
    return []; 
  }

  const { data: familyMembers, error: familyError } = await supabase
    .from('profiles')
    .select('*')
    .eq('family_id', profileData?.family_id);

  if (familyError) {
    throw new Error(familyError.message);
  }

  return familyMembers;
}
