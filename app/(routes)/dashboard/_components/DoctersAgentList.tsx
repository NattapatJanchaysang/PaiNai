import { AIDoctorAgents } from '@/list'
import { div } from 'motion/react-client'
import React from 'react'
import DocterAgentCard from './DocterAgentCard'

function DoctersAgentList() {
  return (
    <div className='mt-6 flex flex-col border-2 border-dashed rounded mt-5 gap-2 py-6 px-6'>
        <h2 className='font-bold text-xl mb-8'>AI Specialist Docters Agent</h2>
        <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4'>
            {AIDoctorAgents.map((docter, index)=>(
                <div key={index}>
                    <DocterAgentCard docterAgent={docter}/>
                </div>
            ))}
        </div>
    </div>
  )
}

export default DoctersAgentList