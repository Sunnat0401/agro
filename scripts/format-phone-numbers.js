const fs = require('fs');

const data = JSON.parse(fs.readFileSync('data/farmers.json', 'utf8'));

// Format phone numbers to proper format
function formatPhoneForStorage(phone) {
  // Remove all non-digits
  let digits = phone.replace(/\D/g, '');
  
  // If doesn't start with 998, add it
  if (!digits.startsWith('998')) {
    if (digits.length === 0) {
      return '+998901234567'; // default
    }
    digits = '998' + digits.replace(/^998/, '');
  }
  
  // Ensure 12 digits (998 + 9 digits)
  digits = digits.slice(0, 12);
  
  // Format as +998 XX XXX XX XX
  if (digits.length === 12) {
    return `+998 ${digits.slice(3, 5)} ${digits.slice(5, 8)} ${digits.slice(8, 10)} ${digits.slice(10, 12)}`;
  }
  
  return phone; // return original if can't format
}

// Update all machinery phone numbers
data.machinery = data.machinery.map((machinery) => {
  return {
    ...machinery,
    phone: formatPhoneForStorage(machinery.phone),
  };
});

fs.writeFileSync('data/farmers.json', JSON.stringify(data, null, 2), 'utf8');
console.log(`Formatted phone numbers for ${data.machinery.length} machinery items`);




