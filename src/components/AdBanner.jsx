import { useEffect } from 'react';
import { Megaphone } from 'lucide-react';

/**
 * AdBanner Component
 * Displays Google AdSense ads with placeholder functionality
 * @param {Object} props - Component props
 * @param {string} props.clientId - Google AdSense client ID (placeholder: ca-pub-xxxxxxxxxxxxxx)
 * @param {string} props.slot - Ad slot ID
 * @param {string} props.format - Ad format (auto, rectangle, etc.)
 * @param {string} props.style - Additional CSS styles
 * @param {string} props.className - Additional CSS classes
 */
const AdBanner = ({ 
  clientId = "ca-pub-xxxxxxxxxxxxxx", 
  slot = "1234567890", 
  format = "auto",
  style = "display:block",
  className = ""
}) => {
  useEffect(() => {
    // Load Google AdSense script
    const loadAdSense = () => {
      if (window.adsbygoogle) return; // Already loaded
      
      const script = document.createElement('script');
      script.async = true;
      script.src = `https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${clientId}`;
      script.crossOrigin = 'anonymous';
      document.head.appendChild(script);
    };

    loadAdSense();
  }, [clientId]);

  useEffect(() => {
    // Initialize ads after component mounts
    if (window.adsbygoogle) {
      try {
        (window.adsbygoogle = window.adsbygoogle || []).push({});
      } catch (e) {
        console.log('AdSense error:', e);
      }
    }
  }, []);

  return (
    <div className={`w-full flex justify-center my-8 ${className}`}>
      <div className="w-full max-w-4xl">
        <ins 
          className="adsbygoogle"
          style={{ 
            display: 'block',
            ...(typeof style === 'string' ? {} : style)
          }}
          data-ad-client={clientId}
          data-ad-slot={slot}
          data-ad-format={format}
          data-full-width-responsive="true"
        />
        
        {/* Fallback placeholder for development */}
        {clientId === "ca-pub-xxxxxxxxxxxxxx" && (
          <div className="w-full h-40 bg-gradient-to-r from-blue-50 to-purple-50 border-2 border-dashed border-blue-200 rounded-2xl flex items-center justify-center text-gray-500">
            <div className="text-center">
              <div className="p-3 bg-blue-100 rounded-xl w-fit mx-auto mb-3">
                <Megaphone className="w-6 h-6 text-blue-600" />
              </div>
              <div className="font-semibold text-gray-700 mb-1">Advertisement Space</div>
              <div className="text-sm text-gray-500">
                Replace with your AdSense client ID
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdBanner;
