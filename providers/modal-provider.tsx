"use client"

import { useState, useEffect } from "react"

import { StoreModal } from "@/components/modals/store-modal"

export const ModalProvider = () =>{
    const [isMounted, setIsMounted] = useState(false)
    useEffect(()=>{
        setIsMounted(true)
    },[])

    if(!isMounted){
        return null
    }

    return(
        <>
        <StoreModal/>
        </>
    )
}

// What exactly does this do ?
/*

we are going to add this modal provider inside the layout.tsx which is present in "app" folder. but layout.tsx is a server component
which means that I simply cannot add the client component to it. i have to ensure that there will not be any hydration errors especially with modals.
because there are lot of ways that we can trigger a modal and that can cause the synchronization between the server-side rendering and client-side rendering.

for example, the server will not have any modal open but the client will have modal to open. which throws the hydration error.

using this code i ensure until this lifecycle has run which is only something that can happen in client component, i return null

so if it has not mounted (if i am in server side rendering), return null (don't do anything). so there is no hydration error possible of happening.

Applications of using this code :
this is a small that we can do whenever we face hydration error.
this code is more of a precaution to avoid it.

now we can add this modal provider in root layout (app/layout.tsx)

*/
