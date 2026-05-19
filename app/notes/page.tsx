'use client'

import React, { useEffect, useState } from 'react'

const API = 'http://localhost:8080/api/v1/notes'

interface Note {
  id: number
  title: string
  content: string
  createdAt: string
  updatedAt: string
}

export default function NotesPage() {
  const [notes, setNotes] = useState<Note[]>([])
  const [title, setTitle] = useState('')
  const [content, setContent] = useState('')
  const [editingId, setEditingId] = useState<number | null>(null)
  const [editTitle, setEditTitle] = useState('')
  const [editContent, setEditContent] = useState('')
  const [error, setError] = useState('')

  const fetchNotes = async () => {
    try {
      const res = await fetch(API)
      const data = await res.json()
      if (data.success) setNotes(data.result)
    } catch {
      setError('Could not connect to server. Make sure the Java backend is running on port 8080.')
    }
  }

  useEffect(() => { fetchNotes() }, [])

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    if (!title.trim() || !content.trim()) { setError('Title and content are required.'); return }
    const res = await fetch(API, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ title, content }),
    })
    const data = await res.json()
    if (data.success) {
      setNotes(prev => [...prev, data.result])
      setTitle('')
      setContent('')
    } else {
      setError(data.message || 'Failed to create note.')
    }
  }

  const startEdit = (note: Note) => {
    setEditingId(note.id)
    setEditTitle(note.title)
    setEditContent(note.content)
  }

  const handleUpdate = async (id: number) => {
    const res = await fetch(`${API}/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ title: editTitle, content: editContent }),
    })
    const data = await res.json()
    if (data.success) {
      setNotes(prev => prev.map(n => n.id === id ? data.result : n))
      setEditingId(null)
    }
  }

  const handleDelete = async (id: number) => {
    const res = await fetch(`${API}/${id}`, { method: 'DELETE' })
    const data = await res.json()
    if (data.success) setNotes(prev => prev.filter(n => n.id !== id))
  }

  return (
    <div className="min-h-screen bg-[#0B1120] text-gray-100 py-10 px-4">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-3xl font-extrabold text-white mb-8">Notes</h1>

        <form onSubmit={handleCreate} className="bg-gray-800/60 rounded-xl p-6 mb-8 space-y-4">
          <h2 className="text-lg font-semibold text-white">New Note</h2>
          {error && <p className="text-red-400 text-sm">{error}</p>}
          <input
            type="text"
            placeholder="Title"
            value={title}
            onChange={e => setTitle(e.target.value)}
            className="w-full bg-gray-700 rounded-lg px-4 py-2 text-white placeholder-gray-400 outline-none focus:ring-2 focus:ring-[#3B82F6]"
          />
          <textarea
            placeholder="Content"
            value={content}
            onChange={e => setContent(e.target.value)}
            rows={3}
            className="w-full bg-gray-700 rounded-lg px-4 py-2 text-white placeholder-gray-400 outline-none focus:ring-2 focus:ring-[#3B82F6] resize-none"
          />
          <button
            type="submit"
            className="bg-[#3B82F6] hover:bg-[#2563EB] text-white font-semibold px-6 py-2 rounded-lg transition-colors"
          >
            Add Note
          </button>
        </form>

        {notes.length === 0 ? (
          <p className="text-gray-400 text-center py-12">No notes yet. Create one above.</p>
        ) : (
          <ul className="space-y-4">
            {notes.map(note => (
              <li key={note.id} className="bg-gray-800/60 rounded-xl p-5">
                {editingId === note.id ? (
                  <div className="space-y-3">
                    <input
                      value={editTitle}
                      onChange={e => setEditTitle(e.target.value)}
                      className="w-full bg-gray-700 rounded-lg px-4 py-2 text-white outline-none focus:ring-2 focus:ring-[#3B82F6]"
                    />
                    <textarea
                      value={editContent}
                      onChange={e => setEditContent(e.target.value)}
                      rows={3}
                      className="w-full bg-gray-700 rounded-lg px-4 py-2 text-white outline-none focus:ring-2 focus:ring-[#3B82F6] resize-none"
                    />
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleUpdate(note.id)}
                        className="bg-[#10B981] hover:bg-[#059669] text-white text-sm px-4 py-1.5 rounded-lg transition-colors"
                      >
                        Save
                      </button>
                      <button
                        onClick={() => setEditingId(null)}
                        className="bg-gray-600 hover:bg-gray-500 text-white text-sm px-4 py-1.5 rounded-lg transition-colors"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="flex justify-between items-start gap-4">
                    <div>
                      <h3 className="text-white font-semibold text-lg">{note.title}</h3>
                      <p className="text-gray-300 mt-1 whitespace-pre-wrap">{note.content}</p>
                      <p className="text-gray-500 text-xs mt-3">
                        #{note.id} · Created {new Date(note.createdAt).toLocaleString()}
                        {note.updatedAt !== note.createdAt && ` · Updated ${new Date(note.updatedAt).toLocaleString()}`}
                      </p>
                    </div>
                    <div className="flex gap-2 shrink-0">
                      <button
                        onClick={() => startEdit(note)}
                        className="bg-gray-600 hover:bg-gray-500 text-white text-sm px-3 py-1.5 rounded-lg transition-colors"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(note.id)}
                        className="bg-red-700 hover:bg-red-600 text-white text-sm px-3 py-1.5 rounded-lg transition-colors"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                )}
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  )
}
