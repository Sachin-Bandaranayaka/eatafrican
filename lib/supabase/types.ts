// Database types generated from schema
export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      users: {
        Row: {
          id: string
          email: string
          password_hash: string
          role: 'customer' | 'restaurant_owner' | 'driver' | 'super_admin'
          first_name: string | null
          last_name: string | null
          phone: string | null
          language: 'en' | 'de' | 'fr' | 'it'
          status: 'active' | 'inactive' | 'suspended'
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          email: string
          password_hash: string
          role: 'customer' | 'restaurant_owner' | 'driver' | 'super_admin'
          first_name?: string | null
          last_name?: string | null
          phone?: string | null
          language?: 'en' | 'de' | 'fr' | 'it'
          status?: 'active' | 'inactive' | 'suspended'
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          email?: string
          password_hash?: string
          role?: 'customer' | 'restaurant_owner' | 'driver' | 'super_admin'
          first_name?: string | null
          last_name?: string | null
          phone?: string | null
          language?: 'en' | 'de' | 'fr' | 'it'
          status?: 'active' | 'inactive' | 'suspended'
          created_at?: string
          updated_at?: string
        }
      }
      restaurants: {
        Row: {
          id: string
          owner_id: string
          name: string
          description: string | null
          cuisine_types: string[] | null
          address: string
          city: string
          postal_code: string
          region: string
          latitude: number | null
          longitude: number | null
          phone: string | null
          email: string | null
          min_order_amount: number
          status: 'pending' | 'active' | 'suspended'
          rating: number
          total_ratings: number
          logo_url: string | null
          cover_image_url: string | null
          opening_hours: Json | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          owner_id: string
          name: string
          description?: string | null
          cuisine_types?: string[] | null
          address: string
          city: string
          postal_code: string
          region: string
          latitude?: number | null
          longitude?: number | null
          phone?: string | null
          email?: string | null
          min_order_amount?: number
          status?: 'pending' | 'active' | 'suspended'
          rating?: number
          total_ratings?: number
          logo_url?: string | null
          cover_image_url?: string | null
          opening_hours?: Json | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          owner_id?: string
          name?: string
          description?: string | null
          cuisine_types?: string[] | null
          address?: string
          city?: string
          postal_code?: string
          region?: string
          latitude?: number | null
          longitude?: number | null
          phone?: string | null
          email?: string | null
          min_order_amount?: number
          status?: 'pending' | 'active' | 'suspended'
          rating?: number
          total_ratings?: number
          logo_url?: string | null
          cover_image_url?: string | null
          opening_hours?: Json | null
          created_at?: string
          updated_at?: string
        }
      }
      menu_items: {
        Row: {
          id: string
          restaurant_id: string
          name: string
          description: string | null
          price: number
          category: 'meals' | 'drinks' | 'special_deals'
          meal_category: string | null
          cuisine_type: string | null
          dietary_tags: string[] | null
          image_url: string | null
          gallery_urls: string[] | null
          quantity: number
          status: 'active' | 'inactive' | 'out_of_stock'
          translations: Json | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          restaurant_id: string
          name: string
          description?: string | null
          price: number
          category: 'meals' | 'drinks' | 'special_deals'
          meal_category?: string | null
          cuisine_type?: string | null
          dietary_tags?: string[] | null
          image_url?: string | null
          gallery_urls?: string[] | null
          quantity?: number
          status?: 'active' | 'inactive' | 'out_of_stock'
          translations?: Json | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          restaurant_id?: string
          name?: string
          description?: string | null
          price?: number
          category?: 'meals' | 'drinks' | 'special_deals'
          meal_category?: string | null
          cuisine_type?: string | null
          dietary_tags?: string[] | null
          image_url?: string | null
          gallery_urls?: string[] | null
          quantity?: number
          status?: 'active' | 'inactive' | 'out_of_stock'
          translations?: Json | null
          created_at?: string
          updated_at?: string
        }
      }
      orders: {
        Row: {
          id: string
          order_number: string
          customer_id: string | null
          restaurant_id: string
          driver_id: string | null
          status: 'new' | 'confirmed' | 'preparing' | 'ready_for_pickup' | 'assigned' | 'in_transit' | 'delivered' | 'cancelled'
          customer_email: string | null
          customer_phone: string | null
          customer_first_name: string | null
          customer_last_name: string | null
          delivery_address: string
          delivery_city: string
          delivery_postal_code: string
          delivery_latitude: number | null
          delivery_longitude: number | null
          delivery_instructions: string | null
          scheduled_delivery_time: string | null
          actual_delivery_time: string | null
          subtotal: number
          delivery_fee: number
          discount_amount: number
          tax_amount: number
          total_amount: number
          payment_status: 'pending' | 'completed' | 'failed' | 'refunded'
          payment_method: string | null
          payment_reference: string | null
          voucher_code: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          order_number?: string
          customer_id?: string | null
          restaurant_id: string
          driver_id?: string | null
          status?: 'new' | 'confirmed' | 'preparing' | 'ready_for_pickup' | 'assigned' | 'in_transit' | 'delivered' | 'cancelled'
          customer_email?: string | null
          customer_phone?: string | null
          customer_first_name?: string | null
          customer_last_name?: string | null
          delivery_address: string
          delivery_city: string
          delivery_postal_code: string
          delivery_latitude?: number | null
          delivery_longitude?: number | null
          delivery_instructions?: string | null
          scheduled_delivery_time?: string | null
          actual_delivery_time?: string | null
          subtotal: number
          delivery_fee: number
          discount_amount?: number
          tax_amount?: number
          total_amount: number
          payment_status?: 'pending' | 'completed' | 'failed' | 'refunded'
          payment_method?: string | null
          payment_reference?: string | null
          voucher_code?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          order_number?: string
          customer_id?: string | null
          restaurant_id?: string
          driver_id?: string | null
          status?: 'new' | 'confirmed' | 'preparing' | 'ready_for_pickup' | 'assigned' | 'in_transit' | 'delivered' | 'cancelled'
          customer_email?: string | null
          customer_phone?: string | null
          customer_first_name?: string | null
          customer_last_name?: string | null
          delivery_address?: string
          delivery_city?: string
          delivery_postal_code?: string
          delivery_latitude?: number | null
          delivery_longitude?: number | null
          delivery_instructions?: string | null
          scheduled_delivery_time?: string | null
          actual_delivery_time?: string | null
          subtotal?: number
          delivery_fee?: number
          discount_amount?: number
          tax_amount?: number
          total_amount?: number
          payment_status?: 'pending' | 'completed' | 'failed' | 'refunded'
          payment_method?: string | null
          payment_reference?: string | null
          voucher_code?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      order_items: {
        Row: {
          id: string
          order_id: string
          menu_item_id: string | null
          name: string
          price: number
          quantity: number
          subtotal: number
          special_instructions: string | null
          created_at: string
        }
        Insert: {
          id?: string
          order_id: string
          menu_item_id?: string | null
          name: string
          price: number
          quantity: number
          subtotal: number
          special_instructions?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          order_id?: string
          menu_item_id?: string | null
          name?: string
          price?: number
          quantity?: number
          subtotal?: number
          special_instructions?: string | null
          created_at?: string
        }
      }
      drivers: {
        Row: {
          id: string
          user_id: string
          license_number: string | null
          vehicle_type: string | null
          vehicle_plate: string | null
          pickup_zone: string
          status: 'pending' | 'active' | 'inactive' | 'suspended'
          rating: number
          total_ratings: number
          total_deliveries: number
          total_earnings: number
          profile_image_url: string | null
          documents_verified: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          license_number?: string | null
          vehicle_type?: string | null
          vehicle_plate?: string | null
          pickup_zone: string
          status?: 'pending' | 'active' | 'inactive' | 'suspended'
          rating?: number
          total_ratings?: number
          total_deliveries?: number
          total_earnings?: number
          profile_image_url?: string | null
          documents_verified?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          license_number?: string | null
          vehicle_type?: string | null
          vehicle_plate?: string | null
          pickup_zone?: string
          status?: 'pending' | 'active' | 'inactive' | 'suspended'
          rating?: number
          total_ratings?: number
          total_deliveries?: number
          total_earnings?: number
          profile_image_url?: string | null
          documents_verified?: boolean
          created_at?: string
          updated_at?: string
        }
      }
      loyalty_points: {
        Row: {
          id: string
          customer_id: string
          points_balance: number
          lifetime_points: number
          referral_code: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          customer_id: string
          points_balance?: number
          lifetime_points?: number
          referral_code?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          customer_id?: string
          points_balance?: number
          lifetime_points?: number
          referral_code?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      loyalty_transactions: {
        Row: {
          id: string
          customer_id: string
          order_id: string | null
          transaction_type: 'earned' | 'redeemed' | 'referral_bonus'
          points: number
          description: string | null
          created_at: string
        }
        Insert: {
          id?: string
          customer_id: string
          order_id?: string | null
          transaction_type: 'earned' | 'redeemed' | 'referral_bonus'
          points: number
          description?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          customer_id?: string
          order_id?: string | null
          transaction_type?: 'earned' | 'redeemed' | 'referral_bonus'
          points?: number
          description?: string | null
          created_at?: string
        }
      }
      vouchers: {
        Row: {
          id: string
          code: string
          discount_type: 'percentage' | 'fixed_amount'
          discount_value: number
          min_order_amount: number | null
          max_discount_amount: number | null
          usage_limit: number | null
          usage_count: number
          valid_from: string | null
          valid_until: string | null
          status: 'active' | 'inactive' | 'expired'
          created_at: string
        }
        Insert: {
          id?: string
          code: string
          discount_type: 'percentage' | 'fixed_amount'
          discount_value: number
          min_order_amount?: number | null
          max_discount_amount?: number | null
          usage_limit?: number | null
          usage_count?: number
          valid_from?: string | null
          valid_until?: string | null
          status?: 'active' | 'inactive' | 'expired'
          created_at?: string
        }
        Update: {
          id?: string
          code?: string
          discount_type?: 'percentage' | 'fixed_amount'
          discount_value?: number
          min_order_amount?: number | null
          max_discount_amount?: number | null
          usage_limit?: number | null
          usage_count?: number
          valid_from?: string | null
          valid_until?: string | null
          status?: 'active' | 'inactive' | 'expired'
          created_at?: string
        }
      }
      favorites: {
        Row: {
          id: string
          customer_id: string
          menu_item_id: string
          created_at: string
        }
        Insert: {
          id?: string
          customer_id: string
          menu_item_id: string
          created_at?: string
        }
        Update: {
          id?: string
          customer_id?: string
          menu_item_id?: string
          created_at?: string
        }
      }
      notifications: {
        Row: {
          id: string
          user_id: string
          type: 'order_status' | 'account' | 'system' | 'promotion'
          title: string
          message: string
          data: Json | null
          read: boolean
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          type: 'order_status' | 'account' | 'system' | 'promotion'
          title: string
          message: string
          data?: Json | null
          read?: boolean
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          type?: 'order_status' | 'account' | 'system' | 'promotion'
          title?: string
          message?: string
          data?: Json | null
          read?: boolean
          created_at?: string
        }
      }
      activity_logs: {
        Row: {
          id: string
          user_id: string | null
          entity_type: string
          entity_id: string | null
          action: string
          details: Json | null
          ip_address: string | null
          created_at: string
        }
        Insert: {
          id?: string
          user_id?: string | null
          entity_type: string
          entity_id?: string | null
          action: string
          details?: Json | null
          ip_address?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string | null
          entity_type?: string
          entity_id?: string | null
          action?: string
          details?: Json | null
          ip_address?: string | null
          created_at?: string
        }
      }
    }
  }
}
