import { useState, useEffect } from 'react'
import { supabase } from '../supabase/client'

export default function AdminDashboard() {
  const [messages, setMessages] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchMessages()
  }, [])

  const fetchMessages = async () => {
    const { data, error } = await supabase
      .from('messages')
      .select('*')
      .order('created_at', { ascending: false })

    if (!error) {
      setMessages(data)
    }
    setLoading(false)
  }

  if (loading) {
    return <div className="text-center py-8">Loading messages...</div>
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-gray-800 mb-8">Admin Dashboard</h1>
      
      <div className="bg-white shadow-md rounded-lg overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Name
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Email
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Message
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Date
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {messages.map((message) => (
              <tr key={message.id}>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {message.name}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {message.email}
                </td>
                <td className="px-6 py-4 text-sm text-gray-500">
                  {message.message}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {new Date(message.created_at).toLocaleDateString()}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}