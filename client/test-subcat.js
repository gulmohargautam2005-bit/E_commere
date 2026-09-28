const subCatData = [
  {
    _id: '6a3c6cb67863149462dd2d8f',
    subCat: 'Boys Clothing',
    category: { name: 'Kidz' }
  },
  {
    _id: '6a3c6cb67863149462dd2d85',
    subCat: 'Luxury Watches',
    category: { name: 'Watches' }
  }
];

const groupedSubCats = (subCatData || []).reduce((acc, item) => {
  const catName = item.category?.name || "Other";
  if (!acc[catName]) acc[catName] = [];
  acc[catName].push(item);
  return acc;
}, {});

console.log("Grouped:", groupedSubCats);

const fashionKey = Object.keys(groupedSubCats).find((k) => k.toLowerCase() === "fashion");
const kidzKey = Object.keys(groupedSubCats).find((k) =>
  ["kidz", "kids", "kidszz"].includes(k.toLowerCase())
);
const watchesKey = Object.keys(groupedSubCats).find((k) => k.toLowerCase() === "watches");

console.log("Keys:", { fashionKey, kidzKey, watchesKey });
