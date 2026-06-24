'use client'
import UserProfile from '../../components/UserProfile';

export default function ProfilePage() {
  return (
    <main className="min-h-screen bg-gray-950 pb-20">
      <UserProfile initialBalance={1250} />
    </main>
  );
}
