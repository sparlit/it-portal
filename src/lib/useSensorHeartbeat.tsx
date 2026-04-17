"use client"

import { useState, useEffect } from 'react'

interface SensorData {
  temp: number
  pressure: number
  throughput: number
}

export function useSensorHeartbeat() {
  const [data, setData] = useState<SensorData>({ temp: 60, pressure: 1.2, throughput: 85 })

  useEffect(() => {
    const interval = setInterval(() => {
      setData(prev => ({
        temp: prev.temp + (Math.random() * 2 - 1), // Drift +/- 1
        pressure: prev.pressure + (Math.random() * 0.1 - 0.05),
        throughput: prev.throughput + (Math.random() * 5 - 2.5)
      }))
    }, 3000)

    return () => clearInterval(interval)
  }, [])

  return data
}
