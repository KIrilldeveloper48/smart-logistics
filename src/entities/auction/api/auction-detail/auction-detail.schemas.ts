import { z } from 'zod';
import {
  auctionStatusSchema,
  auctionTypeSchema,
  bidMeasurementTypeSchema,
  operationTypeSchema,
  paymentDelayTypeSchema,
  tradingStatusSchema,
} from '../auction-common/auction-common.schemas';

export const auctionUuidSchema = z.uuid();

const contactSchema = z.object({
  name: z.string().nullable().optional(),
  phone: z.string().nullable().optional(),
  work_phone: z.string().nullable().optional(),
  uid: z.string().nullable().optional(),
  email: z.string().nullable().optional(),
});

const loadingTypesSchema = z.object({
  side: z.boolean().optional(),
  top: z.boolean().optional(),
  rear: z.boolean().optional(),
  full: z.boolean().optional(),
});

const docsSchema = z.object({
  tir: z.boolean().optional(),
  cmr: z.boolean().optional(),
  t1: z.boolean().optional(),
  med: z.boolean().optional(),
});

const carRequirementsSchema = z
  .object({
    type: z.string().optional(),
    weight: z.number().nullable().optional(),
    volume: z.number().nullable().optional(),
    width: z.number().nullable().optional(),
    length: z.number().nullable().optional(),
    height: z.number().nullable().optional(),
  })
  .nullable();

const routePointSchema = z.object({
  row_num: z.number().int().optional(),
  op_type: operationTypeSchema.optional(),
  start_date: z.string().optional(),
  end_date: z.string().optional(),
  comment: z.string().nullable().optional(),
  contractor: z.string().optional(),
  contractor_inn: z.string().optional(),
  location: z
    .object({
      city_name: z.string().optional(),
      city_full_name: z.string().optional(),
      city_gc_id: z.number().int().optional(),
      loading_address: z.string().optional(),
      lon: z.number().optional(),
      lat: z.number().optional(),
    })
    .optional(),
  cargo: z
    .object({
      name: z.string().optional(),
      package_name: z.string().optional(),
      weight: z.string().optional(),
      volume: z.string().optional(),
      length: z.string().optional(),
      width: z.string().optional(),
      height: z.string().optional(),
      oversized: z.boolean().optional(),
      package_amount: z.number().int().nullable().optional(),
    })
    .optional(),
  contact: z
    .object({
      name: z.string().optional(),
      phone: z.string().optional(),
    })
    .optional(),
});

const admittedOrganizationSchema = z.object({
  id: z.number().int().optional(),
  inn: z.string().optional(),
  is_main: z.boolean().optional(),
  name: z.string().optional(),
  full_name: z.string().optional(),
  site: z.string().nullable().optional(),
  subscriber_id: z.number().int().optional(),
  subscriber_code: z.string().optional(),
  subscriber_role: z.string().nullable().optional(),
  infobase_code: z.string().optional(),
  infobase_address: z.string().nullable().optional(),
  nalog_key: z.string().nullable().optional(),
  hide_me: z.boolean().optional(),
  current_vat_rate: z.string().nullable().optional(),
});

const auctionShowMainSchema = z.object({
  id: z.number().int().optional(),
  cargo_num: z.string().optional(),
  cargo_date: z.string().optional(),
  order_uid: auctionUuidSchema.optional(),
  auc_type: auctionTypeSchema.optional(),
  created_at: z.string().optional(),
});

const auctionShowOrganizerSchema = z.object({
  subscriber_id: z.number().int().optional(),
  subscriber_code: z.string().optional(),
  infobase_code: z.string().optional(),
  organization_name: z.string().optional(),
  organization_inn: z.string().optional(),
  organization_kpp: z.string().optional(),
  organization_id: z.number().int().optional(),
});

const auctionShowCargoSchema = z.object({
  price: z.string().optional(),
  currency: z.number().int().nullable().optional(),
  is_international: z.boolean().optional(),
  distance: z.number().int().nullable().optional(),
  truck_count: z.number().int().optional(),
  body_type: z.string().optional(),
  temp_from: z.number().nullable().optional(),
  temp_to: z.number().nullable().optional(),
  conics: z.number().int().nullable().optional(),
  belts: z.number().int().nullable().optional(),
  adr: z.number().int().nullable().optional(),
  coupling: z.boolean().nullable().optional(),
  air_pass: z.boolean().nullable().optional(),
  low_loader: z.boolean().nullable().optional(),
  additional_load: z.boolean().nullable().optional(),
  containered: z.boolean().optional(),
  container_type: z.string().nullable().optional(),
  container_size: z.string().nullable().optional(),
  loading_types: loadingTypesSchema.optional(),
  docs: docsSchema.optional(),
  car: carRequirementsSchema.optional(),
});

const auctionShowTradingSchema = z.object({
  status: auctionStatusSchema.optional(),
  status_mobile: tradingStatusSchema.optional(),
  start_time: z.string().optional(),
  stop_time: z.string().optional(),
  bid_measurement_type: bidMeasurementTypeSchema.optional(),
  can_set_bet: z.boolean().optional(),
  allow_counter_bets: z.boolean().optional(),
  hide_bets_history: z.boolean().optional(),
  hide_places: z.boolean().optional(),
  no_view_cargo_price: z.boolean().optional(),
  hide_points_address_and_contacts: z.boolean().optional(),
  is_bidder: z.boolean().optional(),
  is_favorite: z.boolean().optional(),
  is_last_bet_with_vat: z.boolean().nullable().optional(),
  red_bet_with_vat: z.boolean().optional(),
  red_bet_no_vat: z.boolean().optional(),
  send_deal_before_load: z.boolean().optional(),
  chat_id: z.string().nullable().optional(),
  price: z
    .object({
      start: z.number().nullable().optional(),
      start_no_vat: z.number().nullable().optional(),
      current: z.number().nullable().optional(),
      current_no_vat: z.number().nullable().optional(),
      available: z.number().nullable().optional(),
      available_no_vat: z.number().nullable().optional(),
      min: z.number().nullable().optional(),
      min_no_vat: z.number().nullable().optional(),
      max: z.number().nullable().optional(),
      max_no_vat: z.number().nullable().optional(),
      step: z.number().nullable().optional(),
      step_no_vat: z.number().nullable().optional(),
      price_per_km: z.number().optional(),
    })
    .optional(),
  your: z
    .object({
      bet: z.boolean().optional(),
      last_bet: z.number().nullable().optional(),
      last_bet_with_vat: z.number().nullable().optional(),
      win: z.boolean().optional(),
    })
    .optional(),
  settings: z
    .object({
      prolong_after_bet: z.number().int().nullable().optional(),
      winner_confirm: z.number().int().nullable().optional(),
      winner_counter_mode: z.number().int().nullable().optional(),
      transmission_time_in: z.number().int().nullable().optional(),
      coefficient: z.number().int().nullable().optional(),
    })
    .optional(),
});

const auctionShowPaymentSchema = z.object({
  condition: z.string().nullable().optional(),
  condition_predefined: z.string().nullable().optional(),
  form: z.string().optional(),
  delay: z.number().int().nullable().optional(),
  delay_type: paymentDelayTypeSchema.optional(),
  currency_code: z.string().optional(),
  prepay: z.string().nullable().optional(),
});

export const auctionDetailResponseSchema = z.object({
  main: auctionShowMainSchema,
  organizer: auctionShowOrganizerSchema,
  contacts: z.array(contactSchema),
  cargo: auctionShowCargoSchema,
  trading: auctionShowTradingSchema,
  payment: auctionShowPaymentSchema,
  assembly: z.object({
    num: z.string().nullable().optional(),
    date: z.string().nullable().optional(),
  }),
  routes: z.array(routePointSchema),
  admitted_organizations: z.array(admittedOrganizationSchema),
  hide_bets_history: z.boolean().optional(),
});

const betItemSchema = z.object({
  id: z.number().int().optional(),
  created_at: z.string().optional(),
  auction_id: z.number().int().optional(),
  subscriber_id: z.number().int().optional(),
  contact_name: z.string().optional(),
  contact_phone: z.string().optional(),
  price_with_vat: z.number().optional(),
  price_no_vat: z.number().optional(),
  organization_id: z.number().int().optional(),
  organization_inn: z.string().optional(),
  organization_name: z.string().optional(),
  transporter_comment: z.string().nullable().optional(),
  is_rejected: z.boolean().optional(),
  is_counter: z.boolean().optional(),
  place: z.number().int().nullable().optional(),
  is_win: z.boolean().optional(),
  run_number: z.number().int().optional(),
  cancel_reason: z.string().optional(),
  price_info: z
    .object({
      price_with_vat: z.number().nullable().optional(),
      price_no_vat: z.number().nullable().optional(),
      payment_type: z.string().nullable().optional(),
      vat_rate: z.string().nullable().optional(),
    })
    .optional(),
});

export const listBetsSearchSchema = z.object({
  all: z.boolean().nullable().optional(),
});

export const betListResponseSchema = z.object({
  bets: z.array(betItemSchema),
});

export const setBetRequestSchema = z.object({
  price: z.number().finite().positive(),
});
