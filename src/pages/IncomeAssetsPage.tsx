import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { StatusBar } from '../components/StatusBar';
import { HomeIndicator } from '../components/HomeIndicator';
import { ChevronLeftIcon, PlusIcon } from '../components/Icons';
import { useOnboarding } from '../context/OnboardingContext';
import { buildInitialRows, useIncomeAssets } from '../context/IncomeAssetsContext';
import type { AssetRow, ItemCategory } from '../context/IncomeAssetsContext';
import mixpanel from '../lib/mixpanel';
import './IncomeAssetsPage.css';

// ── Item catalogue ────────────────────────────────────────────────────────

interface SheetItem {
  label: string;
  description?: string; // shown in selection sheet
  category: ItemCategory;
}

const ALL_ITEMS: SheetItem[] = [
  { label: '근로 소득', category: '소득', description: '근로에 대한 대가로 지급받은 소득' },
  { label: '사업 소득', category: '소득', description: '농업, 어업, 도소매업 등 사업으로 얻은 소득' },
  { label: '재산 소득', category: '소득', description: '임대, 이자, 연금 등으로 발생한 소득' },
  { label: '기타 소득', category: '소득', description: '공적이전소득 및 사적이전소득' },
  { label: '예금', category: '금융 재산' },
  { label: '적금', category: '금융 재산' },
  { label: '주식', category: '금융 재산' },
  { label: '어음', category: '금융 재산' },
  { label: '국공채', category: '금융 재산' },
  { label: '보험', category: '금융 재산' },
  { label: '현금', category: '금융 재산' },
  { label: '수익증권', category: '금융 재산' },
  { label: '주거용 재산', category: '일반 재산', description: '주택, 보증금 등 거주를 목적으로 하는 재산' },
  { label: '건축물', category: '일반 재산', description: '주거 목적 외의 주택, 건물, 시설' },
  { label: '토지', category: '일반 재산', description: '시가 표준액 기준 토지 재산' },
  { label: '임차보증금', category: '일반 재산', description: '주거 목적 외의 보증금' },
  { label: '기타 재산', category: '일반 재산', description: '선박, 항공기, 회원권, 입주권, 분양권 등' },
  { label: '자동차', category: '일반 재산', description: '차량의 종류 및 옵션에 따른 차량가액' },
];

// Input sheet descriptions (shown when entering/editing amount)
const INPUT_INFO: Record<string, { desc: string; note?: string }> = {
  '근로 소득': { desc: '근로에 대한 대가로 지급받은\n이번 달 소득을 입력해주세요', note: '*일용직근로, 자활근로, 공공일자리 근로 포함' },
  '사업 소득': { desc: '농업, 어업, 임업, 도소매업 등\n사업으로 얻은 소득을 입력해주세요' },
  '재산 소득': { desc: '임대, 이자, 연금 등으로\n발생한 소득을 입력해주세요' },
  '기타 소득': { desc: '공적이전소득 및\n사적이전소득을 입력해주세요' },
  '예금': { desc: '금융기관에 예치한\n예금 금액을 입력해주세요' },
  '적금': { desc: '금융기관에 가입한\n적금 금액을 입력해주세요' },
  '주식': { desc: '보유한 주식의\n현재 가치를 입력해주세요' },
  '어음': { desc: '보유한 어음의\n금액을 입력해주세요' },
  '국공채': { desc: '보유한 국공채의\n금액을 입력해주세요' },
  '보험': { desc: '보험의 해약환급금 또는\n가입금액을 입력해주세요' },
  '현금': { desc: '보유한 현금의\n금액을 입력해주세요' },
  '수익증권': { desc: '보유한 수익증권의\n금액을 입력해주세요' },
  '주거용 재산': { desc: '거주 중인 주택, 아파트의 가격(보유 시)\n또는 전세금을 입력해주세요' },
  '건축물': { desc: '주거 목적 외의 주택,\n건물, 시설 금액을 입력해주세요' },
  '토지': { desc: '시가 표준액 기준\n토지 재산을 입력해주세요' },
  '임차보증금': { desc: '주거 목적 외의\n보증금을 입력해주세요' },
  '기타 재산': { desc: '선박, 항공기, 회원권 등\n기타 재산을 입력해주세요' },
  '자동차': { desc: '차량의 종류 및 옵션에 따른\n차량가액을 입력해주세요' },
};

const CATEGORY_ORDER: ItemCategory[] = ['소득', '금융 재산', '일반 재산'];

// ── Helpers ───────────────────────────────────────────────────────────────

function fmt(n: number) {
  return n.toLocaleString('ko-KR') + '원';
}

// ── Input bottom sheet (amount entry / edit) ──────────────────────────────

function InputSheet({
  label,
  initialAmount,
  mode,
  onConfirm,
  onDelete,
  onClose,
}: {
  label: string;
  initialAmount: number;
  mode: 'add' | 'edit';
  onConfirm: (amount: number) => void;
  onDelete?: () => void;
  onClose: () => void;
}) {
  const info = INPUT_INFO[label] ?? { desc: '금액을 입력해주세요' };
  const [raw, setRaw] = useState(
    initialAmount > 0 ? initialAmount.toLocaleString('ko-KR') : '',
  );
  const parsed = parseInt(raw.replace(/[^0-9]/g, ''), 10) || 0;

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const digits = e.target.value.replace(/[^0-9]/g, '');
    const n = parseInt(digits, 10);
    setRaw(isNaN(n) || n === 0 ? '' : n.toLocaleString('ko-KR'));
  }

  const hasNote = Boolean(info.note);

  return (
    <>
      <div className="bs-overlay" onClick={onClose} />
      <div className={`bs2${hasNote ? ' bs2--with-note' : ''}`}>
        <div className="bs2__handle" />
        <p className="bs2__title">{label}</p>
        <p className="bs2__desc">{info.desc}</p>
        {info.note && <p className="bs2__note">{info.note}</p>}
        <div className="bs2__field">
          <input
            className="bs2__field-input"
            type="text"
            inputMode="numeric"
            placeholder="금액을 입력해주세요"
            value={raw}
            onChange={handleChange}
            autoFocus
          />
          {raw && <span className="bs2__field-unit">원</span>}
        </div>
        {mode === 'add' ? (
          <button
            type="button"
            className={`bs2__btn-single${parsed === 0 ? ' bs2__btn--disabled' : ''}`}
            disabled={parsed === 0}
            onClick={() => onConfirm(parsed)}
          >
            완료
          </button>
        ) : (
          <div className="bs2__actions">
            <button type="button" className="bs2__btn-delete" onClick={onDelete}>
              항목 삭제
            </button>
            <button
              type="button"
              className={`bs2__btn-confirm${parsed === 0 ? ' bs2__btn--disabled' : ''}`}
              disabled={parsed === 0}
              onClick={() => onConfirm(parsed)}
            >
              완료
            </button>
          </div>
        )}
      </div>
    </>
  );
}

// ── Main page ─────────────────────────────────────────────────────────────

type SheetState =
  | { mode: 'select' }
  | { mode: 'add'; item: SheetItem }
  | { mode: 'edit'; row: AssetRow }
  | null;

export function IncomeAssetsPage() {
  const navigate = useNavigate();
  const { data: onboardingData } = useOnboarding();
  const { rows, initRows, addRow, updateAmount, deleteRow } = useIncomeAssets();

  const [sheet, setSheet] = useState<SheetState>(null);

  // Seed from onboarding data once if context is empty
  useEffect(() => {
    if (rows.length === 0 && onboardingData) {
      initRows(buildInitialRows(onboardingData));
    }
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const existingLabels = new Set(rows.map((r) => r.label));
  const availableItems = ALL_ITEMS.filter((item) => !existingLabels.has(item.label));
  const availableCategories = CATEGORY_ORDER.filter((cat) =>
    availableItems.some((item) => item.category === cat),
  );

  function handleSelectItem(item: SheetItem) {
    mixpanel.track('income_asset_item_selected', { label: item.label, category: item.category });
    setSheet({ mode: 'add', item });
  }

  function handleConfirmAdd(amount: number) {
    if (sheet?.mode !== 'add') return;
    mixpanel.track('income_asset_item_added', { label: sheet.item.label, category: sheet.item.category, amount });
    addRow({ label: sheet.item.label, amount, category: sheet.item.category });
    setSheet(null);
  }

  function handleConfirmEdit(amount: number) {
    if (sheet?.mode !== 'edit') return;
    mixpanel.track('income_asset_item_updated', { label: sheet.row.label, amount });
    updateAmount(sheet.row.label, amount);
    setSheet(null);
  }

  function handleDelete() {
    if (sheet?.mode !== 'edit') return;
    mixpanel.track('income_asset_item_deleted', { label: sheet.row.label });
    deleteRow(sheet.row.label);
    setSheet(null);
  }

  return (
    <div className="phone-frame">
      <StatusBar />

      <main className="income-page">
        <header className="income-page__header">
          <button type="button" className="income-page__back" onClick={() => navigate('/')}>
            <ChevronLeftIcon />
          </button>
          <h1 className="income-page__title">이번 달 소득 및 재산</h1>
          <p className="income-page__subtitle">항목을 클릭해 소득 및 재산의 변화를 반영해주세요</p>
        </header>

        {CATEGORY_ORDER.map((cat) => {
          const catRows = rows.filter((r) => r.category === cat);
          if (catRows.length === 0) return null;
          return (
            <section key={cat} className="income-page__section">
              <h2 className="income-page__section-title">{cat}</h2>
              {catRows.map((row) => (
                <button
                  key={row.label}
                  type="button"
                  className="income-page__row"
                  onClick={() => { mixpanel.track('income_asset_item_edit_opened', { label: row.label, category: row.category }); setSheet({ mode: 'edit', row }); }}
                >
                  <span>{row.label}</span>
                  <span>{fmt(row.amount)}</span>
                </button>
              ))}
            </section>
          );
        })}

        <button
          type="button"
          className="income-page__add-btn"
          aria-label="항목 추가"
          onClick={() => { mixpanel.track('income_asset_add_opened'); setSheet({ mode: 'select' }); }}
        >
          <PlusIcon />
        </button>
      </main>

      {/* ── Selection sheet (항목 목록) ── */}
      {sheet?.mode === 'select' && (
        <>
          <div className="bs-overlay" onClick={() => setSheet(null)} />
          <div className="bs" role="dialog" aria-label="항목 추가">
            <div className="bs__handle" />
            <div className="bs__scroll">
              {availableCategories.length === 0 ? (
                <p className="bs__empty">추가할 수 있는 항목이 없어요</p>
              ) : (
                availableCategories.map((cat, idx) => (
                  <div key={cat}>
                    {idx > 0 && <div className="bs__divider" />}
                    <p className="bs__section-title">{cat}</p>
                    {availableItems
                      .filter((item) => item.category === cat)
                      .map((item) => (
                        <button
                          key={item.label}
                          type="button"
                          className="bs__item"
                          onClick={() => handleSelectItem(item)}
                        >
                          <span className="bs__item-label">{item.label}</span>
                          {item.description && (
                            <span className="bs__item-desc">{item.description}</span>
                          )}
                        </button>
                      ))}
                  </div>
                ))
              )}
            </div>
          </div>
        </>
      )}

      {/* ── Add amount sheet ── */}
      {sheet?.mode === 'add' && (
        <InputSheet
          label={sheet.item.label}
          initialAmount={0}
          mode="add"
          onConfirm={handleConfirmAdd}
          onClose={() => setSheet(null)}
        />
      )}

      {/* ── Edit / delete sheet ── */}
      {sheet?.mode === 'edit' && (
        <InputSheet
          label={sheet.row.label}
          initialAmount={sheet.row.amount}
          mode="edit"
          onConfirm={handleConfirmEdit}
          onDelete={handleDelete}
          onClose={() => setSheet(null)}
        />
      )}

      <HomeIndicator />
    </div>
  );
}
