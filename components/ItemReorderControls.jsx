import { CaretUpIcon, CaretDownIcon } from "@phosphor-icons/react";
import { Button } from "@/components/ui/button";

export default function ItemReorderControls({
  index,
  totalCount,
  onMoveUp,
  onMoveDown,
}) {
  if (totalCount <= 1) return null;

  const isFirst = index === 0;
  const isLast = index === totalCount - 1;

  return (
    <div className="flex items-center">
      <Button
        type="button"
        variant="ghost"
        size="icon-xs"
        disabled={isFirst}
        aria-label="Move up"
        onClick={onMoveUp}
      >
        <CaretUpIcon size={14} />
      </Button>
      <Button
        type="button"
        variant="ghost"
        size="icon-xs"
        disabled={isLast}
        aria-label="Move down"
        onClick={onMoveDown}
      >
        <CaretDownIcon size={14} />
      </Button>
    </div>
  );
}
