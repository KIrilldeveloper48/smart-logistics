import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { formatPrice } from '@/entities/auction';
import {
  Button,
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  Input,
} from '@/shared/ui';
import { createAuctionBidFormSchema, getAuctionBidDefaultValues } from '../model';
import type { TAuctionBidFormValues } from '../model';
import type { TAuctionBidFormProps } from './auction-bid-form.types';

export function AuctionBidForm({ auction, isOpen, onOpenChange }: TAuctionBidFormProps) {
  const constraints = {
    auctionType: auction.auctionType,
    canSetBid: auction.canSetBid,
    price: auction.price,
  };
  const form = useForm<TAuctionBidFormValues>({
    resolver: zodResolver(createAuctionBidFormSchema(constraints)),
    defaultValues: getAuctionBidDefaultValues(constraints),
  });
  const priceError = form.formState.errors.price?.message;

  const handleOpenChange = (nextIsOpen: boolean): void => {
    if (!nextIsOpen) {
      form.reset(getAuctionBidDefaultValues(constraints));
    }

    onOpenChange(nextIsOpen);
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{auction.hasMyBid ? 'Изменить ставку' : 'Сделать ставку'}</DialogTitle>
          <DialogDescription>
            Укажите цену с НДС. Перед отправкой ставка будет проверена по правилам аукциона.
          </DialogDescription>
        </DialogHeader>

        <form className="grid gap-4" noValidate onSubmit={form.handleSubmit(() => undefined)}>
          <label className="grid gap-2 text-sm font-medium" htmlFor="auction-bid-price">
            Сумма ставки, ₽
            <Input
              {...form.register('price', { valueAsNumber: true })}
              id="auction-bid-price"
              type="number"
              min={auction.price.min ?? undefined}
              max={auction.price.max ?? undefined}
              step={auction.price.step ?? 'any'}
              aria-invalid={priceError !== undefined}
            />
          </label>
          {priceError && (
            <p className="text-sm text-destructive" role="alert">
              {priceError}
            </p>
          )}

          <dl className="grid gap-2 rounded-lg bg-muted/50 p-3 text-sm">
            <div className="flex justify-between gap-4">
              <dt className="text-muted-foreground">Доступная цена</dt>
              <dd>{formatPrice(auction.price.available)}</dd>
            </div>
            <div className="flex justify-between gap-4">
              <dt className="text-muted-foreground">Диапазон</dt>
              <dd>
                {formatPrice(auction.price.min)} — {formatPrice(auction.price.max)}
              </dd>
            </div>
            <div className="flex justify-between gap-4">
              <dt className="text-muted-foreground">Шаг</dt>
              <dd>{formatPrice(auction.price.step)}</dd>
            </div>
          </dl>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => handleOpenChange(false)}>
              Отмена
            </Button>
            <Button type="submit">Проверить ставку</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
