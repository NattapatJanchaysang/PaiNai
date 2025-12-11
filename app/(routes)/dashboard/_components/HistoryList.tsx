"use client"

import { Button } from '@/components/ui/button'
import { img } from 'motion/react-client'
import React, { useEffect, useState } from 'react'
import AddNewSessionDialog from './AddNewSessionDialog'
import axios from 'axios'
import HistoryTable from './HistoryTable'
import { SessionDetail } from '../medical-agent/[sessionId]/page'
import { useUser } from '@clerk/nextjs'
import Link from 'next/link'
import Image from 'next/image'

function HistoryList() {
  
    const {user} = useUser()
    const [historyList,setHistorylist] = useState<SessionDetail[]>([])

    useEffect(() => {
      GetHistory()
    }, [])
    const GetHistory = async () =>{
      const result = await axios.get('/api/session-chat?sessionId=all')
      console.log(result.data)
      setHistorylist(result.data);
    }
  return (
    <div>
        {historyList.length==0?
        <div className='flex flex-col items-center justify-center border-2 border-dashed rounded mt-5 gap-2 py-6'>
            <Image src="/questionmark.png" alt="empty" width={200} height={200}/>
            <h2 className='font-bold mt-4'>No Recent Consultations</h2>
            <p>เอ๊ะ! ดูเหมือนคุณจะยังไม่เคยมาปรึกษาคุณหมอของเราเลยนะ… {!user ? <span>ลงทะเบียนก่อนซิ...</span> : ''}</p>
            {user ? <AddNewSessionDialog /> : <Link href='/sign-in'><Button className='mt-2 mb-6'><span className='font-bold text-green-400'>Sign in</span> to Start Consultation</Button></Link>}
        </div> :
        <div>
            <HistoryTable historyList={historyList}/>
        </div>}
    </div>
  )
}

export default HistoryList