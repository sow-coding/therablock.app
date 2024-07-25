"use client"
import { useState } from 'react';
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { login } from './actions';
import CircularProgressComponent from '@/components/nextui/circularProgress';

export default function LoginPage() {
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [cookiesAccepted, setCookiesAccepted] = useState(false);

  const handleLogin = async (event: any) => {
    event.preventDefault();
    setLoading(true);
    try {
      await login({ email, password });
    } catch (error) {
      console.error('Login failed:', error);
    }
    setLoading(false);
  };

  const acceptCookies = () => {
    setCookiesAccepted(true);
    localStorage.setItem('cookiesAccepted', 'true');
  };

  return (
    <>
      <Card className="mx-auto max-w-sm mt-6">
        <CardHeader>
          <CardTitle className="text-2xl">Login</CardTitle>
          <CardDescription>
            Enter your email and password below to login to your account
          </CardDescription>
        </CardHeader>
        {loading ? (
          <div className="flex justify-center my-4">
            <CircularProgressComponent />
          </div>
        ) : (
          <form onSubmit={handleLogin} className="mx-4 my-4">
            <div className="grid gap-4">
              <div className="grid gap-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  name='email'
                  placeholder="m@example.com"
                  required
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                />
              </div>
              <div className="grid gap-2">
                <div className="flex items-center">
                  <Label htmlFor="password">Password</Label>
                  <Link href="/resetPassword" className="ml-auto inline-block text-sm underline">
                    Forgot your password?
                  </Link>
                </div>
                <Input
                  id="password"
                  name='password'
                  type="password"
                  required
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                />
              </div>
              <Button type="submit" className="w-full">
                Login
              </Button>
            </div>
            <div className="mt-4 text-center text-sm">
              Don&apos;t have an account?{" "}
              <Link href="/signup" className="underline">
                Sign up
              </Link>
            </div>
          </form>
        )}
      </Card>
      {!cookiesAccepted && (
        <div className="fixed inset-x-0 bottom-0 bg-gray-800 text-white p-2 text-center">
          We use essential cookies for authentication and basic analytics to improve our website, tracking only country, device type, and referral source.
          <Button onClick={acceptCookies} className="ml-2 bg-blue-500 hover:bg-blue-700 text-white">
            Accept Cookies
          </Button>
        </div>
      )}
    </>
  );
}
