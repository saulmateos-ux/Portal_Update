'use client';

import { formatCurrency, formatNumber, formatPercentage } from '@/lib/formatters';
import { Building2, Scale, TrendingUp, AlertTriangle } from 'lucide-react';

interface LawFirmKPIsProps {
  totalLawFirms: number;
  totalOpenAR: number;
  totalCases: number;
  avgCollectionRate: number;
  totalAtRiskAR: number;
  totalActiveLitigationAR: number;
  loading?: boolean;
}

export function LawFirmKPIs({
  totalLawFirms,
  totalOpenAR,
  totalCases,
  avgCollectionRate,
  totalAtRiskAR,
  totalActiveLitigationAR,
  loading,
}: LawFirmKPIsProps) {
  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="bg-white rounded-lg border border-brand-neutral-40 p-6 animate-pulse">
            <div className="h-4 bg-brand-neutral-20 rounded w-1/2 mb-4"></div>
            <div className="h-8 bg-brand-neutral-20 rounded w-3/4"></div>
          </div>
        ))}
      </div>
    );
  }

  const kpis = [
    {
      title: 'Active Law Firms',
      value: formatNumber(totalLawFirms),
      subtitle: `${formatCurrency(totalOpenAR)} total AR`,
      icon: <Building2 className="w-5 h-5" />,
      iconBg: 'bg-semantic-info-light',
      iconColor: 'text-semantic-info',
      borderColor: 'border-brand-neutral-40',
    },
    {
      title: 'Active Litigation',
      value: formatCurrency(totalActiveLitigationAR),
      subtitle: `${Math.round((totalActiveLitigationAR / totalOpenAR) * 100)}% of total AR`,
      icon: <Scale className="w-5 h-5" />,
      iconBg: 'bg-purple-100',
      iconColor: 'text-purple-600',
      borderColor: 'border-brand-neutral-40',
    },
    {
      title: 'Avg Collection Rate',
      value: formatPercentage(avgCollectionRate / 100),
      subtitle: 'Across all active firms',
      icon: <TrendingUp className="w-5 h-5" />,
      iconBg: 'bg-semantic-success-light',
      iconColor: 'text-semantic-success',
      borderColor: 'border-brand-neutral-40',
    },
    {
      title: 'At-Risk AR',
      value: formatCurrency(totalAtRiskAR),
      subtitle: `${Math.round((totalAtRiskAR / totalOpenAR) * 100)}% of total AR`,
      icon: <AlertTriangle className="w-5 h-5" />,
      iconBg: 'bg-semantic-danger-light',
      iconColor: 'text-semantic-danger',
      borderColor: 'border-semantic-danger',
      highlight: true,
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {kpis.map((kpi, index) => (
        <div
          key={index}
          className={`bg-white rounded-lg border ${kpi.borderColor} p-6 ${
            kpi.highlight ? 'shadow-md' : ''
          }`}
        >
          <div className="flex items-center justify-between mb-4">
            <div className={`${kpi.iconBg} ${kpi.iconColor} p-3 rounded-lg`}>{kpi.icon}</div>
          </div>
          <h3 className="text-sm text-brand-neutral-80 mb-1">{kpi.title}</h3>
          <p className="text-2xl font-bold text-brand-neutral-100 mb-1">{kpi.value}</p>
          <p className="text-xs text-brand-neutral-60">{kpi.subtitle}</p>
        </div>
      ))}
    </div>
  );
}
