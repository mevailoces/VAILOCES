import React, { useEffect, useState } from 'react'
import { supabase } from '../supabaseClient'

export default function TableReader({ tableName }) {
  const [columns, setColumns] = useState([])
  const [rows, setRows] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    async function load() {
      setLoading(true)
      setError(null)
      try {
        const { data: oneRow, error: oneErr } = await supabase.from(tableName).select('*').limit(1)
        if (oneErr) throw oneErr
        if (oneRow && oneRow.length > 0) setColumns(Object.keys(oneRow[0]))

        const { data: allRows, error: allErr } = await supabase.from(tableName).select('*').order('id', { ascending: true })
        if (allErr) throw allErr
        setRows(allRows || [])
      } catch (err) {
        setError(err.message || 'Error fetching data')
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [tableName])

  if (loading) return <div>Loading...</div>
  if (error) return <div style={{ color: 'red' }}>Error: {error}</div>
  if (rows.length === 0) return <div>No rows found. Please add sample rows in Supabase.</div>

  const displayColumns = columns.length ? columns : Object.keys(rows[0])

  return (
    <div style={{ overflowX: 'auto' }}>
      <table style={{ borderCollapse: 'collapse', width: '100%' }}>
        <thead>
          <tr>
            {displayColumns.map(col => <th key={col} style={{ border: '1px solid #ddd', padding: '8px', textAlign: 'left' }}>{col}</th>)}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, rIdx) => (
            <tr key={rIdx}>
              {displayColumns.map(col => <td key={col} style={{ border: '1px solid #ddd', padding: '8px' }}>{String(row[col] ?? '')}</td>)}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
