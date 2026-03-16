'use client'

import { useState } from 'react'

export default function ContactForm() {
  const [status, setStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle')
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: ''
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev: typeof formData) => ({ ...prev, [name]: value }))
  }


  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setStatus('submitting')

    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
      })

      if (!res.ok) throw new Error('Failed to send message')
      
      setStatus('success')
      setFormData({ name: '', email: '', message: '' })
    } catch (err) {
      console.error(err)
      setStatus('error')
    }
  }

  if (status === 'success') {
    return (
      <div className="bg-green-50 text-green-800 p-6 rounded-2xl border border-green-100 text-center space-y-3">
        <h3 className="font-bold text-lg">メッセージを送信しました</h3>
        <p className="text-sm">お問い合わせありがとうございます。折り返しご連絡いたします。</p>
        <button 
          onClick={() => setStatus('idle')}
          className="mt-4 px-4 py-2 bg-white text-green-700 text-sm font-medium rounded-lg border border-green-200 hover:bg-green-50 transition-colors"
        >
          別のメッセージを送る
        </button>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="text-left space-y-5 max-w-lg mx-auto w-full">
      <div className="space-y-1">
        <label htmlFor="name" className="text-sm font-medium text-gray-700 block">Name</label>
        <input
          type="text"
          id="name"
          name="name"
          required
          value={formData.name}
          onChange={handleChange}
          className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-shadow bg-white"
          placeholder="山田 太郎"
        />
      </div>

      <div className="space-y-1">
        <label htmlFor="email" className="text-sm font-medium text-gray-700 block">Email</label>
        <input
          type="email"
          id="email"
          name="email"
          required
          value={formData.email}
          onChange={handleChange}
          className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-shadow bg-white"
          placeholder="hello@example.com"
        />
      </div>

      <div className="space-y-1">
        <label htmlFor="message" className="text-sm font-medium text-gray-700 block">Message</label>
        <textarea
          id="message"
          name="message"
          required
          rows={5}
          value={formData.message}
          onChange={handleChange}
          className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-shadow bg-white resize-y"
          placeholder="ご要件をご記入ください..."
        />
      </div>

      {status === 'error' && (
        <p className="text-red-600 text-sm font-medium pt-1 text-center">
          送信に失敗しました。時間をおいて再度お試しください。
        </p>
      )}

      <button
        type="submit"
        disabled={status === 'submitting'}
        className={`w-full py-3.5 px-6 rounded-lg text-white font-medium transition-all shadow-sm
          ${status === 'submitting' 
            ? 'bg-blue-400 cursor-not-allowed' 
            : 'bg-blue-600 hover:bg-blue-700 active:transform active:scale-[0.98]'
          }`}
      >
        {status === 'submitting' ? '送信中...' : 'Send Message'}
      </button>
    </form>
  )
}
