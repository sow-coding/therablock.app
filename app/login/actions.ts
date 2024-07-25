'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'

import { createClient } from '@/utils/supabase/server'

export async function login({email, password}: {email: string, password: string}) {
  const supabase = createClient()

  const data = {
    email: email,
    password: password
  }

  const { error } = await supabase.auth.signInWithPassword(data)

  if (error?.message === "Email not confirmed") {
    redirect('/emailNotConfirmed')
  } else if (error) {
    redirect("/error")
  }

  revalidatePath('/', 'layout')
  redirect('/download')
}

export async function signup({email, password}: {email: string, password: string}) {
  const supabase = createClient()

  const data = {
    email: email,
    password: password,
    options: {
      data: {
        userType: 'free',
        paid: false
      }
    }
  }

  const { data: userData, error } = await supabase.auth.signUp(data)

  if (error) {
    redirect('/error')
  }

  revalidatePath('/', 'layout')
  redirect('/download')
}

export async function logout() {
  const supabase = createClient()
  const { error } = await supabase.auth.signOut()
  if (error) {
    redirect('/error')
  }
  revalidatePath('/', 'layout')
  redirect('/login')
}
