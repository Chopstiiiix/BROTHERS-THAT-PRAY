import Image from 'next/image'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'

const products = [
  {
    id: 1,
    name: 'BTP T-Shirt',
    description: 'Classic Brothers That Pray t-shirt with logo',
    price: 0.00,
    image: '/products/tshirt.jpg',
  },
  {
    id: 2,
    name: 'BTP Hoodie',
    description: 'Comfortable hoodie with embroidered logo',
    price: 0.00,
    image: '/products/hoodie.jpg',
  },
  {
    id: 3,
    name: 'Prayer Journal',
    description: 'Guided prayer journal for daily devotion',
    price: 0.00,
    image: '/products/journal.jpg',
  },
  {
    id: 4,
    name: 'BTP Cap',
    description: 'Adjustable cap with Brothers That Pray logo',
    price: 0.00,
    image: '/products/cap.jpg',
  },
  {
    id: 5,
    name: 'BTP Lapel Pin',
    description: 'Elegant lapel pin with Brothers That Pray emblem',
    price: 0.00,
    image: '/products/lapel-pin.jpg',
  },
  {
    id: 6,
    name: 'BTP Wallet',
    description: 'Premium leather wallet with embossed logo',
    price: 0.00,
    image: '/products/wallet.jpg',
  },
  {
    id: 7,
    name: 'BTP Polo Shirt',
    description: 'Smart polo shirt with embroidered logo',
    price: 0.00,
    image: '/products/polo.jpg',
  },
]

export default function StorePage() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="text-center mb-12">
        <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
          Store
        </h1>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
          Support the ministry and represent the brotherhood with our merchandise.
        </p>
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {products.map((product) => (
          <Card key={product.id} className="overflow-hidden">
            <div className="aspect-square bg-gray-100 relative">
              <Image
                src={product.image}
                alt={product.name}
                fill
                className="object-cover"
                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
              />
            </div>
            <CardContent className="p-4">
              <h3 className="font-semibold text-gray-900 mb-1">{product.name}</h3>
              <p className="text-sm text-gray-600 mb-3">{product.description}</p>
              <div className="flex items-center justify-between">
                <span className="text-lg font-bold text-primary-700">₦{product.price.toFixed(2)}</span>
                <Button size="sm" className="bg-primary-700 hover:bg-primary-800">
                  Add to Cart
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card className="mt-12 bg-primary-50 border-primary-200">
        <CardContent className="p-8 text-center">
          <h2 className="text-xl font-bold text-primary-900 mb-2">Coming Soon</h2>
          <p className="text-primary-700">
            Full e-commerce functionality with secure checkout will be available soon.
            Stay tuned for more products and features!
          </p>
        </CardContent>
      </Card>
    </div>
  )
}
