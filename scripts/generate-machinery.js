const fs = require('fs');
const path = require('path');

const data = JSON.parse(fs.readFileSync('data/farmers.json', 'utf8'));

const crops = ['cotton', 'wheat', 'corn', 'rice', 'potato', 'tomato', 'cucumber', 'watermelon'];
const regions = ['tashkent', 'andijan', 'bukhara', 'fergana', 'jizzakh', 'kashkadarya', 'khorezm', 'namangan', 'navoi', 'samarkand', 'sirdaryo', 'surkhandarya', 'tashkent-region', 'karakalpakstan'];

const districts = {
  uz: ['Yunusobod', 'Mirzo Ulug\'bek', 'Olmazor', 'Chilonzor', 'Shayxontohur', 'Yakkasaroy', 'Sergeli', 'Bektemir'],
  ru: ['Юнусабадский', 'Мирзо-Улугбекский', 'Алмазарский', 'Чиланзарский', 'Шайхантахурский', 'Яккасарайский', 'Сергелийский', 'Бектемирский'],
  en: ['Yunusobod', 'Mirzo Ulug\'bek', 'Olmazor', 'Chilonzor', 'Shayxontohur', 'Yakkasaroy', 'Sergeli', 'Bektemir']
};

const machineryTypes = [
  ['Traktor', 'Трактор', 'Tractor'],
  ['Kombayn', 'Комбайн', 'Combine'],
  ['Ekin ekish mashinasi', 'Сеялка', 'Seeder'],
  ['Sug\'orish uskuni', 'Оросительная установка', 'Irrigation System'],
  ['Yer ishlovchi', 'Культиватор', 'Cultivator'],
  ['Prigon', 'Прицеп', 'Trailer'],
  ['Yuk mashinasi', 'Грузовик', 'Truck'],
  ['Kuch agregati', 'Силовой агрегат', 'Power Unit']
];

const names = {
  uz: ['MTZ', 'John Deere', 'Case IH', 'New Holland', 'Belarus', 'Massey Ferguson', 'Fendt', 'Deutz-Fahr'],
  ru: ['МТЗ', 'John Deere', 'Case IH', 'New Holland', 'Беларусь', 'Massey Ferguson', 'Fendt', 'Deutz-Fahr'],
  en: ['MTZ', 'John Deere', 'Case IH', 'New Holland', 'Belarus', 'Massey Ferguson', 'Fendt', 'Deutz-Fahr']
};

const models = ['80', '82', '90', '100', '1221', 'S685', '7120', '8030', '9330', 'S760', '8500', 'T8', 'T7', 'TTX200', '3230', '6170', '9360', '7480'];

let machinery = data.machinery || [];

const targetCount = 120; // 100+ texnika
for (let i = machinery.length + 1; i <= targetCount; i++) {
  const typeIdx = Math.floor(Math.random() * machineryTypes.length);
  const type = machineryTypes[typeIdx];
  const nameIdx = Math.floor(Math.random() * names.uz.length);
  const model = models[Math.floor(Math.random() * models.length)];
  const regionId = regions[Math.floor(Math.random() * regions.length)];
  const districtIdx = Math.floor(Math.random() * districts.uz.length);
  
  const cropCount = Math.floor(Math.random() * 3) + 1;
  const selectedCrops = [];
  for (let j = 0; j < cropCount; j++) {
    let crop = crops[Math.floor(Math.random() * crops.length)];
    if (!selectedCrops.includes(crop)) {
      selectedCrops.push(crop);
    } else {
      j--;
    }
  }
  
  const price = Math.floor(Math.random() * 2000000) + 200000;
  const experience = Math.floor(Math.random() * 20) + 1;
  const projectYears = Math.floor(Math.random() * 7) + 1;
  
  machinery.push({
    id: String(i),
    name: {
      uz: `${type[0]} ${names.uz[nameIdx]} ${model}`,
      ru: `${type[1]} ${names.ru[nameIdx]} ${model}`,
      en: `${type[2]} ${names.en[nameIdx]} ${model}`
    },
    cropIds: selectedCrops,
    regionId,
    district: {
      uz: districts.uz[districtIdx],
      ru: districts.ru[districtIdx],
      en: districts.en[districtIdx]
    },
    price,
    pricePer: { uz: 'kun', ru: 'день', en: 'day' },
    experience,
    projectYears,
    telegram: `@machinery_${i}`,
    phone: `+99890${Math.floor(1000000 + Math.random() * 9000000)}`,
    images: ['/placeholder.jpg', '/placeholder.jpg', '/placeholder.jpg'],
    description: {
      uz: `${type[0]} ${names.uz[nameIdx]} ${model} - zamonaviy va samarali qishloq xo'jalik texnikasi. Yuqori sifat va ishonchlilik.`,
      ru: `${type[1]} ${names.ru[nameIdx]} ${model} - современная и эффективная сельскохозяйственная техника. Высокое качество и надежность.`,
      en: `${type[2]} ${names.en[nameIdx]} ${model} - modern and efficient agricultural machinery. High quality and reliability.`
    },
    specifications: {
      uz: `Quvvat: ${Math.floor(Math.random() * 200) + 50} ot kuchi, Vazn: ${Math.floor(Math.random() * 5000) + 2000} kg`,
      ru: `Мощность: ${Math.floor(Math.random() * 200) + 50} л.с., Вес: ${Math.floor(Math.random() * 5000) + 2000} кг`,
      en: `Power: ${Math.floor(Math.random() * 200) + 50} HP, Weight: ${Math.floor(Math.random() * 5000) + 2000} kg`
    }
  });
}

data.machinery = machinery;

fs.writeFileSync('data/farmers.json', JSON.stringify(data, null, 2), 'utf8');
console.log(`Generated ${machinery.length} machinery items`);

