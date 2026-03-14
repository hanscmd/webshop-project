import { useEffect,useState } from "react"
import { useParams } from "react-router-dom"
import { supabase } from "../supabase/client"
import { loadMessages,sendMessage } from "../chat/chatService"

export default function AdminChat(){

  const { id } = useParams()

  const [messages,setMessages] = useState([])
  const [text,setText] = useState("")

  useEffect(()=>{
    init()
  },[])

  async function init(){

    const msgs = await loadMessages(id)

    setMessages(msgs)

    subscribe()
  }

  function subscribe(){

    supabase
      .channel("adminchat")
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

    await sendMessage(id,userData.user.id,text)

    setText("")
  }

  return(

    <div className="container mx-auto py-10">

      <div className="border h-96 overflow-y-scroll p-4">

        {messages.map(m=>(
          <div key={m.id}>{m.message}</div>
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
