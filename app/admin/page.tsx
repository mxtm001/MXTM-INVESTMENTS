"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { collection, onSnapshot, doc, updateDoc, query, orderBy, where, getDocs } from "firebase/firestore"
import { Users, DollarSign, TrendingUp, Edit } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import Navbar from "@/components/navbar"
import { useAuth } from "@/lib/auth-context"
import { db } from "@/lib/firebase"

interface User {
  id: string
  email: string
  balance: {
    usd: number
    btc: number
    eth: number
    usdt: number
    usdc: number
  }
  createdAt: any
  status: string
}

interface Withdrawal {
  id: string
  userId: string
  userEmail: string
  currency: string
  amount: number
  fee: number
  address: string
  status: string
  createdAt: any
}

export default function AdminPage() {
  const { user, userProfile, loading } = useAuth()
  const router = useRouter()
  const [users, setUsers] = useState<User[]>([])
  const [withdrawals, setWithdrawals] = useState<Withdrawal[]>([])
  const [selectedUser, setSelectedUser] = useState<User | null>(null)
  const [editBalance, setEditBalance] = useState({
    usd: 0,
    btc: 0,
    eth: 0,
    usdt: 0,
    usdc: 0,
  })
  const [updating, setUpdating] = useState(false)

  useEffect(() => {
    if (!loading && (!user || !userProfile?.isAdmin)) {
      router.push("/dashboard")
      return
    }

    if (user && userProfile?.isAdmin) {
      // Listen to users
      const usersQuery = query(collection(db, "users"), orderBy("createdAt", "desc"))
      const unsubscribeUsers = onSnapshot(usersQuery, (snapshot) => {
        const usersData = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        })) as User[]
        setUsers(usersData)
      })

      // Listen to withdrawals
      const withdrawalsQuery = query(collection(db, "withdrawals"), orderBy("createdAt", "desc"))
      const unsubscribeWithdrawals = onSnapshot(withdrawalsQuery, (snapshot) => {
        const withdrawalsData = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        })) as Withdrawal[]
        setWithdrawals(withdrawalsData)
      })

      return () => {
        unsubscribeUsers()
        unsubscribeWithdrawals()
      }
    }
  }, [user, userProfile, loading, router])

  if (loading) {
    return <div className="min-h-screen bg-slate-50 flex items-center justify-center">Loading...</div>
  }

  if (!user || !userProfile?.isAdmin) {
    return null
  }

  const handleEditUser = (user: User) => {
    setSelectedUser(user)
    setEditBalance(user.balance)
  }

  const handleUpdateBalance = async () => {
    if (!selectedUser) return

    setUpdating(true)
    try {
      await updateDoc(doc(db, "users", selectedUser.id), {
        balance: editBalance,
      })
      setSelectedUser(null)
      alert("Balance updated successfully!")
    } catch (error) {
      alert("Failed to update balance")
    } finally {
      setUpdating(false)
    }
  }

  const handleWithdrawalAction = async (withdrawalId: string, status: string) => {
    try {
      const withdrawal = withdrawals.find((w) => w.id === withdrawalId)
      if (!withdrawal) return

      await updateDoc(doc(db, "withdrawals", withdrawalId), {
        status: status,
        processedAt: new Date(),
      })

      // Update the transaction status
      const q = query(
        collection(db, "transactions"),
        where("userId", "==", withdrawal.userId),
        where("type", "==", "withdrawal"),
        where("amount", "==", withdrawal.amount),
        where("status", "==", "pending"),
      )

      const querySnapshot = await getDocs(q)
      querySnapshot.forEach(async (doc) => {
        await updateDoc(doc.ref, {
          status: status === "approved" ? "completed" : "failed",
        })
      })

      alert(`Withdrawal ${status} successfully!`)
    } catch (error) {
      alert("Failed to update withdrawal status")
    }
  }

  const totalUsers = users.length
  const totalUSDValue = users.reduce((sum, user) => {
    return (
      sum +
      user.balance.usd +
      user.balance.btc * 45000 +
      user.balance.eth * 2500 +
      user.balance.usdt +
      user.balance.usdc
    )
  }, 0)

  return (
    <div className="min-h-screen bg-slate-50">
      <Navbar />

      <div className="container mx-auto max-w-7xl px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-slate-900 mb-2">Admin Dashboard</h1>
          <p className="text-slate-600">Manage users, balances, and withdrawal requests</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Users</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{totalUsers}</div>
              <p className="text-xs text-muted-foreground">Registered accounts</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Value Locked</CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">${totalUSDValue.toLocaleString()}</div>
              <p className="text-xs text-muted-foreground">Across all accounts</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Pending Withdrawals</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{withdrawals.filter((w) => w.status === "pending").length}</div>
              <p className="text-xs text-muted-foreground">Awaiting approval</p>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="users" className="space-y-6">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="users">User Management</TabsTrigger>
            <TabsTrigger value="withdrawals">Withdrawal Requests</TabsTrigger>
          </TabsList>

          <TabsContent value="users">
            <Card>
              <CardHeader>
                <CardTitle>User Management</CardTitle>
                <CardDescription>View and manage user accounts and balances</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {users.map((user) => (
                    <div key={user.id} className="flex items-center justify-between p-4 bg-slate-50 rounded-lg">
                      <div className="flex-1">
                        <div className="font-medium text-slate-900">{user.email}</div>
                        <div className="text-sm text-slate-500">
                          Joined: {user.createdAt?.toDate?.()?.toLocaleDateString() || "Unknown"}
                        </div>
                        <div className="text-sm text-slate-600 mt-1">
                          USD: ${user.balance.usd.toFixed(2)} | BTC: {user.balance.btc.toFixed(8)} | ETH:{" "}
                          {user.balance.eth.toFixed(6)} | USDT: {user.balance.usdt.toFixed(2)} | USDC:{" "}
                          {user.balance.usdc.toFixed(2)}
                        </div>
                      </div>
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button variant="outline" size="sm" onClick={() => handleEditUser(user)}>
                            <Edit className="h-4 w-4 mr-1" />
                            Edit Balance
                          </Button>
                        </DialogTrigger>
                        <DialogContent>
                          <DialogHeader>
                            <DialogTitle>Edit User Balance</DialogTitle>
                            <DialogDescription>Update the balance for {user.email}</DialogDescription>
                          </DialogHeader>
                          <div className="space-y-4">
                            <div>
                              <Label htmlFor="usd">USD Balance</Label>
                              <Input
                                id="usd"
                                type="number"
                                value={editBalance.usd}
                                onChange={(e) =>
                                  setEditBalance({ ...editBalance, usd: Number.parseFloat(e.target.value) || 0 })
                                }
                              />
                            </div>
                            <div>
                              <Label htmlFor="btc">BTC Balance</Label>
                              <Input
                                id="btc"
                                type="number"
                                step="0.00000001"
                                value={editBalance.btc}
                                onChange={(e) =>
                                  setEditBalance({ ...editBalance, btc: Number.parseFloat(e.target.value) || 0 })
                                }
                              />
                            </div>
                            <div>
                              <Label htmlFor="eth">ETH Balance</Label>
                              <Input
                                id="eth"
                                type="number"
                                step="0.000001"
                                value={editBalance.eth}
                                onChange={(e) =>
                                  setEditBalance({ ...editBalance, eth: Number.parseFloat(e.target.value) || 0 })
                                }
                              />
                            </div>
                            <div>
                              <Label htmlFor="usdt">USDT Balance</Label>
                              <Input
                                id="usdt"
                                type="number"
                                value={editBalance.usdt}
                                onChange={(e) =>
                                  setEditBalance({ ...editBalance, usdt: Number.parseFloat(e.target.value) || 0 })
                                }
                              />
                            </div>
                            <div>
                              <Label htmlFor="usdc">USDC Balance</Label>
                              <Input
                                id="usdc"
                                type="number"
                                value={editBalance.usdc}
                                onChange={(e) =>
                                  setEditBalance({ ...editBalance, usdc: Number.parseFloat(e.target.value) || 0 })
                                }
                              />
                            </div>
                            <Button onClick={handleUpdateBalance} disabled={updating} className="w-full">
                              {updating ? "Updating..." : "Update Balance"}
                            </Button>
                          </div>
                        </DialogContent>
                      </Dialog>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="withdrawals">
            <Card>
              <CardHeader>
                <CardTitle>Withdrawal Requests</CardTitle>
                <CardDescription>Review and process withdrawal requests</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {withdrawals.map((withdrawal) => (
                    <div key={withdrawal.id} className="p-4 bg-slate-50 rounded-lg">
                      <div className="flex items-center justify-between mb-2">
                        <div className="font-medium text-slate-900">{withdrawal.userEmail}</div>
                        <div
                          className={`px-2 py-1 rounded text-xs font-medium ${
                            withdrawal.status === "pending"
                              ? "bg-yellow-100 text-yellow-800"
                              : withdrawal.status === "approved"
                                ? "bg-green-100 text-green-800"
                                : "bg-red-100 text-red-800"
                          }`}
                        >
                          {withdrawal.status.toUpperCase()}
                        </div>
                      </div>
                      <div className="text-sm text-slate-600 mb-3">
                        <div>
                          Amount: {withdrawal.amount} {withdrawal.currency.toUpperCase()}
                        </div>
                        <div>
                          Fee: {withdrawal.fee} {withdrawal.currency.toUpperCase()}
                        </div>
                        <div>Address: {withdrawal.address}</div>
                        <div>Date: {withdrawal.createdAt?.toDate?.()?.toLocaleString() || "Unknown"}</div>
                      </div>
                      {withdrawal.status === "pending" && (
                        <div className="flex space-x-2">
                          <Button
                            size="sm"
                            className="bg-green-600 hover:bg-green-700"
                            onClick={() => handleWithdrawalAction(withdrawal.id, "approved")}
                          >
                            Approve
                          </Button>
                          <Button
                            size="sm"
                            variant="destructive"
                            onClick={() => handleWithdrawalAction(withdrawal.id, "rejected")}
                          >
                            Reject
                          </Button>
                        </div>
                      )}
                    </div>
                  ))}
                  {withdrawals.length === 0 && (
                    <div className="text-center py-8 text-slate-500">No withdrawal requests found</div>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
