"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Copy, Check } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Alert, AlertDescription } from "@/components/ui/alert"
import Navbar from "@/components/navbar"
import { useAuth } from "@/lib/auth-context"
import { collection, addDoc } from "firebase/firestore"
import { db } from "@/lib/firebase"
import { Input } from "@/components/ui/input"

const depositAddresses = {
  btc: "1EwSeZbK8RW5EgRc96RnhjcLmGQA6zZ2RV",
  usdt: "TFBXLYCcuDLJqkN7ggxzfKMHmW64L7u9AA",
  usdc: "TFBXLYCcuDLJqkN7ggxzfKMHmW64L7u9AA",
  eth: "0x4c2bba6f32aa4b804c43dd25c4c3c311dd8016cf",
}

export default function DepositPage() {
  const { user, loading } = useAuth()
  const router = useRouter()
  const [copiedAddress, setCopiedAddress] = useState("")

  if (!loading && !user) {
    router.push("/login")
    return null
  }

  if (loading) {
    return <div className="min-h-screen bg-slate-50 flex items-center justify-center">Loading...</div>
  }

  const copyToClipboard = (address: string, currency: string) => {
    navigator.clipboard.writeText(address)
    setCopiedAddress(currency)
    setTimeout(() => setCopiedAddress(""), 2000)
  }

  const recordDeposit = async (currency: string, amount: string) => {
    if (!amount || isNaN(Number(amount)) || Number(amount) <= 0) {
      alert("Please enter a valid amount")
      return
    }

    try {
      // Add transaction record
      await addDoc(collection(db, "transactions"), {
        userId: user.uid,
        type: "deposit",
        currency: currency,
        amount: Number(amount),
        status: "pending",
        createdAt: new Date(),
        description: `Deposit ${amount} ${currency.toUpperCase()}`,
      })

      alert("Deposit recorded! It will be credited after confirmation.")
    } catch (error) {
      console.error("Error recording deposit:", error)
      alert("Failed to record deposit")
    }
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <Navbar />

      <div className="container mx-auto max-w-4xl px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-slate-900 mb-2">Deposit Funds</h1>
          <p className="text-slate-600">Add cryptocurrency to your MXTM INVESTMENTS account</p>
        </div>

        <Alert className="mb-8">
          <AlertDescription>
            <strong>Important:</strong> Only send the specified cryptocurrency to its corresponding address. Sending the
            wrong currency or using the wrong network may result in permanent loss of funds.
          </AlertDescription>
        </Alert>

        <Tabs defaultValue="btc" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="btc">Bitcoin (BTC)</TabsTrigger>
            <TabsTrigger value="eth">Ethereum (ETH)</TabsTrigger>
            <TabsTrigger value="usdt">USDT (TRC20)</TabsTrigger>
            <TabsTrigger value="usdc">USDC (TRC20)</TabsTrigger>
          </TabsList>

          <TabsContent value="btc">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <div className="w-8 h-8 bg-orange-100 rounded-full flex items-center justify-center mr-3">
                    <span className="text-sm font-semibold text-orange-600">₿</span>
                  </div>
                  Bitcoin (BTC) Deposit
                </CardTitle>
                <CardDescription>Send Bitcoin to the address below. Minimum deposit: 0.001 BTC</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <label className="text-sm font-medium text-slate-700">Deposit Address</label>
                  <div className="flex items-center space-x-2 mt-1">
                    <div className="flex-1 p-3 bg-slate-100 rounded-lg font-mono text-sm break-all">
                      {depositAddresses.btc}
                    </div>
                    <Button variant="outline" size="sm" onClick={() => copyToClipboard(depositAddresses.btc, "btc")}>
                      {copiedAddress === "btc" ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                    </Button>
                  </div>
                </div>
                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                  <p className="text-sm text-yellow-800">
                    <strong>Network:</strong> Bitcoin (BTC)
                    <br />
                    <strong>Confirmations required:</strong> 3<br />
                    <strong>Processing time:</strong> 30-60 minutes
                  </p>
                </div>
                <div className="mt-6 border-t pt-6">
                  <h3 className="text-lg font-medium mb-4">Record Your Deposit</h3>
                  <div className="flex space-x-2">
                    <Input type="number" placeholder="Amount" id="deposit-amount-btc" className="max-w-[200px]" />
                    <Button
                      onClick={() => {
                        const amount = (document.getElementById("deposit-amount-btc") as HTMLInputElement).value
                        recordDeposit("btc", amount)
                      }}
                    >
                      Record Deposit
                    </Button>
                  </div>
                  <p className="text-sm text-slate-500 mt-2">
                    After sending funds, record your deposit here for faster processing
                  </p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="eth">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center mr-3">
                    <span className="text-sm font-semibold text-blue-600">Ξ</span>
                  </div>
                  Ethereum (ETH) Deposit
                </CardTitle>
                <CardDescription>Send Ethereum to the address below. Minimum deposit: 0.01 ETH</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <label className="text-sm font-medium text-slate-700">Deposit Address</label>
                  <div className="flex items-center space-x-2 mt-1">
                    <div className="flex-1 p-3 bg-slate-100 rounded-lg font-mono text-sm break-all">
                      {depositAddresses.eth}
                    </div>
                    <Button variant="outline" size="sm" onClick={() => copyToClipboard(depositAddresses.eth, "eth")}>
                      {copiedAddress === "eth" ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                    </Button>
                  </div>
                </div>
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <p className="text-sm text-blue-800">
                    <strong>Network:</strong> Ethereum (ERC20)
                    <br />
                    <strong>Confirmations required:</strong> 12
                    <br />
                    <strong>Processing time:</strong> 5-15 minutes
                  </p>
                </div>
                <div className="mt-6 border-t pt-6">
                  <h3 className="text-lg font-medium mb-4">Record Your Deposit</h3>
                  <div className="flex space-x-2">
                    <Input type="number" placeholder="Amount" id="deposit-amount-eth" className="max-w-[200px]" />
                    <Button
                      onClick={() => {
                        const amount = (document.getElementById("deposit-amount-eth") as HTMLInputElement).value
                        recordDeposit("eth", amount)
                      }}
                    >
                      Record Deposit
                    </Button>
                  </div>
                  <p className="text-sm text-slate-500 mt-2">
                    After sending funds, record your deposit here for faster processing
                  </p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="usdt">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center mr-3">
                    <span className="text-sm font-semibold text-green-600">₮</span>
                  </div>
                  USDT (TRC20) Deposit
                </CardTitle>
                <CardDescription>
                  Send USDT via TRC20 network to the address below. Minimum deposit: 10 USDT
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <label className="text-sm font-medium text-slate-700">Deposit Address</label>
                  <div className="flex items-center space-x-2 mt-1">
                    <div className="flex-1 p-3 bg-slate-100 rounded-lg font-mono text-sm break-all">
                      {depositAddresses.usdt}
                    </div>
                    <Button variant="outline" size="sm" onClick={() => copyToClipboard(depositAddresses.usdt, "usdt")}>
                      {copiedAddress === "usdt" ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                    </Button>
                  </div>
                </div>
                <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                  <p className="text-sm text-green-800">
                    <strong>Network:</strong> TRON (TRC20)
                    <br />
                    <strong>Confirmations required:</strong> 19
                    <br />
                    <strong>Processing time:</strong> 2-5 minutes
                  </p>
                </div>
                <div className="mt-6 border-t pt-6">
                  <h3 className="text-lg font-medium mb-4">Record Your Deposit</h3>
                  <div className="flex space-x-2">
                    <Input type="number" placeholder="Amount" id="deposit-amount-usdt" className="max-w-[200px]" />
                    <Button
                      onClick={() => {
                        const amount = (document.getElementById("deposit-amount-usdt") as HTMLInputElement).value
                        recordDeposit("usdt", amount)
                      }}
                    >
                      Record Deposit
                    </Button>
                  </div>
                  <p className="text-sm text-slate-500 mt-2">
                    After sending funds, record your deposit here for faster processing
                  </p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="usdc">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center mr-3">
                    <span className="text-sm font-semibold text-blue-600">$</span>
                  </div>
                  USDC (TRC20) Deposit
                </CardTitle>
                <CardDescription>
                  Send USDC via TRC20 network to the address below. Minimum deposit: 10 USDC
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <label className="text-sm font-medium text-slate-700">Deposit Address</label>
                  <div className="flex items-center space-x-2 mt-1">
                    <div className="flex-1 p-3 bg-slate-100 rounded-lg font-mono text-sm break-all">
                      {depositAddresses.usdc}
                    </div>
                    <Button variant="outline" size="sm" onClick={() => copyToClipboard(depositAddresses.usdc, "usdc")}>
                      {copiedAddress === "usdc" ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                    </Button>
                  </div>
                </div>
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <p className="text-sm text-blue-800">
                    <strong>Network:</strong> TRON (TRC20)
                    <br />
                    <strong>Confirmations required:</strong> 19
                    <br />
                    <strong>Processing time:</strong> 2-5 minutes
                  </p>
                </div>
                <div className="mt-6 border-t pt-6">
                  <h3 className="text-lg font-medium mb-4">Record Your Deposit</h3>
                  <div className="flex space-x-2">
                    <Input type="number" placeholder="Amount" id="deposit-amount-usdc" className="max-w-[200px]" />
                    <Button
                      onClick={() => {
                        const amount = (document.getElementById("deposit-amount-usdc") as HTMLInputElement).value
                        recordDeposit("usdc", amount)
                      }}
                    >
                      Record Deposit
                    </Button>
                  </div>
                  <p className="text-sm text-slate-500 mt-2">
                    After sending funds, record your deposit here for faster processing
                  </p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        <Card className="mt-8">
          <CardHeader>
            <CardTitle>Important Notes</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2 text-sm text-slate-600">
              <li>• Deposits are processed automatically after the required network confirmations</li>
              <li>• Do not send any other cryptocurrency to these addresses</li>
              <li>• Always double-check the address before sending funds</li>
              <li>• Contact support if your deposit doesn't appear after the expected processing time</li>
              <li>• Network fees are deducted from your deposit amount</li>
            </ul>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
