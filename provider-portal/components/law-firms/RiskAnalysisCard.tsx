'use client';

import { formatCurrency, formatNumber, formatPercentage } from '@/lib/formatters';
import { AlertTriangle, AlertCircle, XCircle } from 'lucide-react';

interface RiskData {
  lawFirmId: string;
  lawFirmName: string;
  noLongerRepresent: { cases: number; ar: number };
  stalePending: { cases: number; ar: number };
  veryOld: { cases: number; ar: number };
  totalAtRiskCases: number;
  totalAtRiskAR: number;
  atRiskPct: number;
  delayedDisbursementCases: number;
  delayedDisbursementAR: number;
  avgDisbursementDelayDays: number;
  riskScore: number;
  riskLevel: string;
  color: string;
}

interface RiskAnalysisCardProps {
  riskData: RiskData[];
  loading?: boolean;
}

export function RiskAnalysisCard({ riskData, loading }: RiskAnalysisCardProps) {
  if (loading) {
    return (
      <div className="bg-white rounded-lg border border-brand-neutral-40 p-6">
        <div className="animate-pulse space-y-4">
          <div className="h-6 bg-brand-neutral-20 rounded w-1/3"></div>
          <div className="h-64 bg-brand-neutral-20 rounded"></div>
        </div>
      </div>
    );
  }

  // Sort by risk score descending
  const sortedRiskData = [...riskData].sort((a, b) => b.riskScore - a.riskScore);
  const highRiskFirms = sortedRiskData.filter((f) => f.riskLevel === 'Critical' || f.riskLevel === 'High');

  // Calculate totals
  const totalAtRiskAR = sortedRiskData.reduce((sum, f) => sum + f.totalAtRiskAR, 0);
  const totalAtRiskCases = sortedRiskData.reduce((sum, f) => sum + f.totalAtRiskCases, 0);

  const getRiskIcon = (level: string) => {
    switch (level) {
      case 'Critical':
        return <XCircle className="w-5 h-5 text-semantic-danger" />;
      case 'High':
        return <AlertTriangle className="w-5 h-5 text-semantic-warning" />;
      case 'Medium':
        return <AlertCircle className="w-5 h-5 text-semantic-info" />;
      default:
        return <AlertCircle className="w-5 h-5 text-brand-neutral-60" />;
    }
  };

  const getRiskBadgeColor = (level: string) => {
    switch (level) {
      case 'Critical':
        return 'bg-semantic-danger-light text-semantic-danger-dark border-semantic-danger';
      case 'High':
        return 'bg-semantic-warning-light text-semantic-warning-dark border-semantic-warning';
      case 'Medium':
        return 'bg-semantic-info-light text-semantic-info-dark border-semantic-info';
      default:
        return 'bg-semantic-success-light text-semantic-success-dark border-semantic-success';
    }
  };

  return (
    <div className="bg-white rounded-lg border border-semantic-danger overflow-hidden">
      <div className="px-6 py-4 bg-semantic-danger-light border-b border-semantic-danger">
        <div className="flex items-center gap-2">
          <AlertTriangle className="w-5 h-5 text-semantic-danger" />
          <h2 className="text-lg font-semibold text-brand-neutral-100">Law Firm Risk Analysis</h2>
        </div>
        <p className="text-sm text-brand-neutral-80 mt-1">
          Firms with high write-off risk or performance concerns
        </p>
      </div>

      <div className="p-6">
        {/* Summary Cards */}
        <div className="grid grid-cols-3 gap-4 mb-6">
          <div className="bg-white border border-semantic-danger rounded-lg p-4">
            <div className="flex items-center gap-2 mb-2">
              <XCircle className="w-4 h-4 text-semantic-danger" />
              <span className="text-xs text-brand-neutral-60">Total At-Risk AR</span>
            </div>
            <p className="text-2xl font-bold text-semantic-danger">{formatCurrency(totalAtRiskAR)}</p>
            <p className="text-xs text-brand-neutral-60 mt-1">{formatNumber(totalAtRiskCases)} cases</p>
          </div>

          <div className="bg-white border border-semantic-warning rounded-lg p-4">
            <div className="flex items-center gap-2 mb-2">
              <AlertTriangle className="w-4 h-4 text-semantic-warning" />
              <span className="text-xs text-brand-neutral-60">High-Risk Firms</span>
            </div>
            <p className="text-2xl font-bold text-semantic-warning">{highRiskFirms.length}</p>
            <p className="text-xs text-brand-neutral-60 mt-1">
              {formatCurrency(highRiskFirms.reduce((sum, f) => sum + f.totalAtRiskAR, 0))} at risk
            </p>
          </div>

          <div className="bg-white border border-semantic-info rounded-lg p-4">
            <div className="flex items-center gap-2 mb-2">
              <AlertCircle className="w-4 h-4 text-semantic-info" />
              <span className="text-xs text-brand-neutral-60">Avg Risk Score</span>
            </div>
            <p className="text-2xl font-bold text-semantic-info">
              {Math.round(
                sortedRiskData.reduce((sum, f) => sum + f.riskScore, 0) / sortedRiskData.length
              )}
            </p>
            <p className="text-xs text-brand-neutral-60 mt-1">out of 100</p>
          </div>
        </div>

        {/* Risk Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-brand-neutral-20 border-b border-brand-neutral-40">
              <tr>
                <th className="text-left py-3 px-4 font-medium text-brand-neutral-80">Law Firm</th>
                <th className="text-center py-3 px-4 font-medium text-brand-neutral-80">Risk Level</th>
                <th className="text-right py-3 px-4 font-medium text-brand-neutral-80">Risk Score</th>
                <th className="text-right py-3 px-4 font-medium text-brand-neutral-80">At-Risk AR</th>
                <th className="text-right py-3 px-4 font-medium text-brand-neutral-80">At-Risk %</th>
                <th className="text-right py-3 px-4 font-medium text-brand-neutral-80">No Longer Rep</th>
                <th className="text-right py-3 px-4 font-medium text-brand-neutral-80">Stale Pending</th>
              </tr>
            </thead>
            <tbody>
              {sortedRiskData.map((firm) => (
                <tr key={firm.lawFirmId} className="border-b border-brand-neutral-40 hover:bg-brand-neutral-20">
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-2">
                      {getRiskIcon(firm.riskLevel)}
                      <span className="font-medium text-brand-neutral-100">{firm.lawFirmName}</span>
                    </div>
                  </td>
                  <td className="py-3 px-4 text-center">
                    <span
                      className={`inline-flex px-2.5 py-0.5 rounded-full text-xs font-medium border ${getRiskBadgeColor(
                        firm.riskLevel
                      )}`}
                    >
                      {firm.riskLevel}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-right">
                    <div
                      className={`font-medium ${
                        firm.riskScore >= 70
                          ? 'text-semantic-danger'
                          : firm.riskScore >= 50
                          ? 'text-semantic-warning'
                          : firm.riskScore >= 30
                          ? 'text-semantic-info'
                          : 'text-semantic-success'
                      }`}
                    >
                      {Math.round(firm.riskScore)}
                    </div>
                  </td>
                  <td className="py-3 px-4 text-right font-medium text-semantic-danger">
                    {formatCurrency(firm.totalAtRiskAR)}
                  </td>
                  <td className="py-3 px-4 text-right text-brand-neutral-80">
                    {formatPercentage(firm.atRiskPct / 100)}
                  </td>
                  <td className="py-3 px-4 text-right text-brand-neutral-80">
                    <div className="text-xs text-brand-neutral-60">
                      {formatCurrency(firm.noLongerRepresent.ar)}
                    </div>
                    <div className="text-xs text-brand-neutral-60">
                      {firm.noLongerRepresent.cases} cases
                    </div>
                  </td>
                  <td className="py-3 px-4 text-right text-brand-neutral-80">
                    <div className="text-xs text-brand-neutral-60">
                      {formatCurrency(firm.stalePending.ar)}
                    </div>
                    <div className="text-xs text-brand-neutral-60">{firm.stalePending.cases} cases</div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Risk Category Breakdown */}
        <div className="mt-6 pt-4 border-t border-brand-neutral-40">
          <p className="text-sm font-semibold text-brand-neutral-100 mb-3">Risk Category Breakdown</p>
          <div className="grid grid-cols-3 gap-4">
            <div className="bg-semantic-danger-light border border-semantic-danger rounded-lg p-3">
              <p className="text-xs text-brand-neutral-80 mb-1">No Longer Represent</p>
              <p className="text-lg font-bold text-semantic-danger">
                {formatCurrency(
                  sortedRiskData.reduce((sum, f) => sum + f.noLongerRepresent.ar, 0)
                )}
              </p>
              <p className="text-xs text-brand-neutral-60">
                {formatNumber(
                  sortedRiskData.reduce((sum, f) => sum + f.noLongerRepresent.cases, 0)
                )}{' '}
                cases
              </p>
            </div>
            <div className="bg-semantic-warning-light border border-semantic-warning rounded-lg p-3">
              <p className="text-xs text-brand-neutral-80 mb-1">Stale Pending (18+ mo)</p>
              <p className="text-lg font-bold text-semantic-warning">
                {formatCurrency(sortedRiskData.reduce((sum, f) => sum + f.stalePending.ar, 0))}
              </p>
              <p className="text-xs text-brand-neutral-60">
                {formatNumber(sortedRiskData.reduce((sum, f) => sum + f.stalePending.cases, 0))}{' '}
                cases
              </p>
            </div>
            <div className="bg-semantic-info-light border border-semantic-info rounded-lg p-3">
              <p className="text-xs text-brand-neutral-80 mb-1">Very Old Cases (36+ mo)</p>
              <p className="text-lg font-bold text-semantic-info">
                {formatCurrency(sortedRiskData.reduce((sum, f) => sum + f.veryOld.ar, 0))}
              </p>
              <p className="text-xs text-brand-neutral-60">
                {formatNumber(sortedRiskData.reduce((sum, f) => sum + f.veryOld.cases, 0))} cases
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
