"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { collection, query, where, orderBy, onSnapshot } from "firebase/firestore"
import { ArrowUpRight, ArrowDownRight, RefreshCw } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import Navbar from "@/components/navbar"
import { useAuth } from "@/lib/auth-context"
import { db } from "@/lib/firebase"

interface Transaction {
  id: string
  type: string
  currency: string
  amount: number
  status: string
  createdAt: any
  description: string
}

export default function TransactionsPage() {
  const { user, loading } = useAuth()
  const router = useRouter()
  const [transactions, setTransactions] = useState<Transaction[]>([])
  const [filter, setFilter] = useState("all")

  useEffect(() => {
    if (!loading && !user) {
      router.push("/login")
      return
    }

    if (user) {
      // Create a query for transactions
      const q = query(collection(db, "transactions"), where("userId", "==", user.uid), orderBy("createdAt", "desc"))

      const unsubscribe = onSnapshot(q, (snapshot) => {
        const transactionsData = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        })) as Transaction[]
        setTransactions(transactionsData)
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

  const filteredTransactions = filter === "all" ? transactions : transactions.filter((t) => t.type === filter)

  const getTransactionIcon = (type: string) => {
    switch (type) {
      case "deposit":
        return <ArrowDownRight className="h-4 w-4 text-green-600" />
      case "withdrawal":
        return <ArrowUpRight className="h-4 w-4 text-red-600" />
      case "convert":
        return <RefreshCw className="h-4 w-4 text-blue-600" />
      default:
        return null
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed":
        return "bg-green-100 text-green-800"
      case "pending":
        return "bg-yellow-100 text-yellow-800"
      case "failed":
        return "bg-red-100 text-red-800"
      default:
        return "bg-slate-100 text-slate-800"
    }
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <Navbar />

      <div className="container mx-auto max-w-4xl px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-slate-900 mb-2">Transaction History</h1>
          <p className="text-slate-600">View your complete transaction history</p>
        </div>

        <div className="mb-6 flex justify-between items-center">
          <div className="flex items-center space-x-2">
            <span className="text-sm text-slate-600">Filter by:</span>
            <Select value={filter} onValueChange={setFilter}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="All Transactions" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Transactions</SelectItem>
                <SelectItem value="deposit">Deposits</SelectItem>
                <SelectItem value="withdrawal">Withdrawals</SelectItem>
                <SelectItem value="convert">Conversions</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Transaction History</CardTitle>
            <CardDescription>Your recent account activity</CardDescription>
          </CardHeader>
          <CardContent>
            {filteredTransactions.length > 0 ? (
              <div className="space-y-4">
                {filteredTransactions.map((transaction) => (
                  <div key={transaction.id} className="flex items-center justify-between p-4 bg-slate-50 rounded-lg">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-slate-100 rounded-full flex items-center justify-center">
                        {getTransactionIcon(transaction.type)}
                      </div>
                      <div>
                        <p className="font-medium text-slate-900 capitalize">{transaction.type}</p>
                        <p className="text-sm text-slate-500">
                          {transaction.createdAt?.toDate?.()?.toLocaleString() || "Unknown"}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-medium text-slate-900">
                        {transaction.type === "deposit" ? "+" : transaction.type === "withdrawal" ? "-" : ""}
                        {transaction.amount} {transaction.currency.toUpperCase()}
                      </p>
                      <p className={`text-xs px-2 py-1 rounded inline-block ${getStatusColor(transaction.status)}`}>
                        {transaction.status}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <p className="text-slate-500">No transactions found</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
