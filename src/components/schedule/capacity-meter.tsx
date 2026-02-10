interface CapacityMeterProps {
  booked: number;
  capacity: number;
  size?: 'sm' | 'lg';
}

export function CapacityMeter({ booked, capacity, size = 'sm' }: CapacityMeterProps) {
  const dotClass = size === 'lg'
    ? 'w-[14px] h-[14px] border-2'
    : 'w-[10px] h-[10px] border';

  const gap = size === 'lg' ? 'gap-[4px]' : 'gap-[3px]';

  return (
    <div className={`flex ${gap}`} aria-label={`${booked} of ${capacity} spots booked`}>
      {Array.from({ length: capacity }, (_, i) => (
        <div
          key={i}
          className={`${dotClass} rounded-full border-current ${
            i < booked ? 'bg-current' : ''
          }`}
        />
      ))}
    </div>
  );
}
