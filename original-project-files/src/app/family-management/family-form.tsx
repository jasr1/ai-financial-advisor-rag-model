'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';

import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';

import { addFamily } from './actions';

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import FormSubmitButton from '@/components/form-submit-button';

const formSchema = z.object({
  name: z.string({ message: 'Invalid email' }),
});

export type InsertFamily = z.infer<typeof formSchema>;

export function FamilyForm() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const form = useForm<InsertFamily>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: '',
    },
  });

  async function onSubmit(values: InsertFamily) {
    setIsSubmitting(true);
    await addFamily(values);
    form.reset();
    setIsSubmitting(false);
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="mt-4 space-y-8">
      <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Create new family:</FormLabel>
              <FormControl>
                <Input
                  placeholder="Enter new family name here"
                  type="name"
                  {...field}
                />
              </FormControl>

              <FormMessage />
            </FormItem>
          )}
        />
        <FormSubmitButton
          defaultText="Add family"
          loadingText="Adding..."
          disabled={isSubmitting}
        />
      </form>
    </Form>
  );
}