import { useEffect,useState } from "react"
import { supabase } from "../supabase/client"
import { Link } from "react-router-dom"

export default function AdminInbox(){

  const [conversations,setConversations] = useState([])

  useEffect(()=>{
    load()
  },[])

  async function load(){

    const { data } = await supabase
      .from("conversations")
      .select(`
        id,
        users(
          first_name,
          last_name,
          email
        )
      `)

    setConversations(data || [])
  }

  return(

    <div className="container mx-auto py-10">

      <h1 className="text-3xl font-bold mb-8">
        Admin Inbox
      </h1>

      <table className="w-full border">

        <thead>

          <tr>
            <th>User</th>
            <th>Email</th>
            <th>Chat</th>
          </tr>

        </thead>

        <tbody>

        {conversations.map(c=>(
          <tr key={c.id}>

            <td>
              {c.users?.first_name} {c.users?.last_name}
            </td>

            <td>
              {c.users?.email}
            </td>

            <td>
              <Link
                to={`/admin/chat/${c.id}`}
                className="text-blue-600"
              >
                Open
              </Link>
            </td>

          </tr>
        ))}

        </tbody>

      </table>

    </div>
  )
}
