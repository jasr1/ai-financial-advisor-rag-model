import { Suspense } from 'react';
import Loading from '@/components/loading';
import FamilyVisionForm from './family-vision-form';
import VisionStatements from './vision-statements';
import AuthenticatedRoute from '../(auth)/authenticated-route';

export default function FamilyVisionPage() {
  return (
    <AuthenticatedRoute>
      <main className="mx-auto mt-4 max-w-xl px-2 md:mt-20">
        <FamilyVisionForm />
        <Suspense fallback={<Loading />}>
          <VisionStatements />
        </Suspense>
      </main>
    </AuthenticatedRoute>
  );
}
