import { Button } from '@/components/ui/button'
import Link from 'next/link'
import React from 'react'

function EmailConfirmed() {
  return (
    <div className="w-full my-4 flex justify-center">
      <div className="w-4/5 flex flex-col items-center">
        <h1 className='text-xl text-center'>Thank you for confirming your signup</h1>
        <Button className='my-4'>
            <Link href={"/login"}>Login</Link>
        </Button>
      </div>
    </div>
  )
}

export default EmailConfirmed