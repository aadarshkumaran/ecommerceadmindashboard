"use client"
import { Modal } from "@/components/ui/modal";
import { useStoreModal } from "@/hooks/use-store-modal";
import { UserButton } from "@clerk/nextjs";
import { useEffect } from "react";

const SetupPage = () => {
  //another approach of extracting onOpen and isOpen state in zustand because it doesnt work when we need use it inside useEffect hook. using "state" we can able to simplify this process.
  //Previous approach was like how we did in store-modal.tsx
  const onOpen = useStoreModal((state)=> state.onOpen)
  const isOpen = useStoreModal((state)=>state.isOpen)

  useEffect(()=>{
    if(!isOpen){
      onOpen()
    }
  },[isOpen,onOpen])

  // return (<div className="p-4">
  //   {/* <UserButton afterSignOutUrl="/"/> */}
  //   Root Page
  // </div>);
  return null
}

export default SetupPage;