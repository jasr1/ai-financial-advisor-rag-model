import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { updateFamily } from './actions';
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

const editFamilySchema = z.object({
  name: z.string().nonempty({ message: 'Family name cannot be empty' }),
});

export type EditFamily = z.infer<typeof editFamilySchema>;

interface EditFamilyFormProps {
  family: { id: number; name: string };
  onSuccess: (updatedFamily: { id: number; name: string }) => void;
}

export function EditFamilyForm({ family, onSuccess }: EditFamilyFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const form = useForm<EditFamily>({
    resolver: zodResolver(editFamilySchema),
    defaultValues: {
      name: family.name,
    },
  });

  useEffect(() => {
    form.reset({ name: family.name });
  }, [family, form]);

  async function onSubmit(values: EditFamily) {
    setIsSubmitting(true);
    try {
      await updateFamily(family.id, values);
      onSuccess({ id: family.id, name: values.name });
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
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Edit family name:</FormLabel>
              <FormControl>
                <Input placeholder="Enter family name" type="text" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormSubmitButton
          defaultText="Save"
          loadingText="Saving..."
          disabled={isSubmitting}
        />
      </form>
    </Form>
  );
}

