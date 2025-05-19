import React from 'react'
import GetStartedButton from './button/get-started-button'
import WorkButton from './button/work-button'
import { Menu } from 'lucide-react'
export default function Navbar() {
  return (
    <div className=' w-full h-auto flex items-center justify-between  absolute top-0 px-10 p-3'>
        <div className="title">
            <h1 className='font-bold text-2xl text-orange-600'>Jam's Chatbot</h1>
        </div>
        <div className="hidden md:flex buttons gap-3">
            <WorkButton />
            <GetStartedButton text="Sign up" />

        </div>
        <div className="menu md:hidden">
            <button title='Menu' className=' flex items-center justify-center w-10 h-10 rounded-full bg-gray-200'>
                <Menu className='text-gray-600' />
            </button>
        </div>
    </div>
  )
}
