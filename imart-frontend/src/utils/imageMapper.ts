export function getStoreImage(storeName: string, businessType: string, customImage?: string): string {
  // If there is a custom image and it doesn't contain unsplash, use it
  if (customImage && !customImage.includes('unsplash.com') && !customImage.includes('via.placeholder.com')) {
    return customImage;
  }

  const nameLower = (storeName || '').toLowerCase();
  const typeLower = (businessType || '').toLowerCase();

  if (typeLower.includes('jewelry') || nameLower.includes('jewelry') || nameLower.includes('gold') || nameLower.includes('aura')) {
    return '/images/stores/luxe_jewelry.png';
  }
  if (typeLower.includes('electronic') || nameLower.includes('tech') || nameLower.includes('electronic') || nameLower.includes('signal')) {
    return '/images/stores/urban_tech.png';
  }
  if (typeLower.includes('fashion') || nameLower.includes('fashion') || nameLower.includes('apparel') || nameLower.includes('velvet') || nameLower.includes('touch')) {
    return '/images/stores/velvet_fashion.png';
  }
  if (typeLower.includes('grocery') || nameLower.includes('pantry') || nameLower.includes('grocery') || nameLower.includes('food') || nameLower.includes('local')) {
    return '/images/stores/local_pantry.png';
  }
  if (typeLower.includes('furniture') || nameLower.includes('living') || nameLower.includes('furniture') || nameLower.includes('sofa') || nameLower.includes('luxe') || nameLower.includes('industrial')) {
    return '/images/stores/luxe_industrial.png';
  }
  if (typeLower.includes('sport') || nameLower.includes('sport') || nameLower.includes('fitness') || nameLower.includes('profit') || nameLower.includes('pro')) {
    return '/images/stores/profit_sports.png';
  }
  if (typeLower.includes('accessor') || nameLower.includes('watch') || nameLower.includes('chronos')) {
    return '/images/stores/chronos_watches.png';
  }

  return '/images/stores/luxe_industrial.png'; // default fallback
}

export function getProductImage(productName: string, category?: string, customImage?: string): string {
  // If there is a custom image and it doesn't contain unsplash, use it
  if (customImage && !customImage.includes('unsplash.com') && !customImage.includes('via.placeholder.com')) {
    return customImage;
  }

  const nameLower = (productName || '').toLowerCase();
  const catLower = (category || '').toLowerCase();

  // Jewelry
  if (catLower.includes('jewelry') || nameLower.includes('gold') || nameLower.includes('necklace') || nameLower.includes('earring') || nameLower.includes('ring') || nameLower.includes('pearl') || nameLower.includes('diamond') || nameLower.includes('pendant') || nameLower.includes('bangle') || nameLower.includes('anklet') || nameLower.includes('gemstone') || nameLower.includes('nose pin') || nameLower.includes('stud')) {
    return '/images/products/gold_necklace.png';
  }

  // Electronics specific sub-items
  if (nameLower.includes('lamp') || nameLower.includes('light')) {
    return '/images/products/cyberpunk_lamp.png';
  }
  if (nameLower.includes('keyboard') || nameLower.includes('keychron')) {
    return '/images/products/titanium_keyboard.png';
  }
  if (nameLower.includes('headphones') || nameLower.includes('sound') || nameLower.includes('audio') || nameLower.includes('sony') || nameLower.includes('bose') || nameLower.includes('speaker')) {
    return '/images/products/neural_headphones.png';
  }
  if (nameLower.includes('watch') || nameLower.includes('apple watch') || nameLower.includes('smartwatch')) {
    return '/images/products/quantum_watch.png';
  }
  if (catLower.includes('electronic') || nameLower.includes('phone') || nameLower.includes('macbook') || nameLower.includes('samsung') || nameLower.includes('laptop') || nameLower.includes('ipad') || nameLower.includes('camera') || nameLower.includes('tv') || nameLower.includes('playstation') || nameLower.includes('drone') || nameLower.includes('tech')) {
    return '/images/products/quantum_watch.png'; // default electronic fallback
  }

  // Fashion
  if (catLower.includes('fashion') || nameLower.includes('saree') || nameLower.includes('suit') || nameLower.includes('jacket') || nameLower.includes('dress') || nameLower.includes('jeans') || nameLower.includes('kurta') || nameLower.includes('sneakers') || nameLower.includes('coat') || nameLower.includes('handbag') || nameLower.includes('shoes') || nameLower.includes('t-shirt') || nameLower.includes('gown') || nameLower.includes('velvet')) {
    return '/images/products/silk_saree.png';
  }

  // Grocery
  if (catLower.includes('grocery') || nameLower.includes('rice') || nameLower.includes('oil') || nameLower.includes('tea') || nameLower.includes('honey') || nameLower.includes('almond') || nameLower.includes('saffron') || nameLower.includes('turmeric') || nameLower.includes('flour') || nameLower.includes('ghee') || nameLower.includes('spice') || nameLower.includes('jaggery') || nameLower.includes('coffee') || nameLower.includes('pasta')) {
    return '/images/products/organic_honey.png';
  }

  // Furniture
  if (catLower.includes('furniture') || nameLower.includes('sofa') || nameLower.includes('bed') || nameLower.includes('dining') || nameLower.includes('chair') || nameLower.includes('tv unit') || nameLower.includes('bookshelf') || nameLower.includes('table') || nameLower.includes('wardrobe') || nameLower.includes('patio') || nameLower.includes('bean bag')) {
    return '/images/products/teak_sofa.png';
  }

  // Sports
  if (catLower.includes('sport') || nameLower.includes('treadmill') || nameLower.includes('dumbbell') || nameLower.includes('yoga') || nameLower.includes('bat') || nameLower.includes('racket') || nameLower.includes('band') || nameLower.includes('football') || nameLower.includes('bike') || nameLower.includes('gloves') || nameLower.includes('tracker') || nameLower.includes('protein') || nameLower.includes('basketball') || nameLower.includes('goggles')) {
    return '/images/products/exercise_bike.png';
  }

  return '/images/products/quantum_watch.png'; // overall default product image
}
