"use client";

import React, { useState } from "react";
import { CardBody, CardContainer, CardItem } from "@/components/ui/3d-card";
import Image from 'next/image'
import { Badge } from "@/components/ui/badge";
import { useAuth, useUser } from "@clerk/nextjs";
import { Button } from "@/components/ui/button";
import axios from "axios";
import { useRouter } from "next/navigation";
import DilectlyConsult from "./DilectlyConsult";



export type docterAgent = {
        id: number,
        specialist: string,
        description: string,
        image: string,
        agentPrompt: string,
        voiceId?: string,
        subscriptionRequired: boolean
}

type props={
    docterAgent:docterAgent
}




function DocterAgentCard({docterAgent}:props) {

const { has } = useAuth()
const {user} = useUser()
const hasPremiumAccess = has?.({ plan: 'premium' })

  return (
  <div className="border shadow rounded-xl p-4">
    <div className="flex flex-col">
    <div className="flex justify-between">
      <h2 className="font-bold text-lg">{docterAgent.specialist}</h2>
      {docterAgent.subscriptionRequired && <Badge>Premium</Badge>}
    </div>

    <p className="text-neutral-500 text-sm max-w-sm mt-1 dark:text-neutral-300 line-clamp-1">{docterAgent.description}</p>      
    </div>
    <div className="flex flex-col items-center">
    <Image src={docterAgent.image} height={1000} width={1000}
    className="h-[300px] w-full object-cover rounded-xl mt-6 mb-4"
    alt={docterAgent.specialist}
    />
      <DilectlyConsult docterAgent={docterAgent} />       
    </div>
  </div>
  );
}

export default DocterAgentCard
