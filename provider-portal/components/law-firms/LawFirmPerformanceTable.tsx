'use client';

import { useState } from 'react';
import { formatCurrency, formatPercentage, formatNumber } from '@/lib/formatters';
import { ChevronDown, ChevronUp, Award, AlertTriangle, TrendingUp, TrendingDown } from 'lucide-react';

interface LawFirmPerformance {
  lawFirmId: string;
  lawFirmName: string;
  totalCases: number;
  totalInvoiced: number;
  totalCollected: number;
  totalOpenAR: number;
  collectionRate: number;
  activeLitigationCases: number;
  activeLitigationAR: number;
  atRiskCases: number;
  atRiskAR: number;
  avgCaseAgeDays: number;
  avgDaysToCollection: number;
  performanceGrade: string;
}

interface LawFirmPerformanceTableProps {
  lawFirms: LawFirmPerformance[];
  loading?: boolean;
}

// Grade colors (consistent with design tokens)
const GRADE_COLORS: Record<string, { bg: string; text: string; border: string }> = {
  A: { bg: 'bg-semantic-success-light', text: 'text-semantic-success-dark', border: 'border-semantic-success' },
  B: { bg: 'bg-semantic-info-light', text: 'text-semantic-info-dark', border: 'border-semantic-info' },
  C: { bg: 'bg-brand-neutral-20', text: 'text-brand-neutral-100', border: 'border-brand-neutral-40' },
  D: { bg: 'bg-semantic-warning-light', text: 'text-semantic-warning-dark', border: 'border-semantic-warning' },
  F: { bg: 'bg-semantic-danger-light', text: 'text-semantic-danger-dark', border: 'border-semantic-danger' },
};

type SortField = 'name' | 'cases' | 'openAR' | 'collectionRate' | 'grade' | 'atRiskPct';
type SortDirection = 'asc' | 'desc';

export function LawFirmPerformanceTable({ lawFirms, loading }: LawFirmPerformanceTableProps) {
  const [sortField, setSortField] = useState<SortField>('openAR');
  const [sortDirection, setSortDirection] = useState<SortDirection>('desc');
  const [expandedFirm, setExpandedFirm] = useState<string | null>(null);

  if (loading) {
    return (
      <div className="bg-white rounded-lg border border-brand-neutral-40 p-6">
        <div className="animate-pulse space-y-4">
          <div className="h-6 bg-brand-neutral-20 rounded w-1/4"></div>
          <div className="h-64 bg-brand-neutral-20 rounded"></div>
        </div>
      </div>
    );
  }

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('desc');
    }
  };

  const sortedLawFirms = [...lawFirms].sort((a, b) => {
    let aVal: any;
    let bVal: any;

    switch (sortField) {
      case 'name':
        aVal = a.lawFirmName;
        bVal = b.lawFirmName;
        break;
      case 'cases':
        aVal = a.totalCases;
        bVal = b.totalCases;
        break;
      case 'openAR':
        aVal = a.totalOpenAR;
        bVal = b.totalOpenAR;
        break;
      case 'collectionRate':
        aVal = a.collectionRate;
        bVal = b.collectionRate;
        break;
      case 'grade':
        aVal = a.performanceGrade;
        bVal = b.performanceGrade;
        break;
      case 'atRiskPct':
        aVal = a.totalOpenAR > 0 ? (a.atRiskAR / a.totalOpenAR) * 100 : 0;
        bVal = b.totalOpenAR > 0 ? (b.atRiskAR / b.totalOpenAR) * 100 : 0;
        break;
      default:
        aVal = a.totalOpenAR;
        bVal = b.totalOpenAR;
    }

    if (typeof aVal === 'string') {
      return sortDirection === 'asc'
        ? aVal.localeCompare(bVal)
        : bVal.localeCompare(aVal);
    }

    return sortDirection === 'asc' ? aVal - bVal : bVal - aVal;
  });

  const SortIcon = ({ field }: { field: SortField }) => {
    if (sortField !== field) return null;
    return sortDirection === 'asc' ? (
      <ChevronUp className="w-4 h-4 inline ml-1" />
    ) : (
      <ChevronDown className="w-4 h-4 inline ml-1" />
    );
  };

  return (
    <div className="bg-white rounded-lg border border-brand-neutral-40 overflow-hidden">
      <div className="px-6 py-4 border-b border-brand-neutral-40">
        <h2 className="text-lg font-semibold text-brand-neutral-100">Law Firm Performance Summary</h2>
        <p className="text-sm text-brand-neutral-60 mt-1">
          PI-specific performance metrics ranked by open AR
        </p>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-brand-neutral-20 border-b border-brand-neutral-40">
            <tr>
              <th
                className="text-left py-3 px-6 font-medium text-brand-neutral-80 cursor-pointer hover:bg-brand-neutral-40 w-64"
                onClick={() => handleSort('name')}
              >
                Law Firm <SortIcon field="name" />
              </th>
              <th
                className="text-center py-3 px-4 font-medium text-brand-neutral-80 cursor-pointer hover:bg-brand-neutral-40 w-20"
                onClick={() => handleSort('grade')}
              >
                Grade <SortIcon field="grade" />
              </th>
              <th
                className="text-right py-3 px-4 font-medium text-brand-neutral-80 cursor-pointer hover:bg-brand-neutral-40 w-32"
                onClick={() => handleSort('openAR')}
              >
                Open AR <SortIcon field="openAR" />
              </th>
              <th
                className="text-right py-3 px-4 font-medium text-brand-neutral-80 cursor-pointer hover:bg-brand-neutral-40 w-20"
                onClick={() => handleSort('cases')}
              >
                Cases <SortIcon field="cases" />
              </th>
              <th
                className="text-right py-3 px-4 font-medium text-brand-neutral-80 cursor-pointer hover:bg-brand-neutral-40 w-28"
                onClick={() => handleSort('collectionRate')}
              >
                Coll. Rate <SortIcon field="collectionRate" />
              </th>
              <th className="text-right py-3 px-4 font-medium text-brand-neutral-80 w-32">Active Litigation</th>
              <th
                className="text-right py-3 px-4 font-medium text-brand-neutral-80 cursor-pointer hover:bg-brand-neutral-40 w-24"
                onClick={() => handleSort('atRiskPct')}
              >
                At-Risk % <SortIcon field="atRiskPct" />
              </th>
              <th className="text-right py-3 px-4 font-medium text-brand-neutral-80 w-24">Avg Age</th>
            </tr>
          </thead>
          <tbody>
            {sortedLawFirms.map((firm) => {
              const atRiskPct =
                firm.totalOpenAR > 0 ? (firm.atRiskAR / firm.totalOpenAR) * 100 : 0;
              const gradeStyle = GRADE_COLORS[firm.performanceGrade] || GRADE_COLORS.C;
              const isExpanded = expandedFirm === firm.lawFirmId;

              return (
                <>
                  <tr
                    key={firm.lawFirmId}
                    className="border-b border-brand-neutral-40 hover:bg-brand-neutral-20 cursor-pointer"
                    onClick={() =>
                      setExpandedFirm(isExpanded ? null : firm.lawFirmId)
                    }
                  >
                    <td className="py-3 px-6">
                      <div className="flex items-center gap-2">
                        <span className="font-medium text-brand-neutral-100">{firm.lawFirmName}</span>
                        {isExpanded ? (
                          <ChevronUp className="w-4 h-4 text-brand-neutral-60" />
                        ) : (
                          <ChevronDown className="w-4 h-4 text-brand-neutral-60" />
                        )}
                      </div>
                    </td>
                    <td className="py-3 px-4 text-center">
                      <span
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${gradeStyle.bg} ${gradeStyle.text} ${gradeStyle.border}`}
                      >
                        {firm.performanceGrade === 'A' && <Award className="w-3 h-3 mr-1" />}
                        {firm.performanceGrade}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-right font-medium text-brand-neutral-100">
                      {formatCurrency(firm.totalOpenAR)}
                    </td>
                    <td className="py-3 px-4 text-right text-brand-neutral-80">
                      {formatNumber(firm.totalCases)}
                    </td>
                    <td className="py-3 px-4 text-right text-brand-neutral-80">
                      {formatPercentage(firm.collectionRate / 100)}
                    </td>
                    <td className="py-3 px-4 text-right text-brand-neutral-80">
                      <div>{formatCurrency(firm.activeLitigationAR)}</div>
                      <div className="text-xs text-brand-neutral-60">
                        {formatNumber(firm.activeLitigationCases)} cases
                      </div>
                    </td>
                    <td className="py-3 px-4 text-right">
                      <div className="flex items-center justify-end gap-1">
                        {atRiskPct > 30 && <AlertTriangle className="w-4 h-4 text-semantic-danger" />}
                        <span
                          className={
                            atRiskPct > 30
                              ? 'text-semantic-danger font-medium'
                              : atRiskPct > 20
                              ? 'text-semantic-warning'
                              : 'text-brand-neutral-80'
                          }
                        >
                          {formatPercentage(atRiskPct / 100)}
                        </span>
                      </div>
                    </td>
                    <td className="py-3 px-4 text-right text-brand-neutral-80">
                      {Math.round(firm.avgCaseAgeDays / 30)} mo
                    </td>
                  </tr>

                  {/* Expanded Row with Additional Details */}
                  {isExpanded && (
                    <tr className="bg-brand-neutral-20 border-b border-brand-neutral-40">
                      <td colSpan={8} className="py-3 px-6">
                        <div className="grid grid-cols-4 gap-6">
                          <div className="flex flex-col">
                            <span className="text-xs text-brand-neutral-60">Total Invoiced</span>
                            <span className="text-sm font-semibold text-brand-neutral-100 mt-1">
                              {formatCurrency(firm.totalInvoiced)}
                            </span>
                          </div>
                          <div className="flex flex-col">
                            <span className="text-xs text-brand-neutral-60">Total Collected</span>
                            <span className="text-sm font-semibold text-brand-neutral-100 mt-1">
                              {formatCurrency(firm.totalCollected)}
                            </span>
                          </div>
                          <div className="flex flex-col">
                            <span className="text-xs text-brand-neutral-60">Avg Days to Collection</span>
                            <span className="text-sm font-semibold text-brand-neutral-100 mt-1">
                              {Math.round(firm.avgDaysToCollection)} days
                            </span>
                          </div>
                          <div className="flex flex-col">
                            <span className="text-xs text-brand-neutral-60">At-Risk AR</span>
                            <span className="text-sm font-semibold text-semantic-danger mt-1">
                              {formatCurrency(firm.atRiskAR)}
                              <span className="text-xs text-brand-neutral-60 font-normal ml-1">
                                ({formatNumber(firm.atRiskCases)} cases)
                              </span>
                            </span>
                          </div>
                        </div>
                      </td>
                    </tr>
                  )}
                </>
              );
            })}
          </tbody>
          <tfoot className="border-t-2 border-brand-neutral-40 bg-brand-neutral-20 font-semibold">
            <tr>
              <td className="py-3 px-6 text-brand-neutral-100">Total ({lawFirms.length} firms)</td>
              <td className="py-3 px-4"></td>
              <td className="py-3 px-4 text-right text-brand-neutral-100">
                {formatCurrency(lawFirms.reduce((sum, f) => sum + f.totalOpenAR, 0))}
              </td>
              <td className="py-3 px-4 text-right text-brand-neutral-100">
                {formatNumber(lawFirms.reduce((sum, f) => sum + f.totalCases, 0))}
              </td>
              <td className="py-3 px-4 text-right text-brand-neutral-100">
                {formatPercentage(
                  lawFirms.reduce((sum, f) => sum + f.totalCollected, 0) /
                    lawFirms.reduce((sum, f) => sum + f.totalInvoiced, 0)
                )}
              </td>
              <td className="py-3 px-4"></td>
              <td className="py-3 px-4"></td>
              <td className="py-3 px-4"></td>
            </tr>
          </tfoot>
        </table>
      </div>
    </div>
  );
}
