import { Badge, Card, CardContent, CardHeader, CardTitle } from '@/shared/ui';
import {
  formatAuctionStatus,
  formatAuctionType,
  formatDate,
  formatMetric,
  formatOperationType,
  formatPaymentDelay,
  formatPrice,
  formatTradingStatus,
} from '../auction-presentation';
import type { TAuctionDetailProps } from './auction-detail.types';

export function AuctionDetail({ auction }: TAuctionDetailProps) {
  const isPriceHidden = Object.values(auction.price).every((value) => value === null);

  return (
    <div className="mt-6 grid gap-6">
      <section className="flex flex-col gap-3 border-b pb-6 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <p className="text-sm text-muted-foreground">Заявка</p>
          <h2 className="mt-1 text-xl font-semibold tracking-tight sm:text-2xl">
            {auction.cargoNumber ?? 'Номер не указан'}
          </h2>
        </div>
        <div className="flex flex-wrap gap-2">
          <Badge variant="outline">{formatAuctionType(auction.auctionType)}</Badge>
          <Badge variant="secondary">{formatAuctionStatus(auction.auctionStatus)}</Badge>
          <Badge variant="secondary">{formatTradingStatus(auction.tradingStatus)}</Badge>
          {auction.hasMyBid ? <Badge>Моя ставка</Badge> : null}
        </div>
      </section>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Организатор</CardTitle>
          </CardHeader>
          <CardContent className="grid gap-3 text-sm">
            <p>
              <span className="text-muted-foreground">Название: </span>
              {auction.organizer.name ?? 'Не указано'}
            </p>
            <p>
              <span className="text-muted-foreground">ИНН: </span>
              {auction.organizer.inn ?? 'Не указан'}
            </p>
            <p>
              <span className="text-muted-foreground">КПП: </span>
              {auction.organizer.kpp ?? 'Не указан'}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Груз и транспорт</CardTitle>
          </CardHeader>
          <CardContent className="grid gap-3 text-sm">
            <p>
              <span className="text-muted-foreground">Груз: </span>
              {auction.cargo.name ?? 'Не указан'}
            </p>
            <p>
              <span className="text-muted-foreground">Вес и объём: </span>
              {formatMetric(auction.cargo.weight, 'т')} · {formatMetric(auction.cargo.volume, 'м³')}
            </p>
            <p>
              <span className="text-muted-foreground">Кузов: </span>
              {auction.cargo.bodyType ?? 'Не указан'}
            </p>
            <p>
              <span className="text-muted-foreground">Транспорт: </span>
              {auction.cargo.truckType ?? 'Не указан'}, {auction.cargo.truckCount ?? '—'} шт.
            </p>
            <p>
              <span className="text-muted-foreground">Расстояние: </span>
              {formatMetric(auction.cargo.distance, 'км')}
            </p>
            {auction.cargo.isInternational ? (
              <Badge className="w-fit">Международная перевозка</Badge>
            ) : null}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Оплата</CardTitle>
          </CardHeader>
          <CardContent className="grid gap-3 text-sm">
            <p>
              <span className="text-muted-foreground">Форма: </span>
              {auction.payment.form ?? 'Не указана'}
            </p>
            <p>
              <span className="text-muted-foreground">Отсрочка: </span>
              {formatPaymentDelay(auction.payment.delay, auction.payment.delayType)}
            </p>
            <p>
              <span className="text-muted-foreground">Валюта: </span>
              {auction.payment.currencyCode ?? 'Не указана'}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Торговые параметры</CardTitle>
          </CardHeader>
          <CardContent className="grid gap-3 text-sm">
            {isPriceHidden ? (
              <p className="text-muted-foreground">Информация о цене недоступна.</p>
            ) : (
              <>
                <p>
                  <span className="text-muted-foreground">Текущая цена: </span>
                  {formatPrice(auction.price.current)}
                </p>
                <p>
                  <span className="text-muted-foreground">Без НДС: </span>
                  {formatPrice(auction.price.currentWithoutVat)}
                </p>
                <p>
                  <span className="text-muted-foreground">Доступная цена: </span>
                  {formatPrice(auction.price.available)}
                </p>
                <p>
                  <span className="text-muted-foreground">Диапазон: </span>
                  {formatPrice(auction.price.min)} — {formatPrice(auction.price.max)}
                </p>
                <p>
                  <span className="text-muted-foreground">Шаг: </span>
                  {formatPrice(auction.price.step)}
                </p>
              </>
            )}
            <Badge variant={auction.canSetBid ? 'default' : 'secondary'} className="w-fit">
              {auction.canSetBid ? 'Ставка доступна' : 'Ставка недоступна'}
            </Badge>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Маршрут</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-4">
          {auction.routes.length === 0 ? (
            <p className="text-sm text-muted-foreground">Точки маршрута не указаны.</p>
          ) : (
            auction.routes.map((route, index) => (
              <section
                key={`${route.sequence ?? index}-${route.operationType}`}
                className="rounded-lg border p-4"
              >
                <p className="font-medium">
                  {route.sequence ?? index + 1}. {formatOperationType(route.operationType)}
                </p>
                <p className="mt-2 text-sm text-muted-foreground">
                  {route.city ?? 'Город не указан'}
                  {route.address === null ? '' : `, ${route.address}`}
                </p>
                <p className="mt-1 text-sm text-muted-foreground">
                  {formatDate(route.startDate)} — {formatDate(route.endDate)}
                </p>
                {route.contactName !== null || route.contactPhone !== null ? (
                  <p className="mt-2 text-sm">
                    Контакт: {route.contactName ?? 'Не указан'}
                    {route.contactPhone === null ? '' : `, ${route.contactPhone}`}
                  </p>
                ) : null}
              </section>
            ))
          )}
        </CardContent>
      </Card>

      {!auction.areRouteDetailsHidden ? (
        <Card>
          <CardHeader>
            <CardTitle>Контакты</CardTitle>
          </CardHeader>
          <CardContent className="grid gap-3 text-sm md:grid-cols-2">
            {auction.contacts.length === 0 ? (
              <p className="text-muted-foreground">Контакты не указаны.</p>
            ) : (
              auction.contacts.map((contact, index) => (
                <div
                  key={`${contact.email ?? contact.phone ?? contact.name ?? 'contact'}-${index}`}
                >
                  <p className="font-medium">{contact.name ?? 'Контакт не указан'}</p>
                  <p className="mt-1 text-muted-foreground">
                    {contact.phone ?? 'Телефон не указан'}
                  </p>
                  <p className="text-muted-foreground">{contact.email ?? 'Email не указан'}</p>
                </div>
              ))
            )}
          </CardContent>
        </Card>
      ) : null}
    </div>
  );
}
