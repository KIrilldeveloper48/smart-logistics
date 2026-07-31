import type { FormEvent } from 'react';
import { auctionCityOptions } from '@/entities/auction';
import { Button, Input } from '@/shared/ui';
import { toAuctionListFilters } from '../model';
import { toDateInputValue } from '../model/auction-list-filters.helpers';
import type { TAuctionListFiltersProps } from '../model/auction-list-filters.types';

const selectClassName =
  'flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-xs outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50';

export function AuctionListFilters({ search, onApply, onReset }: TAuctionListFiltersProps) {
  const formKey = JSON.stringify(search);

  const handleSubmit = (event: FormEvent<HTMLFormElement>): void => {
    event.preventDefault();
    onApply(toAuctionListFilters(new FormData(event.currentTarget)));
  };

  return (
    <form
      key={formKey}
      className="grid gap-4 rounded-xl border bg-card p-4"
      onSubmit={handleSubmit}
    >
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <label className="grid gap-2 text-sm font-medium">
          Номер груза
          <Input
            name="cargoNum"
            defaultValue={search.cargoNum ?? ''}
            placeholder="Например, 00000001059"
          />
        </label>
        <label className="grid gap-2 text-sm font-medium">
          Статус торгов
          <select className={selectClassName} name="status" defaultValue={search.status?.[0] ?? ''}>
            <option value="">Все</option>
            <option value="NotParticipating">Не участвую</option>
            <option value="Leading">Лидирую</option>
            <option value="Losing">Проигрываю</option>
            <option value="Winner">Победитель</option>
          </select>
        </label>
        <label className="grid gap-2 text-sm font-medium">
          Статус аукциона
          <select
            className={selectClassName}
            name="auctionStatus"
            defaultValue={search.statuses?.[0]?.toString() ?? ''}
          >
            <option value="">Все</option>
            <option value="1">Планирование</option>
            <option value="2">Торги</option>
            <option value="6">Завершён</option>
            <option value="8">Отменён</option>
          </select>
        </label>
        <label className="grid gap-2 text-sm font-medium">
          Тип торгов
          <select
            className={selectClassName}
            name="auctionType"
            defaultValue={search.auctionTypes?.[0] ?? ''}
          >
            <option value="">Все</option>
            <option value="Request">Запрос цен</option>
            <option value="Up">На повышение</option>
            <option value="Down">На понижение</option>
            <option value="FixPrice">Фиксированная цена</option>
          </select>
        </label>
        <label className="grid gap-2 text-sm font-medium">
          Город погрузки
          <select className={selectClassName} name="loadCity" defaultValue={search.loadCity ?? ''}>
            <option value="">Все</option>
            {auctionCityOptions.map((city) => (
              <option key={city} value={city}>
                {city}
              </option>
            ))}
          </select>
        </label>
        <label className="grid gap-2 text-sm font-medium">
          Город выгрузки
          <select
            className={selectClassName}
            name="unloadCity"
            defaultValue={search.unloadCity ?? ''}
          >
            <option value="">Все</option>
            {auctionCityOptions.map((city) => (
              <option key={city} value={city}>
                {city}
              </option>
            ))}
          </select>
        </label>
        <label className="grid gap-2 text-sm font-medium">
          Погрузка от
          <Input
            name="loadDateFrom"
            type="date"
            defaultValue={toDateInputValue(search.loadDateFrom)}
          />
        </label>
        <label className="grid gap-2 text-sm font-medium">
          Погрузка до
          <Input name="loadDateTo" type="date" defaultValue={toDateInputValue(search.loadDateTo)} />
        </label>
        <label className="grid gap-2 text-sm font-medium">
          Доступность
          <select
            className={selectClassName}
            name="isAvailable"
            defaultValue={search.isAvailable?.toString() ?? ''}
          >
            <option value="">Все</option>
            <option value="true">Доступные</option>
            <option value="false">Недоступные</option>
          </select>
        </label>
        <label className="grid gap-2 text-sm font-medium">
          Моё участие
          <select
            className={selectClassName}
            name="isBidder"
            defaultValue={search.isBidder?.toString() ?? ''}
          >
            <option value="">Все</option>
            <option value="true">Участвую</option>
            <option value="false">Не участвую</option>
          </select>
        </label>
        <label className="grid gap-2 text-sm font-medium">
          Цена от
          <Input
            name="currentPriceFrom"
            type="number"
            min="0"
            defaultValue={search.currentPriceFrom?.toString() ?? ''}
          />
        </label>
        <label className="grid gap-2 text-sm font-medium">
          Цена до
          <Input
            name="currentPriceTo"
            type="number"
            min="0"
            defaultValue={search.currentPriceTo?.toString() ?? ''}
          />
        </label>
      </div>
      <div className="flex flex-wrap gap-3">
        <Button type="submit">Применить</Button>
        <Button type="button" variant="outline" onClick={onReset}>
          Сбросить
        </Button>
      </div>
    </form>
  );
}
