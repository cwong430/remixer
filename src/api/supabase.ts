import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseKey) {
  throw new Error('Missing Supabase environment variables')
}

export const supabase = createClient(supabaseUrl, supabaseKey)

export interface SavedTweet {
  id: number
  content: string
  created_at: string
}

// Get all saved tweets
export async function getSavedTweets() {
  const { data, error } = await supabase
    .from('saved_tweets')
    .select('*')
    .order('created_at', { ascending: false })
  
  if (error) {
    console.error('Error fetching tweets:', error.message)
    return []
  }
  
  console.log('Fetched tweets:', data)
  return data
}

// Remove duplicates from the table
async function removeDuplicateTweets() {
  // This SQL will keep only one row for each content, the one with the lowest ID
  const { error } = await supabase.rpc('remove_duplicate_tweets')
  
  if (error) {
    console.error('Error removing duplicates:', error.message)
    return false
  }
  
  return true
}

// Save a new tweet
export async function saveTweet(content: string) {
  // First check if tweet already exists
  const { data: existing, error: checkError } = await supabase
    .from('saved_tweets')
    .select('id')
    .eq('content', content)
    .single()

  if (checkError && checkError.code !== 'PGRST116') { // PGRST116 is "not found" error
    console.error('Error checking for existing tweet:', checkError.message)
    return false
  }

  if (existing) {
    console.log('Tweet already exists, skipping save')
    // Remove duplicates while we're here
    await removeDuplicateTweets()
    return true
  }

  const { error: insertError } = await supabase
    .from('saved_tweets')
    .insert([{ content }])
  
  if (insertError) {
    console.error('Error saving tweet:', insertError.message)
    return false
  }

  // Remove any duplicates that might have been created
  await removeDuplicateTweets()
  
  return true
}

// Delete a saved tweet
export async function deleteSavedTweet(id: number) {
  const { error } = await supabase
    .from('saved_tweets')
    .delete()
    .eq('id', id)
  
  if (error) {
    console.error('Error deleting tweet:', error.message)
    return false
  }
  
  return true
}

// Update a tweet
export async function updateTweet(id: number, content: string) {
  const { error } = await supabase
    .from('saved_tweets')
    .update({ content })
    .eq('id', id)
  
  if (error) {
    console.error('Error updating tweet:', error.message)
    return false
  }
  
  return true
} 