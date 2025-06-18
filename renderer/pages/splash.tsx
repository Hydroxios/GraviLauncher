"use client"

import Image from 'next/image'
import { useState } from 'react'

const SplashPage = () => {
    const [checkUpdate, setCheckUpdate] = useState(true)

    
  return (
    <div className="flex flex-col items-center justify-center h-full">
      <Image src="/images/logo.png" alt="Logo" width={100} height={100} />
      {checkUpdate && (
        <div className="flex flex-col items-center justify-center">
          <p>Checking for updates...</p>
        </div>
      )}
    </div>
  )
}

export default SplashPage