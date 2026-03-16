import { useEffect, useState } from "react"
import { supabase } from "../supabase/client"
import { Link } from "react-router-dom"

export default function AdminInbox() {
  const [conversations, setConversations] = useState([])
  const [loading, setLoading] = useState(true)
  const [errorMessage, setErrorMessage] = useState(null)

  useEffect(() => {
    load()
  }, [])

  async function load() {
    try {
      setLoading(true)
      
      // KLJUČNA IZMENA: Profiles umesto Users i eksplicitna veza preko !user_id
      const { data, error } = await supabase
        .from("conversations")
        .select(`
          id,
          profiles!user_id (
            first_name,
            last_name,
            email
          )
        `)

      if (error) {
        console.error("Supabase Error:", error.message)
        setErrorMessage(`Greška: ${error.message}`)
      } else {
        console.log("Uspešno povučeni podaci:", data)
        setConversations(data || [])
      }
    } catch (err) {
      console.error("Unexpected Error:", err)
      setErrorMessage("Desila se neočekivana greška prilikom učitavanja.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="container mx-auto py-10 px-4">
      <h1 className="text-3xl font-bold mb-8 italic">Admin Inbox</h1>

      {errorMessage && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          <p>{errorMessage}</p>
        </div>
      )}

      {loading ? (
        <p>Učitavanje konverzacija...</p>
      ) : (
        <div className="overflow-x-auto shadow-lg rounded-lg">
          <table className="w-full border-collapse bg-white">
            <thead className="bg-gray-800 text-white">
              <tr>
                <th className="p-3 text-left">User</th>
                <th className="p-3 text-left">Email</th>
                <th className="p-3 text-center">Chat</th>
              </tr>
            </thead>
            <tbody>
              {conversations.length > 0 ? (
                conversations.map((c) => (
                  <tr key={c.id} className="border-b hover:bg-gray-50 transition">
                    <td className="p-3">
                      {/* Izmena: c.profiles umesto c.users */}
                      {c.profiles?.first_name} {c.profiles?.last_name || "New User"}
                    </td>
                    <td className="p-3 italic text-gray-600">
                      {c.profiles?.email}
                    </td>
                    <td className="p-3 text-center">
                      <Link
                        to={`/admin/chat/${c.id}`}
                        className="bg-blue-600 text-white px-4 py-2 rounded-full text-sm font-bold hover:bg-blue-700 transition"
                      >
                        Open Chat
                      </Link>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="3" className="p-10 text-center text-gray-500 italic">
                    Nema pronađenih konverzacija. Proverite da li su korisnici otvorili Support stranicu.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}