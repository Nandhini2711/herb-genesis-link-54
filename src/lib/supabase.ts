import { createClient } from '@supabase/supabase-js'
import { SUPABASE_CONFIG } from './env'

export const supabase = createClient(SUPABASE_CONFIG.url, SUPABASE_CONFIG.anonKey)

export interface HerbRecord {
  id: string
  herb_name: string
  farmer_name: string
  location: string
  harvest_date: string
  notes?: string
  qr_code_url?: string
  created_at: string
}

export interface ScanRecord {
  id: string
  herb_id: string
  scanned_at: string
  consumer_ip?: string
}

// Database functions
export const herbService = {
  // Create a new herb record
  async createHerb(herbData: Omit<HerbRecord, 'id' | 'created_at'>) {
    const { data, error } = await supabase
      .from('herbs')
      .insert(herbData)
      .select()
      .single()
    
    if (error) throw error
    return data
  },

  // Get all herbs
  async getAllHerbs() {
    const { data, error } = await supabase
      .from('herbs')
      .select('*')
      .order('created_at', { ascending: false })
    
    if (error) throw error
    return data
  },

  // Get herb by ID
  async getHerbById(id: string) {
    const { data, error } = await supabase
      .from('herbs')
      .select('*')
      .eq('id', id)
      .single()
    
    if (error) throw error
    return data
  },

  // Record a scan
  async recordScan(herbId: string) {
    const { data, error } = await supabase
      .from('scans')
      .insert({
        herb_id: herbId,
        scanned_at: new Date().toISOString()
      })
      .select()
      .single()
    
    if (error) throw error
    return data
  },

  // Get scan history for a herb
  async getScanHistory(herbId: string) {
    const { data, error } = await supabase
      .from('scans')
      .select('*')
      .eq('herb_id', herbId)
      .order('scanned_at', { ascending: false })
    
    if (error) throw error
    return data
  }
}