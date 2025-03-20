"use client";

import { z } from "zod";
import { createClient } from '@/lib/supabase/client';
import { zodResolver } from "@hookform/resolvers/zod";
import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { saveProfile } from "./actions";
import { Button } from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import FormSubmitButton from "@/components/form-submit-button";

const profileFormSchema = z.object({
  name: z.string().min(2, { message: "Name must be at least 2 characters long" }).max(50).or(z.literal('')),
  title: z.string().min(5, { message: "Job title must be at least 5 characters long" }).max(50).or(z.literal('')),
  phone: z.string().min(10, { message: "Phone number must be at least 10 characters long" }).max(15).or(z.literal('')),
});

type InsertProfile = z.infer<typeof profileFormSchema>;

export default function ProfileForm() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isEditable, setIsEditable] = useState(false); 
  const form = useForm<InsertProfile>({
    resolver: zodResolver(profileFormSchema),
  });
  const supabase = createClient();

  useEffect(() => {
    async function loadProfile() {
      const { data } = await supabase.auth.getUser();
      if (data.user) {
        const { data: profileData, error } = await supabase
          .from('profiles')
          .select('*')
          .eq('user_id', data.user.id)
          .single();

        if (error) {
          console.error("Failed to load profile data:", error.message);
          return;
        }

        if (profileData) {
          form.reset(profileData);
        }
      }
    }

    loadProfile();
  }, [form, supabase]);

  const enableEdit = () => setIsEditable(true);

  async function onSubmit(values: InsertProfile) {
    setIsSubmitting(true);
    const response = await saveProfile(values);
    if (response && response.message) {
      console.error("Failed to save profile:", response.message);
    } else {
      setIsEditable(false);
    }
    setIsSubmitting(false);
    setIsEditable(false);
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="mt-4 space-y-8">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Name</FormLabel>
              <FormControl>
                <Input placeholder="Enter your full name" {...field} disabled={!isEditable} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="title"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Title</FormLabel>
              <FormControl>
                <Input placeholder="Enter your title" {...field} disabled={!isEditable} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        /> 
        <FormField
          control={form.control}
          name="phone"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Phone</FormLabel>
              <FormControl>
                <Input placeholder="123-456-7890" type="tel" {...field} disabled={!isEditable} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className="flex space-x-2 mt-4">
          <Button size="lg"
            className="w-full"
            type="button"
            onClick={enableEdit}>Edit</Button>
          <FormSubmitButton
            defaultText="Save"
            loadingText="Saving..."
            disabled={isSubmitting}
          />
        </div>
      </form>
    </Form>
  );
}