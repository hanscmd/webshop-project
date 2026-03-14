import { useEffect,useState } from "react"
import { supabase } from "../supabase/client"
import { getConversation,loadMessages,sendMessage } from "../chat/chatService"

export default function UserChat(){

  const [conversation,setConversation] = useState(null)
  const [messages,setMessages] = useState([])
  const [text,setText] = useState("")

  useEffect(()=>{
    init()
  },[])

  async function init(){

    const { data:userData } = await supabase.auth.getUser()

    const conv = await getConversation(userData.user.id)

    setConversation(conv)

    const msgs = await loadMessages(conv.id)

    setMessages(msgs)

    subscribe(conv.id)
  }

  function subscribe(id){

    supabase
      .channel("chat")
      .on(
        "postgres_changes",
        {
          event:"INSERT",
          schema:"public",
          table:"messages",
          filter:`conversation_id=eq.${id}`
        },
        payload=>{
          setMessages(m=>[...m,payload.new])
        }
      )
      .subscribe()
  }

  async function send(){

    const { data:userData } = await supabase.auth.getUser()

    await sendMessage(conversation.id,userData.user.id,text)

    setText("")
  }

  return(

    <div className="container mx-auto py-10">

      <h1 className="text-2xl font-bold mb-6">
        Support Chat
      </h1>

      <div className="border h-96 overflow-y-scroll p-4">

        {messages.map(m=>(
          <div key={m.id} className="mb-3">
            {m.message}
          </div>
        ))}

      </div>

      <div className="flex mt-4">

        <input
          value={text}
          onChange={e=>setText(e.target.value)}
          className="border flex-1 p-2"
        />

        <button
          onClick={send}
          className="bg-blue-600 text-white px-4"
        >
          Send
        </button>

      </div>

    </div>
  )
}
