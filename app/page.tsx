"use client"

import { useEffect, useState } from "react"
import { ArrowRight, BarChart3, Shield, TrendingUp, Users, Zap, Bitcoin } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import Navbar from "@/components/navbar"
import Footer from "@/components/footer"
import Link from "next/link"

interface CryptoPrice {
  id: string
  symbol: string
  name: string
  current_price: number
  price_change_percentage_24h: number
}

export default function HomePage() {
  const [cryptoPrices, setCryptoPrices] = useState<CryptoPrice[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchCryptoPrices = async () => {
      try {
        const response = await fetch(
          "https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&ids=bitcoin,ethereum,tether,usd-coin&order=market_cap_desc&per_page=4&page=1&sparkline=false",
        )
        const data = await response.json()
        setCryptoPrices(data)
      } catch (error) {
        console.error("Error fetching crypto prices:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchCryptoPrices()
    const interval = setInterval(fetchCryptoPrices, 30000) // Update every 30 seconds

    return () => clearInterval(interval)
  }, [])

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white relative overflow-hidden">
      {/* Animated Bitcoin Background */}
      <div className="absolute inset-0 pointer-events-none">
        {/* Large floating Bitcoin logos */}
        <div className="absolute top-20 left-10 animate-float-slow opacity-5">
          <Bitcoin className="h-32 w-32 text-orange-500" />
        </div>
        <div className="absolute top-40 right-20 animate-float-medium opacity-5">
          <Bitcoin className="h-24 w-24 text-orange-500" />
        </div>
        <div className="absolute bottom-40 left-1/4 animate-float-fast opacity-5">
          <Bitcoin className="h-28 w-28 text-orange-500" />
        </div>
        <div className="absolute top-1/3 right-1/3 animate-float-slow opacity-5">
          <Bitcoin className="h-20 w-20 text-orange-500" />
        </div>
        <div className="absolute bottom-20 right-10 animate-float-medium opacity-5">
          <Bitcoin className="h-36 w-36 text-orange-500" />
        </div>
        <div className="absolute top-60 left-1/2 animate-float-fast opacity-5">
          <Bitcoin className="h-16 w-16 text-orange-500" />
        </div>

        {/* Smaller floating Bitcoin logos */}
        <div className="absolute top-32 right-1/4 animate-float-medium opacity-3">
          <Bitcoin className="h-12 w-12 text-yellow-500" />
        </div>
        <div className="absolute bottom-60 left-1/3 animate-float-slow opacity-3">
          <Bitcoin className="h-14 w-14 text-yellow-500" />
        </div>
        <div className="absolute top-1/2 left-20 animate-float-fast opacity-3">
          <Bitcoin className="h-10 w-10 text-yellow-500" />
        </div>
        <div className="absolute bottom-32 right-1/3 animate-float-medium opacity-3">
          <Bitcoin className="h-18 w-18 text-yellow-500" />
        </div>
      </div>

      <Navbar />

      {/* Hero Section */}
      <section className="relative px-4 py-20 md:py-32 z-10">
        <div className="container mx-auto max-w-6xl text-center">
          <div className="flex justify-center mb-6">
            <div className="w-20 h-20 bg-gradient-to-r from-orange-500 to-yellow-500 rounded-full flex items-center justify-center shadow-lg animate-pulse-slow">
              <Bitcoin className="h-12 w-12 text-white animate-spin-slow" />
            </div>
          </div>
          <h1 className="mb-6 text-4xl font-bold tracking-tight text-slate-900 md:text-6xl relative z-10">
            Invest Smarter with{" "}
            <span className="bg-gradient-to-r from-emerald-600 to-blue-600 bg-clip-text text-transparent">
              MXTM INVESTMENTS
            </span>
          </h1>
          <p className="mx-auto mb-8 max-w-2xl text-lg text-slate-600 md:text-xl relative z-10">
            Professional cryptocurrency and investment brokerage services with cutting-edge technology, personalized
            strategies, and expert guidance to help you achieve your financial goals.
          </p>
          <div className="flex flex-col gap-4 sm:flex-row sm:justify-center relative z-10">
            <Link href="/register">
              <Button
                size="lg"
                className="bg-emerald-600 hover:bg-emerald-700 shadow-lg hover:shadow-xl transition-all"
              >
                Create Account
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
            <Link href="/login">
              <Button size="lg" variant="outline" className="shadow-lg hover:shadow-xl transition-all">
                Sign In
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Live Crypto Prices */}
      <section className="px-4 py-16 bg-white/80 backdrop-blur-sm relative z-10">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-slate-900 mb-4">Live Cryptocurrency Prices</h2>
            <p className="text-lg text-slate-600">Real-time market data updated every 30 seconds</p>
          </div>

          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {[1, 2, 3, 4].map((i) => (
                <Card key={i} className="animate-pulse">
                  <CardHeader>
                    <div className="h-4 bg-slate-200 rounded w-3/4"></div>
                    <div className="h-3 bg-slate-200 rounded w-1/2"></div>
                  </CardHeader>
                  <CardContent>
                    <div className="h-6 bg-slate-200 rounded w-full mb-2"></div>
                    <div className="h-4 bg-slate-200 rounded w-2/3"></div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {cryptoPrices.map((crypto) => (
                <Card
                  key={crypto.id}
                  className="border-0 shadow-lg hover:shadow-xl transition-all duration-300 bg-white/90 backdrop-blur-sm"
                >
                  <CardHeader>
                    <CardTitle className="flex items-center justify-between">
                      <span className="flex items-center">
                        {crypto.symbol === "btc" && <Bitcoin className="h-5 w-5 mr-2 text-orange-500" />}
                        {crypto.symbol.toUpperCase()}
                      </span>
                      <span
                        className={`text-sm ${crypto.price_change_percentage_24h >= 0 ? "text-green-600" : "text-red-600"}`}
                      >
                        {crypto.price_change_percentage_24h >= 0 ? "+" : ""}
                        {crypto.price_change_percentage_24h.toFixed(2)}%
                      </span>
                    </CardTitle>
                    <CardDescription>{crypto.name}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold text-slate-900">${crypto.current_price.toLocaleString()}</div>
                    <div
                      className={`text-sm ${crypto.price_change_percentage_24h >= 0 ? "text-green-600" : "text-red-600"}`}
                    >
                      {crypto.price_change_percentage_24h >= 0 ? "↗" : "↘"} 24h change
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Features Section */}
      <section className="px-4 py-16 bg-slate-50/80 backdrop-blur-sm relative z-10">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-slate-900 mb-4">Why Choose MXTM INVESTMENTS?</h2>
            <p className="text-lg text-slate-600 max-w-2xl mx-auto">
              We combine decades of market expertise with innovative technology to deliver superior investment
              solutions.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Card className="border-0 shadow-lg bg-white/90 backdrop-blur-sm hover:shadow-xl transition-all duration-300">
              <CardHeader>
                <div className="w-12 h-12 bg-emerald-100 rounded-lg flex items-center justify-center mb-4">
                  <TrendingUp className="h-6 w-6 text-emerald-600" />
                </div>
                <CardTitle>Expert Analysis</CardTitle>
                <CardDescription>
                  Professional market analysis and investment strategies backed by years of experience.
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="border-0 shadow-lg bg-white/90 backdrop-blur-sm hover:shadow-xl transition-all duration-300">
              <CardHeader>
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
                  <Shield className="h-6 w-6 text-blue-600" />
                </div>
                <CardTitle>Secure Platform</CardTitle>
                <CardDescription>
                  Bank-level security with advanced encryption to protect your investments and personal data.
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="border-0 shadow-lg bg-white/90 backdrop-blur-sm hover:shadow-xl transition-all duration-300">
              <CardHeader>
                <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mb-4">
                  <Zap className="h-6 w-6 text-purple-600" />
                </div>
                <CardTitle>Fast Execution</CardTitle>
                <CardDescription>
                  Lightning-fast trade execution with real-time market data and instant order processing.
                </CardDescription>
              </CardHeader>
            </Card>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section className="px-4 py-16 bg-white/80 backdrop-blur-sm relative z-10">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-slate-900 mb-4">Our Services</h2>
            <p className="text-lg text-slate-600">Comprehensive investment solutions tailored to your needs</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <Card className="bg-white/90 backdrop-blur-sm hover:shadow-xl transition-all duration-300">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <BarChart3 className="h-5 w-5 mr-2 text-emerald-600" />
                  Crypto Trading
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-slate-600">
                  Access to global cryptocurrency markets with competitive fees and advanced trading tools.
                </p>
              </CardContent>
            </Card>

            <Card className="bg-white/90 backdrop-blur-sm hover:shadow-xl transition-all duration-300">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <TrendingUp className="h-5 w-5 mr-2 text-blue-600" />
                  Portfolio Management
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-slate-600">
                  Professional portfolio management services with personalized investment strategies.
                </p>
              </CardContent>
            </Card>

            <Card className="bg-white/90 backdrop-blur-sm hover:shadow-xl transition-all duration-300">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Users className="h-5 w-5 mr-2 text-purple-600" />
                  Financial Advisory
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-slate-600">
                  One-on-one consultation with certified financial advisors to plan your investment journey.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="px-4 py-16 bg-gradient-to-r from-emerald-600 to-blue-600 relative z-10">
        <div className="container mx-auto max-w-4xl text-center">
          <h2 className="text-3xl font-bold text-white mb-4">Ready to Start Your Investment Journey?</h2>
          <p className="text-xl text-emerald-100 mb-8">
            Join thousands of satisfied clients who trust MXTM INVESTMENTS with their financial future.
          </p>
          <div className="flex flex-col gap-4 sm:flex-row sm:justify-center">
            <Link href="/register">
              <Button size="lg" variant="secondary" className="shadow-lg hover:shadow-xl transition-all">
                Open Account Now
              </Button>
            </Link>
            <Link href="/login">
              <Button
                size="lg"
                variant="outline"
                className="text-white border-white hover:bg-white hover:text-emerald-600 shadow-lg hover:shadow-xl transition-all"
              >
                Sign In
              </Button>
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  )
}
