import { Suspense } from 'react';
import Loading from '@/components/loading';
import { FamilyForm } from './family-form';
import Families from './families';
import { Separator } from '../../components/ui/separator';
import AuthenticatedRoute from '../(auth)/authenticated-route';

export default function FamilyPage() {
  return (
    <AuthenticatedRoute>
      <div className="prose mt-8">
        <main className="min-h-screen px-6 pt-5">
          <h1 className="text-3xl font-bold">Family Management</h1>
          <Separator className="mx-auto mt-2 w-[100%]" />
          <h2 className="text-2xl">Your Families</h2>
          <Suspense fallback={<Loading />}>
            <Families />
          </Suspense>
          <Separator className="mx-auto mt-2 w-[100%]" />
          <FamilyForm />
        </main>
      </div>
    </AuthenticatedRoute>
  );
}
