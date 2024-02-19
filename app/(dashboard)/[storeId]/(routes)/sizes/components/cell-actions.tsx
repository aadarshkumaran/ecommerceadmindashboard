"use client"

import { Copy, Delete, Edit, MoreHorizontal } from "lucide-react";
import { toast } from "react-hot-toast";
import { useParams, useRouter } from "next/navigation";

import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuLabel, DropdownMenuItem } from "@/components/ui/dropdown-menu";
import { SizeColumn } from "./columns";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import axios from "axios";
import { AlertModal } from "@/components/modals/alert-modal";

interface CellActionProps {
    data: SizeColumn;
};

const CellAction: React.FC<CellActionProps> = ({ data }) => {
    const router = useRouter();
    const params = useParams();
    const [loading,setLoading] = useState(false)
    const [open,setOpen] = useState(false)
    const onCopy = (id: string) => {
        navigator.clipboard.writeText(id);
        toast.success("Size ID Copied To The Clipboard!")
    }
    const onDelete = async () => {
        try {
            setLoading(true);
            await axios.delete(`/api/${params.storeId}/sizes/${data.id}`);
            router.refresh();
            toast.success("Size Deleted Successfully.")

        } catch (error) {
            toast.error("Make sure you removed all products using this size first.");
        }
        finally {
            setLoading(false);
            setOpen(false);
        }
    }
    return (<>
    <AlertModal
    isOpen={open} onClose={()=> setOpen(false)} onConfirm={onDelete} loading={loading}
    />
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button variant={"ghost"} className="h-8 w-8 p-0">
                    <span className="sr-only">Open Menu</span>
                    <MoreHorizontal className="h-4 w-4" />
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
                <DropdownMenuLabel>Actions</DropdownMenuLabel>
                <DropdownMenuItem onClick={()=> onCopy(data.id)}>
                    <Copy className="mr-2 h-4 w-4/12" /> Copy ID
                </DropdownMenuItem>
                <DropdownMenuItem onClick={()=>router.push(`/${params.storeId}/sizes/${data.id}`)}>
                    <Edit className="mr-2 h-4 w-4/12" /> Update
                </DropdownMenuItem>
                <DropdownMenuItem onClick={()=> setOpen(true)}>
                    <Delete className="mr-2 h-4 w-4/12" /> Delete
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    </>);
}

export default CellAction;