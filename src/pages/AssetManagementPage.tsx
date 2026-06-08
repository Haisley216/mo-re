import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { StatusBar } from '../components/StatusBar';
import { HomeIndicator } from '../components/HomeIndicator';
import { BankIcon, BriefcaseIcon, HamburgerIcon, HouseIcon, WonIcon } from '../components/Icons';
import { formatCurrency, monthData, monthOrder, type MonthKey } from '../data/monthlyData';
import { buildInitialRows, useIncomeAssets } from '../context/IncomeAssetsContext';
import { useOnboarding } from '../context/OnboardingContext';
import './AssetManagementPage.css';

const CURRENT_MONTH = new Date().getMonth() + 1;

export function AssetManagementPage() {
  const navigate = useNavigate();
  const { data: onboardingData } = useOnboarding();
  const { rows, initRows } = useIncomeAssets();
  const [selectedMonth, setSelectedMonth] = useState<MonthKey>('4');

  // Seed income/assets from onboarding data if context is still empty (same-session flow)
  useEffect(() => {
    if (rows.length === 0 && onboardingData) {
      const seeded = buildInitialRows(onboardingData);
      if (seeded.length > 0) initRows(seeded);
    }
  }, []); // eslint-disable-line react-hooks/exhaustive-deps
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const menuBtnRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!menuOpen) return;

    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Node;
      if (
        menuRef.current?.contains(target) ||
        menuBtnRef.current?.contains(target)
      ) {
        return;
      }
      setMenuOpen(false);
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [menuOpen]);

  const report = monthData[selectedMonth];
  const maxChartHeight = 58;

  // Derived totals from shared IncomeAssetsContext
  const earnedIncome = rows.find((r) => r.label === '근로 소득')?.amount ?? 0;
  const otherIncome = rows
    .filter((r) => r.category === '소득' && r.label !== '근로 소득')
    .reduce((sum, r) => sum + r.amount, 0);
  const financialAssets = rows
    .filter((r) => r.category === '금융 재산')
    .reduce((sum, r) => sum + r.amount, 0);
  const generalAssets = rows
    .filter((r) => r.category === '일반 재산')
    .reduce((sum, r) => sum + r.amount, 0);

  const incomeTotal = earnedIncome + otherIncome;

  const breakdownItems = [
    { key: 'income', icon: <WonIcon />, label: '소득', value: incomeTotal },
    { key: 'financial', icon: <BankIcon />, label: '금융 재산', value: financialAssets },
    { key: 'general', icon: <HouseIcon />, label: '일반 재산', value: generalAssets },
  ].filter((item) => item.value > 0);

  const totalIncome = Math.round(
    earnedIncome * 0.7 +
    otherIncome +
    financialAssets * (6.26 / 100 / 12) +
    generalAssets * (4.17 / 100 / 12),
  );

  const BENEFIT_THRESHOLD = 820_000;
  const remaining = BENEFIT_THRESHOLD - totalIncome;

  return (
    <div className="phone-frame">
      <StatusBar />

      <main className="asset-page">
        <header className="asset-page__header">
          <h1 className="asset-page__title">자산 관리</h1>
          <button
            type="button"
            ref={menuBtnRef}
            className="asset-page__menu-btn"
            aria-label="메뉴 열기"
            aria-expanded={menuOpen}
            onClick={() => setMenuOpen((open) => !open)}
          >
            <HamburgerIcon />
          </button>
        </header>

        {menuOpen && (
          <div ref={menuRef} className="asset-page__menu" role="menu">
            <button type="button" role="menuitem" onClick={() => setMenuOpen(false)}>
              홈
            </button>
            <button type="button" role="menuitem" onClick={() => setMenuOpen(false)}>
              설정
            </button>
          </div>
        )}

        <section className="asset-page__summary">
          <p className="asset-page__month-label">{CURRENT_MONTH}월 소득인정액</p>
          <p className="asset-page__amount">{formatCurrency(totalIncome)}</p>
          {remaining > 0 ? (
            <p className="asset-page__hint">
              앞으로 약{' '}
              <span className="asset-page__highlight">
                {Math.round(remaining / 10000)}만원
              </span>
              의 소득인정액까지 생계급여가 보장돼요
            </p>
          ) : (
            <p className="asset-page__hint">
              현재 소득인정액이 생계급여 기준을 초과하고 있어요
            </p>
          )}

          <div className="asset-page__progress" aria-hidden="true">
            <div className="asset-page__progress-track">
              <div className="asset-page__progress-fill asset-page__progress-fill--pink" />
              <div className="asset-page__progress-fill asset-page__progress-fill--orange" />
              <div className="asset-page__progress-fill asset-page__progress-fill--yellow" />
            </div>
          </div>

          {breakdownItems.length > 0 ? (
            <ul className="asset-page__breakdown">
              {breakdownItems.map((item) => (
                <li key={item.key}>
                  {item.icon}
                  <span>{item.label}</span>
                  <span className="asset-page__breakdown-value">{formatCurrency(item.value)}</span>
                </li>
              ))}
            </ul>
          ) : (
            <p className="asset-page__hint" style={{ marginBottom: 14 }}>입력된 소득 및 재산 정보가 없어요</p>
          )}

          <p className="asset-page__footnote">*생계급여 820,556원 기준</p>

          <button
            type="button"
            className="asset-page__cta"
            onClick={() => navigate('/income-assets')}
          >
            이번 달 소득 및 재산의 변화가 예상되시나요?
          </button>
        </section>

        <section className="asset-page__trend">
          <h2 className="asset-page__section-title">나의 소득인정액 추이</h2>

          <div className="asset-page__chart" role="group" aria-label="월별 소득인정액 차트">
            <div className="asset-page__chart-bars">
              {monthOrder.map((month) => {
                const mdata = monthData[month];
                const isSelected = selectedMonth === month;

                return (
                  <button
                    key={month}
                    type="button"
                    className={`asset-page__chart-item${isSelected ? ' asset-page__chart-item--selected' : ''}`}
                    aria-pressed={isSelected}
                    aria-label={`${mdata.label} ${mdata.chartValueLabel}`}
                    onClick={() => setSelectedMonth(month)}
                  >
                    <span className="asset-page__chart-value">{mdata.chartValueLabel}</span>
                    <span
                      className="asset-page__chart-bar"
                      style={{ height: `${(mdata.chartHeight / maxChartHeight) * 55}px` }}
                    />
                  </button>
                );
              })}
            </div>
            <div className="asset-page__chart-baseline" />
            <div className="asset-page__chart-labels">
              {monthOrder.map((month) => {
                const mdata = monthData[month];
                const isSelected = selectedMonth === month;

                return (
                  <span
                    key={month}
                    className={`asset-page__chart-label${isSelected ? ' asset-page__chart-label--selected' : ''}`}
                  >
                    {mdata.label}
                  </span>
                );
              })}
            </div>
          </div>
        </section>

        <section className="asset-page__report" aria-live="polite">
          <h3 className="asset-page__report-title">{report.reportTitle}</h3>
          <p className="asset-page__report-summary">{report.summary}</p>

          <div className="asset-page__composition">
            <p className="asset-page__composition-title">소득인정액 구성</p>

            <div className="asset-page__composition-row">
              <span>근로 소득</span>
              <span className="asset-page__composition-amount">{formatCurrency(report.composition.earnedIncome)}</span>
              <span>소득평가액</span>
              <span className="asset-page__composition-amount">{formatCurrency(report.composition.earnedIncomeAssessment)}</span>
            </div>
            <div className="asset-page__composition-divider" />

            <div className="asset-page__composition-row">
              <span>금융 재산</span>
              <span className="asset-page__composition-amount">{formatCurrency(report.composition.financialAssets)}</span>
              <span>금융재산환산액</span>
              <span className="asset-page__composition-amount">{formatCurrency(report.composition.financialConversion)}</span>
            </div>
            <div className="asset-page__composition-divider" />

            <div className="asset-page__composition-row">
              <span>일반 재산</span>
              <span className="asset-page__composition-amount">{formatCurrency(report.composition.generalAssets)}</span>
              <span>일반재산환산액</span>
              <span className="asset-page__composition-amount">{formatCurrency(report.composition.generalConversion)}</span>
            </div>
          </div>
        </section>
      </main>

      <HomeIndicator />
    </div>
  );
}
