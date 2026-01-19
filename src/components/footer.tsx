import Link from 'next/link'

export function Footer() {
  return (
    <footer className="relative text-primary-100 grunge-texture" style={{ backgroundColor: '#543507' }}>
      <div className="absolute inset-0 bg-black/10" />
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="col-span-1 md:col-span-2">
            <h3 className="text-xl font-bold text-white mb-2">Brothers That Pray</h3>
            <p className="text-primary-200 max-w-md">
              A community of men united in faith, supporting one another through prayer,
              fellowship, and spiritual growth.
            </p>
          </div>

          <div>
            <h4 className="font-semibold text-white mb-4">Quick Links</h4>
            <ul className="space-y-2">
              <li>
                <Link href="/live" className="hover:text-white transition-colors">
                  Live Stream
                </Link>
              </li>
              <li>
                <Link href="/sermons" className="hover:text-white transition-colors">
                  Sermons
                </Link>
              </li>
              <li>
                <Link href="/events" className="hover:text-white transition-colors">
                  Events
                </Link>
              </li>
              <li>
                <Link href="/donate" className="hover:text-white transition-colors">
                  Donate
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold text-white mb-4">Community</h4>
            <ul className="space-y-2">
              <li>
                <Link href="/prayer" className="hover:text-white transition-colors">
                  Prayer Wall
                </Link>
              </li>
              <li>
                <Link href="/auth/signup" className="hover:text-white transition-colors">
                  Join Us
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-primary-600 text-center text-primary-200 text-sm">
          <p>&copy; {new Date().getFullYear()} Brothers That Pray. All rights reserved.</p>
        </div>
      </div>
    </footer>
  )
}
