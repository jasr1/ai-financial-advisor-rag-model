import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { createClient } from '@/lib/supabase/client';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const moneyFormatter = Intl.NumberFormat('en-CA', {
  currency: 'CAD',
  currencyDisplay: 'symbol',
  currencySign: 'standard',
  style: 'currency',
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
});

export async function fetchUserProfile() {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (user) {
    const { data: profileData, error: profileError } = await supabase
      .from('profiles')
      .select('role')
      .eq('user_id', user.id)
      .single();

    if (profileError) {
      console.error('Error fetching user profile:', profileError.message);
      return { role: null };
    }

    return { role: profileData.role };
  }

  return { role: null };
}
