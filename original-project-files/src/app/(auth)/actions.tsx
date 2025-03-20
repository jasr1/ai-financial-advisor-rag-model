'use server';

import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import jwt from 'jsonwebtoken';
import fs from 'fs';
import path from 'path';

import { createClient } from '@/lib/supabase/server';

interface JWTToken {
  sub: string;
}

export async function login(email: string, password: string) {
  const supabase = createClient();

  const { error, data } = await supabase.auth.signInWithPassword({ email, password });

  if (error) {
    return { message: error.message };
  }

  const token = data?.session?.access_token;
  if (token) {
    const decodedToken = jwt.decode(token) as JWTToken;
    const userId = decodedToken.sub;

    // Write the user ID to a file
    const userIdFilePath = path.resolve(process.cwd(), 'user_id.txt');
    fs.writeFileSync(userIdFilePath, userId);

    console.log('User ID:', userId);
  }

  revalidatePath('/');
  redirect('/decision-tree');
}

export async function signup(email: string, password: string, role: string) {
  const supabase = createClient();

  const { error, data } = await supabase.auth.signUp({ email, password });

  if (error) {
    return { message: error.message };
  }

  const userId = data?.user?.id;
  if (userId) {
    const { error: profileError } = await supabase
      .from('profiles')
      .update({ role })
      .eq('user_id', userId);

    if (profileError) {
      return { message: profileError.message };
    }
  }

  revalidatePath('/');
  redirect('/decision-tree');
}

export async function signout() {
  const supabase = createClient();
  await supabase.auth.signOut();
  revalidatePath('/');
  redirect('/login');
}
