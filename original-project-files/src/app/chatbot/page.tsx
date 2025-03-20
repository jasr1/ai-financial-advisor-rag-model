import React, { Suspense } from 'react';
import Loading from '@/components/loading';
import AuthenticatedRoute from '../(auth)/authenticated-route';
import ChatbotComponent from './ChatbotComponent';

export default function ContactPage() {
  return (
    <AuthenticatedRoute>
      <main className="min-h-screen px-6 pt-5">
        <Suspense fallback={<Loading />}>
          <div style={{ position: 'relative', zIndex: 1 }}>
            <ChatbotComponent />
          </div>
        </Suspense>
      </main>
    </AuthenticatedRoute>
  );
}
