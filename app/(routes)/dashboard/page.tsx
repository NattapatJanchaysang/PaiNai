'use client'


import React from 'react'
import HistoryList from './_components/HistoryList'
import { Button } from '@/components/ui/button'
import DoctersAgentList from './_components/DoctersAgentList'
import AddNewSessionDialog from './_components/AddNewSessionDialog'
import { useUser } from '@clerk/nextjs'

function Dashboard() {

const { user } = useUser()

  return (
    <div>
      <div className='flex justify-between items-center'>
        <h2 className='text-2xl font-bold'>My Dashboard</h2>
        {user?<AddNewSessionDialog /> : <Button disabled className="my-2">+ Start a Consultation</Button>}
      </div>
      
      <HistoryList />
      <DoctersAgentList />
    </div>
  )
}

export default Dashboard