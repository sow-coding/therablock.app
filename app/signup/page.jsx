"use client"
import CircularProgressComponent from "@/components/nextui/circularProgress";
import Link from "next/link"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { signup } from "../login/actions"
import { useState } from "react"
import {Checkbox} from "@nextui-org/react";

export default function SignUpForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isChecked, setIsChecked] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSignup = async (e) => {
    e.preventDefault(); // Prevent form from submitting the traditional way
    if (!isChecked) {
      alert("Please agree to the Terms and Conditions.");
      return;
    }
    setLoading(true);
    await signup({ email, password });
  };

  function CheckboxComponent () {
    return (
      <div className="flex flex-col gap-2">
        <Checkbox isSelected={isChecked} onValueChange={setIsChecked}>
          I have read and agree to the Terms and Conditions.
        </Checkbox>
      </div>
    );
  }

  return (
    <Card className="mx-auto max-w-sm mt-6">
      <CardHeader>
        <CardTitle className="text-xl">Sign Up</CardTitle>
        <CardDescription>
          Enter your information to create an account
        </CardDescription>
      </CardHeader>
      {loading ? (
      <div className="flex justify-center my-4">
        <CircularProgressComponent />  
      </div>
      ) : (
        <form className="mx-4 my-4" onSubmit={handleSignup}>
          <div className="grid gap-4">
            <div className="grid gap-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="m@example.com"
                required
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                pattern="^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^\da-zA-Z]).{8,}$"
                placeholder="Password"
                title="The password must contain at least one uppercase letter, one lowercase letter, one digit, one symbol and must be at least 8 characters long."
              />
            </div>
            <CheckboxComponent />
            <Button type="submit" disabled={!isChecked} className="w-full">
              Create an account
            </Button>
          </div>
          <div className="mt-4 text-center text-sm">
            Already have an account?{" "}
            <Link href="/login" className="underline">
              Login
            </Link>
          </div>
          <div className="mt-4 text-center text-sm">
            <Link href="/termsAndConditions" className="underline my-2">
              Terms and Conditions
            </Link>
          </div>
        </form>
      )}
    </Card>
  );
}