import React, { useState } from 'react'
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { ArrowRight, Loader2 } from 'lucide-react'
import axios from 'axios'
import DocterAgentCard, { docterAgent } from './DocterAgentCard'
import SuggestedDocterCard from './SuggestedDocterCard'
import { useRouter } from 'next/navigation'


type props={
    docterAgent:docterAgent
}

function DilectlyConsult({docterAgent}:props) {

    const [loading,setLoading] = useState(false)
    const router=useRouter()
    const [selectedDocter,setSelectedDocter]=useState<docterAgent>()
    const [note,setNote] = useState <string> ()


    const onStartConsultation= async ()=>{
    setLoading(true)
    // Save All info to database
    const result = await axios.post('/api/session-chat',{
      notes:note,
      selectedDocter:docterAgent
    })
    console.log(result.data)
    if(result.data?.sessionId){
      console.log(result.data.sessionId)
      //Route new data screen
      router.push('/dashboard/medical-agent/'+result.data.sessionId)
    }
    setLoading(false)
  }

  return (
    <div>
    <Dialog>
      <DialogTrigger asChild><Button className='my-2'>+ Start a Consultation</Button></DialogTrigger>
  <DialogContent >
    <DialogHeader>
      <DialogTitle>Add Basic Details</DialogTitle>
      <DialogDescription asChild>
       <div>
          {/* // Ask an User Symptoms */}
          <h2 className='mb-4'>Add Symptoms or Any Other Details</h2>
          <Textarea className='h-[140px]' placeholder='Add Details here...'
          onChange={(e)=>setNote(e.target.value)}/>
        </div> 
      </DialogDescription>
    </DialogHeader>
    <DialogFooter >
      <DialogClose asChild>
        <Button variant={'outline'}>Cancel</Button>
        </DialogClose>
        <Button onClick={()=>onStartConsultation()} disabled={!note || loading}>Start Consultation
        {loading ? <Loader2 className='animate-spin'/> : <ArrowRight />}</Button>
    </DialogFooter>
  </DialogContent>
</Dialog>
    </div>
  )
}

export default DilectlyConsult