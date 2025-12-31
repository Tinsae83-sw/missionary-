import Link from 'next/link';
import Image from 'next/image';
import { Button } from '../components/ui/button';
import { Calendar, Clock, MapPin, Play } from 'lucide-react';

export default function Home() {
  const upcomingEvents = [
    {
      id: 1,
      title: 'Sunday Service',
      date: '2023-12-24',
      time: '10:00 AM',
      location: 'Main Sanctuary',
      description: 'Join us for our weekly Sunday worship service with inspiring music and a powerful message.'
    },
    {
      id: 2,
      title: 'Bible Study',
      date: '2023-12-27',
      time: '7:00 PM',
      location: 'Fellowship Hall',
      description: 'Mid-week Bible study where we dive deeper into God\'s word and its application to our daily lives.'
    }
  ];

  const recentSermons = [
    {
      id: 1,
      title: 'The Power of Faith',
      speaker: 'Pastor John Smith',
      date: '2023-12-17',
      scripture: 'Hebrews 11:1-6',
      imageUrl: null, // Will be replaced with actual sermon image or fallback
    },
    {
      id: 2,
      title: 'Walking in Love',
      speaker: 'Pastor Sarah Johnson',
      date: '2023-12-10',
      scripture: '1 Corinthians 13',
      imageUrl: null, // Will be replaced with actual sermon image or fallback
    },
  ];

  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <section 
        className="relative h-[80vh] flex items-center justify-center text-center overflow-hidden"
        style={{
          backgroundColor: '#0D47A1', // Dark Blue background
        }}
      >
        <div className="absolute inset-0 z-0">
          <div className="absolute inset-0 bg-black/40 z-10"></div>
          {/* Blue gradient overlay */}
          <div 
            className="absolute inset-0"
            style={{
              background: 'linear-gradient(135deg, #0D47A1 0%, #1976D2 50%, #42A5F5 100%)'
            }}
          >
            {/* You can add a church illustration or pattern here */}
            <div className="absolute inset-0 flex items-center justify-center">
              <div 
                className="text-4xl font-bold"
                style={{ color: 'rgba(187, 222, 251, 0.2)' }} // Light Blue Accent with opacity
              >
                Grace Community Church
              </div>
            </div>
          </div>
        </div>
        <div className="container relative z-20 px-4">
          <h1 
            className="text-4xl md:text-6xl font-bold mb-6"
            style={{ color: '#E3F2FD' }} // Light Blue text
          >
            Welcome to Grace Community Church
          </h1>
          <p 
            className="text-xl md:text-2xl mb-8 max-w-3xl mx-auto"
            style={{ color: '#BBDEFB' }} // Light Blue Accent text
          >
            A place to grow in faith and fellowship
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button 
              size="lg" 
              asChild
              style={{
                backgroundColor: '#BBDEFB', // Light Blue Accent
                color: '#0D47A1', // Dark Blue text
                border: '2px solid #BBDEFB',
                fontWeight: '600',
              }}
              className="hover:scale-105 transition-transform"
            >
              <Link href="/about">Learn More</Link>
            </Button>
            <Button 
              size="lg" 
              variant="outline" 
              asChild
              style={{
                color: '#E3F2FD', // Light Blue text
                borderColor: '#E3F2FD', // Light Blue border
                backgroundColor: 'transparent',
              }}
              className="hover:bg-[#E3F2FD]/10"
            >
              <Link href="/sermons">Watch Sermons</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Welcome Section */}
      <section 
        className="py-20"
        style={{ backgroundColor: '#E3F2FD' }} // Light Blue background
      >
        <div className="container px-4 mx-auto">
          <div className="max-w-4xl mx-auto text-center">
            <h2 
              className="text-3xl md:text-4xl font-bold mb-6"
              style={{ color: '#0D47A1' }} // Dark Blue text
            >
              Welcome to Our Church Family
            </h2>
            <p 
              className="text-lg mb-8"
              style={{ color: '#1976D2' }} // Medium Blue text
            >
              We are a community of believers committed to following Jesus Christ and sharing His love with the world. 
              Join us as we worship, grow, and serve together.
            </p>
            <div className="grid md:grid-cols-3 gap-8 mt-12">
              <div 
                className="p-6 rounded-lg"
                style={{
                  backgroundColor: '#FFFFFF',
                  border: '1px solid #BBDEFB', // Light Blue Accent border
                }}
              >
                <h3 
                  className="text-xl font-semibold mb-3"
                  style={{ color: '#0D47A1' }} // Dark Blue text
                >
                  Worship With Us
                </h3>
                <p style={{ color: '#1976D2' }}>Sundays at 10:00 AM & Wednesdays at 7:00 PM</p>
              </div>
              <div 
                className="p-6 rounded-lg"
                style={{
                  backgroundColor: '#FFFFFF',
                  border: '1px solid #BBDEFB', // Light Blue Accent border
                }}
              >
                <h3 
                  className="text-xl font-semibold mb-3"
                  style={{ color: '#0D47A1' }} // Dark Blue text
                >
                  Our Location
                </h3>
                <p style={{ color: '#1976D2' }}>123 Faith Avenue, City, State 12345</p>
              </div>
              <div 
                className="p-6 rounded-lg"
                style={{
                  backgroundColor: '#FFFFFF',
                  border: '1px solid #BBDEFB', // Light Blue Accent border
                }}
              >
                <h3 
                  className="text-xl font-semibold mb-3"
                  style={{ color: '#0D47A1' }} // Dark Blue text
                >
                  Get Connected
                </h3>
                <p style={{ color: '#1976D2' }}>Join a small group or ministry today</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Upcoming Events */}
      <section 
        className="py-20"
        style={{ backgroundColor: '#BBDEFB' }} // Light Blue Accent background
      >
        <div className="container px-4 mx-auto">
          <div className="text-center mb-12">
            <h2 
              className="text-3xl md:text-4xl font-bold mb-4"
              style={{ color: '#0D47A1' }} // Dark Blue text
            >
              Upcoming Events
            </h2>
            <p 
              className="text-lg max-w-2xl mx-auto"
              style={{ color: '#1976D2' }} // Medium Blue text
            >
              Join us for worship, fellowship, and community events.
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-2 gap-8">
            {upcomingEvents.map((event) => (
              <div 
                key={event.id} 
                className="rounded-lg shadow-md overflow-hidden"
                style={{
                  backgroundColor: '#FFFFFF',
                  border: '1px solid #0D47A1', // Dark Blue border
                }}
              >
                <div className="p-6">
                  <h3 
                    className="text-xl font-semibold mb-2"
                    style={{ color: '#0D47A1' }} // Dark Blue text
                  >
                    {event.title}
                  </h3>
                  <div className="flex items-center mb-2" style={{ color: '#1976D2' }}>
                    <Calendar className="h-5 w-5 mr-2" />
                    <span>{new Date(event.date).toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</span>
                  </div>
                  <div className="flex items-center mb-2" style={{ color: '#1976D2' }}>
                    <Clock className="h-5 w-5 mr-2" />
                    <span>{event.time}</span>
                  </div>
                  <div className="flex items-center mb-4" style={{ color: '#1976D2' }}>
                    <MapPin className="h-5 w-5 mr-2" />
                    <span>{event.location}</span>
                  </div>
                  <p className="mb-4" style={{ color: '#1976D2' }}>{event.description}</p>
                  <Button 
                    asChild
                    style={{
                      backgroundColor: '#0D47A1', // Dark Blue
                      color: '#FFFFFF', // White text
                      border: '2px solid #0D47A1',
                      fontWeight: '600',
                    }}
                    className="hover:scale-105 transition-transform"
                  >
                    <Link href={`/events/${event.id}`}>Learn More</Link>
                  </Button>
                </div>
              </div>
            ))}
          </div>
          
          <div className="text-center mt-10">
            <Button 
              variant="outline" 
              asChild
              style={{
                color: '#0D47A1', // Dark Blue text
                borderColor: '#0D47A1', // Dark Blue border
                backgroundColor: 'transparent',
              }}
              className="hover:bg-[#0D47A1]/10"
            >
              <Link href="/events">View All Events</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Recent Sermons */}
      <section 
        className="py-20"
        style={{ backgroundColor: '#E3F2FD' }} // Light Blue background
      >
        <div className="container px-4 mx-auto">
          <div className="text-center mb-12">
            <h2 
              className="text-3xl md:text-4xl font-bold mb-4"
              style={{ color: '#0D47A1' }} // Dark Blue text
            >
              Recent Sermons
            </h2>
            <p 
              className="text-lg max-w-2xl mx-auto"
              style={{ color: '#1976D2' }} // Medium Blue text
            >
              Catch up on our latest messages and teachings.
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 gap-8">
            {recentSermons.map((sermon) => (
              <div 
                key={sermon.id} 
                className="rounded-lg overflow-hidden"
                style={{
                  backgroundColor: '#FFFFFF',
                  border: '1px solid #BBDEFB', // Light Blue Accent border
                }}
              >
                <div 
                  className="relative h-48"
                  style={{
                    background: 'linear-gradient(135deg, #0D47A1 0%, #1976D2 50%, #42A5F5 100%)'
                  }}
                >
                  {sermon.imageUrl ? (
                    <Image
                      src={sermon.imageUrl}
                      alt={sermon.title}
                      fill
                      className="object-cover"
                    />
                  ) : (
                    <div 
                      className="absolute inset-0 flex items-center justify-center"
                      style={{ color: 'rgba(255, 255, 255, 0.5)' }}
                    >
                      <div className="text-center p-4">
                        <div className="text-4xl mb-2">🎵</div>
                        <div className="text-sm">Sermon Thumbnail</div>
                      </div>
                    </div>
                  )}
                  <div className="absolute inset-0 bg-black/30 flex items-center justify-center">
                    <Button 
                      size="icon" 
                      className="rounded-full h-14 w-14"
                      style={{
                        backgroundColor: '#BBDEFB', // Light Blue Accent
                        color: '#0D47A1', // Dark Blue text
                      }}
                      className="hover:scale-110 transition-transform"
                    >
                      <Play className="h-6 w-6" />
                    </Button>
                  </div>
                </div>
                <div className="p-6">
                  <h3 
                    className="text-xl font-semibold mb-2"
                    style={{ color: '#0D47A1' }} // Dark Blue text
                  >
                    {sermon.title}
                  </h3>
                  <p className="mb-2" style={{ color: '#1976D2' }}>{sermon.speaker}</p>
                  <p 
                    className="text-sm mb-4"
                    style={{ color: '#1976D2', opacity: 0.8 }}
                  >
                    {new Date(sermon.date).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })} • {sermon.scripture}
                  </p>
                  <div className="flex gap-2">
                    <Button 
                      variant="outline" 
                      size="sm" 
                      asChild
                      style={{
                        color: '#0D47A1', // Dark Blue text
                        borderColor: '#0D47A1', // Dark Blue border
                        backgroundColor: 'transparent',
                      }}
                      className="hover:bg-[#0D47A1]/10"
                    >
                      <Link href={`/sermons/${sermon.id}`}>Watch Now</Link>
                    </Button>
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      asChild
                      style={{
                        color: '#0D47A1', // Dark Blue text
                      }}
                      className="hover:bg-[#0D47A1]/5"
                    >
                      <Link href={`/sermons/${sermon.id}#transcript`}>Read Transcript</Link>
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
          
          <div className="text-center mt-10">
            <Button 
              asChild
              style={{
                backgroundColor: '#0D47A1', // Dark Blue
                color: '#FFFFFF', // White text
                border: '2px solid #0D47A1',
                fontWeight: '600',
              }}
              className="hover:scale-105 transition-transform"
            >
              <Link href="/sermons">View All Sermons</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section 
        className="py-20 text-white"
        style={{
          backgroundColor: '#0D47A1', // Dark Blue background
          background: 'linear-gradient(135deg, #0D47A1 0%, #1976D2 100%)'
        }}
      >
        <div className="container px-4 mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">Join Us This Sunday</h2>
          <p className="text-xl mb-8 max-w-2xl mx-auto" style={{ color: '#E3F2FD' }}>
            We'd love to welcome you to our church family.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button 
              size="lg" 
              variant="secondary" 
              asChild
              style={{
                backgroundColor: '#BBDEFB', // Light Blue Accent
                color: '#0D47A1', // Dark Blue text
                border: '2px solid #BBDEFB',
                fontWeight: '600',
              }}
              className="hover:scale-105 transition-transform"
            >
              <Link href="/visit">Plan Your Visit</Link>
            </Button>
            <Button 
              size="lg" 
              variant="outline" 
              asChild
              style={{
                color: '#E3F2FD', // Light Blue text
                borderColor: '#E3F2FD', // Light Blue border
                backgroundColor: 'transparent',
              }}
              className="hover:bg-[#E3F2FD]/10"
            >
              <Link href="/contact">Contact Us</Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}