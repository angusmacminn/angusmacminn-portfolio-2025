import React, { useState, useEffect } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination, Autoplay } from 'swiper/modules';

// Import Swiper styles
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import './MediaGallery.css';

function MediaGallery({ mediaItems, restBase }) {
  const [mediaContent, setMediaContent] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchMediaContent = async () => {
      // Add defensive checks
      if (!mediaItems || !Array.isArray(mediaItems) || mediaItems.length === 0) {
        console.log("No valid media items provided:", mediaItems);
        setLoading(false);
        return;
      }

      try {
        console.log("Processing media items:", mediaItems);
        
        // Create an array to store all media content
        const mediaContentArray = [];
        
        // Process each media item
        for (const item of mediaItems) {
          console.log("Processing item:", item);
          
          try {
            // Handle different media types
            if (item.type === 'video') {
              if (item.video_file) {
                // Fetch video file data
                const videoResponse = await fetch(`${restBase}media/${item.video_file}`);
                if (videoResponse.ok) {
                  const videoData = await videoResponse.json();
                  mediaContentArray.push({
                    id: videoData.id,
                    type: 'video',
                    url: videoData.source_url,
                    title: videoData.title?.rendered || '',
                    mime_type: videoData.mime_type || 'video/mp4'
                  });
                } else {
                  console.error(`Failed to fetch video with ID ${item.video_file}: ${videoResponse.status}`);
                }
              } else if (item.video_url) {
                // Handle external video URL (YouTube, Vimeo, etc.)
                mediaContentArray.push({
                  id: `video-url-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
                  type: 'embed',
                  url: item.video_url,
                  title: ''
                });
              }
            } else if (item.type === 'image' && item.image) {
              // Fetch image data
              const imageResponse = await fetch(`${restBase}media/${item.image}`);
              if (imageResponse.ok) {
                const imageData = await imageResponse.json();
                mediaContentArray.push({
                  id: imageData.id,
                  type: 'image',
                  url: imageData.source_url,
                  alt: imageData.alt_text || 'Project image',
                  title: imageData.title?.rendered || ''
                });
              } else {
                console.error(`Failed to fetch image with ID ${item.image}: ${imageResponse.status}`);
              }
            }
          } catch (itemError) {
            console.error("Error processing media item:", itemError);
            // Continue with next item instead of failing the whole gallery
          }
        }
        
        // Sort the array to put videos first
        const sortedMedia = [
          ...mediaContentArray.filter(item => item.type === 'video' || item.type === 'embed'),
          ...mediaContentArray.filter(item => item.type === 'image')
        ];
        
        console.log("Processed media content:", sortedMedia);
        setMediaContent(sortedMedia);
      } catch (error) {
        console.error('Error fetching media content:', error);
        setError('Failed to load media content');
      } finally {
        setLoading(false);
      }
    };

    fetchMediaContent();
  }, [mediaItems, restBase]);

  if (loading) {
    return <div className="gallery-loading">Loading media...</div>;
  }

  if (error) {
    return <div className="gallery-error">{error}</div>;
  }

  if (mediaContent.length === 0) {
    return null; // Don't render anything if no media
  }

  return (
    <div className="media-gallery">
      <Swiper
        modules={[Navigation, Pagination, Autoplay]}
        spaceBetween={30}
        slidesPerView={1}
        navigation
        pagination={{ clickable: true }}
        autoplay={{ 
          delay: 10000,
          disableOnInteraction: false,
          pauseOnMouseEnter: true
        }}
        className="mySwiper"
      >
        {mediaContent.map((media) => (
          <SwiperSlide key={media.id}>
            <div className="swiper-media-container">
              {media.type === 'video' && (
                <video 
                  controls
                  autoPlay={true}
                  muted
                  playsInline
                  className="media-video"
                >
                  <source src={media.url} type={media.mime_type} />
                  Your browser does not support the video tag.
                </video>
              )}
              
              {media.type === 'embed' && (
                <div className="media-embed">
                  <iframe
                    src={getEmbedUrl(media.url)}
                    title={media.title || "Embedded video"}
                    frameBorder="0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                  ></iframe>
                </div>
              )}
              
              {media.type === 'image' && (
                <img 
                  src={media.url} 
                  alt={media.alt} 
                  loading="lazy"
                  className="media-image"
                />
              )}
              
              
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
}

// Helper function to convert YouTube/Vimeo URLs to embed URLs
function getEmbedUrl(url) {
  if (!url) return '';
  
  try {
    // YouTube
    const youtubeRegex = /(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/;
    const youtubeMatch = url.match(youtubeRegex);
    
    if (youtubeMatch && youtubeMatch[1]) {
      return `https://www.youtube.com/embed/${youtubeMatch[1]}`;
    }
    
    // Vimeo
    const vimeoRegex = /vimeo\.com\/(?:video\/)?(\d+)/;
    const vimeoMatch = url.match(vimeoRegex);
    
    if (vimeoMatch && vimeoMatch[1]) {
      return `https://player.vimeo.com/video/${vimeoMatch[1]}`;
    }
  } catch (error) {
    console.error("Error parsing video URL:", error);
  }
  
  return url;
}

export default MediaGallery;