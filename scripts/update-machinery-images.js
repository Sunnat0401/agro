const fs = require('fs');
const path = require('path');

const data = JSON.parse(fs.readFileSync('data/farmers.json', 'utf8'));

// Unsplash va boshqa source'lardan real rasmlar
const imageUrls = {
  tractor: [
    'https://images.unsplash.com/photo-1565043666747-69f6e6e8f871?w=800',
    'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=800',
    'https://images.unsplash.com/photo-1593111774240-d529f12cf5f9?w=800',
    'https://images.unsplash.com/photo-1530836369250-ef72a3f5cda8?w=800',
    'https://images.unsplash.com/photo-1581092160562-40aa08e78837?w=800',
    'https://images.unsplash.com/photo-1558618047-3c8c76ca7d13?w=800',
  ],
  combine: [
    'https://images.unsplash.com/photo-1516253593875-bd7ba052fbc5?w=800',
    'https://images.unsplash.com/photo-1560493676-04071c5f467b?w=800',
    'https://images.unsplash.com/photo-1574943320219-553eb213f72d?w=800',
    'https://images.unsplash.com/photo-1574944985070-8f3ebc6b79d2?w=800',
    'https://images.unsplash.com/photo-1625246333195-78d9c38ad449?w=800',
    'https://images.unsplash.com/photo-1500937386664-56d1dfef3854?w=800',
  ],
  seeder: [
    'https://images.unsplash.com/photo-1530836369250-ef72a3f5cda8?w=800',
    'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=800',
    'https://images.unsplash.com/photo-1593111774240-d529f12cf5f9?w=800',
    'https://images.unsplash.com/photo-1565043666747-69f6e6e8f871?w=800',
    'https://images.unsplash.com/photo-1581092160562-40aa08e78837?w=800',
    'https://images.unsplash.com/photo-1558618047-3c8c76ca7d13?w=800',
  ],
  irrigation: [
    'https://images.unsplash.com/photo-1560493676-04071c5f467b?w=800',
    'https://images.unsplash.com/photo-1574943320219-553eb213f72d?w=800',
    'https://images.unsplash.com/photo-1530836369250-ef72a3f5cda8?w=800',
    'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=800',
    'https://images.unsplash.com/photo-1593111774240-d529f12cf5f9?w=800',
    'https://images.unsplash.com/photo-1574944985070-8f3ebc6b79d2?w=800',
  ],
  cultivator: [
    'https://images.unsplash.com/photo-1581092160562-40aa08e78837?w=800',
    'https://images.unsplash.com/photo-1558618047-3c8c76ca7d13?w=800',
    'https://images.unsplash.com/photo-1530836369250-ef72a3f5cda8?w=800',
    'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=800',
    'https://images.unsplash.com/photo-1565043666747-69f6e6e8f871?w=800',
    'https://images.unsplash.com/photo-1593111774240-d529f12cf5f9?w=800',
  ],
  trailer: [
    'https://images.unsplash.com/photo-1574943320219-553eb213f72d?w=800',
    'https://images.unsplash.com/photo-1560493676-04071c5f467b?w=800',
    'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=800',
    'https://images.unsplash.com/photo-1530836369250-ef72a3f5cda8?w=800',
    'https://images.unsplash.com/photo-1593111774240-d529f12cf5f9?w=800',
    'https://images.unsplash.com/photo-1581092160562-40aa08e78837?w=800',
  ],
  truck: [
    'https://images.unsplash.com/photo-1558618047-3c8c76ca7d13?w=800',
    'https://images.unsplash.com/photo-1565043666747-69f6e6e8f871?w=800',
    'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=800',
    'https://images.unsplash.com/photo-1530836369250-ef72a3f5cda8?w=800',
    'https://images.unsplash.com/photo-1593111774240-d529f12cf5f9?w=800',
    'https://images.unsplash.com/photo-1625246333195-78d9c38ad449?w=800',
  ],
  power: [
    'https://images.unsplash.com/photo-1574944985070-8f3ebc6b79d2?w=800',
    'https://images.unsplash.com/photo-1516253593875-bd7ba052fbc5?w=800',
    'https://images.unsplash.com/photo-1560493676-04071c5f467b?w=800',
    'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=800',
    'https://images.unsplash.com/photo-1530836369250-ef72a3f5cda8?w=800',
    'https://images.unsplash.com/photo-1593111774240-d529f12cf5f9?w=800',
  ],
};

function getImageType(name) {
  const nameLower = name.toLowerCase();
  if (nameLower.includes('traktor') || nameLower.includes('трактор') || nameLower.includes('tractor')) {
    return 'tractor';
  }
  if (nameLower.includes('kombayn') || nameLower.includes('комбайн') || nameLower.includes('combine')) {
    return 'combine';
  }
  if (nameLower.includes('ekish') || nameLower.includes('сеялка') || nameLower.includes('seeder')) {
    return 'seeder';
  }
  if (nameLower.includes('sug\'orish') || nameLower.includes('оросительная') || nameLower.includes('irrigation')) {
    return 'irrigation';
  }
  if (nameLower.includes('ishlovchi') || nameLower.includes('культиватор') || nameLower.includes('cultivator')) {
    return 'cultivator';
  }
  if (nameLower.includes('prigon') || nameLower.includes('прицеп') || nameLower.includes('trailer')) {
    return 'trailer';
  }
  if (nameLower.includes('yuk') || nameLower.includes('грузовик') || nameLower.includes('truck')) {
    return 'truck';
  }
  return 'tractor'; // default
}

// Update all machinery with real images
data.machinery = data.machinery.map((machinery) => {
  const imageType = getImageType(machinery.name.uz || machinery.name.en);
  const images = imageUrls[imageType] || imageUrls.tractor;
  
  // Select 3 random images for each machinery
  const selectedImages = [];
  for (let i = 0; i < 3; i++) {
    const randomIndex = Math.floor(Math.random() * images.length);
    selectedImages.push(images[randomIndex]);
  }
  
  return {
    ...machinery,
    images: selectedImages,
  };
});

fs.writeFileSync('data/farmers.json', JSON.stringify(data, null, 2), 'utf8');
console.log(`Updated ${data.machinery.length} machinery items with real images`);



