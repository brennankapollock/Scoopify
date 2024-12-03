import React from 'react';
import { pdf } from '@react-pdf/renderer';
import { Download } from 'lucide-react';
import { BusinessInfo, LetterOptions } from './types';
import { format } from 'date-fns';
import { Document, Page, Text, View, StyleSheet, Image } from '@react-pdf/renderer';

interface LetterPreviewProps {
  businessInfo: BusinessInfo;
  letterOptions: LetterOptions;
  onBack: () => void;
}

// PDF styles using Helvetica (standard PDF font)
const styles = StyleSheet.create({
  page: {
    padding: 40,
    fontFamily: 'Helvetica',
    fontSize: 12,
    lineHeight: 1.5,
  },
  header: {
    marginBottom: 40,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  headerContent: {
    flex: 1,
  },
  logo: {
    width: 100,
    marginLeft: 20,
    objectFit: 'contain',
  },
  businessName: {
    fontSize: 16,
    fontFamily: 'Helvetica-Bold',
    marginBottom: 8,
  },
  address: {
    marginBottom: 4,
  },
  date: {
    marginTop: 20,
    marginBottom: 40,
  },
  greeting: {
    marginBottom: 30,
    fontFamily: 'Helvetica-Bold',
  },
  paragraph: {
    marginBottom: 20,
    lineHeight: 1.5,
  },
  closing: {
    marginTop: 40,
  },
  signature: {
    marginTop: 40,
  },
  signatureName: {
    fontFamily: 'Helvetica-Bold',
  }
});

const generateLetterContent = (info: BusinessInfo, options: LetterOptions) => {
  const content = [];

  if (options.includeThankYou) {
    content.push(
      `Thank you for being a valued customer of ${info.businessName}. We truly appreciate your continued trust in our services.`
    );
  }

  if (options.includeMarketFactors) {
    content.push(
      `Due to increasing operational costs, including fuel, equipment, and labor expenses, we find it necessary to adjust our service rates.`
    );
  }

  if (options.includeValueProposition) {
    content.push(
      `We remain committed to providing you with the highest quality pet waste removal service, maintaining clean and healthy yards for you and your pets.`
    );
  }

  if (options.includeEffectiveDate) {
    content.push(
      `Effective ${format(new Date(info.effectiveDate), 'MMMM d, yyyy')}, our service rate will change from ${info.currentPrice} to ${info.newPrice} per visit${
        info.priceChangeType === 'percentage' ? ` (a ${info.percentageIncrease} increase)` : ''
      }.`
    );
  }

  if (options.includeContact) {
    content.push(
      `If you have any questions or concerns, please don't hesitate to contact us at ${info.phone} or ${info.email}.`
    );
  }

  return content;
};

const LetterDocument = ({ businessInfo, letterOptions }: { businessInfo: BusinessInfo, letterOptions: LetterOptions }) => {
  const [logoUrl, setLogoUrl] = React.useState<string>();

  React.useEffect(() => {
    if (businessInfo.logo) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setLogoUrl(reader.result as string);
      };
      reader.readAsDataURL(businessInfo.logo);
    }
  }, [businessInfo.logo]);

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <View style={styles.header}>
          <View style={styles.headerContent}>
            <Text style={styles.businessName}>{businessInfo.businessName}</Text>
            <Text style={styles.address}>{businessInfo.address}</Text>
            <Text>{businessInfo.phone}</Text>
            <Text>{businessInfo.email}</Text>
            {businessInfo.website && <Text>{businessInfo.website}</Text>}
          </View>
          {logoUrl && (
            <Image
              src={logoUrl}
              style={styles.logo}
            />
          )}
        </View>

        <Text style={styles.date}>{format(new Date(), 'MMMM d, yyyy')}</Text>

        <Text style={styles.greeting}>Dear Valued Customer,</Text>

        {generateLetterContent(businessInfo, letterOptions).map((paragraph, index) => (
          <Text key={index} style={styles.paragraph}>
            {paragraph}
          </Text>
        ))}

        <View style={styles.closing}>
          <Text style={styles.paragraph}>Thank you for your understanding.</Text>
          <Text style={styles.paragraph}>Best regards,</Text>
        </View>

        <View style={styles.signature}>
          <Text style={styles.signatureName}>{businessInfo.ownerName}</Text>
          <Text>{businessInfo.businessName}</Text>
        </View>
      </Page>
    </Document>
  );
};

const LetterPreview: React.FC<LetterPreviewProps> = ({ businessInfo, letterOptions, onBack }) => {
  const [isGenerating, setIsGenerating] = React.useState(false);

  const handleDownload = async () => {
    if (isGenerating) return;

    setIsGenerating(true);
    try {
      const doc = <LetterDocument businessInfo={businessInfo} letterOptions={letterOptions} />;
      const blob = await pdf(doc).toBlob();
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = 'scoopify-price-increase-letter.pdf';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Error generating PDF:', error);
      alert('There was an error generating the PDF. Please try again.');
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="bg-white rounded-xl p-6 shadow-sm">
      <div className="flex justify-between items-center mb-6">
        <button
          onClick={onBack}
          className="text-gray-600 hover:text-gray-900"
        >
          Edit Letter
        </button>
        <button
          onClick={handleDownload}
          disabled={isGenerating}
          className={`inline-flex items-center px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700 transition-colors ${
            isGenerating ? 'opacity-50 cursor-not-allowed' : ''
          }`}
        >
          <Download size={16} className="mr-2" />
          {isGenerating ? 'Generating...' : 'Download PDF'}
        </button>
      </div>

      <div className="prose max-w-none">
        {/* Preview content */}
        <div className="mb-12 flex items-start justify-between">
          <div>
            <h3 className="text-xl font-bold">{businessInfo.businessName}</h3>
            <p className="mb-1">{businessInfo.address}</p>
            <p className="mb-1">{businessInfo.phone}</p>
            <p className="mb-1">{businessInfo.email}</p>
            {businessInfo.website && <p className="mb-1">{businessInfo.website}</p>}
          </div>
          {businessInfo.logo && (
            <img
              src={URL.createObjectURL(businessInfo.logo)}
              alt="Business logo"
              className="w-24 h-24 object-contain"
            />
          )}
        </div>

        <p className="mb-8">{format(new Date(), 'MMMM d, yyyy')}</p>

        <p className="text-lg font-semibold mb-8">Dear Valued Customer,</p>

        {generateLetterContent(businessInfo, letterOptions).map((paragraph, index) => (
          <p key={index} className="mb-6 leading-relaxed">{paragraph}</p>
        ))}

        <p className="mb-6">Thank you for your understanding.</p>
        <p className="mb-8">Best regards,</p>

        <div className="mt-8">
          <p className="font-bold mb-1">{businessInfo.ownerName}</p>
          <p>{businessInfo.businessName}</p>
        </div>
      </div>
    </div>
  );
};

export default LetterPreview;