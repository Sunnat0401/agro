const categories = ["seeds", "fertilizers", "pesticides", "tools", "feed", "medicine", "agro-medicine", "irrigation"]

const seedsProducts = [
  // Vegetables
  {
    name: { uz: "Pomidor urug'i", ru: "Семена помидоров", en: "Tomato Seeds" },
    query: "tomato seeds packet",
    price: 45000,
  },
  { name: { uz: "Bodring urug'i", ru: "Семена огурцов", en: "Cucumber Seeds" }, query: "cucumber seeds", price: 35000 },
  {
    name: { uz: "Sabzi urug'i", ru: "Семена моркови", en: "Carrot Seeds" },
    query: "carrot seeds packet",
    price: 28000,
  },
  {
    name: { uz: "Kartoshka urug'i", ru: "Семенной картофель", en: "Seed Potatoes" },
    query: "seed potatoes",
    price: 55000,
  },
  { name: { uz: "Piyoz urug'i", ru: "Семена лука", en: "Onion Seeds" }, query: "onion seeds", price: 32000 },
  { name: { uz: "Qalampir urug'i", ru: "Семена перца", en: "Pepper Seeds" }, query: "bell pepper seeds", price: 42000 },
  {
    name: { uz: "Baqlajon urug'i", ru: "Семена баклажанов", en: "Eggplant Seeds" },
    query: "eggplant seeds",
    price: 38000,
  },
  { name: { uz: "Karam urug'i", ru: "Семена капусты", en: "Cabbage Seeds" }, query: "cabbage seeds", price: 30000 },
  { name: { uz: "Qovun urug'i", ru: "Семена дыни", en: "Melon Seeds" }, query: "melon seeds", price: 48000 },
  {
    name: { uz: "Tarvuz urug'i", ru: "Семена арбуза", en: "Watermelon Seeds" },
    query: "watermelon seeds",
    price: 46000,
  },
  // More vegetables...
  { name: { uz: "Sholgom urug'i", ru: "Семена редиса", en: "Radish Seeds" }, query: "radish seeds", price: 25000 },
  { name: { uz: "Sholg'om urug'i", ru: "Семена репы", en: "Turnip Seeds" }, query: "turnip seeds", price: 27000 },
  { name: { uz: "Lavlagi urug'i", ru: "Семена свеклы", en: "Beet Seeds" }, query: "beet seeds", price: 29000 },
  { name: { uz: "Ismaloq urug'i", ru: "Семена шпината", en: "Spinach Seeds" }, query: "spinach seeds", price: 31000 },
  { name: { uz: "Salat urug'i", ru: "Семена салата", en: "Lettuce Seeds" }, query: "lettuce seeds", price: 26000 },
]

console.log("Generated", seedsProducts.length, "seed products")
console.log(JSON.stringify(seedsProducts.slice(0, 3), null, 2))
