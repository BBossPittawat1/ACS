import type { ReactNode } from 'react';

interface StatCardProps {
  title: string;
  count: number;
  icon: ReactNode;
  colorClass: string;
}

export function StatCard({ title, count, icon, colorClass }: StatCardProps) {
  return (
    <div
      className={`card border shadow-sm transition-transform hover:scale-105 ${colorClass}`}
    >
      <div className="card-body items-center p-4 text-center">
        <div className="mb-1 rounded-full bg-base-100/50 p-2">{icon}</div>
        <p className="text-2xl font-bold">{count}</p>
        <p className="text-xs font-medium opacity-80">{title}</p>
      </div>
    </div>
  );
}

interface ProgressBarProps {
  label: string;
  percent: number;
  colorClass?: string;
}

export function ProgressBar({
  label,
  percent,
  colorClass = 'bg-primary',
}: ProgressBarProps) {
  return (
    <div>
      <div className="mb-2 flex justify-between text-sm font-medium text-base-content/70">
        <span>{label}</span>
        <span>{percent}%</span>
      </div>
      <div className="h-3 w-full overflow-hidden rounded-full border border-primary/10 bg-base-200">
        <div
          className={`h-full rounded-full transition-all duration-1000 ease-out ${colorClass}`}
          style={{ width: `${percent}%` }}
        />
      </div>
    </div>
  );
}
