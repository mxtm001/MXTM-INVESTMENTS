import { Users, Award, TrendingUp, Shield } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import Navbar from "@/components/navbar"
import Footer from "@/components/footer"

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-white">
      <Navbar />

      {/* Hero Section */}
      <section className="px-4 py-16 bg-gradient-to-r from-emerald-50 to-blue-50">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-slate-900 mb-4">About MXTM INVESTMENTS</h1>
            <p className="text-xl text-slate-600 max-w-2xl mx-auto">
              Your trusted partner in building wealth through smart investment strategies and professional guidance.
            </p>
          </div>
        </div>
      </section>

      {/* Company Story */}
      <section className="px-4 py-16">
        <div className="container mx-auto max-w-4xl">
          <div className="prose prose-lg mx-auto text-slate-600">
            <h2 className="text-3xl font-bold text-slate-900 mb-6">Our Story</h2>
            <p className="mb-6">
              Founded in 2010, MXTM INVESTMENTS has grown from a small boutique firm to one of the most trusted names in
              investment brokerage. Our journey began with a simple mission: to democratize access to professional
              investment services and help individuals build lasting wealth.
            </p>
            <p className="mb-6">
              Over the years, we've helped thousands of clients navigate the complexities of financial markets,
              providing them with the tools, knowledge, and support they need to achieve their financial goals. Our
              commitment to excellence and client success has made us a leader in the industry.
            </p>
            <p>
              Today, we continue to innovate and evolve, leveraging cutting-edge technology and market insights to
              deliver superior investment solutions. Our team of experienced professionals is dedicated to your success,
              providing personalized service and expert guidance every step of the way.
            </p>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="px-4 py-16 bg-slate-50">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-slate-900 mb-4">Our Track Record</h2>
            <p className="text-lg text-slate-600">Numbers that speak to our commitment and success</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="text-4xl font-bold text-emerald-600 mb-2">15+</div>
              <div className="text-slate-600">Years of Experience</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-blue-600 mb-2">10K+</div>
              <div className="text-slate-600">Satisfied Clients</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-purple-600 mb-2">$2B+</div>
              <div className="text-slate-600">Assets Under Management</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-orange-600 mb-2">98%</div>
              <div className="text-slate-600">Client Satisfaction</div>
            </div>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="px-4 py-16">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-slate-900 mb-4">Our Values</h2>
            <p className="text-lg text-slate-600">The principles that guide everything we do</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <Card className="text-center border-0 shadow-lg">
              <CardHeader>
                <div className="w-12 h-12 bg-emerald-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                  <Shield className="h-6 w-6 text-emerald-600" />
                </div>
                <CardTitle>Integrity</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-slate-600">
                  We operate with the highest ethical standards and complete transparency in all our dealings.
                </p>
              </CardContent>
            </Card>

            <Card className="text-center border-0 shadow-lg">
              <CardHeader>
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                  <Award className="h-6 w-6 text-blue-600" />
                </div>
                <CardTitle>Excellence</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-slate-600">
                  We strive for excellence in everything we do, continuously improving our services and expertise.
                </p>
              </CardContent>
            </Card>

            <Card className="text-center border-0 shadow-lg">
              <CardHeader>
                <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                  <Users className="h-6 w-6 text-purple-600" />
                </div>
                <CardTitle>Client Focus</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-slate-600">
                  Your success is our success. We put our clients' interests first in every decision we make.
                </p>
              </CardContent>
            </Card>

            <Card className="text-center border-0 shadow-lg">
              <CardHeader>
                <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                  <TrendingUp className="h-6 w-6 text-orange-600" />
                </div>
                <CardTitle>Innovation</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-slate-600">
                  We embrace technology and innovation to provide cutting-edge investment solutions.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  )
}
