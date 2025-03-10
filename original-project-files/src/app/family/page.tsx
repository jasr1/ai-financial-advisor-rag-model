import { Suspense } from 'react';
import Loading from '@/components/loading';
import FamilyMembers from './family-members';
import AuthenticatedRoute from '../(auth)/authenticated-route';

export default function ContactPage() {
  return (
    <AuthenticatedRoute>
      <main className="min-h-screen px-6 pt-5">
        <h1 className="text-3xl font-bold">Your Family</h1>
        <Suspense fallback={<Loading />}>
          <FamilyMembers />
        </Suspense>
      </main>
    </AuthenticatedRoute>
  );
}
