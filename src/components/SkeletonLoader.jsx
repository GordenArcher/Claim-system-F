import React from 'react'

export default function SkeletonLoader({ number }) {
  return (
    <div className="w-full p-4 md:p-8">
        <div className="container mx-auto">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {Array(number).fill().map((_, index) => (
                    <div 
                    key={index} 
                    className="bg-gray-200 rounded-lg h-35 animate-pulse"
                    />
                ))}
            </div>
        </div>
    </div>
  )
}