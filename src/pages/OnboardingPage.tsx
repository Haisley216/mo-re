import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { StatusBar } from '../components/StatusBar';
import { HomeIndicator } from '../components/HomeIndicator';
import { ChevronLeftIcon } from '../components/Icons';
import { useOnboarding } from '../context/OnboardingContext';
import mixpanel from '../lib/mixpanel';
import './OnboardingPage.css';

const TOTAL_DOTS = 7;

const HOUSEHOLD_OPTIONS = ['1인 가구', '2인 가구', '3인 가구', '4인 가구', '5인 가구', '6인 가구'];
const REGION_OPTIONS = ['서울', '경기', '광역·세종·창원', '그 외'];


function formatAmount(n: number): string {
  if (n === 0) return '';
  return n.toLocaleString('ko-KR');
}

function Dots({ activeIndex }: { activeIndex: number }) {
  return (
    <div className="ob-dots">
      {Array.from({ length: TOTAL_DOTS }).map((_, i) => (
        <span key={i} className={`ob-dot${i === activeIndex ? ' ob-dot--active' : ''}`} />
      ))}
    </div>
  );
}

export function OnboardingPage() {
  const navigate = useNavigate();
  const { complete } = useOnboarding();

  const [step, setStep] = useState(0);
  const [householdSize, setHouseholdSize] = useState<number | null>(null);
  const [region, setRegion] = useState<string | null>(null);
  const [age, setAge] = useState('');
  const [earnedIncome, setEarnedIncome] = useState(0);
  const [businessIncome, setBusinessIncome] = useState(0);
  const [financialAssets, setFinancialAssets] = useState(0);
  const [residentialProperty, setResidentialProperty] = useState(0);

  useEffect(() => {
    if (step !== 9) return;
    const timer = setTimeout(() => {
      complete({
        householdSize: householdSize ?? 1,
        region: region ?? '그 외',
        age: parseInt(age) || 0,
        earnedIncome,
        businessIncome,
        financialAssets,
        residentialProperty,
      });
      navigate('/');
    }, 2200);
    return () => clearTimeout(timer);
  }, [step]);

  function handleAmountChange(setter: (n: number) => void, raw: string) {
    setter(parseInt(raw.replace(/[^0-9]/g, ''), 10) || 0);
  }

  // ── Step 0: Welcome ──────────────────────────────────────────────────────
  if (step === 0) {
    return (
      <div className="phone-frame">
        <StatusBar />
        <div className="ob-welcome">
          <div className="ob-welcome__body">
            <h1 className="ob-welcome__title">{'복잡한 계산 없이, \n내 수급 상태를 한눈에'}</h1>
            <p className="ob-welcome__sub">
              소득과 재산 정보를 바탕으로<br />이번 달 예상 수급 상태를 확인하고 관리해보세요
            </p>
          </div>
          <button type="button" className="ob-btn ob-btn--primary ob-welcome__cta" onClick={() => { mixpanel.track('onboarding_started'); setStep(1); }}>
            시작하기
          </button>
        </div>
        <HomeIndicator />
      </div>
    );
  }

  // ── Step 9: Loading ──────────────────────────────────────────────────────
  if (step === 9) {
    return (
      <div className="phone-frame">
        <StatusBar />
        <div className="ob-screen ob-screen--loading">
          <div className="ob-loader" />
          <p className="ob-loading-title">
            입력한 정보를 바탕으로<br />이번 달 소득인정액을 예상했어요
          </p>
          <p className="ob-loading-sub">
            추가적인 항목에 대해 정보를 입력하면<br />더욱 정확한 예측이 가능해요
          </p>
        </div>
        <HomeIndicator />
      </div>
    );
  }

  // ── Step 1: Intro ────────────────────────────────────────────────────────
  if (step === 1) {
    return (
      <div className="phone-frame">
        <StatusBar />
        <div className="ob-screen">
          <div className="ob-body">
            <h2 className="ob-title">{'수급 기준 파악을 위해\n몇 가지 정보를 입력해주세요'}</h2>
          </div>
          <div className="ob-footer">
            <button type="button" className="ob-cta" onClick={() => { mixpanel.track('onboarding_step_next', { step: 1, step_name: 'intro' }); setStep(2); }}>다음</button>
          </div>
        </div>
        <HomeIndicator />
      </div>
    );
  }

  // ── Step 2: 가구원 수 ────────────────────────────────────────────────────
  if (step === 2) {
    const disabled = householdSize === null;
    return (
      <div className="phone-frame">
        <StatusBar />
        <div className="ob-screen">
          <button type="button" className="ob-back" onClick={() => setStep(1)} aria-label="뒤로 가기">
            <ChevronLeftIcon />
          </button>
          <div className="ob-body">
            <h2 className="ob-title">가구원 수를 선택해주세요</h2>
            <div className="ob-options">
              {HOUSEHOLD_OPTIONS.map((opt, i) => (
                <button
                  key={opt}
                  type="button"
                  className={`ob-option${householdSize === i + 1 ? ' ob-option--selected' : ''}`}
                  onClick={() => { mixpanel.track('onboarding_option_selected', { field: 'household', value: opt }); setHouseholdSize(i + 1); }}
                >
                  {opt}
                </button>
              ))}
            </div>
          </div>
          <div className="ob-footer">
            <Dots activeIndex={0} />
            <button
              type="button"
              className={`ob-cta${disabled ? ' ob-cta--disabled' : ''}`}
              disabled={disabled}
              onClick={() => { mixpanel.track('onboarding_step_next', { step: 2, step_name: 'household' }); setStep(3); }}
            >
              다음
            </button>
          </div>
        </div>
        <HomeIndicator />
      </div>
    );
  }

  // ── Step 3: 거주 지역 ────────────────────────────────────────────────────
  if (step === 3) {
    const disabled = region === null;
    return (
      <div className="phone-frame">
        <StatusBar />
        <div className="ob-screen">
          <button type="button" className="ob-back" onClick={() => setStep(2)} aria-label="뒤로 가기">
            <ChevronLeftIcon />
          </button>
          <div className="ob-body">
            <h2 className="ob-title">거주 지역을 선택해주세요</h2>
            <div className="ob-options">
              {REGION_OPTIONS.map((opt) => (
                <button
                  key={opt}
                  type="button"
                  className={`ob-option${region === opt ? ' ob-option--selected' : ''}`}
                  onClick={() => { mixpanel.track('onboarding_option_selected', { field: 'region', value: opt }); setRegion(opt); }}
                >
                  {opt}
                </button>
              ))}
            </div>
          </div>
          <div className="ob-footer">
            <Dots activeIndex={1} />
            <button
              type="button"
              className={`ob-cta${disabled ? ' ob-cta--disabled' : ''}`}
              disabled={disabled}
              onClick={() => { mixpanel.track('onboarding_step_next', { step: 3, step_name: 'region' }); setStep(4); }}
            >
              다음
            </button>
          </div>
        </div>
        <HomeIndicator />
      </div>
    );
  }

  // ── Step 4: 만 나이 ──────────────────────────────────────────────────────
  if (step === 4) {
    const disabled = age === '';
    return (
      <div className="phone-frame">
        <StatusBar />
        <div className="ob-screen">
          <button type="button" className="ob-back" onClick={() => setStep(3)} aria-label="뒤로 가기">
            <ChevronLeftIcon />
          </button>
          <div className="ob-body">
            <h2 className="ob-title">만 나이를 입력해주세요</h2>
            <input
              className="ob-input"
              type="text"
              inputMode="numeric"
              placeholder="입력해주세요"
              value={age}
              onChange={(e) => setAge(e.target.value.replace(/[^0-9]/g, ''))}
              autoFocus
            />
          </div>
          <div className="ob-footer">
            <Dots activeIndex={2} />
            <button
              type="button"
              className={`ob-cta${disabled ? ' ob-cta--disabled' : ''}`}
              disabled={disabled}
              onClick={() => { mixpanel.track('onboarding_step_next', { step: 4, step_name: 'age' }); setStep(5); }}
            >
              다음
            </button>
          </div>
        </div>
        <HomeIndicator />
      </div>
    );
  }

  // ── Steps 5–8: 소득 및 재산 입력 ─────────────────────────────────────────
  const INPUT_STEPS = [
    {
      step: 5,
      title: '지난 달 근로 소득을 입력해주세요',
      subtitle: '근로에 대한 대가로 지급받은 총 금액으로,\n일용직근로, 자활근로, 공공일자리도 포함돼요',
      value: earnedIncome,
      setter: setEarnedIncome,
      dotIndex: 3,
    },
    {
      step: 6,
      title: '지난 달 사업 소득을 입력해주세요',
      subtitle: '농업, 임업, 어업, 양식업, 도소매업, 제조업 등\n사업으로 얻은 소득을 말해요',
      value: businessIncome,
      setter: setBusinessIncome,
      dotIndex: 4,
    },
    {
      step: 7,
      title: '지난 달 금융 재산을 입력해주세요',
      subtitle: '예금, 적금, 주식, 현금, 보험 등의 금융 재산을\n모두 합친 금액으로 입력해주세요',
      value: financialAssets,
      setter: setFinancialAssets,
      dotIndex: 5,
    },
    {
      step: 8,
      title: '지난 달 주거용 재산을 입력해주세요',
      subtitle: '거주하고 있는 주택, 아파트의 가격(보유 시)\n혹은 전세금 및 보증금을 입력해주세요',
      value: residentialProperty,
      setter: setResidentialProperty,
      dotIndex: 6,
    },
  ];

  const current = INPUT_STEPS.find((s) => s.step === step)!;
  const nextDisabled = current.value === 0;
  const nextLabel = step === 8 ? '완료' : '다음';

  return (
    <div className="phone-frame">
      <StatusBar />
      <div className="ob-screen">
        <button type="button" className="ob-back" onClick={() => setStep((s) => s - 1)} aria-label="뒤로 가기">
          <ChevronLeftIcon />
        </button>
        <div className="ob-body">
          <h2 className="ob-title">{current.title}</h2>
          <p className="ob-subtitle">{current.subtitle}</p>
          <input
            key={step}
            className="ob-input"
            type="text"
            inputMode="numeric"
            placeholder="입력해주세요"
            value={formatAmount(current.value)}
            onChange={(e) => handleAmountChange(current.setter, e.target.value)}
            autoFocus
          />
        </div>
        <div className="ob-footer">
          <Dots activeIndex={current.dotIndex} />
          <div className="ob-cta-row">
            <button
              type="button"
              className={`ob-cta-row__skip${!nextDisabled ? ' ob-cta-row__skip--disabled' : ''}`}
              disabled={!nextDisabled}
              onClick={() => { mixpanel.track('onboarding_item_skipped', { step, step_name: current.title }); current.setter(0); setStep((s) => s + 1); }}
            >
              해당 없음
            </button>
            <button
              type="button"
              className={`ob-cta-row__next${nextDisabled ? ' ob-cta-row__next--disabled' : ''}`}
              disabled={nextDisabled}
              onClick={() => {
                if (step === 8) {
                  mixpanel.track('onboarding_completed');
                } else {
                  mixpanel.track('onboarding_step_next', { step, step_name: current.title });
                }
                setStep((s) => s + 1);
              }}
            >
              {nextLabel}
            </button>
          </div>
        </div>
      </div>
      <HomeIndicator />
    </div>
  );
}
