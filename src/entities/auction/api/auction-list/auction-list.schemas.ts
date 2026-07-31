import { z } from 'zod';
import {
  auctionStatusSchema,
  auctionTypeSchema,
  bidMeasurementTypeSchema,
  tradingStatusSchema,
} from '../auction-common/auction-common.schemas';

export const dateTimeWithOffsetSchema = z
  .string()
  .regex(
    /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(\.\d+)?(([+-]\d{2}:\d{2})|Z)$/,
    'Expected an ISO 8601 date-time with an offset.',
  );

const sortDirectionSchema = z.enum(['asc', 'desc']);

export const auctionListAuctionTypeFilterSchema = z.enum(['Request', 'Up', 'Down', 'FixPrice']);

export const auctionListRequestSchema = z.object({
  page: z.number().int().optional(),
  per_page: z.number().int().optional(),
  is_oldest: z.boolean().optional(),
  sort: z.record(z.string(), sortDirectionSchema).nullable().optional(),
  status: z.array(tradingStatusSchema).optional(),
  mobile_statuses: z.array(z.number().int()).optional(),
  statuses: z.array(z.number().int()).optional(),
  cargo_num: z.string().optional(),
  weight_from: z.number().optional(),
  weight_to: z.number().optional(),
  volume_from: z.number().optional(),
  volume_to: z.number().optional(),
  body_types: z.array(z.string()).optional(),
  form_type: z.string().nullable().optional(),
  is_international_shipment: z.boolean().optional(),
  load_city: z.string().optional(),
  load_gc_id: z.number().int().optional(),
  load_range: z.number().int().optional(),
  unload_city: z.string().optional(),
  unload_gc_id: z.number().int().optional(),
  unload_range: z.number().int().optional(),
  load_date_from: dateTimeWithOffsetSchema.optional(),
  load_date_to: dateTimeWithOffsetSchema.optional(),
  unload_date_from: dateTimeWithOffsetSchema.optional(),
  unload_date_to: dateTimeWithOffsetSchema.optional(),
  create_date_from: dateTimeWithOffsetSchema.optional(),
  create_date_to: dateTimeWithOffsetSchema.optional(),
  start_time_from: dateTimeWithOffsetSchema.optional(),
  start_time_to: dateTimeWithOffsetSchema.optional(),
  stop_time_from: dateTimeWithOffsetSchema.optional(),
  stop_time_to: dateTimeWithOffsetSchema.optional(),
  is_available: z.boolean().optional(),
  is_favorite: z.boolean().optional(),
  is_bidder: z.boolean().optional(),
  customer: z.string().optional(),
  customer_ids: z.array(z.number().int()).optional(),
  contractor: z.string().nullable().optional(),
  auction_ids: z.array(z.number().int()).optional(),
  replace_external_pads: z.boolean().nullable().optional(),
  current_price_from: z.number().nullable().optional(),
  current_price_to: z.number().nullable().optional(),
  price_per_km_from: z.number().nullable().optional(),
  price_per_km_to: z.number().nullable().optional(),
  auc_type: z.array(auctionListAuctionTypeFilterSchema).optional(),
});

const routePointSchema = z.object({
  city: z.string().optional(),
  address: z.string().optional(),
  date: z.string().optional(),
  city_gc_id: z.number().int().optional(),
  points_count: z.number().int().optional(),
});

const cargoCarSchema = z.object({
  type: z.string().optional(),
  weight: z.number().optional(),
  volume: z.number().optional(),
  width: z.number().optional(),
  length: z.number().optional(),
  height: z.number().optional(),
});

const auctionListItemSchema = z.object({
  main: z
    .object({
      id: z.number().int().optional(),
      cargo_num: z.string().optional(),
      cargo_date: z.string().optional(),
      auc_type: auctionTypeSchema.optional(),
      order_uid: z.string().optional(),
      created_at: z.string().optional(),
      priority_sort: z.number().int().optional(),
      is_assembly: z.boolean().optional(),
      price_per_km: z.number().nullable().optional(),
    })
    .optional(),
  organizer: z
    .object({
      subscriber_id: z.number().int().optional(),
      organization_id: z.number().int().optional(),
      organization_name: z.string().optional(),
      organization_inn: z.string().optional(),
      organization_kpp: z.string().optional(),
      is_hide_organization: z.boolean().optional(),
    })
    .optional(),
  route: z
    .object({
      load: routePointSchema.optional(),
      unload: routePointSchema.optional(),
    })
    .optional(),
  cargo: z
    .object({
      name: z.string().optional(),
      weight: z.number().optional(),
      volume: z.number().optional(),
      body_type: z.string().optional(),
      truck_count: z.number().int().optional(),
      is_cargo: z.boolean().optional(),
      is_international: z.boolean().optional(),
      containered: z.boolean().optional(),
      incoterms: z.string().optional(),
      conics: z.number().int().optional(),
      belts: z.number().int().optional(),
      adr: z.number().int().optional(),
      coupling: z.boolean().optional(),
      air_pass: z.boolean().optional(),
      low_loader: z.boolean().optional(),
      additional_load: z.boolean().optional(),
      temp_from: z.number().int().optional(),
      temp_to: z.number().int().optional(),
      loading_types: z
        .object({
          side: z.boolean().optional(),
          top: z.boolean().optional(),
          rear: z.boolean().optional(),
          full: z.boolean().optional(),
        })
        .optional(),
      docs: z
        .object({
          tir: z.boolean().optional(),
          cmr: z.boolean().optional(),
          t1: z.boolean().optional(),
          med: z.boolean().optional(),
        })
        .optional(),
      car: cargoCarSchema.nullable().optional(),
    })
    .optional(),
  trading: z
    .object({
      status: auctionStatusSchema.optional(),
      status_mobile: z
        .enum(['NotParticipating', 'Leading', 'Losing', 'Winner', 'Confirmed', 'Unknown'])
        .optional(),
      start_time: z.string().optional(),
      stop_time: z.string().optional(),
      bid_measurement_type: bidMeasurementTypeSchema.nullable().optional(),
      can_set_bet: z.boolean().optional(),
      allow_counter_bets: z.boolean().optional(),
      hide_points_address_and_contacts: z.boolean().optional(),
      direction: z.string().optional(),
      comment: z.string().optional(),
      is_bidder: z.boolean().optional(),
      is_available: z.boolean().optional(),
      is_accredited: z.boolean().optional(),
      is_favorite: z.boolean().optional(),
      price: z
        .object({
          start: z.number().optional(),
          current: z.number().optional(),
          current_no_vat: z.number().optional(),
        })
        .nullable()
        .optional(),
      your: z
        .object({
          bet: z.boolean().optional(),
          last_bet: z.number().nullable().optional(),
        })
        .nullable()
        .optional(),
      red_bet_with_vat: z.boolean().optional(),
      red_bet_no_vat: z.boolean().optional(),
      is_last_bet_with_vat: z.boolean().optional(),
    })
    .optional(),
  payment: z
    .object({
      form: z.string().optional(),
      currency_code: z.string().optional(),
      consignor: z.string().optional(),
      consignee: z.string().optional(),
    })
    .optional(),
});

export const auctionListResponseSchema = z.object({
  data: z.array(auctionListItemSchema).optional(),
  meta: z
    .object({
      current_page: z.number().int().optional(),
      from: z.number().int().optional(),
      last_page: z.number().int().optional(),
      per_page: z.number().int().optional(),
      to: z.number().int().optional(),
      total: z.number().int().optional(),
    })
    .optional(),
});
