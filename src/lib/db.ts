import { createClient } from '@supabase/supabase-js'

// Supabase client configuration
const supabaseUrl = process.env.SUPABASE_URL
const supabaseKey = process.env.SUPABASE_ANON_KEY

function isValidHttpUrl(url?: string) {
  if (!url) return false
  return url.startsWith('http://') || url.startsWith('https://')
}

// Create Supabase client
export const supabase = (isValidHttpUrl(supabaseUrl) && !!supabaseKey)
  ? createClient(supabaseUrl as string, supabaseKey as string)
  : null

// Database helper functions
export const db = {
  // User operations
  async createUser(userData: {
    email: string
    password: string
    name?: string
    subscriptionStatus?: string
    usageCountDay?: number
    usageCountMonth?: number
  }) {
    if (!supabase) throw new Error('Supabase client not initialized')
    
    const { data, error } = await supabase
      .from('users')
      .insert([{
        email: userData.email,
        password: userData.password,
        name: userData.name || null,
        subscription_status: userData.subscriptionStatus || 'FREE',
        usage_count_day: userData.usageCountDay || 0,
        usage_count_month: userData.usageCountMonth || 0,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      }])
      .select()
      .single()
    
    if (error) throw error
    return data
  },

  async findUserByEmail(email: string) {
    if (!supabase) throw new Error('Supabase client not initialized')
    
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .eq('email', email)
      .single()
    
    if (error && error.code !== 'PGRST116') throw error
    return data
  },

  async findUserById(id: string) {
    if (!supabase) throw new Error('Supabase client not initialized')
    
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .eq('id', id)
      .single()
    
    if (error && error.code !== 'PGRST116') throw error
    return data
  },

  async updateUser(id: string, updates: any) {
    if (!supabase) throw new Error('Supabase client not initialized')
    
    const { data, error } = await supabase
      .from('users')
      .update({
        ...updates,
        updated_at: new Date().toISOString()
      })
      .eq('id', id)
      .select()
      .single()
    
    if (error) throw error
    return data
  },

  // Generation operations
  async createGeneration(generationData: {
    userId: string
    prompt: string
    outputText: string
    templateType: string
  }) {
    if (!supabase) throw new Error('Supabase client not initialized')
    
    const { data, error } = await supabase
      .from('generations')
      .insert([{
        user_id: generationData.userId,
        prompt: generationData.prompt,
        output_text: generationData.outputText,
        template_type: generationData.templateType,
        created_at: new Date().toISOString()
      }])
      .select()
      .single()
    
    if (error) throw error
    return data
  },

  async getUserGenerations(userId: string) {
    if (!supabase) throw new Error('Supabase client not initialized')
    
    const { data, error } = await supabase
      .from('generations')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
    
    if (error) throw error
    return data || []
  },

  // Test connection
  async testConnection() {
    if (!supabase) throw new Error('Supabase client not initialized')
    
    const { data, error } = await supabase
      .from('users')
      .select('count', { count: 'exact', head: true })
    
    if (error) throw error
    return { connected: true, userCount: data || 0 }
  }
}