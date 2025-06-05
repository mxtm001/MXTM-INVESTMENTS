import Link from "next/link"
import { TrendingUp, Mail, Phone, MapPin } from "lucide-react"

export default function Footer() {
  return (
    <footer className="bg-slate-900 text-white">
      <div className="container mx-auto max-w-6xl px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Company Info */}
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center space-x-2 mb-4">
              <div className="w-8 h-8 bg-gradient-to-r from-emerald-600 to-blue-600 rounded-lg flex items-center justify-center">
                <TrendingUp className="h-5 w-5 text-white" />
              </div>
              <span className="text-xl font-bold">MXTM INVESTMENTS</span>
            </div>
            <p className="text-slate-400 mb-4 max-w-md">
              Your trusted partner in investment success. We provide professional brokerage services with cutting-edge
              technology and personalized strategies.
            </p>
            <div className="space-y-2">
              <div className="flex items-center space-x-2 text-slate-400">
                <Mail className="h-4 w-4" />
                <span>info@mxtminvestments.com</span>
              </div>
              <div className="flex items-center space-x-2 text-slate-400">
                <Phone className="h-4 w-4" />
                <span>+1 (555) 123-4567</span>
              </div>
              <div className="flex items-center space-x-2 text-slate-400">
                <MapPin className="h-4 w-4" />
                <span>123 Financial District, New York, NY 10004</span>
              </div>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
            <div className="space-y-2">
              <Link href="/services" className="block text-slate-400 hover:text-white transition-colors">
                Services
              </Link>
              <Link href="/about" className="block text-slate-400 hover:text-white transition-colors">
                About Us
              </Link>
              <Link href="/contact" className="block text-slate-400 hover:text-white transition-colors">
                Contact
              </Link>
              <Link href="/dashboard" className="block text-slate-400 hover:text-white transition-colors">
                Dashboard
              </Link>
            </div>
          </div>

          {/* Legal */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Legal</h3>
            <div className="space-y-2">
              <Link href="/privacy" className="block text-slate-400 hover:text-white transition-colors">
                Privacy Policy
              </Link>
              <Link href="/terms" className="block text-slate-400 hover:text-white transition-colors">
                Terms of Service
              </Link>
              <Link href="/disclaimer" className="block text-slate-400 hover:text-white transition-colors">
                Risk Disclaimer
              </Link>
            </div>
          </div>
        </div>

        <div className="border-t border-slate-800 mt-8 pt-8 text-center text-slate-400">
          <p>&copy; 2024 MXTM INVESTMENTS. All rights reserved.</p>
          <p className="text-sm mt-2">Investment involves risk. Past performance does not guarantee future results.</p>
        </div>
      </div>
    </footer>
  )
}
