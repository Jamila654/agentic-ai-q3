import React from 'react'
import StaggeredLetter from './animata/text/staggered-letter'
import Link from 'next/link'

export default function Title() {
  return (
    <div className=' absolute top-0 text-black font-bold'>
        <Link href="/"><StaggeredLetter text="Jam's Chatbot" /></Link>
    </div>
  )
}
