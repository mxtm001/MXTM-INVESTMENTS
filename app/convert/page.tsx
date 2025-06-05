"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { doc, updateDoc, onSnapshot, addDoc, collection } from "firebase/firestore"
import { ArrowUpDown } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Alert, AlertDescription } from "@/components/ui/alert"
import Navbar from "@/components/navbar"
import { useAuth } from "@/lib/auth-context"
import { db } from "@/lib/firebase"

const exchangeRates = {
  btc: 45000,
  eth: 2500,
  usdt: 1,
  usdc: 1,
  usd: 1,
}

export default function ConvertPage() {
  const { user, loading } = useAuth()
  const router = useRouter()
  const [fromCurrency, setFromCurrency] = useState("usd")
  const [toCurrency, setToCurrency] = useState("btc")
  const [amount, setAmount] = useState("")
  const [converting, setConverting] = useState(false)
  const [error, setError] = useState("")
  const [userBalance, setUserBalance] = useState({
    usd: 0,
    btc: 0,
    eth: 0,
    usdt: 0,
    usdc: 0,
  })

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

  const calculateConversion = () => {
    if (!amount || isNaN(Number.parseFloat(amount))) return 0
    const fromRate = exchangeRates[fromCurrency as keyof typeof exchangeRates]
    const toRate = exchangeRates[toCurrency as keyof typeof exchangeRates]
    return (Number.parseFloat(amount) * fromRate) / toRate
  }

  const handleConvert = async () => {
    setError("")
    setConverting(true)

    try {
      const convertAmount = Number.parseFloat(amount)
      if (!convertAmount || convertAmount <= 0) {
        setError("Please enter a valid amount")
        return
      }

      const availableBalance = userBalance[fromCurrency as keyof typeof userBalance]
      if (convertAmount > availableBalance) {
        setError("Insufficient balance")
        return
      }

      const convertedAmount = calculateConversion()

      const newBalance = {
        ...userBalance,
        [fromCurrency]: userBalance[fromCurrency as keyof typeof userBalance] - convertAmount,
        [toCurrency]: userBalance[toCurrency as keyof typeof userBalance] + convertedAmount,
      }

      await updateDoc(doc(db, "users", user.uid), {
        balance: newBalance,
      })

      // Record the transaction
      await addDoc(collection(db, "transactions"), {
        userId: user.uid,
        type: "convert",
        currency: `${fromCurrency}_to_${toCurrency}`,
        amount: convertAmount,
        status: "completed",
        createdAt: new Date(),
        description: `Converted ${convertAmount} ${fromCurrency.toUpperCase()} to ${calculateConversion().toFixed(8)} ${toCurrency.toUpperCase()}`,
      })

      setAmount("")
      alert("Conversion successful!")
    } catch (error) {
      setError("Conversion failed. Please try again.")
    } finally {
      setConverting(false)
    }
  }

  const swapCurrencies = () => {
    const temp = fromCurrency
    setFromCurrency(toCurrency)
    setToCurrency(temp)
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <Navbar />

      <div className="container mx-auto max-w-2xl px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-slate-900 mb-2">Convert Currency</h1>
          <p className="text-slate-600">Exchange between different cryptocurrencies and USD</p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Currency Conversion</CardTitle>
            <CardDescription>Convert your holdings between different currencies</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {error && (
              <Alert variant="destructive">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            <div className="space-y-4">
              <div>
                <Label htmlFor="from-currency">From</Label>
                <div className="flex space-x-2 mt-1">
                  <Select value={fromCurrency} onValueChange={setFromCurrency}>
                    <SelectTrigger className="w-32">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="usd">USD</SelectItem>
                      <SelectItem value="btc">BTC</SelectItem>
                      <SelectItem value="eth">ETH</SelectItem>
                      <SelectItem value="usdt">USDT</SelectItem>
                      <SelectItem value="usdc">USDC</SelectItem>
                    </SelectContent>
                  </Select>
                  <Input
                    id="amount"
                    type="number"
                    placeholder="0.00"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    className="flex-1"
                  />
                </div>
                <p className="text-sm text-slate-500 mt-1">
                  Available: {userBalance[fromCurrency as keyof typeof userBalance].toFixed(8)}{" "}
                  {fromCurrency.toUpperCase()}
                </p>
              </div>

              <div className="flex justify-center">
                <Button variant="outline" size="sm" onClick={swapCurrencies}>
                  <ArrowUpDown className="h-4 w-4" />
                </Button>
              </div>

              <div>
                <Label htmlFor="to-currency">To</Label>
                <div className="flex space-x-2 mt-1">
                  <Select value={toCurrency} onValueChange={setToCurrency}>
                    <SelectTrigger className="w-32">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="usd">USD</SelectItem>
                      <SelectItem value="btc">BTC</SelectItem>
                      <SelectItem value="eth">ETH</SelectItem>
                      <SelectItem value="usdt">USDT</SelectItem>
                      <SelectItem value="usdc">USDC</SelectItem>
                    </SelectContent>
                  </Select>
                  <div className="flex-1 p-3 bg-slate-100 rounded-lg">
                    {calculateConversion().toFixed(8)} {toCurrency.toUpperCase()}
                  </div>
                </div>
                <p className="text-sm text-slate-500 mt-1">
                  Available: {userBalance[toCurrency as keyof typeof userBalance].toFixed(8)} {toCurrency.toUpperCase()}
                </p>
              </div>
            </div>

            <div className="bg-slate-50 rounded-lg p-4">
              <h4 className="font-medium text-slate-900 mb-2">Exchange Rates</h4>
              <div className="grid grid-cols-2 gap-2 text-sm">
                <div>1 BTC = $45,000</div>
                <div>1 ETH = $2,500</div>
                <div>1 USDT = $1.00</div>
                <div>1 USDC = $1.00</div>
              </div>
            </div>

            <Button
              onClick={handleConvert}
              disabled={converting || !amount || fromCurrency === toCurrency}
              className="w-full bg-emerald-600 hover:bg-emerald-700"
            >
              {converting ? "Converting..." : "Convert"}
            </Button>
          </CardContent>
        </Card>

        <Card className="mt-6">
          <CardHeader>
            <CardTitle>Important Notes</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2 text-sm text-slate-600">
              <li>• Conversions are processed instantly</li>
              <li>• Exchange rates are updated in real-time</li>
              <li>• No conversion fees are charged</li>
              <li>• Minimum conversion amount: $1 equivalent</li>
            </ul>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
