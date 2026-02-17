export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export type KolStatus = 'potential' | 'active' | 'paused' | 'ended';
export type UserRole = 'staff' | 'admin';

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string;
          email: string;
          display_name: string;
          role: UserRole;
          avatar_url: string | null;
          is_active: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id: string;
          email: string;
          display_name: string;
          role?: UserRole;
          avatar_url?: string | null;
          is_active?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          email?: string;
          display_name?: string;
          role?: UserRole;
          avatar_url?: string | null;
          is_active?: boolean;
          updated_at?: string;
        };
        Relationships: [];
      };
      products: {
        Row: {
          id: string;
          name: string;
          description: string | null;
          price: number | null;
          image_url: string | null;
          is_active: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          description?: string | null;
          price?: number | null;
          image_url?: string | null;
          is_active?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          name?: string;
          description?: string | null;
          price?: number | null;
          image_url?: string | null;
          is_active?: boolean;
          updated_at?: string;
        };
        Relationships: [];
      };
      kols: {
        Row: {
          id: string;
          ig_handle: string;
          status: KolStatus;
          group_buy_start_date: string | null;
          group_buy_end_date: string | null;
          has_pr_products: boolean;
          pr_products_received: boolean;
          revenue_share_pct: number | null;
          revenue_share_start_unit: number | null;
          has_exclusive_store: boolean;
          notes: string | null;
          staff_id: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          ig_handle: string;
          status?: KolStatus;
          group_buy_start_date?: string | null;
          group_buy_end_date?: string | null;
          has_pr_products?: boolean;
          pr_products_received?: boolean;
          revenue_share_pct?: number | null;
          revenue_share_start_unit?: number | null;
          has_exclusive_store?: boolean;
          notes?: string | null;
          staff_id?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          ig_handle?: string;
          status?: KolStatus;
          group_buy_start_date?: string | null;
          group_buy_end_date?: string | null;
          has_pr_products?: boolean;
          pr_products_received?: boolean;
          revenue_share_pct?: number | null;
          revenue_share_start_unit?: number | null;
          has_exclusive_store?: boolean;
          notes?: string | null;
          staff_id?: string | null;
          updated_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: 'kols_staff_id_fkey';
            columns: ['staff_id'];
            isOneToOne: false;
            referencedRelation: 'profiles';
            referencedColumns: ['id'];
          },
        ];
      };
      kol_products: {
        Row: {
          id: string;
          kol_id: string;
          product_id: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          kol_id: string;
          product_id: string;
          created_at?: string;
        };
        Update: {
          kol_id?: string;
          product_id?: string;
        };
        Relationships: [
          {
            foreignKeyName: 'kol_products_kol_id_fkey';
            columns: ['kol_id'];
            isOneToOne: false;
            referencedRelation: 'kols';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'kol_products_product_id_fkey';
            columns: ['product_id'];
            isOneToOne: false;
            referencedRelation: 'products';
            referencedColumns: ['id'];
          },
        ];
      };
      checkins: {
        Row: {
          id: string;
          staff_id: string;
          image_url: string;
          notes: string | null;
          checked_at: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          staff_id: string;
          image_url: string;
          notes?: string | null;
          checked_at?: string;
          created_at?: string;
        };
        Update: {
          image_url?: string;
          notes?: string | null;
          checked_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: 'checkins_staff_id_fkey';
            columns: ['staff_id'];
            isOneToOne: false;
            referencedRelation: 'profiles';
            referencedColumns: ['id'];
          },
        ];
      };
      settlements: {
        Row: {
          id: string;
          kol_id: string;
          sales_rating: number | null;
          settlement_amount: number | null;
          is_settled: boolean;
          settled_at: string | null;
          period_start: string | null;
          period_end: string | null;
          notes: string | null;
          created_by: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          kol_id: string;
          sales_rating?: number | null;
          settlement_amount?: number | null;
          is_settled?: boolean;
          settled_at?: string | null;
          period_start?: string | null;
          period_end?: string | null;
          notes?: string | null;
          created_by?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          kol_id?: string;
          sales_rating?: number | null;
          settlement_amount?: number | null;
          is_settled?: boolean;
          settled_at?: string | null;
          period_start?: string | null;
          period_end?: string | null;
          notes?: string | null;
          updated_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: 'settlements_kol_id_fkey';
            columns: ['kol_id'];
            isOneToOne: false;
            referencedRelation: 'kols';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'settlements_created_by_fkey';
            columns: ['created_by'];
            isOneToOne: false;
            referencedRelation: 'profiles';
            referencedColumns: ['id'];
          },
        ];
      };
    };
    Views: {
      upcoming_group_buy_endings: {
        Row: {
          id: string;
          ig_handle: string;
          group_buy_end_date: string;
          staff_id: string | null;
          days_remaining: number;
        };
        Relationships: [];
      };
      pending_pr_products: {
        Row: {
          id: string;
          ig_handle: string;
          staff_id: string | null;
          has_pr_products: boolean;
          pr_products_received: boolean;
        };
        Relationships: [];
      };
      pending_settlements: {
        Row: {
          id: string;
          ig_handle: string;
          group_buy_end_date: string;
          staff_id: string | null;
        };
        Relationships: [];
      };
    };
    Functions: Record<string, never>;
    Enums: Record<string, never>;
    CompositeTypes: Record<string, never>;
  };
}

// Convenience type aliases
export type Profile = Database['public']['Tables']['profiles']['Row'];
export type Product = Database['public']['Tables']['products']['Row'];
export type Kol = Database['public']['Tables']['kols']['Row'];
export type KolProduct = Database['public']['Tables']['kol_products']['Row'];
export type Checkin = Database['public']['Tables']['checkins']['Row'];
export type Settlement = Database['public']['Tables']['settlements']['Row'];

export type ProfileInsert = Database['public']['Tables']['profiles']['Insert'];
export type ProductInsert = Database['public']['Tables']['products']['Insert'];
export type KolInsert = Database['public']['Tables']['kols']['Insert'];
export type KolProductInsert = Database['public']['Tables']['kol_products']['Insert'];
export type CheckinInsert = Database['public']['Tables']['checkins']['Insert'];
export type SettlementInsert = Database['public']['Tables']['settlements']['Insert'];

export type ProductUpdate = Database['public']['Tables']['products']['Update'];
export type KolUpdate = Database['public']['Tables']['kols']['Update'];
export type SettlementUpdate = Database['public']['Tables']['settlements']['Update'];
