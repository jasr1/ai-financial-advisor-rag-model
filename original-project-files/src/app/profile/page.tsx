import ProfileForm from "./profile";
import AuthenticatedRoute from "../(auth)/authenticated-route";

export default function ProfilePage() {
  return (
    <AuthenticatedRoute>
      <main className="mx-auto mt-4 max-w-xl px-2 md:mt-20">
        <h1 className="text-3xl font-bold">Profile</h1>
        <ProfileForm />
      </main>
    </AuthenticatedRoute>
  );
}
