import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { addFamilyMember } from './actions';
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

const addFamilyMemberSchema = z.object({
  email: z.string().email({ message: 'Invalid email' }),
  family_id: z.number(),
});

export type AddFamilyMember = z.infer<typeof addFamilyMemberSchema>;

interface AddFamilyMemberFormProps {
  familyId: number;
  onSuccess: () => void;
}

export function AddFamilyMemberForm({ familyId, onSuccess }: AddFamilyMemberFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const form = useForm<AddFamilyMember>({
    resolver: zodResolver(addFamilyMemberSchema),
    defaultValues: {
      email: '',
      family_id: familyId,
    },
  });

  async function onSubmit(values: AddFamilyMember) {
    setIsSubmitting(true);
    try {
      await addFamilyMember(values);
      form.reset();
      onSuccess();
    } catch (err) {
      console.error('Unexpected error:', err);
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="mt-4 space-y-8">
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Add a new family member:</FormLabel>
              <FormControl>
                <Input placeholder="Enter user email here" type="email" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormSubmitButton
          defaultText="Add Family Member"
          loadingText="Adding..."
          disabled={isSubmitting}
        />
      </form>
    </Form>
  );
}
