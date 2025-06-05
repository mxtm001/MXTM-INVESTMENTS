"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { doc, onSnapshot } from "firebase/firestore"
import { DollarSign, BarChart3, Activity, Plus, ArrowUpDown, ArrowDownLeft } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Navbar from "@/components/navbar"
import { useAuth } from "@/lib/auth-context"
import { db } from "@/lib/firebase"
import Link from "next/link"

export default function DashboardPage() {
  const { user, loading } = useAuth()
  const router = useRouter()
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

  const totalUSDValue =
    userBalance.usd + userBalance.btc * 45000 + userBalance.eth * 2500 + userBalance.usdt + userBalance.usdc

  return (
    <div className="min-h-screen bg-slate-50">
      <Navbar />

      <div className="container mx-auto max-w-7xl px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-slate-900 mb-2">Investment Dashboard</h1>
          <p className="text-slate-600">Welcome back! Here's your portfolio overview.</p>
        </div>

        {/* Portfolio Overview Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Portfolio Value</CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">${totalUSDValue.toLocaleString()}</div>
              <p className="text-xs text-muted-foreground">Estimated USD value</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">USD Balance</CardTitle>
              <DollarSign className="h-4 w-4 text-green-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">${userBalance.usd.toFixed(2)}</div>
              <p className="text-xs text-muted-foreground">Available cash</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Bitcoin</CardTitle>
              <BarChart3 className="h-4 w-4 text-orange-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{userBalance.btc.toFixed(8)} BTC</div>
              <p className="text-xs text-muted-foreground">≈ ${(userBalance.btc * 45000).toFixed(2)}</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Ethereum</CardTitle>
              <Activity className="h-4 w-4 text-blue-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{userBalance.eth.toFixed(6)} ETH</div>
              <p className="text-xs text-muted-foreground">≈ ${(userBalance.eth * 2500).toFixed(2)}</p>
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
            <CardDescription>Manage your investments with these quick actions</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <Link href="/deposit">
                <Button className="h-16 w-full bg-emerald-600 hover:bg-emerald-700">
                  <Plus className="h-5 w-5 mr-2" />
                  Deposit Funds
                </Button>
              </Link>
              <Link href="/convert">
                <Button variant="outline" className="h-16 w-full">
                  <ArrowUpDown className="h-5 w-5 mr-2" />
                  Convert Currency
                </Button>
              </Link>
              <Link href="/withdraw">
                <Button variant="outline" className="h-16 w-full">
                  <ArrowDownLeft className="h-5 w-5 mr-2" />
                  Withdraw Funds
                </Button>
              </Link>
              <Link href="/dashboard/transactions">
                <Button variant="outline" className="h-16 w-full">
                  <Activity className="h-5 w-5 mr-2" />
                  Transactions
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>

        {/* Detailed Balances */}
        <Card>
          <CardHeader>
            <CardTitle>Detailed Balances</CardTitle>
            <CardDescription>Your current cryptocurrency and fiat holdings</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 bg-slate-50 rounded-lg">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                    <DollarSign className="h-5 w-5 text-green-600" />
                  </div>
                  <div>
                    <p className="font-medium text-slate-900">US Dollar</p>
                    <p className="text-sm text-slate-500">USD</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-medium text-slate-900">${userBalance.usd.toFixed(2)}</p>
                </div>
              </div>

              <div className="flex items-center justify-between p-4 bg-slate-50 rounded-lg">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-orange-100 rounded-full flex items-center justify-center">
                    <span className="text-sm font-semibold text-orange-600">₿</span>
                  </div>
                  <div>
                    <p className="font-medium text-slate-900">Bitcoin</p>
                    <p className="text-sm text-slate-500">BTC</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-medium text-slate-900">{userBalance.btc.toFixed(8)} BTC</p>
                  <p className="text-sm text-slate-500">≈ ${(userBalance.btc * 45000).toFixed(2)}</p>
                </div>
              </div>

              <div className="flex items-center justify-between p-4 bg-slate-50 rounded-lg">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                    <span className="text-sm font-semibold text-blue-600">Ξ</span>
                  </div>
                  <div>
                    <p className="font-medium text-slate-900">Ethereum</p>
                    <p className="text-sm text-slate-500">ETH</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-medium text-slate-900">{userBalance.eth.toFixed(6)} ETH</p>
                  <p className="text-sm text-slate-500">≈ ${(userBalance.eth * 2500).toFixed(2)}</p>
                </div>
              </div>

              <div className="flex items-center justify-between p-4 bg-slate-50 rounded-lg">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                    <span className="text-sm font-semibold text-green-600">₮</span>
                  </div>
                  <div>
                    <p className="font-medium text-slate-900">Tether USD</p>
                    <p className="text-sm text-slate-500">USDT</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-medium text-slate-900">{userBalance.usdt.toFixed(2)} USDT</p>
                </div>
              </div>

              <div className="flex items-center justify-between p-4 bg-slate-50 rounded-lg">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                    <span className="text-sm font-semibold text-blue-600">$</span>
                  </div>
                  <div>
                    <p className="font-medium text-slate-900">USD Coin</p>
                    <p className="text-sm text-slate-500">USDC</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-medium text-slate-900">{userBalance.usdc.toFixed(2)} USDC</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
