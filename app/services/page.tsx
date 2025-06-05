import { BarChart3, TrendingUp, Users, Shield, Zap, Globe } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Navbar from "@/components/navbar"
import Footer from "@/components/footer"

export default function ServicesPage() {
  return (
    <div className="min-h-screen bg-white">
      <Navbar />

      {/* Hero Section */}
      <section className="px-4 py-16 bg-gradient-to-r from-emerald-50 to-blue-50">
        <div className="container mx-auto max-w-6xl text-center">
          <h1 className="text-4xl font-bold text-slate-900 mb-4">Our Services</h1>
          <p className="text-xl text-slate-600 max-w-2xl mx-auto">
            Comprehensive investment solutions designed to help you achieve your financial goals
          </p>
        </div>
      </section>

      {/* Services Grid */}
      <section className="px-4 py-16">
        <div className="container mx-auto max-w-6xl">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <Card className="border-0 shadow-lg">
              <CardHeader>
                <div className="w-12 h-12 bg-emerald-100 rounded-lg flex items-center justify-center mb-4">
                  <BarChart3 className="h-6 w-6 text-emerald-600" />
                </div>
                <CardTitle>Stock Trading</CardTitle>
                <CardDescription>
                  Access global stock markets with competitive commissions and advanced trading tools.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm text-slate-600 mb-4">
                  <li>• Real-time market data</li>
                  <li>• Advanced charting tools</li>
                  <li>• Low commission rates</li>
                  <li>• Mobile trading app</li>
                </ul>
                <Button className="w-full">Learn More</Button>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-lg">
              <CardHeader>
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
                  <TrendingUp className="h-6 w-6 text-blue-600" />
                </div>
                <CardTitle>Portfolio Management</CardTitle>
                <CardDescription>
                  Professional portfolio management with personalized investment strategies.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm text-slate-600 mb-4">
                  <li>• Personalized strategies</li>
                  <li>• Risk assessment</li>
                  <li>• Regular rebalancing</li>
                  <li>• Performance reporting</li>
                </ul>
                <Button className="w-full">Learn More</Button>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-lg">
              <CardHeader>
                <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mb-4">
                  <Users className="h-6 w-6 text-purple-600" />
                </div>
                <CardTitle>Financial Advisory</CardTitle>
                <CardDescription>One-on-one consultation with certified financial advisors.</CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm text-slate-600 mb-4">
                  <li>• Certified advisors</li>
                  <li>• Retirement planning</li>
                  <li>• Tax optimization</li>
                  <li>• Estate planning</li>
                </ul>
                <Button className="w-full">Learn More</Button>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-lg">
              <CardHeader>
                <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-4">
                  <Shield className="h-6 w-6 text-green-600" />
                </div>
                <CardTitle>Risk Management</CardTitle>
                <CardDescription>Advanced risk management tools to protect your investments.</CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm text-slate-600 mb-4">
                  <li>• Risk analysis tools</li>
                  <li>• Stop-loss orders</li>
                  <li>• Diversification strategies</li>
                  <li>• Market alerts</li>
                </ul>
                <Button className="w-full">Learn More</Button>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-lg">
              <CardHeader>
                <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center mb-4">
                  <Zap className="h-6 w-6 text-orange-600" />
                </div>
                <CardTitle>Algorithmic Trading</CardTitle>
                <CardDescription>Automated trading strategies powered by advanced algorithms.</CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm text-slate-600 mb-4">
                  <li>• Custom algorithms</li>
                  <li>• Backtesting tools</li>
                  <li>• 24/7 monitoring</li>
                  <li>• Performance analytics</li>
                </ul>
                <Button className="w-full">Learn More</Button>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-lg">
              <CardHeader>
                <div className="w-12 h-12 bg-indigo-100 rounded-lg flex items-center justify-center mb-4">
                  <Globe className="h-6 w-6 text-indigo-600" />
                </div>
                <CardTitle>Global Markets</CardTitle>
                <CardDescription>Access to international markets and foreign exchange trading.</CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm text-slate-600 mb-4">
                  <li>• International stocks</li>
                  <li>• Forex trading</li>
                  <li>• Currency hedging</li>
                  <li>• Global ETFs</li>
                </ul>
                <Button className="w-full">Learn More</Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  )
}
