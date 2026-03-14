import { supabase } from "../supabase/client"

export async function getConversation(userId){

  let { data } = await supabase
    .from("conversations")
    .select("*")
    .eq("user_id", userId)
    .single()

  if(!data){

    const { data:newConv } = await supabase
      .from("conversations")
      .insert([{ user_id:userId }])
      .select()
      .single()

    return newConv
  }

  return data
}

export async function sendMessage(conversationId,userId,text){

  return supabase
    .from("messages")
    .insert([
      {
        conversation_id:conversationId,
        sender_id:userId,
        message:text
      }
    ])
}

export async function loadMessages(conversationId){

  const { data } = await supabase
    .from("messages")
    .select("*")
    .eq("conversation_id",conversationId)
    .order("created_at")

  return data || []
}
