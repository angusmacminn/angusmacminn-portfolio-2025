import React, { useState, useEffect } from 'react';
import './StackedMediaGallery.css';

function StackedMediaGallery({ mediaItems, restBase }) {
    const [mediaContent, setMediaContent] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchMediaContent = async () => {
            if (!mediaItems || !Array.isArray(mediaItems) || mediaItems.length === 0) {
                setLoading(false);
                return;
            }
            try {
                const mediaContentArray = [];
                for (const item of mediaItems) {
                    if (item.type === 'video') {
                        if (item.video_file) {
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
                            }
                        } else if (item.video_url) {
                            mediaContentArray.push({ 
                                id: `video-url-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`, 
                                type: 'embed', 
                                url: item.video_url, 
                                title: '' 
                            });
                        }
                    } else if (item.type === 'image' && item.image) {
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
                        }
                    }
                }
                // Sort media: videos first, then images
                const sortedMedia = [
                    ...mediaContentArray.filter(item => item.type === 'video' || item.type === 'embed'),
                    ...mediaContentArray.filter(item => item.type === 'image')
                ];
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

    // Helper function to convert YouTube/Vimeo URLs to embed URLs
    const getEmbedUrl = (url) => {
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
    };

    if (loading) {
        return <div className="stacked-gallery-loading">Loading media...</div>;
    }

    if (error) {
        return <div className="stacked-gallery-error">{error}</div>;
    }

    if (mediaContent.length === 0) {
        return null; 
    }

    return (
        <div className="stacked-media-gallery">
            {mediaContent.map((media, index) => (
                <div key={media.id} className="stacked-media-item">
                    {media.type === 'video' && (
                        <video 
                            controls
                            autoPlay={index === 0} // Only autoplay the first video
                            muted
                            playsInline
                            className="stacked-media-video"
                            aria-label={media.title || "Project video"}
                        >
                            <source src={media.url} type={media.mime_type} />
                            Your browser does not support the video tag.
                        </video>
                    )}
                    
                    {media.type === 'embed' && (
                        <div className="stacked-media-embed">
                            <iframe
                                src={getEmbedUrl(media.url)}
                                title={media.title || "Embedded video"}
                                frameBorder="0"
                                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                allowFullScreen
                                aria-label={media.title || "Embedded project video"}
                            ></iframe>
                        </div>
                    )}
                    
                    {media.type === 'image' && (
                        <img 
                            src={media.url} 
                            loading="lazy" 
                            alt={media.alt} 
                            className="stacked-media-image"
                        />
                    )}
                </div>
            ))}
        </div>
    );
}

export default StackedMediaGallery;
