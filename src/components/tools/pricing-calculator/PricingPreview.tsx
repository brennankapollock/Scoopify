import React from 'react';
import { pdf } from '@react-pdf/renderer';
import { Download } from 'lucide-react';
import { PricingCalculatorData } from './types';
import { Document, Page, Text, View, StyleSheet, Image } from '@react-pdf/renderer';

interface PricingPreviewProps {
  data: PricingCalculatorData;
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
  section: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 14,
    fontFamily: 'Helvetica-Bold',
    marginBottom: 10,
  },
  table: {
    display: 'table',
    width: 'auto',
    marginBottom: 20,
  },
  tableRow: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
    borderBottomStyle: 'solid',
    minHeight: 30,
    alignItems: 'center',
  },
  tableHeader: {
    backgroundColor: '#F3F4F6',
    fontFamily: 'Helvetica-Bold',
  },
  tableCell: {
    flex: 1,
    padding: 8,
  },
  priceCell: {
    width: 80,
    textAlign: 'right',
    padding: 8,
  },
  timeCell: {
    width: 100,
    textAlign: 'right',
    padding: 8,
  },
  profitCell: {
    width: 100,
    textAlign: 'right',
    padding: 8,
  },
});

const calculateServiceCosts = (data: PricingCalculatorData, service: any) => {
  const {
    laborRate,
    fuelCost,
    vehicleMileage,
    averageDriveDistance,
    supplies,
    insurance,
    marketing,
    overhead
  } = data.operatingCosts;

  // Calculate time-based costs
  const laborCost = (service.timePerYard / 60) * laborRate;

  // Calculate travel costs
  const fuelCostPerYard = (averageDriveDistance / vehicleMileage) * fuelCost;

  // Calculate monthly overhead per yard (assuming 100 yards per month as baseline)
  const monthlyOverheadPerYard = (insurance + marketing + overhead) / 100;

  // Calculate total cost per yard
  const totalCost = laborCost + fuelCostPerYard + supplies + monthlyOverheadPerYard;

  // Calculate profits at different margins
  const { minimumProfit, targetProfit, maximumProfit } = data.profitTargets;
  
  const minPrice = totalCost / (1 - (minimumProfit / 100));
  const targetPrice = totalCost / (1 - (targetProfit / 100));
  const maxPrice = totalCost / (1 - (maximumProfit / 100));

  return {
    cost: totalCost,
    minPrice,
    targetPrice,
    maxPrice,
    actualProfit: ((service.basePrice - totalCost) / service.basePrice) * 100
  };
};

const PricingDocument = ({ data }: { data: PricingCalculatorData }) => {
  const [logoUrl, setLogoUrl] = React.useState<string>();

  React.useEffect(() => {
    if (data.businessInfo.logo) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setLogoUrl(reader.result as string);
      };
      reader.readAsDataURL(data.businessInfo.logo);
    }
  }, [data.businessInfo.logo]);

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.headerContent}>
            <Text style={styles.title}>{data.businessInfo.businessName}</Text>
            <Text>{data.businessInfo.address}</Text>
            <Text>{data.businessInfo.phone}</Text>
            <Text>{data.businessInfo.email}</Text>
            {data.businessInfo.website && <Text>{data.businessInfo.website}</Text>}
          </View>
          {logoUrl && (
            <Image
              src={logoUrl}
              style={styles.logo}
            />
          )}
        </View>

        {/* Regular Services */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Regular Services</Text>
          <View style={styles.table}>
            <View style={[styles.tableRow, styles.tableHeader]}>
              <Text style={styles.tableCell}>Service</Text>
              <Text style={styles.priceCell}>Price</Text>
              <Text style={styles.timeCell}>Time</Text>
              <Text style={styles.profitCell}>Profit</Text>
            </View>
            {data.services.filter(s => !s.isAddOn).map((service) => {
              const costs = calculateServiceCosts(data, service);
              return (
                <View key={service.id} style={styles.tableRow}>
                  <Text style={styles.tableCell}>{service.name}</Text>
                  <Text style={styles.priceCell}>${service.basePrice.toFixed(2)}</Text>
                  <Text style={styles.timeCell}>{service.timePerYard} min</Text>
                  <Text style={styles.profitCell}>
                    {costs.actualProfit.toFixed(1)}%
                  </Text>
                </View>
              );
            })}
          </View>
        </View>

        {/* Add-on Services */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Add-on Services</Text>
          <View style={styles.table}>
            <View style={[styles.tableRow, styles.tableHeader]}>
              <Text style={styles.tableCell}>Service</Text>
              <Text style={styles.priceCell}>Price</Text>
              <Text style={styles.timeCell}>Time</Text>
              <Text style={styles.profitCell}>Profit</Text>
            </View>
            {data.services.filter(s => s.isAddOn).map((service) => {
              const costs = calculateServiceCosts(data, service);
              return (
                <View key={service.id} style={styles.tableRow}>
                  <Text style={styles.tableCell}>{service.name}</Text>
                  <Text style={styles.priceCell}>${service.basePrice.toFixed(2)}</Text>
                  <Text style={styles.timeCell}>{service.timePerYard} min</Text>
                  <Text style={styles.profitCell}>
                    {costs.actualProfit.toFixed(1)}%
                  </Text>
                </View>
              );
            })}
          </View>
        </View>
      </Page>
    </Document>
  );
};

const PricingPreview: React.FC<PricingPreviewProps> = ({ data, onBack }) => {
  const [isGenerating, setIsGenerating] = React.useState(false);

  const handleDownload = async () => {
    if (isGenerating) return;

    setIsGenerating(true);
    try {
      const doc = <PricingDocument data={data} />;
      const blob = await pdf(doc).toBlob();
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = 'service-pricing.pdf';
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
          Edit Pricing
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
            <h3 className="text-xl font-bold">{data.businessInfo.businessName}</h3>
            <p className="mb-1">{data.businessInfo.address}</p>
            <p className="mb-1">{data.businessInfo.phone}</p>
            <p className="mb-1">{data.businessInfo.email}</p>
            {data.businessInfo.website && <p className="mb-1">{data.businessInfo.website}</p>}
          </div>
          {data.businessInfo.logo && (
            <img
              src={URL.createObjectURL(data.businessInfo.logo)}
              alt="Business logo"
              className="w-24 h-24 object-contain"
            />
          )}
        </div>

        {/* Regular Services */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold mb-4">Regular Services</h2>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead>
                <tr className="bg-gray-50">
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Service</th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Price</th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Time</th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Profit</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {data.services.filter(s => !s.isAddOn).map((service) => {
                  const costs = calculateServiceCosts(data, service);
                  return (
                    <tr key={service.id}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{service.name}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 text-right">${service.basePrice.toFixed(2)}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 text-right">{service.timePerYard} min</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-right">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                          costs.actualProfit >= data.profitTargets.targetProfit
                            ? 'bg-green-100 text-green-800'
                            : costs.actualProfit >= data.profitTargets.minimumProfit
                            ? 'bg-yellow-100 text-yellow-800'
                            : 'bg-red-100 text-red-800'
                        }`}>
                          {costs.actualProfit.toFixed(1)}%
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* Add-on Services */}
        <div>
          <h2 className="text-2xl font-bold mb-4">Add-on Services</h2>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead>
                <tr className="bg-gray-50">
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Service</th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Price</th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Time</th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Profit</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {data.services.filter(s => s.isAddOn).map((service) => {
                  const costs = calculateServiceCosts(data, service);
                  return (
                    <tr key={service.id}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{service.name}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 text-right">${service.basePrice.toFixed(2)}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 text-right">{service.timePerYard} min</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-right">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                          costs.actualProfit >= data.profitTargets.targetProfit
                            ? 'bg-green-100 text-green-800'
                            : costs.actualProfit >= data.profitTargets.minimumProfit
                            ? 'bg-yellow-100 text-yellow-800'
                            : 'bg-red-100 text-red-800'
                        }`}>
                          {costs.actualProfit.toFixed(1)}%
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PricingPreview;