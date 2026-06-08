import { FinanceTab } from '@/components/finance/FinanceTab';

export default function FinancePage() {
  return (
    <div className="mx-auto max-w-3xl pb-24 md:pb-6">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-primary drop-shadow-sm">
            ระบบฝากเงิน
          </h1>
          <p className="mt-1 text-sm font-medium text-primary/60">
            จัดการเงินฝากและถอนของนักเรียน
          </p>
        </div>
      </div>
      <FinanceTab />
    </div>
  );
}
