import React, { useState } from 'react'

interface CustomSelectProps {
  label: string
  name: string
  options: Array<{ label: string; value: string }>
  value: string
  onChange: (value: string) => void
}

const CustomSelect: React.FC<CustomSelectProps> = ({ label, name, options, value, onChange }) => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')

  // Filter options based on the search term
  const filteredOptions = options.filter((option) =>
    option.label.toLowerCase().includes(searchTerm.toLowerCase())
  )

  return (
    <div className="w-full">
      {/* Label */}
      <label htmlFor={name} className="block text-sm font-medium text-gray-700">
        {label} <span className="text-red-500">*</span>
      </label>

      {/* Select Trigger */}
      <div className="relative mt-2" onClick={() => setIsDropdownOpen(!isDropdownOpen)}>
        <button
          type="button"
          className="w-full rounded-md border border-gray-300 bg-white py-2 pr-10 pl-3 text-left shadow-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500 sm:text-sm"
        >
          {value
            ? options.find((option) => option.value === value)?.label || 'Tanlang...'
            : 'Tanlang...'}
        </button>

        {/* Dropdown Content */}
        {isDropdownOpen && (
          <div className="absolute z-10 mt-1 max-h-52 w-full overflow-auto rounded-md border border-gray-300 bg-white shadow-lg">
            {/* Search Input */}
            <div className="p-2">
              <input
                type="text"
                placeholder="Qidirish..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full rounded-md border border-gray-300 px-2 py-1 text-sm text-gray-700 focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
              />
            </div>

            {/* Option List */}
            <ul className="py-1">
              {filteredOptions.length > 0 ? (
                filteredOptions.map((option) => (
                  <li
                    key={option.value}
                    className={`cursor-pointer px-4 py-2 text-sm hover:bg-blue-100 ${
                      value === option.value ? 'bg-blue-500 text-white' : ''
                    }`}
                    onClick={() => {
                      onChange(option.value)
                      setIsDropdownOpen(false)
                      setSearchTerm('') // Reset search term
                    }}
                  >
                    {option.label}
                  </li>
                ))
              ) : (
                <li className="px-4 py-2 text-sm text-gray-500">Hech narsa topilmadi</li>
              )}
            </ul>
          </div>
        )}
      </div>
    </div>
  )
}

export default CustomSelect
