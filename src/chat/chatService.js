import { supabase } from "../supabase/client"

export async function getConversation(userId) {
  // Koristimo .maybeSingle() umesto .single() 
  // .maybeSingle() vraća null ako nema reda, bez bacanja Error-a koji blokira kod
  let { data, error } = await supabase
    .from("conversations")
    .select("*")
    .eq("user_id", userId)
    .maybeSingle()

  // Ako konverzacija ne postoji (data je null)
  if (!data) {
    console.log("Konverzacija ne postoji, kreiram novu za korisnika:", userId)
    
    const { data: newConv, error: insertError } = await supabase
      .from("conversations")
      .insert([{ user_id: userId }])
      .select()
      .single()

    if (insertError) {
      console.error("Greška pri kreiranju konverzacije:", insertError.message)
      return null
    }

    return newConv
  }

  return data
}

export async function sendMessage(conversationId, userId, text) {
  // Osiguranje da ne šaljemo prazne poruke
  if (!text || text.trim() === "") return

  const { error } = await supabase
    .from("messages")
    .insert([
      {
        conversation_id: conversationId,
        sender_id: userId,
        message: text
      }
    ])

  if (error) {
    console.error("Greška pri slanju poruke:", error.message)
  }
}

export async function loadMessages(conversationId) {
  if (!conversationId) return []

  const { data, error } = await supabase
    .from("messages")
    .select("*")
    .eq("conversation_id", conversationId)
    .order("created_at", { ascending: true })

  if (error) {
    console.error("Greška pri učitavanju poruka:", error.message)
    return []
  }

  return data || []
}