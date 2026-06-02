<?php

namespace Database\Seeders;

use App\Models\Product;
use App\Models\Store;
use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Str;
use Illuminate\Support\Facades\Hash;

class RealDataSeeder extends Seeder
{
    public function run(): void
    {
        $storesData = [
            [
                'name' => 'Aura Jewelry & Fine Gold',
                'owner' => 'Amit Sharma',
                'category' => 'Jewelry',
                'products' => [
                    ['name' => '24K Gold Necklace', 'price' => 125000, 'desc' => 'Pure 24K yellow gold handcrafted necklace with traditional design.'],
                    ['name' => 'Diamond Stud Earrings', 'price' => 45000, 'desc' => 'Dazzling 1-carat diamond studs set in 18K white gold.'],
                    ['name' => 'Platinum Wedding Band', 'price' => 35000, 'desc' => 'Classic comfort-fit platinum band for eternal commitment.'],
                    ['name' => 'Ruby Pendant Necklace', 'price' => 28000, 'desc' => 'Genuine Burmese ruby surrounded by pavé diamonds.'],
                    ['name' => 'Gold Bangle Set (2pc)', 'price' => 95000, 'desc' => 'Traditional Indian gold bangles with intricate filigree work.'],
                    ['name' => 'Silver Anklet Pair', 'price' => 3500, 'desc' => 'Sterling silver anklets with delicate bells.'],
                    ['name' => 'Engagement Ring', 'price' => 150000, 'desc' => 'Solitaire diamond ring with a halo of smaller stones.'],
                    ['name' => 'Antique Pearl Choker', 'price' => 62000, 'desc' => 'Vintage-style freshwater pearl choker with gold clasp.'],
                    ['name' => 'Gemstone Bracelet', 'price' => 12000, 'desc' => 'Multi-color gemstone bracelet in 14K gold.'],
                    ['name' => 'Men\'s Gold Ring', 'price' => 42000, 'desc' => 'Masculine 22K gold ring with brushed finish.'],
                    ['name' => 'Nose Pin Diamond', 'price' => 8500, 'desc' => 'Single stone diamond nose pin in yellow gold.'],
                    ['name' => 'Temple Design Earring', 'price' => 55000, 'desc' => 'Heavy temple jewelry earrings for bridal wear.'],
                ]
            ],
            [
                'name' => 'Signal Tech Electronics',
                'owner' => 'Rajesh Kumar',
                'category' => 'Electronics',
                'products' => [
                    ['name' => 'iPhone 16 Pro Max', 'price' => 144900, 'desc' => 'Latest flagship with 256GB storage, Natural Titanium.'],
                    ['name' => 'MacBook Pro M3', 'price' => 169900, 'desc' => '14-inch Apple Silicon M3 Chip with 16GB RAM.'],
                    ['name' => 'Samsung S24 Ultra', 'price' => 129999, 'desc' => 'Ultimate Android flagship with S-Pen and AI features.'],
                    ['name' => 'Sony WH-1000XM5', 'price' => 29990, 'desc' => 'Industry-leading noise-canceling wireless headphones.'],
                    ['name' => 'Dell XPS 13 Laptop', 'price' => 115000, 'desc' => 'Ultra-thin Windows laptop with OLED display.'],
                    ['name' => 'iPad Air 11-inch', 'price' => 59900, 'desc' => 'M2 chip, 128GB, Liquid Retina display.'],
                    ['name' => 'Canon EOS R6 Mark II', 'price' => 215000, 'desc' => 'Full-frame mirrorless camera for professionals.'],
                    ['name' => 'LG C3 55-inch OLED TV', 'price' => 135000, 'desc' => 'Stunning 4K OLED display for the ultimate cinema experience.'],
                    ['name' => 'PlayStation 5 Slim', 'price' => 44990, 'desc' => 'Next-gen gaming console with 1TB SSD.'],
                    ['name' => 'Bose SoundLink Revolve+', 'price' => 24500, 'desc' => 'Portable Bluetooth speaker with 360-degree sound.'],
                    ['name' => 'Apple Watch Series 9', 'price' => 41900, 'desc' => 'Advanced health sensors and powerful S9 chip.'],
                    ['name' => 'DJI Mini 4 Pro Drone', 'price' => 95000, 'desc' => 'Foldable camera drone with 4K HDR video.'],
                    ['name' => 'Keychron K2 Mechanical Keyboard', 'price' => 8500, 'desc' => 'Wireless mechanical keyboard with Gateron switches.'],
                ]
            ],
            [
                'name' => 'Velvet Touch Fashion',
                'owner' => 'Priya Das',
                'category' => 'Fashion',
                'products' => [
                    ['name' => 'Designer Silk Saree', 'price' => 18500, 'desc' => 'Handwoven Banarasi silk saree with gold zari work.'],
                    ['name' => 'Men\'s Slim Fit Suit', 'price' => 12000, 'desc' => 'Premium wool-blend three-piece suit in charcoal gray.'],
                    ['name' => 'Leather Biker Jacket', 'price' => 8500, 'desc' => 'Genuine top-grain leather jacket with quilted details.'],
                    ['name' => 'Floral Summer Dress', 'price' => 3200, 'desc' => 'Lightweight cotton dress with vibrant floral print.'],
                    ['name' => 'Denim Slim Jeans', 'price' => 2800, 'desc' => 'Distressed blue denim with stretch comfort.'],
                    ['name' => 'Embroidered Kurta Set', 'price' => 4500, 'desc' => 'Traditional Indian wear for festivals and occasions.'],
                    ['name' => 'Casual Sneakers', 'price' => 5500, 'desc' => 'Minimalist white leather sneakers for daily wear.'],
                    ['name' => 'Woolen Trench Coat', 'price' => 9500, 'desc' => 'Classic double-breasted winter coat.'],
                    ['name' => 'Designer Handbag', 'price' => 15000, 'desc' => 'Structured vegan leather tote with gold hardware.'],
                    ['name' => 'Formal Oxford Shoes', 'price' => 4200, 'desc' => 'Polished black leather oxfords for office wear.'],
                    ['name' => 'Graphic Print T-Shirt', 'price' => 1200, 'desc' => '100% organic cotton tee with street-style print.'],
                    ['name' => 'Velvet Evening Gown', 'price' => 14000, 'desc' => 'Elegant floor-length gown for special events.'],
                ]
            ],
            [
                'name' => 'The Local Pantry',
                'owner' => 'Suresh Babu',
                'category' => 'Grocery',
                'products' => [
                    ['name' => 'Organic Basmati Rice 5kg', 'price' => 850, 'desc' => 'Long-grain aged aromatic rice.'],
                    ['name' => 'Cold Pressed Coconut Oil', 'price' => 450, 'desc' => 'Pure and unrefined wood-pressed oil.'],
                    ['name' => 'Premium Darjeeling Tea', 'price' => 350, 'desc' => 'First-flush loose leaf tea from the Himalayas.'],
                    ['name' => 'Honey (Raw & Wild)', 'price' => 600, 'desc' => 'Unprocessed forest honey with natural enzymes.'],
                    ['name' => 'Almonds (California) 1kg', 'price' => 950, 'desc' => 'Crunchy and premium quality whole almonds.'],
                    ['name' => 'Saffron (Kashmiri Mogra)', 'price' => 1200, 'desc' => '1 gram of highest grade Kashmiri saffron.'],
                    ['name' => 'Organic Turmeric Powder', 'price' => 150, 'desc' => 'High curcumin content hand-ground turmeric.'],
                    ['name' => 'Whole Wheat Flour 10kg', 'price' => 550, 'desc' => 'Stone-ground chakki fresh atta.'],
                    ['name' => 'Desi Cow Ghee 1L', 'price' => 1400, 'desc' => 'A2 bilona method cultured ghee.'],
                    ['name' => 'Masala Spice Box Mix', 'price' => 450, 'desc' => 'A collection of essential Indian whole spices.'],
                    ['name' => 'Jaggery Powder 1kg', 'price' => 120, 'desc' => 'Chemical-free natural sweetener.'],
                    ['name' => 'Filter Coffee Roast', 'price' => 280, 'desc' => 'South Indian style chicory blend coffee.'],
                    ['name' => 'Handmade Pasta 500g', 'price' => 320, 'desc' => 'Semolina based artisanal dry pasta.'],
                ]
            ],
            [
                'name' => 'Modern Living Furniture',
                'owner' => 'Vikram Singh',
                'category' => 'Furniture',
                'products' => [
                    ['name' => 'Teak Wood Sofa Set', 'price' => 85000, 'desc' => 'L-shaped premium teak wood sofa with gray upholstery.'],
                    ['name' => 'King Size Storage Bed', 'price' => 45000, 'desc' => 'Hydraulic storage bed with upholstered headboard.'],
                    ['name' => 'Marble Top Dining Table', 'price' => 65000, 'desc' => '6-seater dining set with Italian marble top.'],
                    ['name' => 'Ergonomic Office Chair', 'price' => 12500, 'desc' => 'High-back mesh chair with lumbar support.'],
                    ['name' => 'Modern TV Unit', 'price' => 18000, 'desc' => 'Wall-mounted sleek unit for large screens.'],
                    ['name' => 'Solid Wood Bookshelf', 'price' => 15000, 'desc' => 'Minimalist open shelf design in oak finish.'],
                    ['name' => 'Velvet Wingback Chair', 'price' => 22000, 'desc' => 'Statement accent chair for the living room.'],
                    ['name' => 'Coffee Table (Nesting)', 'price' => 8500, 'desc' => 'Set of 3 round nesting tables with metal legs.'],
                    ['name' => 'Wardrobe (3-Door)', 'price' => 35000, 'desc' => 'Spacious wardrobe with mirror and locker.'],
                    ['name' => 'Outdoor Patio Set', 'price' => 28000, 'desc' => 'Rattan effect furniture for gardens and balconies.'],
                    ['name' => 'Bean Bag (XXL)', 'price' => 2500, 'desc' => 'Classic faux leather bean bag for lounging.'],
                    ['name' => 'Dressing Table with LED', 'price' => 14500, 'desc' => 'Modern vanity table with touch-sensitive light.'],
                ]
            ],
            [
                'name' => 'ProFit Sports & Fitness',
                'owner' => 'Karan Johar',
                'category' => 'Sports',
                'products' => [
                    ['name' => 'Electric Treadmill 2.5HP', 'price' => 35000, 'desc' => 'Home fitness treadmill with auto-incline.'],
                    ['name' => 'Adjustable Dumbbell Set', 'price' => 12000, 'desc' => 'Compact 24kg quick-change weight system.'],
                    ['name' => 'Yoga Mat (Eco-Friendly)', 'price' => 1500, 'desc' => 'Non-slip 6mm thick natural rubber mat.'],
                    ['name' => 'Cricket Bat (English Willow)', 'price' => 18000, 'desc' => 'Professional Grade 1 willow bat for matches.'],
                    ['name' => 'Badminton Racket (Carbon)', 'price' => 4500, 'desc' => 'Lightweight high-tension graphite racket.'],
                    ['name' => 'Resistance Band Set', 'price' => 850, 'desc' => 'Set of 5 power bands for full body workout.'],
                    ['name' => 'Football (Official Size)', 'price' => 2200, 'desc' => 'FIFA quality thermobonded match ball.'],
                    ['name' => 'Spinning Exercise Bike', 'price' => 24000, 'desc' => 'Heavy flywheel indoor cycling bike.'],
                    ['name' => 'Boxing Gloves (Leather)', 'price' => 3200, 'desc' => 'Genuine leather gloves for heavy bag training.'],
                    ['name' => 'Smart Fitness Tracker', 'price' => 3500, 'desc' => 'Heart rate, sleep, and activity monitoring.'],
                    ['name' => 'Whey Protein Isolate 2kg', 'price' => 5800, 'desc' => 'Fast-absorbing protein for muscle recovery.'],
                    ['name' => 'Basketball (Indoor/Outdoor)', 'price' => 1800, 'desc' => 'Durable rubber composite grip basketball.'],
                    ['name' => 'Swimming Goggles Pro', 'price' => 1200, 'desc' => 'Anti-fog wide-view racing goggles.'],
                ]
            ],
        ];

        foreach ($storesData as $storeInfo) {
            // Create the owner
            $user = User::create([
                'id' => Str::uuid(),
                'name' => $storeInfo['owner'],
                'email' => Str::slug($storeInfo['owner']) . '@example.com',
                'password' => Hash::make('password'),
                'role' => 'owner',
            ]);

            // Create the store
            $store = Store::create([
                'id' => Str::uuid(),
                'user_id' => $user->id,
                'name' => $storeInfo['name'],
                'slug' => Str::slug($storeInfo['name']),
                'status' => 'active',
                'business_type' => $storeInfo['category'],
                'avg_rating' => rand(40, 50) / 10,
                'total_earnings' => 0,
                'city' => 'Mumbai',
                'state' => 'Maharashtra',
            ]);

            // Create products
            foreach ($storeInfo['products'] as $productInfo) {
                Product::create([
                    'id' => Str::uuid(),
                    'store_id' => $store->id,
                    'name' => $productInfo['name'],
                    'slug' => Str::slug($productInfo['name']) . '-' . rand(100, 999),
                    'description' => $productInfo['desc'],
                    'price' => $productInfo['price'],
                    'stock' => rand(10, 100),
                    'category' => $storeInfo['category'],
                    'image_url' => 'https://images.unsplash.com/photo-' . $this->getUnsplashId($storeInfo['category']) . '?auto=format&fit=crop&q=80&w=800',
                ]);
            }
        }
    }

    private function getUnsplashId($category) {
        $ids = [
            'Jewelry' => '1515562141515-07cf644869ae',
            'Electronics' => '1498050108023-c5249f4df085',
            'Fashion' => '1445205170230-053b83016050',
            'Grocery' => '1542838132-92c53300491e',
            'Furniture' => '1556228453-efd6c1ff04f6',
            'Sports' => '1461896742585-3bc5b1f9b1bb',
        ];
        return $ids[$category] ?? '1505740420928-5e560c06d30e';
    }
}
