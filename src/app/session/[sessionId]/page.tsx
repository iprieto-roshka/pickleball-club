'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Roster from '@/components/Roster';
import MatchControl from '@/components/MatchControl';
import MatchHistory from '@/components/MatchHistory';
import Leaderboard from '@/components/Leaderboard';
import SessionHeader from '@/components/SessionHeader';
import { RosterSession } from '@/lib/types';

export default function SessionDashboard() {
  const params = useParams();
  const sessionId = params.sessionId as string;

  const [refreshTrigger, setRefreshTrigger] = useState(0);
  const [session, setSession] = useState<RosterSession | null>(null);

  const handleUpdate = () => {
    setRefreshTrigger(prev => prev + 1);
  };

  useEffect(() => {
    const fetchSession = async () => {
      const res = await fetch(`/api/session?id=${sessionId}`);
      if (res.ok) {
        const data = await res.json();
        setSession(data);
      }
    };
    fetchSession();
  }, [sessionId, refreshTrigger]);

  return (
    <>
      <SessionHeader session={session} sessionId={sessionId} activeTab="live" />

      {/* Main content */}
      <main className="min-h-screen bg-gray-50 p-4 md:p-8 font-[family-name:var(--font-geist-sans)]">
          <div className="max-w-6xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
              {/* Left Column */}
              <div className="md:col-span-4 space-y-6 order-2 md:order-1">
                {session?.isActive && (
                  <Roster onUpdate={handleUpdate} sessionId={sessionId} />
                )}
                <Leaderboard refreshTrigger={refreshTrigger} sessionId={sessionId} />
              </div>

              {/* Right Column */}
              <div className="md:col-span-8 order-1 md:order-2">
                {session?.isActive && (
                  <MatchControl onUpdate={handleUpdate} refreshTrigger={refreshTrigger} sessionId={sessionId} />
                )}
                <MatchHistory onUpdate={handleUpdate} refreshTrigger={refreshTrigger} sessionId={sessionId} defaultExpanded />
              </div>
            </div>
          </div>
      </main>
    </>
  );
}
