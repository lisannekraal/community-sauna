import { colors } from '@/lib/design-tokens';

interface StatTileProps {
  label: string;
  value: string | number;
}

export function StatTile({ label, value }: StatTileProps) {
  return (
    <div className={`border-2 ${colors.borderPrimary} p-2`}>
      <div className={`text-xs ${colors.textMuted}`}>{label}</div>
      <div className="text-xl font-mono mt-0.5">{value}</div>
    </div>
  );
}
