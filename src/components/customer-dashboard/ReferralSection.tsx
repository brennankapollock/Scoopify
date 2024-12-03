import React from 'react';
import { Share2, Copy, Facebook, Twitter, Instagram } from 'lucide-react';
import { useAuth } from '../../contexts/auth';

const ReferralSection = () => {
  const { user } = useAuth();
  const [copied, setCopied] = React.useState(false);
  
  // Generate referral code from first name and last 4 of phone
  const generateReferralCode = () => {
    if (!user) return 'FRIEND50';
    
    const firstName = user.displayName?.split(' ')[0] || '';
    const phone = user.phoneNumber || '';
    const last4 = phone.slice(-4);
    
    return `${firstName.toUpperCase()}${last4}`;
  };

  const referralCode = generateReferralCode();

  const handleCopy = () => {
    navigator.clipboard.writeText(referralCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const shareText = `Get $50 off your first month of pet waste removal service with my referral code: ${referralCode}`;

  const socialLinks = [
    {
      name: 'Facebook',
      icon: Facebook,
      url: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(window.location.href)}&quote=${encodeURIComponent(shareText)}`,
      color: 'bg-[#1877F2] hover:bg-[#1865D3]',
    },
    {
      name: 'Twitter',
      icon: Twitter,
      url: `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}`,
      color: 'bg-[#1DA1F2] hover:bg-[#1A91DA]',
    },
    {
      name: 'Instagram',
      icon: Instagram,
      url: 'https://instagram.com',
      color: 'bg-[#E4405F] hover:bg-[#D93B55]',
    },
  ];

  return (
    <div className="bg-white rounded-2xl p-6 shadow-sm">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-lg font-semibold text-gray-900">Share & Earn</h2>
        <Share2 className="text-primary-600" size={24} />
      </div>

      <div className="space-y-6">
        <div>
          <p className="text-sm text-gray-600 mb-4">
            Share your referral code and both you and your friend will get $50 off!
          </p>

          <div className="relative">
            <div className="absolute inset-0 bg-primary-50 opacity-50 rounded-lg" />
            <div className="relative flex items-center">
              <div className="flex-1 px-4 py-3 font-mono text-lg font-semibold text-primary-700 bg-primary-50/50 rounded-l-lg">
                {referralCode}
              </div>
              <button
                onClick={handleCopy}
                className="px-4 py-3 text-white bg-primary-600 rounded-r-lg hover:bg-primary-700 transition-colors"
              >
                <Copy size={20} />
              </button>
            </div>
          </div>
          {copied && (
            <p className="text-sm text-primary-600 mt-2">Copied to clipboard!</p>
          )}
        </div>

        <div className="space-y-3">
          <p className="text-sm font-medium text-gray-900">Share via</p>
          
          <div className="flex justify-center gap-4">
            {socialLinks.map((social) => (
              <a
                key={social.name}
                href={social.url}
                target="_blank"
                rel="noopener noreferrer"
                className={`p-3 text-white rounded-full ${social.color} transition-colors`}
                aria-label={`Share on ${social.name}`}
              >
                <social.icon size={20} />
              </a>
            ))}
          </div>
        </div>

        <div className="border-t border-gray-200 pt-4">
          <div className="flex items-center justify-between text-sm">
            <span className="text-gray-600">Total Referrals</span>
            <span className="font-medium text-gray-900">0</span>
          </div>
          <div className="flex items-center justify-between text-sm mt-2">
            <span className="text-gray-600">Rewards Earned</span>
            <span className="font-medium text-gray-900">$0</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReferralSection;