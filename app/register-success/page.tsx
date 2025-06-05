"use client"

import Link from "next/link"
import { CheckCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

export default function RegisterSuccessPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 to-blue-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="flex justify-center mb-4">
            <CheckCircle className="h-16 w-16 text-emerald-600" />
          </div>
          <CardTitle className="text-2xl font-bold">Registration Successful!</CardTitle>
          <CardDescription>Your MXTM INVESTMENTS account has been created</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="text-center text-slate-600">
            <p className="mb-4">
              Thank you for joining MXTM INVESTMENTS. Your account has been successfully created and is ready to use.
            </p>
            <p>You can now deposit funds, convert between currencies, and start your investment journey.</p>
          </div>

          <div className="flex flex-col space-y-3">
            <Link href="/dashboard">
              <Button className="w-full bg-emerald-600 hover:bg-emerald-700">Go to Dashboard</Button>
            </Link>
            <Link href="/deposit">
              <Button variant="outline" className="w-full">
                Make Your First Deposit
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
