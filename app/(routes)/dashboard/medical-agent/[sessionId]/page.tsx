"use client"
import axios from 'axios'
import { useParams } from 'next/navigation'
import React, { useEffect, useState } from 'react'
import { docterAgent } from '../../_components/DocterAgentCard'
import { Circle, PhoneCall } from 'lucide-react'
import Image from 'next/image'
import { Button } from '@/components/ui/button'

type sessionDetail = {
    id:number,
    notes:string,
    sessionId:string,
    report:JSON,
    selectedDocter:docterAgent,
    createdOn:string,
}

function MedicalVoiceAgent() {
  const { sessionId } = useParams()
  const [sessionDetail,setSessionDetail] = useState<sessionDetail>()
  useEffect(() => {
    sessionId&&GetSessionDetails()
  }, [sessionId])

  const GetSessionDetails = async () => {
    const result=await axios.get('/api/session-chat?sessionId='+sessionId)
    console.log(result.data)
    setSessionDetail(result.data)
  }
  return (
    <div className='p-4 border rounded-3xl bg-secondary'>
      <div className='flex justify-between items-center'>
        <h2 className='p-1 px-2 border rounded-md flex gap-2 items-center'><Circle className='w-4 h-4'/> Not Connected </h2>
        <h2 className='text-xl font-bold text-muted-foreground'>00:00</h2>
      </div>

      {sessionDetail && <div className='flex flex-col items-center mt-10'>
        <Image src={sessionDetail?.selectedDocter?.image} alt={sessionDetail?.selectedDocter.specialist??''}
        width={120}
        height={120}
        className='h-[100px] w-[100px] object-cover rounded-full' />
        <h2 className='p-2 text-lg'>{sessionDetail?.selectedDocter?.specialist}</h2>
        <p className='text-sm text-muted-foreground'>AI Medical Voice Agent</p>

        <div className='py-10'></div>
        <div className='mt-20'>
          <h2 className='text-muted-foreground'>Assistant msg</h2>
          <h2 className='text-lg text-center'>User msg</h2>
        </div>
        <div className='py-10'></div>
        <Button className='mt-10'> <PhoneCall />Start Call </Button>


      </div>}
    </div>
  )
}

export default MedicalVoiceAgent