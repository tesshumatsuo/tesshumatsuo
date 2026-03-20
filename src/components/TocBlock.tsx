'use client'

import { useState } from 'react'

export default function TocBlock({ headings }: { headings: { id: string, text: string, level: number }[] }) {
  const [isOpen, setIsOpen] = useState(false)

  if (!headings || headings.length === 0) return null

  // Function to calculate numbering
  const getNumbering = (headings: any[]) => {
    let counters = [0, 0, 0] // [h2, h3, h4]
    return headings.map(h => {
      if (h.level === 2) {
        counters[0]++
        counters[1] = 0
        counters[2] = 0
        return { ...h, num: `${counters[0]}` }
      } else if (h.level === 3) {
        counters[1]++
        counters[2] = 0
        return { ...h, num: `${counters[0]}.${counters[1]}` }
      } else if (h.level === 4) {
        counters[2]++
        return { ...h, num: `${counters[0]}.${counters[1]}.${counters[2]}` }
      }
      return { ...h, num: '' }
    })
  }

  const numberedHeadings = getNumbering(headings)

  return (
    <div className="my-10 border border-gray-200 bg-[#fafafa] shadow-sm text-gray-800">
      <div className="flex items-center justify-center p-4 border-b border-gray-200 bg-white">
        <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
        <span className="font-bold text-xl mr-2 text-black">Contents</span>
        <button 
          onClick={() => setIsOpen(!isOpen)}
          aria-expanded={isOpen}
          className="text-blue-500 hover:text-blue-700 text-sm font-medium"
        >
          [{isOpen ? 'hide' : 'show'}]
        </button>
      </div>
      
      {isOpen && (
        <div className="p-6 md:p-8">
          <ul className="space-y-5">
            {numberedHeadings.map((h, i) => (
              <li 
                key={i} 
                className={`
                  ${h.level === 3 ? 'ml-6 md:ml-8' : ''} 
                  ${h.level === 4 ? 'ml-12 md:ml-16 text-sm text-gray-600' : ''}
                  ${h.level === 2 ? 'font-bold text-gray-900 border-b border-gray-100 pb-2' : ''}
                `}
              >
                <a href={`#${h.id}`} className="hover:text-blue-600 transition-colors flex items-start gap-3">
                  <span className="text-gray-300 font-bold shrink-0">{h.num}</span>
                  <span>{h.text}</span>
                </a>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  )
}
