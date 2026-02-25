"use client";


import React, { useEffect } from 'react'
import { motion } from "motion/react";

import { UserButton, useUser } from "@clerk/nextjs";
import { Button } from "./ui/button";
import Link from "next/link";
import Image from "next/image";
import ColourfulText from './ui/colourful-text';
import Mainspace from './Mainspace';
import { BackgroundLines } from './ui/background-lines';
import { Mic } from 'lucide-react';


export default function Hero() {

  const {user} = useUser()

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);
  return (
    <main>
      
    <div className="relative flex items-center justify-center h-screen px-24 lg:px-40 mx-auto bg-[url('/bangkokview.jpg')] bg-cover bg-center" >
      <div>
      <div className="absolute inset-y-0 left-0 h-full w-px bg-neutral-200/80 dark:bg-neutral-800/80">
        <div className="absolute top-0 h-40 w-px bg-gradient-to-b from-transparent via-blue-500 to-transparent" />
      </div>
      <div className="absolute inset-y-0 right-0 h-full w-px bg-neutral-200/80 dark:bg-neutral-800/80">
        <div className="absolute h-40 w-px bg-gradient-to-b from-transparent via-blue-500 to-transparent" />
      </div>
      <div className="absolute inset-x-0 bottom-0 h-px w-full bg-neutral-200/80 dark:bg-neutral-800/80">
        <div className="absolute mx-auto h-px w-40 bg-gradient-to-r from-transparent via-blue-500 to-transparent" />
      </div>
      <div className="relative z-20 bg-white rounded-lg shadow-lg px-12">
      <div className="px-4 py-10 md:py-20">
        <h1 className="relative z-10 mx-auto text-center text-2xl font-bold text-slate-700 md:text-4xl lg:text-7xl dark:text-slate-300">
          {"Welcome to"
            .split(" ")
            .map((word, index) => (
              <motion.span
                key={index}
                initial={{ opacity: 0, filter: "blur(4px)", y: 10 }}
                animate={{ opacity: 1, filter: "blur(0px)", y: 0 }}
                transition={{
                  duration: 0.3,
                  delay: index * 0.1,
                  ease: "easeInOut",
                }}
                className="mr-2 inline-block"
              >
                {word}
              </motion.span>
            ))}
              <motion.span
                initial={{ opacity: 0, filter: "blur(4px)", y: 10 }}
                animate={{ opacity: 1, filter: "blur(0px)", y: 0 }}
                transition={{
                  duration: 0.3,
                  delay: 0.3,
                  ease: "easeInOut",
                }}
                className="mr-2 inline-block text-pink-600"
              >
                <ColourfulText text="PaiNai" />
              </motion.span>
        </h1>
        <motion.p
          initial={{
            opacity: 0,
          }}
          animate={{
            opacity: 1,
          }}
          transition={{
            duration: 0.3,
            delay: 0.8,
          }}
          className="relative z-10 mx-auto max-w-xl py-4 text-center text-lg font-normal text-neutral-600 dark:text-neutral-400"
        >
          พูดคุยกับ Ai แนะนำเส้นทางแบบเรียลไทม์
        </motion.p> 
      <Link href='/talkingpage'>
        <Button className="flex items-center gap-2 mt-2 mx-auto animate-pulse bg-gradient-to-r from-blue-500 to-green-500 text-white shadow-lg p-6 text-lg">
          Get Started
        </Button>
      </Link>        
      </div>
      </div>

      </div>
    </div>
      
    </main>
  );
}

 