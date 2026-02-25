"use client";


import { motion } from "motion/react";
import { UserButton, useUser } from "@clerk/nextjs";
import { Button } from "./ui/button";
import Link from "next/link";
import Image from "next/image";
import ColourfulText from "./ui/colourful-text";
import { MapPin } from "lucide-react";

const Navbar = () => {
  const {user} = useUser()
  return (
    <nav className="flex w-full items-center justify-between border-t border-b border-neutral-200 py-4 dark:border-neutral-800 px-10 md:px-24 lg:px-40">
      <Link href="/" className="flex items-center gap-1 cursor-pointer">
  <MapPin className="w-8 h-8 text-red-400" />
  <ColourfulText text="PaiNai" />
</Link>    
      {!user? <Link href={'/sign-in'}><Button className="w-24 transform rounded-lg bg-black px-6 py-2 font-medium text-white transition-all duration-300 hover:-translate-y-0.5 hover:bg-gray-800 md:w-32 dark:bg-white dark:text-black dark:hover:bg-gray-200">
        Login
      </Button></Link> : 
      <div className="flex gap-4 items-center">
          <UserButton />
      </div>
      }
    </nav>
  );
};

export default Navbar;
