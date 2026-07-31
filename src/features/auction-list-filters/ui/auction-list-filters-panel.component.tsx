import { useMemo } from 'react';
import { observer } from 'mobx-react-lite';
import { SlidersHorizontalIcon } from 'lucide-react';
import { Button, Sheet, SheetContent, SheetHeader, SheetTitle } from '@/shared/ui';
import { AuctionListFiltersPanelStore } from '../model';
import type { TAuctionListFiltersProps } from '../model';
import { AuctionListFilters } from './auction-list-filters.component';
import { cn } from '@/shared/lib';

export const AuctionListFiltersPanel = observer(function AuctionListFiltersPanel(
  props: TAuctionListFiltersProps,
) {
  const store = useMemo(() => new AuctionListFiltersPanelStore(), []);

  return (
    <>
      <div className={cn('hidden md:block', props?.className)}>
        <AuctionListFilters {...props} />
      </div>

      <div className={cn('md:hidden flex justify-end', props?.className)}>
        <Button type="button" variant="outline" onClick={() => store.setOpen(true)}>
          <SlidersHorizontalIcon />
          Фильтры
        </Button>
        <Sheet open={store.isOpen} onOpenChange={(isOpen) => store.setOpen(isOpen)}>
          <SheetContent side="bottom" className="max-h-[90dvh] overflow-y-auto p-0">
            <SheetHeader>
              <SheetTitle>Фильтры</SheetTitle>
            </SheetHeader>
            <AuctionListFilters
              {...props}
              className="rounded-none border-x-0 border-b-0"
              onApply={(filters) => {
                props.onApply(filters);
                store.close();
              }}
              onReset={() => {
                props.onReset();
                store.close();
              }}
            />
          </SheetContent>
        </Sheet>
      </div>
    </>
  );
});
