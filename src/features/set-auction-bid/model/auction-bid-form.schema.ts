import { z } from 'zod';

export const auctionBidFormSchema = z.object({
  price: z
    .number({ error: 'Укажите сумму ставки числом.' })
    .finite('Сумма ставки должна быть конечным числом.')
    .positive('Сумма ставки должна быть больше нуля.'),
});
