import { PricingTable } from '@clerk/nextjs'
import React from 'react'

function Pricing() {
  return (
    <div>
        <h2 className='font-bold text-3xl py-4'>Join Subscription</h2>
        <PricingTable />
    </div>
  )
}

export default Pricing