"use client";

import { useEffect, useState } from 'react';
import Image from 'next/image';
import { Skeleton } from '../../components/ui/skeleton';

interface ChurchHistoryItem {
  id: string;
  year: number;
  title: string;
  content: string;
  image_url: string | null;
}

interface Belief {
  id: string;
  title: string;
  description: string;
  icon_class: string;
}

interface MissionVision {
  mission: string;
  vision: string;
  core_values: string[];
  purpose?: string;
}

interface Pastor {
  id: string;
  pastor_name: string;
  pastor_title: string;
  pastor_message: string;
  pastor_bio: string;
  pastor_photo_url: string | null;
  pastor_email: string | null;
}

export default function AboutPage() {
  const [history, setHistory] = useState<ChurchHistoryItem[]>([]);
  const [beliefs, setBeliefs] = useState<Belief[]>([]);
  const [missionVision, setMissionVision] = useState<MissionVision | null>({
    mission: '',
    vision: '',
    core_values: [],
    purpose: ''
  });
  const [pastors, setPastors] = useState<Pastor[]>([]);
  const [loading, setLoading] = useState({
    history: true,
    beliefs: true,
    missionVision: true,
    pastors: true,
  });
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch church history
        const historyRes = await fetch('/api/church-history');
        if (historyRes.ok) {
          const historyData = await historyRes.json();
          setHistory(historyData);
        }
        setLoading(prev => ({ ...prev, history: false }));

        // Fetch beliefs
        const beliefsRes = await fetch('/api/beliefs');
        if (beliefsRes.ok) {
          const beliefsData = await beliefsRes.json();
          setBeliefs(beliefsData);
        }
        setLoading(prev => ({ ...prev, beliefs: false }));

        // Fetch mission and vision
        const missionRes = await fetch('/api/mission-vision');
        if (missionRes.ok) {
          const missionData = await missionRes.json();
          if (missionData.data) {
            setMissionVision({
              mission: missionData.data.mission || '',
              vision: missionData.data.vision || '',
              core_values: Array.isArray(missionData.data.core_values) ? missionData.data.core_values : [],
              purpose: missionData.data.purpose || ''
            });
          }
        }
        setLoading(prev => ({ ...prev, missionVision: false }));

        // Fetch pastors
        const pastorsRes = await fetch('/api/pastors');
        if (pastorsRes.ok) {
          const pastorsData = await pastorsRes.json();
          setPastors(pastorsData.data || []);
        }
        setLoading(prev => ({ ...prev, pastors: false }));

      } catch (err) {
        console.error('Error fetching data:', err);
        setError('Failed to load data. Please try again later.');
        setLoading({
          history: false,
          beliefs: false,
          missionVision: false,
          pastors: false,
        });
      }
    };

    fetchData();
  }, []);

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
          <strong className="font-bold">Error: </strong>
          <span className="block sm:inline">{error}</span>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 about-theme">
      {/* Hero Section */}
      <section className="hero text-center mb-16">
        <div className="p-8 rounded-lg card-accent">
          <h1 className="text-4xl md:text-5xl font-bold mb-6">About Our Church</h1>
          <p className="text-xl max-w-3xl mx-auto">
            Welcome to our church family. We are a community of believers dedicated to spreading the love of Christ and serving our community.
          </p>
        </div>
      </section>
      

      {/* Our Story / History Section */}
      <section className="mb-16">
        <h2 className="text-3xl font-bold mb-8 text-center">Our Story</h2>
        {loading.history ? (
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <Skeleton key={i} className="h-24 w-full" />
            ))}
          </div>
        ) : history.length > 0 ? (
          <div className="space-y-12">
            {history.map((item) => (
              <div key={item.id} className="flex flex-col md:flex-row gap-8 items-center mb-12">
                <div className="md:w-1/3">
                  <div className="bg-gray-200 h-48 w-full rounded-lg overflow-hidden">
                    {item.image_url && (
                      <Image
                        src={item.image_url}
                        alt={item.title}
                        width={400}
                        height={300}
                        className="w-full h-full object-cover"
                      />
                    )}
                  </div>
                </div>
                <div className="md:w-2/3">
                  <h3 className="text-2xl font-semibold mb-2">{item.year}: {item.title}</h3>
                  <p className="text-gray-700">{item.content}</p>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-center text-gray-500">No history available at the moment.</p>
        )}
      </section>

      {/* Our Beliefs Section */}
      <section className="mb-16">
        <h2 className="text-3xl font-bold mb-8 text-center">Our Beliefs</h2>
        {loading.beliefs ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3].map((i) => (
              <Skeleton key={i} className="h-48 w-full" />
            ))}
          </div>
        ) : beliefs.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {beliefs.map((belief) => (
              <div key={belief.id} className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow">
                <div className="text-4xl mb-4">
                  {belief.icon_class ? (
                    <i className={belief.icon_class}></i>
                  ) : (
                    <i className="fas fa-cross"></i>
                  )}
                </div>
                <h3 className="text-xl font-semibold mb-2">{belief.title}</h3>
                <p className="text-gray-700">{belief.description}</p>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-center text-gray-500">No beliefs available at the moment.</p>
        )}
      </section>

      {/* Mission & Vision Section */}
      <section className="mb-16">
        <h2 className="text-3xl font-bold mb-8 text-center">Our Mission & Vision</h2>
        {loading.missionVision ? (
          <div className="space-y-6">
            <Skeleton className="h-8 w-1/2 mx-auto" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-5/6" />
            <Skeleton className="h-4 w-4/5" />
            <div className="h-8"></div>
            <Skeleton className="h-8 w-1/2 mx-auto" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-5/6" />
          </div>
        ) : missionVision ? (
          <div className="max-w-4xl mx-auto space-y-12">
            <div className="p-6 rounded-lg card-accent">
              <h3 className="text-2xl font-semibold mb-4">Our Mission</h3>
              <p>{missionVision.mission}</p>
            </div>

            <div className="p-6 rounded-lg card-accent">
              <h3 className="text-2xl font-semibold mb-4">Our Vision</h3>
              <p>{missionVision.vision}</p>
            </div>

            {missionVision.purpose && (
              <div className="bg-green-50 p-6 rounded-lg">
                <h3 className="text-2xl font-semibold mb-4 text-green-800">Our Purpose</h3>
                <p className="text-gray-700">{missionVision.purpose}</p>
              </div>
            )}

            {missionVision?.core_values?.length > 0 && (
              <div className="bg-yellow-50 p-6 rounded-lg">
                <h3 className="text-2xl font-semibold mb-4 text-yellow-800">Our Core Values</h3>
                <ul className="space-y-2">
                  {missionVision.core_values.map((value, index) => (
                    <li key={index} className="flex items-start">
                      <span className="text-yellow-500 mr-2">•</span>
                      <span className="text-gray-700">{value}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        ) : (
          <p className="text-center text-gray-500">Mission and vision information not available at the moment.</p>
        )}
      </section>

      {/* Pastors Section */}
      <section>
        <h2 className="text-3xl font-bold mb-8 text-center">Our Pastors</h2>
        {loading.pastors ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[1, 2, 3].map((i) => (
              <div key={i} className="bg-white rounded-lg shadow-md overflow-hidden">
                <Skeleton className="h-64 w-full" />
                <div className="p-6">
                  <Skeleton className="h-6 w-3/4 mb-2" />
                  <Skeleton className="h-4 w-1/2 mb-4" />
                  <Skeleton className="h-4 w-full mb-2" />
                  <Skeleton className="h-4 w-5/6" />
                </div>
              </div>
            ))}
          </div>
        ) : pastors.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {pastors.map((pastor) => (
              <div key={pastor.id} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
                <div className="h-64 bg-gray-200 relative">
                  {pastor.pastor_photo_url ? (
                    <Image
                      src={pastor.pastor_photo_url}
                      alt={pastor.pastor_name}
                      fill
                      className="object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-gray-200 text-gray-400">
                      <i className="fas fa-user text-6xl"></i>
                    </div>
                  )}
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-semibold">{pastor.pastor_name}</h3>
                  <p className="text-gray-600 mb-4">{pastor.pastor_title}</p>
                  {pastor.pastor_message && (
                    <p className="text-gray-700 italic mb-4">"{pastor.pastor_message}"</p>
                  )}
                  {pastor.pastor_email && (
                    <a 
                      href={`mailto:${pastor.pastor_email}`}
                      style={{ color: '#0D47A1' }}
                      className="hover:underline inline-flex items-center"
                    >
                      <i className="fas fa-envelope mr-2"></i>
                      Email Pastor {pastor.pastor_name.split(' ')[0]}
                    </a>
                  )}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-center text-gray-500">No pastor information available at the moment.</p>
        )}
      </section>
    </div>
  );
}