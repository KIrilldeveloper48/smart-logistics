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
  DetailItem,
} from '../auction-presentation';
import type { TAuctionDetailProps } from './auction-detail.types';

export function AuctionDetail({ auction }: TAuctionDetailProps) {
  const isPriceHidden = Object.values(auction.price).every((value) => value === null);

  return (
    <article className="mt-6 grid gap-6">
      <header className="flex flex-col gap-3 border-b pb-6 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <p className="text-sm text-muted-foreground">Заявка</p>
          <h2 className="mt-1 text-xl font-semibold tracking-tight sm:text-2xl">
            {auction.cargoNumber ?? 'Номер не указан'}
          </h2>
        </div>
        <div className="flex flex-wrap gap-2" aria-label="Статусы аукциона">
          <Badge variant="outline">{formatAuctionType(auction.auctionType)}</Badge>
          <Badge variant="secondary">{formatAuctionStatus(auction.auctionStatus)}</Badge>
          <Badge variant="secondary">{formatTradingStatus(auction.tradingStatus)}</Badge>
          {auction.hasMyBid ? <Badge>Моя ставка</Badge> : null}
        </div>
      </header>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Организатор</CardTitle>
          </CardHeader>
          <CardContent>
            <dl className="grid gap-3 text-sm">
              <DetailItem term="Название" value={auction.organizer.name ?? 'Не указано'} />
              <DetailItem term="ИНН" value={auction.organizer.inn ?? 'Не указан'} />
              <DetailItem term="КПП" value={auction.organizer.kpp ?? 'Не указан'} />
            </dl>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Груз и транспорт</CardTitle>
          </CardHeader>
          <CardContent className="grid gap-3">
            <dl className="grid gap-3 text-sm">
              <DetailItem term="Груз" value={auction.cargo.name ?? 'Не указан'} />
              <DetailItem
                term="Вес и объём"
                value={`${formatMetric(auction.cargo.weight, 'т')} · ${formatMetric(auction.cargo.volume, 'м³')}`}
              />
              <DetailItem term="Кузов" value={auction.cargo.bodyType ?? 'Не указан'} />
              <DetailItem
                term="Транспорт"
                value={`${auction.cargo.truckType ?? 'Не указан'}, ${auction.cargo.truckCount ?? '—'} шт.`}
              />
              <DetailItem term="Расстояние" value={formatMetric(auction.cargo.distance, 'км')} />
            </dl>
            {auction.cargo.isInternational ? (
              <Badge className="w-fit">Международная перевозка</Badge>
            ) : null}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Оплата</CardTitle>
          </CardHeader>
          <CardContent>
            <dl className="grid gap-3 text-sm">
              <DetailItem term="Форма" value={auction.payment.form ?? 'Не указана'} />
              <DetailItem
                term="Отсрочка"
                value={formatPaymentDelay(auction.payment.delay, auction.payment.delayType)}
              />
              <DetailItem term="Валюта" value={auction.payment.currencyCode ?? 'Не указана'} />
            </dl>
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
              <dl className="grid gap-3 text-sm">
                <DetailItem term="Текущая цена" value={formatPrice(auction.price.current)} />
                <DetailItem term="Без НДС" value={formatPrice(auction.price.currentWithoutVat)} />
                <DetailItem term="Доступная цена" value={formatPrice(auction.price.available)} />
                <DetailItem
                  term="Диапазон"
                  value={`${formatPrice(auction.price.min)} — ${formatPrice(auction.price.max)}`}
                />
                <DetailItem term="Шаг" value={formatPrice(auction.price.step)} />
              </dl>
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
            <ol className="grid gap-4">
              {auction.routes.map((route, index) => {
                const sequence = route.sequence ?? index + 1;

                return (
                  <li key={`${sequence}-${route.operationType}`} className="rounded-lg border p-4">
                    <h3 className="font-medium">
                      {sequence}. {formatOperationType(route.operationType)}
                    </h3>
                    <dl className="mt-3 grid gap-2 text-sm">
                      <DetailItem term="Город" value={route.city ?? 'Город не указан'} />
                      {!auction.areRouteDetailsHidden ? (
                        <DetailItem term="Адрес" value={route.address ?? 'Адрес не указан'} />
                      ) : null}
                      <DetailItem
                        term="Период"
                        value={`${formatDate(route.startDate)} — ${formatDate(route.endDate)}`}
                      />
                      {!auction.areRouteDetailsHidden &&
                      (route.contactName !== null || route.contactPhone !== null) ? (
                        <DetailItem
                          term="Контакт"
                          value={`${route.contactName ?? 'Не указан'}${route.contactPhone === null ? '' : `, ${route.contactPhone}`}`}
                        />
                      ) : null}
                    </dl>
                  </li>
                );
              })}
            </ol>
          )}
        </CardContent>
      </Card>

      {!auction.areRouteDetailsHidden ? (
        <Card>
          <CardHeader>
            <CardTitle>Контакты</CardTitle>
          </CardHeader>
          <CardContent>
            {auction.contacts.length === 0 ? (
              <p className="text-sm text-muted-foreground">Контакты не указаны.</p>
            ) : (
              <ul className="grid gap-4 text-sm md:grid-cols-2">
                {auction.contacts.map((contact, index) => (
                  <li
                    key={`${contact.email ?? contact.phone ?? contact.name ?? 'contact'}-${index}`}
                  >
                    <dl className="grid gap-2">
                      <DetailItem term="Имя" value={contact.name ?? 'Контакт не указан'} />
                      <DetailItem term="Телефон" value={contact.phone ?? 'Телефон не указан'} />
                      <DetailItem
                        term="Email"
                        value={
                          contact.email ? (
                            <a
                              href={`mailto:${contact.email}`}
                              className="underline-offset-4 hover:underline"
                            >
                              {contact.email}
                            </a>
                          ) : (
                            'Email не указан'
                          )
                        }
                      />
                    </dl>
                  </li>
                ))}
              </ul>
            )}
          </CardContent>
        </Card>
      ) : null}
    </article>
  );
}
