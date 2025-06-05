"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { doc, updateDoc, onSnapshot, addDoc, collection } from "firebase/firestore"
import { ArrowDownLeft } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Textarea } from "@/components/ui/textarea"
import Navbar from "@/components/navbar"
import { useAuth } from "@/lib/auth-context"
import { db } from "@/lib/firebase"

export default function WithdrawPage() {
  const { user, loading } = useAuth()
  const router = useRouter()
  const [currency, setCurrency] = useState("btc")
  const [amount, setAmount] = useState("")
  const [address, setAddress] = useState("")
  const [withdrawing, setWithdrawing] = useState(false)
  const [error, setError] = useState("")
  const [userBalance, setUserBalance] = useState({
    usd: 0,
    btc: 0,
    eth: 0,
    usdt: 0,
    usdc: 0,
  })

  const minimumWithdrawals = {
    btc: 0.001,
    eth: 0.01,
    usdt: 10,
    usdc: 10,
  }

  const networkFees = {
    btc: 0.0005,
    eth: 0.005,
    usdt: 1,
    usdc: 1,
  }

  useEffect(() => {
    if (!loading && !user) {
      router.push("/login")
      return
    }

    if (user) {
      const unsubscribe = onSnapshot(doc(db, "users", user.uid), (doc) => {
        if (doc.exists()) {
          const data = doc.data()
          setUserBalance(
            data.balance || {
              usd: 0,
              btc: 0,
              eth: 0,
              usdt: 0,
              usdc: 0,
            },
          )
        }
      })

      return () => unsubscribe()
    }
  }, [user, loading, router])

  if (loading) {
    return <div className="min-h-screen bg-slate-50 flex items-center justify-center">Loading...</div>
  }

  if (!user) {
    return null
  }

  const handleWithdraw = async () => {
    setError("")
    setWithdrawing(true)

    try {
      const withdrawAmount = Number.parseFloat(amount)
      if (!withdrawAmount || withdrawAmount <= 0) {
        setError("Please enter a valid amount")
        return
      }

      if (!address.trim()) {
        setError("Please enter a withdrawal address")
        return
      }

      const minAmount = minimumWithdrawals[currency as keyof typeof minimumWithdrawals]
      if (withdrawAmount < minAmount) {
        setError(`Minimum withdrawal amount is ${minAmount} ${currency.toUpperCase()}`)
        return
      }

      const fee = networkFees[currency as keyof typeof networkFees]
      const totalAmount = withdrawAmount + fee
      const availableBalance = userBalance[currency as keyof typeof userBalance]

      if (totalAmount > availableBalance) {
        setError("Insufficient balance (including network fee)")
        return
      }

      // Create withdrawal request
      await addDoc(collection(db, "withdrawals"), {
        userId: user.uid,
        currency: currency,
        amount: withdrawAmount,
        fee: fee,
        address: address,
        status: "pending",
        createdAt: new Date(),
        userEmail: user.email,
      })

      // Record the transaction
      await addDoc(collection(db, "transactions"), {
        userId: user.uid,
        type: "withdrawal",
        currency: currency,
        amount: withdrawAmount,
        status: "pending",
        createdAt: new Date(),
        description: `Withdrawal of ${withdrawAmount} ${currency.toUpperCase()} to ${address.substring(0, 10)}...`,
      })

      // Update user balance
      const newBalance = {
        ...userBalance,
        [currency]: userBalance[currency as keyof typeof userBalance] - totalAmount,
      }

      await updateDoc(doc(db, "users", user.uid), {
        balance: newBalance,
      })

      setAmount("")
      setAddress("")
      alert("Withdrawal request submitted successfully! It will be processed within 24 hours.")
    } catch (error) {
      setError("Withdrawal failed. Please try again.")
    } finally {
      setWithdrawing(false)
    }
  }

  const getNetworkInfo = (curr: string) => {
    switch (curr) {
      case "btc":
        return { network: "Bitcoin", confirmations: "3" }
      case "eth":
        return { network: "Ethereum (ERC20)", confirmations: "12" }
      case "usdt":
        return { network: "TRON (TRC20)", confirmations: "19" }
      case "usdc":
        return { network: "TRON (TRC20)", confirmations: "19" }
      default:
        return { network: "Unknown", confirmations: "0" }
    }
  }

  const networkInfo = getNetworkInfo(currency)

  return (
    <div className="min-h-screen bg-slate-50">
      <Navbar />

      <div className="container mx-auto max-w-2xl px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-slate-900 mb-2">Withdraw Funds</h1>
          <p className="text-slate-600">Send your cryptocurrency to an external wallet</p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <ArrowDownLeft className="h-5 w-5 mr-2" />
              Withdrawal Request
            </CardTitle>
            <CardDescription>Enter the details for your withdrawal</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {error && (
              <Alert variant="destructive">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            <div className="space-y-4">
              <div>
                <Label htmlFor="currency">Currency</Label>
                <Select value={currency} onValueChange={setCurrency}>
                  <SelectTrigger className="mt-1">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="btc">Bitcoin (BTC)</SelectItem>
                    <SelectItem value="eth">Ethereum (ETH)</SelectItem>
                    <SelectItem value="usdt">Tether USD (USDT)</SelectItem>
                    <SelectItem value="usdc">USD Coin (USDC)</SelectItem>
                  </SelectContent>
                </Select>
                <p className="text-sm text-slate-500 mt-1">
                  Available: {userBalance[currency as keyof typeof userBalance].toFixed(8)} {currency.toUpperCase()}
                </p>
              </div>

              <div>
                <Label htmlFor="amount">Amount</Label>
                <Input
                  id="amount"
                  type="number"
                  placeholder="0.00"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  className="mt-1"
                />
                <p className="text-sm text-slate-500 mt-1">
                  Minimum: {minimumWithdrawals[currency as keyof typeof minimumWithdrawals]} {currency.toUpperCase()}
                </p>
              </div>

              <div>
                <Label htmlFor="address">Withdrawal Address</Label>
                <Textarea
                  id="address"
                  placeholder="Enter the destination wallet address"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  className="mt-1"
                  rows={3}
                />
                <p className="text-sm text-slate-500 mt-1">Network: {networkInfo.network}</p>
              </div>
            </div>

            <div className="bg-slate-50 rounded-lg p-4">
              <h4 className="font-medium text-slate-900 mb-2">Transaction Summary</h4>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span>Amount:</span>
                  <span>
                    {amount || "0"} {currency.toUpperCase()}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>Network Fee:</span>
                  <span>
                    {networkFees[currency as keyof typeof networkFees]} {currency.toUpperCase()}
                  </span>
                </div>
                <div className="flex justify-between font-medium border-t pt-2">
                  <span>Total Deducted:</span>
                  <span>
                    {(Number.parseFloat(amount || "0") + networkFees[currency as keyof typeof networkFees]).toFixed(8)}{" "}
                    {currency.toUpperCase()}
                  </span>
                </div>
              </div>
            </div>

            <Button
              onClick={handleWithdraw}
              disabled={withdrawing || !amount || !address}
              className="w-full bg-red-600 hover:bg-red-700"
            >
              {withdrawing ? "Processing..." : "Submit Withdrawal"}
            </Button>
          </CardContent>
        </Card>

        <Card className="mt-6">
          <CardHeader>
            <CardTitle>Important Information</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2 text-sm text-slate-600">
              <li>• Withdrawals are processed manually within 24 hours</li>
              <li>• Double-check the withdrawal address before submitting</li>
              <li>• Network fees are automatically deducted from your balance</li>
              <li>• Withdrawals to incorrect addresses cannot be reversed</li>
              <li>• Contact support if you need assistance</li>
            </ul>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
