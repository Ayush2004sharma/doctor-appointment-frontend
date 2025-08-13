'use client';

import React from 'react';
import { Star } from 'lucide-react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';

// Import all fallback images
import doc1 from '@/app/assets/assets_frontend/doc1.png';
import doc2 from '@/app/assets/assets_frontend/doc2.png';
import doc3 from '@/app/assets/assets_frontend/doc3.png';
import doc4 from '@/app/assets/assets_frontend/doc4.png';
import doc5 from '@/app/assets/assets_frontend/doc5.png';
import doc6 from '@/app/assets/assets_frontend/doc6.png';
import doc7 from '@/app/assets/assets_frontend/doc7.png';
import doc8 from '@/app/assets/assets_frontend/doc8.png';
import doc9 from '@/app/assets/assets_frontend/doc9.png';
import doc10 from '@/app/assets/assets_frontend/doc10.png';

const fallbackImages = [doc1, doc2, doc3, doc4, doc5, doc6, doc7, doc8, doc9, doc10];

export default function DoctorMiniCard({ doctor }) {
  const router = useRouter();

  if (!doctor) return null;

  const { _id, name, image, consultationFee, rating } = doctor;

  // Function to pick a fallback image based on doctor _id
  const getFallbackImage = () => {
    const index = _id ? parseInt(_id.slice(-2), 16) % fallbackImages.length : 0; 
    return fallbackImages[index];
  };

  const handleClick = () => {
    router.push(`/pages/doctors/${_id}`);
  };

  return (
    <div
      onClick={handleClick}
      className="bg-[#e0f2ff] rounded-xl shadow-sm p-4 flex items-center gap-4 w-full hover:shadow-md transition duration-300 cursor-pointer"
    >
      <Image
        src={image || getFallbackImage()}
        alt={name}
        width={80}
        height={80}
        className="w-20 h-20 object-cover rounded-lg border border-blue-300"
      />
      <div className="flex flex-col justify-center">
        <h3 className="text-lg font-semibold text-[#1e3a8a]">{name}</h3>
        <p className="text-sm text-blue-700">₹{consultationFee || '500'} fee</p>
        <div className="flex items-center gap-1 text-yellow-500">
          <Star className="w-4 h-4 fill-yellow-500" />
          <span className="text-sm text-blue-800">{rating || '4.5'}</span>
        </div>
      </div>
    </div>
  );
}
