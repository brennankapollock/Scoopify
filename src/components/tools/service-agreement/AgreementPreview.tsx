import React from 'react';
import { pdf } from '@react-pdf/renderer';
import { Download } from 'lucide-react';
import { ServiceAgreement, DEFAULT_LIABILITY_TERMS, DEFAULT_CANCELLATION_TERMS } from './types';
import { format } from 'date-fns';
import { Document, Page, Text, View, StyleSheet, Image } from '@react-pdf/renderer';

interface AgreementPreviewProps {
  agreement: ServiceAgreement;
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
  title: {
    fontSize: 24,
    fontFamily: 'Helvetica-Bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  businessName: {
    fontSize: 16,
    fontFamily: 'Helvetica-Bold',
    marginBottom: 8,
  },
  section: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 14,
    fontFamily: 'Helvetica-Bold',
    marginBottom: 10,
  },
  paragraph: {
    marginBottom: 10,
  },
  list: {
    marginLeft: 20,
  },
  listItem: {
    marginBottom: 5,
  },
  signature: {
    marginTop: 40,
  },
  signatureLine: {
    borderTop: 1,
    width: 200,
    marginTop: 40,
    marginBottom: 5,
  },
  signatureLabel: {
    fontSize: 10,
    color: '#666',
  },
});

const formatServiceDetails = (agreement: ServiceAgreement) => {
  const frequency = agreement.serviceDetails.serviceFrequency === 'custom'
    ? agreement.serviceDetails.customFrequency
    : `${agreement.serviceDetails.serviceFrequency.charAt(0).toUpperCase()}${agreement.serviceDetails.serviceFrequency.slice(1)}`;

  return `
1. Service Frequency
- ${frequency} service visits
- Service price: ${agreement.serviceDetails.servicePrice} per visit
- Payment schedule: ${agreement.serviceDetails.paymentSchedule}

2. Included Services
${agreement.serviceDetails.includedServices.map(service => `- ${service}`).join('\n')}
${agreement.serviceDetails.customServices.length > 0 ? '\n3. Additional Services\n' + agreement.serviceDetails.customServices.map(service => `- ${service}`).join('\n') : ''}
  `.trim();
};

const AgreementDocument = ({ agreement }: { agreement: ServiceAgreement }) => {
  const [logoUrl, setLogoUrl] = React.useState<string>();

  React.useEffect(() => {
    if (agreement.businessInfo.logo) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setLogoUrl(reader.result as string);
      };
      reader.readAsDataURL(agreement.businessInfo.logo);
    }
  }, [agreement.businessInfo.logo]);

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.headerContent}>
            <Text style={styles.businessName}>{agreement.businessInfo.businessName}</Text>
            <Text>{agreement.businessInfo.address}</Text>
            <Text>{agreement.businessInfo.phone}</Text>
            <Text>{agreement.businessInfo.email}</Text>
            {agreement.businessInfo.website && <Text>{agreement.businessInfo.website}</Text>}
          </View>
          {logoUrl && (
            <Image
              src={logoUrl}
              style={styles.logo}
            />
          )}
        </View>

        {/* Title */}
        <Text style={styles.title}>Pet Waste Removal Service Agreement</Text>

        {/* Service Details */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Service Details</Text>
          {formatServiceDetails(agreement).split('\n').map((line, index) => (
            <Text key={index} style={styles.paragraph}>{line}</Text>
          ))}
        </View>

        {/* Cancellation Policy */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Cancellation Policy</Text>
          {DEFAULT_CANCELLATION_TERMS.split('\n').map((line, index) => (
            <Text key={index} style={styles.paragraph}>{line}</Text>
          ))}
        </View>

        {/* Liability Terms */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Liability & Terms</Text>
          {DEFAULT_LIABILITY_TERMS.split('\n').map((line, index) => (
            <Text key={index} style={styles.paragraph}>{line}</Text>
          ))}
        </View>

        {/* Signatures */}
        <View style={styles.signature}>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
            <View>
              <View style={styles.signatureLine} />
              <Text style={styles.signatureLabel}>Service Provider Signature</Text>
              <Text>{agreement.businessInfo.ownerName}</Text>
              <Text>{format(new Date(), 'MM/dd/yyyy')}</Text>
            </View>
            <View>
              <View style={styles.signatureLine} />
              <Text style={styles.signatureLabel}>Customer Signature</Text>
              <Text>Date</Text>
            </View>
          </View>
        </View>
      </Page>
    </Document>
  );
};

const AgreementPreview: React.FC<AgreementPreviewProps> = ({ agreement, onBack }) => {
  const [isGenerating, setIsGenerating] = React.useState(false);

  const handleDownload = async () => {
    if (isGenerating) return;

    setIsGenerating(true);
    try {
      const doc = <AgreementDocument agreement={agreement} />;
      const blob = await pdf(doc).toBlob();
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = 'scoopify-service-agreement.pdf';
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
          Edit Agreement
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
            <h3 className="text-xl font-bold">{agreement.businessInfo.businessName}</h3>
            <p className="mb-1">{agreement.businessInfo.address}</p>
            <p className="mb-1">{agreement.businessInfo.phone}</p>
            <p className="mb-1">{agreement.businessInfo.email}</p>
            {agreement.businessInfo.website && <p className="mb-1">{agreement.businessInfo.website}</p>}
          </div>
          {agreement.businessInfo.logo && (
            <img
              src={URL.createObjectURL(agreement.businessInfo.logo)}
              alt="Business logo"
              className="w-24 h-24 object-contain"
            />
          )}
        </div>

        <h1 className="text-3xl font-bold text-center mb-8">Pet Waste Removal Service Agreement</h1>

        <div className="space-y-8">
          {/* Service Details */}
          <section>
            <h2 className="text-xl font-bold mb-4">Service Details</h2>
            <div className="whitespace-pre-line">{formatServiceDetails(agreement)}</div>
          </section>

          {/* Cancellation Policy */}
          <section>
            <h2 className="text-xl font-bold mb-4">Cancellation Policy</h2>
            <div className="whitespace-pre-line">{DEFAULT_CANCELLATION_TERMS}</div>
          </section>

          {/* Liability Terms */}
          <section>
            <h2 className="text-xl font-bold mb-4">Liability & Terms</h2>
            <div className="whitespace-pre-line">{DEFAULT_LIABILITY_TERMS}</div>
          </section>

          {/* Signatures */}
          <section className="mt-12">
            <div className="flex justify-between">
              <div>
                <div className="border-t-2 border-gray-300 w-48 mb-2"></div>
                <p className="text-sm text-gray-500">Service Provider Signature</p>
                <p>{agreement.businessInfo.ownerName}</p>
                <p>{format(new Date(), 'MM/dd/yyyy')}</p>
              </div>
              <div>
                <div className="border-t-2 border-gray-300 w-48 mb-2"></div>
                <p className="text-sm text-gray-500">Customer Signature</p>
                <p>Date</p>
              </div>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
};

export default AgreementPreview;