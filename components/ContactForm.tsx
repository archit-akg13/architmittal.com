'use client'

import { useState } from 'react'
import { TOPMATE_URL, BUDGET_OPTIONS, SOURCE_OPTIONS } from '@/lib/constants'

export default function ContactForm() {
  const [formData, setFormData] = useState({
    fullName: '',
    company: '',
    email: '',
    phone: '',
    automationNeeds: '',
    budget: '',
    source: '',
  })
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle')
  const [message, setMessage] = useState('')

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setStatus('loading')
    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      })
      const data = await res.json()
      if (res.ok) {
        setStatus('success')
        setMessage(data.message)
      } else {
        setStatus('error')
        setMessage(data.error || 'Something went wrong')
      }
    } catch {
      setStatus('error')
      setMessage('Something went wrong')
    }
  }

  if (status === 'success') {
    return (
      <div className="text-center py-12">
        <span className="text-lime text-5xl animate-checkmark inline-block mb-4">&#10003;</span>
        <h3 className="font-heading font-bold text-xl text-heading mb-2">{message}</h3>
        <p className="font-body text-body mb-4">
          For urgent requests, book a slot directly:
        </p>
        <a
          href={TOPMATE_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-block bg-lime hover:bg-lime-dark text-white px-6 py-3 rounded-lg font-heading font-semibold transition-colors"
        >
          Book on Topmate
        </a>
      </div>
    )
  }

  const inputClass = 'w-full px-4 py-3 border border-gray-300 rounded-lg text-sm font-body focus:outline-none focus:border-lime transition-colors'
  const labelClass = 'block text-sm font-heading font-semibold text-heading mb-1'

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        <div>
          <label className={labelClass}>Full Name *</label>
          <input type="text" name="fullName" value={formData.fullName} onChange={handleChange} required className={inputClass} placeholder="Your full name" />
        </div>
        <div>
          <label className={labelClass}>Company Name *</label>
          <input type="text" name="company" value={formData.company} onChange={handleChange} required className={inputClass} placeholder="Your company" />
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        <div>
          <label className={labelClass}>Email *</label>
          <input type="email" name="email" value={formData.email} onChange={handleChange} required className={inputClass} placeholder="your@email.com" />
        </div>
        <div>
          <label className={labelClass}>Phone</label>
          <input type="tel" name="phone" value={formData.phone} onChange={handleChange} className={inputClass} placeholder="+91 XXXXX XXXXX" />
        </div>
      </div>

      <div>
        <label className={labelClass}>What do you want to automate? *</label>
        <textarea
          name="automationNeeds"
          value={formData.automationNeeds}
          onChange={handleChange}
          required
          rows={4}
          className={inputClass}
          placeholder="Describe the processes you want to automate..."
        />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        <div>
          <label className={labelClass}>Estimated Monthly Budget</label>
          <select name="budget" value={formData.budget} onChange={handleChange} className={inputClass}>
            <option value="">Select budget range</option>
            {BUDGET_OPTIONS.map((opt) => (
              <option key={opt} value={opt}>{opt}</option>
            ))}
          </select>
        </div>
        <div>
          <label className={labelClass}>How did you find me?</label>
          <select name="source" value={formData.source} onChange={handleChange} className={inputClass}>
            <option value="">Select source</option>
            {SOURCE_OPTIONS.map((opt) => (
              <option key={opt} value={opt}>{opt}</option>
            ))}
          </select>
        </div>
      </div>

      <button
        type="submit"
        disabled={status === 'loading'}
        className="w-full bg-lime hover:bg-lime-dark text-white py-3 rounded-lg font-heading font-semibold transition-colors disabled:opacity-50"
      >
        {status === 'loading' ? 'Sending...' : 'Send Inquiry'}
      </button>

      {status === 'error' && <p className="text-red-500 text-sm text-center">{message}</p>}
    </form>
  )
}
