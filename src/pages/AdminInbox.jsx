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
      
      // Pokušavamo da povučemo podatke
      const { data, error } = await supabase
        .from("conversations")
        .select(`
          id,
          users (
            first_name,
            last_name,
            email
          )
        `)

      if (error) {
        // Ako Supabase vrati grešku (npr. RLS polisa ili loš Join)
        console.error("Supabase Error:", error.message)
        console.error("Detalji greške:", error.details)
        setErrorMessage(`Greška: ${error.message}`)
      } else {
        console.log("Uspešno povučeni podaci:", data)
        setConversations(data || [])
      }
    } catch (err) {
      // Ako se desi neočekivana JS greška
      console.error("Unexpected Error:", err)
      setErrorMessage("Desila se neočekivana greška prilikom učitavanja.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="container mx-auto py-10 px-4">
      <h1 className="text-3xl font-bold mb-8">Admin Inbox</h1>

      {/* Prikaz greške na ekranu ako postoji */}
      {errorMessage && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          <p>{errorMessage}</p>
          <p className="text-sm italic">Pogledaj konzolu (F12) za više detalja.</p>
        </div>
      )}

      {loading ? (
        <p>Učitavanje konverzacija...</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full border-collapse border border-gray-200">
            <thead className="bg-gray-100">
              <tr>
                <th className="border p-3 text-left">User</th>
                <th className="border p-3 text-left">Email</th>
                <th className="border p-3 text-center">Chat</th>
              </tr>
            </thead>
            <tbody>
              {conversations.length > 0 ? (
                conversations.map((c) => (
                  <tr key={c.id} className="hover:bg-gray-50">
                    <td className="border p-3">
                      {c.users?.first_name} {c.users?.last_name || "N/A"}
                    </td>
                    <td className="border p-3">
                      {c.users?.email || "N/A"}
                    </td>
                    <td className="border p-3 text-center">
                      <Link
                        to={`/admin/chat/${c.id}`}
                        className="bg-blue-600 text-white px-4 py-1 rounded hover:bg-blue-700 transition"
                      >
                        Open
                      </Link>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="3" className="border p-10 text-center text-gray-500">
                    Nema pronađenih konverzacija.
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