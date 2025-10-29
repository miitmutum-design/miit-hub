
'use client';

import { PlayCircle } from 'lucide-react';
import Link from 'next/link';

const MOCK_VIDEO_URL = "https://www.youtube.com/watch?v=dQw4w9WgXcQ"; // Placeholder video

export default function VideoPlayer() {

  const getHref = () => {
    // In a real app, this would check for a paid ad video_ad_url
    // and fall back to the generic marketing video.
    // For now, we use a mock URL.
    if (MOCK_VIDEO_URL.includes('youtube.com') || MOCK_VIDEO_URL.includes('vimeo.com')) {
       return MOCK_VIDEO_URL;
    }
    // If it's an internal link or other website, use the webview
    return `/webview?url=${encodeURIComponent(MOCK_VIDEO_URL)}`;
  };
  
  const isExternal = MOCK_VIDEO_URL.includes('youtube.com') || MOCK_VIDEO_URL.includes('vimeo.com');

  return (
    <Link href={getHref()} target={isExternal ? '_blank' : '_self'} rel="noopener noreferrer">
      <div className="relative h-40 w-full rounded-lg bg-lime-500 flex items-center justify-center cursor-pointer group overflow-hidden">
        <div className="absolute inset-0 bg-black/20 group-hover:bg-black/30 transition-colors"></div>
        <PlayCircle className="relative h-16 w-16 text-white/80 drop-shadow-lg transition-transform group-hover:scale-110" strokeWidth={1.5} />
        {/* In a real app, a thumbnail would go here */}
        {/* <Image src="/path/to/thumbnail.jpg" alt="Video Thumbnail" fill className="object-cover -z-10" /> */}
      </div>
    </Link>
  );
}
