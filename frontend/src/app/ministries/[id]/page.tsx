import { notFound } from 'next/navigation';
import { ministryApi } from '@/lib/api/ministryApi';
import Image from 'next/image';
import { Metadata } from 'next';
import Link from 'next/link';
import { FaArrowLeft, FaClock, FaMapMarkerAlt, FaEnvelope, FaPhone, FaUser } from 'react-icons/fa';

export async function generateMetadata({ params }: { params: { id: string } }): Promise<Metadata> {
  try {
    const ministry = await ministryApi.getMinistryById(params.id);
    return {
      title: `${ministry.name} | Church Ministries`,
      description: ministry.shortDescription || ministry.description,
      openGraph: {
        title: ministry.name,
        description: ministry.shortDescription || ministry.description,
        images: ministry.coverImageUrl ? [ministry.coverImageUrl] : [],
      },
    };
  } catch (error) {
    return {
      title: 'Ministry Not Found',
      description: 'The requested ministry could not be found.',
    };
  }
}

export default async function MinistryDetailPage({ params }: { params: { id: string } }) {
  let ministry;
  
  try {
    ministry = await ministryApi.getMinistryById(params.id);
  } catch (error) {
    notFound();
  }
  
  // Format meeting times if they exist
  const formattedMeetingTimes = ministry.meetingTimes 
    ? ministry.meetingTimes.split('\n').map((time: string, i: number) => (
        <p key={i} className="mb-1">{time.trim()}</p>
      ))
    : null;

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto">
        <div className="mb-6">
          <Link href="/ministries" className="inline-flex items-center text-blue-600 hover:text-blue-800">
            <FaArrowLeft className="mr-2" /> Back to Ministries
          </Link>
        </div>
        
        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
          {/* Cover Image */}
          <div className="relative h-64 md:h-96 w-full bg-gradient-to-r from-blue-600 to-blue-800">
            {ministry.coverImageUrl ? (
              <Image
                src={ministry.coverImageUrl}
                alt={ministry.name}
                fill
                className="object-cover"
                priority
              />
            ) : (
              <div className="absolute inset-0 flex items-center justify-center">
                <h1 className="text-4xl md:text-6xl font-bold text-white text-center px-4">
                  {ministry.name}
                </h1>
              </div>
            )}
          </div>
          
          {/* Ministry Content */}
          <div className="p-6 md:p-10">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
              <div>
                <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">
                  {ministry.name}
                </h1>
                {ministry.shortDescription && (
                  <p className="text-xl text-gray-600">{ministry.shortDescription}</p>
                )}
              </div>
              
              {(ministry.contactEmail || ministry.contactPhone) && (
                <div className="mt-4 md:mt-0">
                  <a
                    href={ministry.contactEmail ? `mailto:${ministry.contactEmail}` : `tel:${ministry.contactPhone}`}
                    className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 transition-colors"
                  >
                    <FaEnvelope className="mr-2" />
                    {ministry.contactEmail ? 'Email Us' : 'Call Us'}
                  </a>
                </div>
              )}
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-10">
              {/* Left Column - Details */}
              <div className="md:col-span-2">
                <div className="prose max-w-none text-gray-700 mb-8">
                  <h2 className="text-2xl font-semibold mb-4">About This Ministry</h2>
                  <p className="text-lg">{ministry.description}</p>
                </div>
                
                {(ministry.meetingTimes || ministry.meetingLocation) && (
                  <div className="bg-gray-50 p-6 rounded-xl mb-8">
                    <h2 className="text-2xl font-semibold mb-4">Meeting Information</h2>
                    
                    {ministry.meetingTimes && (
                      <div className="mb-4">
                        <div className="flex items-start">
                          <FaClock className="text-blue-600 mt-1 mr-3 flex-shrink-0" />
                          <div>
                            <h3 className="font-medium text-gray-900">Meeting Times</h3>
                            <div className="mt-1 text-gray-600">
                              {formattedMeetingTimes}
                            </div>
                          </div>
                        </div>
                      </div>
                    )}
                    
                    {ministry.meetingLocation && (
                      <div>
                        <div className="flex items-start">
                          <FaMapMarkerAlt className="text-blue-600 mt-1 mr-3 flex-shrink-0" />
                          <div>
                            <h3 className="font-medium text-gray-900">Location</h3>
                            <p className="mt-1 text-gray-600">{ministry.meetingLocation}</p>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
              
              {/* Right Column - Contact Info */}
              <div className="space-y-6">
                <div className="bg-blue-50 p-6 rounded-xl">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Contact Information</h3>
                  
                  {ministry.contactPerson && (
                    <div className="flex items-start mb-4">
                      <FaUser className="text-blue-600 mt-1 mr-3 flex-shrink-0" />
                      <div>
                        <p className="text-sm font-medium text-gray-500">Contact Person</p>
                        <p className="text-gray-900">{ministry.contactPerson}</p>
                      </div>
                    </div>
                  )}
                  
                  {ministry.contactEmail && (
                    <div className="flex items-start mb-4">
                      <FaEnvelope className="text-blue-600 mt-1 mr-3 flex-shrink-0" />
                      <div>
                        <p className="text-sm font-medium text-gray-500">Email</p>
                        <a href={`mailto:${ministry.contactEmail}`} className="text-blue-600 hover:underline">
                          {ministry.contactEmail}
                        </a>
                      </div>
                    </div>
                  )}
                  
                  {ministry.contactPhone && (
                    <div className="flex items-start">
                      <FaPhone className="text-blue-600 mt-1 mr-3 flex-shrink-0" />
                      <div>
                        <p className="text-sm font-medium text-gray-500">Phone</p>
                        <a href={`tel:${ministry.contactPhone}`} className="text-gray-900 hover:text-blue-600">
                          {ministry.contactPhone}
                        </a>
                      </div>
                    </div>
                  )}
                </div>
                
                <div className="bg-white border border-gray-200 rounded-xl p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Get Involved</h3>
                  <p className="text-gray-600 mb-4">
                    Interested in joining this ministry? Reach out to us using the contact information above or visit us during our meeting times.
                  </p>
                  <Link 
                    href="/contact" 
                    className="inline-flex items-center justify-center w-full px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                  >
                    Contact Us
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export const dynamicParams = true;

export async function generateStaticParams() {
  // Pre-render the most popular ministries at build time
  try {
    const ministries = await ministryApi.getMinistries();
    return ministries.map((ministry) => ({
      id: ministry.id,
    }));
  } catch (error) {
    console.error('Error generating static params for ministries:', error);
    return [];
  }
}
