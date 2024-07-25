"use client"
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

export default function ErrorPage() {
  const router = useRouter()
    return (
      <div className="flex flex-col items-center w-full">
        <p style={{textAlign: "center", margin: "20px 0"}}>Sorry, something went wrong</p>
        <Button className="my-4" onClick={() => router.push("/login")}>Retry</Button>
      </div>
    )
  }