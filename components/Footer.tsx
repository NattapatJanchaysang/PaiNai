import Link from 'next/link'
import React from 'react'

function Footer() {
  return (
    <footer className="sm:hidden md:block w-full border-t border-neutral-200 py-6 px-10 md:px-12 lg:px-24 dark:border-neutral-800 text-center text-sm text-neutral-500">
        <div className='flex justify-between '>
            © {new Date().getFullYear()} PaiNai All rights reserved.
            <Link href="https://nattapat-portfolio.vercel.app/" className='hover:text-blue-600'>Contact Support</Link>
        </div>
      
    </footer>
  )
}

export default Footer