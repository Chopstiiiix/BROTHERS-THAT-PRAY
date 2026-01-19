import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'

const products = [
  {
    id: 1,
    name: 'BTP T-Shirt',
    description: 'Classic Brothers That Pray t-shirt with logo',
    price: 25.00,
    image: '/placeholder-product.jpg',
  },
  {
    id: 2,
    name: 'BTP Hoodie',
    description: 'Comfortable hoodie with embroidered logo',
    price: 45.00,
    image: '/placeholder-product.jpg',
  },
  {
    id: 3,
    name: 'Prayer Journal',
    description: 'Guided prayer journal for daily devotion',
    price: 15.00,
    image: '/placeholder-product.jpg',
  },
  {
    id: 4,
    name: 'BTP Cap',
    description: 'Adjustable cap with Brothers That Pray logo',
    price: 20.00,
    image: '/placeholder-product.jpg',
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
            <div className="aspect-square bg-gray-100 flex items-center justify-center">
              <svg className="w-16 h-16 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>
            <CardContent className="p-4">
              <h3 className="font-semibold text-gray-900 mb-1">{product.name}</h3>
              <p className="text-sm text-gray-600 mb-3">{product.description}</p>
              <div className="flex items-center justify-between">
                <span className="text-lg font-bold text-primary-700">${product.price.toFixed(2)}</span>
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
