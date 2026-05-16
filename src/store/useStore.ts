import { create } from 'zustand';
import { supabase } from '@/lib/supabase';

export interface Landlord {
  id: string;
  name: string;
  phone: string;
  email: string;
  tcNo: string;
  iban: string;
  createdAt: string;
}

export interface Property {
  id: string;
  landlordId?: string;
  name: string;
  type: string;
  address: string;
  city: string;
  district: string;
  status: string;
  createdAt: string;
}

export interface Tenant {
  id: string;
  name: string;
  tcNo: string;
  phone: string;
  email: string;
  createdAt: string;
}

export interface Lease {
  id: string;
  propertyId: string;
  tenantId: string;
  startDate: string;
  endDate: string;
  rentAmount: number;
  currency: string;
  status: string;
  createdAt: string;
  increaseType?: string;
  increaseRate?: number;
  dueDay?: number;
}

export interface Payment {
  id: string;
  leaseId: string;
  amount: number;
  currency: string;
  paymentDate: string;
  method: string;
  note: string;
  createdAt: string;
}

// ── Row mappers (snake_case → camelCase) ─────────────────────────────────────

function mapLandlord(r: Record<string, unknown>): Landlord {
  return {
    id: r.id as string,
    name: r.name as string,
    phone: r.phone as string,
    email: (r.email as string) ?? '',
    tcNo: (r.tc_no as string) ?? '',
    iban: (r.iban as string) ?? '',
    createdAt: r.created_at as string,
  };
}

function mapProperty(r: Record<string, unknown>): Property {
  return {
    id: r.id as string,
    landlordId: (r.landlord_id as string) ?? undefined,
    name: r.name as string,
    type: r.type as string,
    address: r.address as string,
    city: r.city as string,
    district: r.district as string,
    status: r.status as string,
    createdAt: r.created_at as string,
  };
}

function mapTenant(r: Record<string, unknown>): Tenant {
  return {
    id: r.id as string,
    name: r.name as string,
    tcNo: r.tc_no as string,
    phone: r.phone as string,
    email: (r.email as string) ?? '',
    createdAt: r.created_at as string,
  };
}

function mapLease(r: Record<string, unknown>): Lease {
  return {
    id: r.id as string,
    propertyId: r.property_id as string,
    tenantId: r.tenant_id as string,
    startDate: r.start_date as string,
    endDate: r.end_date as string,
    rentAmount: Number(r.rent_amount),
    currency: r.currency as string,
    status: r.status as string,
    createdAt: r.created_at as string,
    increaseType: (r.increase_type as string) ?? undefined,
    increaseRate: r.increase_rate != null ? Number(r.increase_rate) : undefined,
    dueDay: r.due_day != null ? Number(r.due_day) : undefined,
  };
}

function mapPayment(r: Record<string, unknown>): Payment {
  return {
    id: r.id as string,
    leaseId: r.lease_id as string,
    amount: Number(r.amount),
    currency: r.currency as string,
    paymentDate: r.payment_date as string,
    method: (r.method as string) ?? '',
    note: (r.note as string) ?? '',
    createdAt: r.created_at as string,
  };
}

// ── Store ─────────────────────────────────────────────────────────────────────

interface AppState {
  landlords: Landlord[];
  properties: Property[];
  tenants: Tenant[];
  leases: Lease[];
  payments: Payment[];
  loading: boolean;

  loadAll: () => Promise<void>;

  addLandlord: (l: Omit<Landlord, 'id' | 'createdAt'>) => Promise<void>;
  deleteLandlord: (id: string) => Promise<void>;

  addProperty: (p: Omit<Property, 'id' | 'createdAt'>) => Promise<void>;
  updateProperty: (id: string, p: Omit<Property, 'id' | 'createdAt'>) => Promise<void>;
  deleteProperty: (id: string) => Promise<void>;

  addTenant: (t: Omit<Tenant, 'id' | 'createdAt'>) => Promise<void>;
  updateTenant: (id: string, t: Omit<Tenant, 'id' | 'createdAt'>) => Promise<void>;
  deleteTenant: (id: string) => Promise<void>;

  addLease: (l: Omit<Lease, 'id' | 'createdAt'>) => Promise<void>;
  deleteLease: (id: string) => Promise<void>;

  addPayment: (p: Omit<Payment, 'id' | 'createdAt'>) => Promise<void>;
  deletePayment: (id: string) => Promise<void>;
}

export const useStore = create<AppState>((set) => ({
  landlords: [],
  properties: [],
  tenants: [],
  leases: [],
  payments: [],
  loading: false,

  // ── Load all data from Supabase ──────────────────────────────────────────
  loadAll: async () => {
    set({ loading: true });
    const [{ data: lords }, { data: props }, { data: tens }, { data: leas }, { data: pays }] =
      await Promise.all([
        supabase.from('landlords').select('*').order('created_at'),
        supabase.from('properties').select('*').order('created_at'),
        supabase.from('tenants').select('*').order('created_at'),
        supabase.from('leases').select('*').order('created_at'),
        supabase.from('payments').select('*').order('created_at'),
      ]);
    set({
      landlords: (lords ?? []).map(mapLandlord),
      properties: (props ?? []).map(mapProperty),
      tenants: (tens ?? []).map(mapTenant),
      leases: (leas ?? []).map(mapLease),
      payments: (pays ?? []).map(mapPayment),
      loading: false,
    });
  },

  // ── Landlords ─────────────────────────────────────────────────────────────
  addLandlord: async (l) => {
    const { data } = await supabase
      .from('landlords')
      .insert({ name: l.name, phone: l.phone, email: l.email, tc_no: l.tcNo, iban: l.iban })
      .select().single();
    if (data) set((s) => ({ landlords: [...s.landlords, mapLandlord(data)] }));
  },

  deleteLandlord: async (id) => {
    await supabase.from('landlords').delete().eq('id', id);
    set((s) => ({ landlords: s.landlords.filter((x) => x.id !== id) }));
  },

  // ── Properties ───────────────────────────────────────────────────────────
  addProperty: async (p) => {
    const { data } = await supabase
      .from('properties')
      .insert({ landlord_id: p.landlordId || null, name: p.name, type: p.type, address: p.address, city: p.city, district: p.district, status: p.status })
      .select().single();
    if (data) set((s) => ({ properties: [...s.properties, mapProperty(data)] }));
  },

  updateProperty: async (id, p) => {
    const { data } = await supabase
      .from('properties')
      .update({ landlord_id: p.landlordId || null, name: p.name, type: p.type, address: p.address, city: p.city, district: p.district, status: p.status })
      .eq('id', id).select().single();
    if (data) set((s) => ({ properties: s.properties.map((x) => (x.id === id ? mapProperty(data) : x)) }));
  },

  deleteProperty: async (id) => {
    await supabase.from('properties').delete().eq('id', id);
    set((s) => ({ properties: s.properties.filter((x) => x.id !== id) }));
  },

  // ── Tenants ──────────────────────────────────────────────────────────────
  addTenant: async (t) => {
    const { data } = await supabase
      .from('tenants')
      .insert({ name: t.name, tc_no: t.tcNo, phone: t.phone, email: t.email })
      .select().single();
    if (data) set((s) => ({ tenants: [...s.tenants, mapTenant(data)] }));
  },

  updateTenant: async (id, t) => {
    const { data } = await supabase
      .from('tenants')
      .update({ name: t.name, tc_no: t.tcNo, phone: t.phone, email: t.email })
      .eq('id', id).select().single();
    if (data) set((s) => ({ tenants: s.tenants.map((x) => (x.id === id ? mapTenant(data) : x)) }));
  },

  deleteTenant: async (id) => {
    await supabase.from('tenants').delete().eq('id', id);
    set((s) => ({ tenants: s.tenants.filter((x) => x.id !== id) }));
  },

  // ── Leases ───────────────────────────────────────────────────────────────
  addLease: async (l) => {
    const { data } = await supabase
      .from('leases')
      .insert({
        property_id: l.propertyId,
        tenant_id: l.tenantId,
        start_date: l.startDate,
        end_date: l.endDate,
        rent_amount: l.rentAmount,
        currency: l.currency,
        status: l.status,
        increase_type: l.increaseType,
        increase_rate: l.increaseRate,
        due_day: l.dueDay,
      })
      .select().single();
    if (data) set((s) => ({ leases: [...s.leases, mapLease(data)] }));
  },

  deleteLease: async (id) => {
    await supabase.from('leases').delete().eq('id', id);
    set((s) => ({ leases: s.leases.filter((x) => x.id !== id) }));
  },

  // ── Payments ─────────────────────────────────────────────────────────────
  addPayment: async (p) => {
    const { data } = await supabase
      .from('payments')
      .insert({
        lease_id: p.leaseId,
        amount: p.amount,
        currency: p.currency,
        payment_date: p.paymentDate,
        method: p.method,
        note: p.note,
      })
      .select().single();
    if (data) set((s) => ({ payments: [...s.payments, mapPayment(data)] }));
  },

  deletePayment: async (id) => {
    await supabase.from('payments').delete().eq('id', id);
    set((s) => ({ payments: s.payments.filter((x) => x.id !== id) }));
  },
}));
