export function formatPrice(price: number): string {
  return new Intl.NumberFormat("uz-UZ").format(price) + " UZS"
}

export function formatPhoneNumber(value: string): string {
  // Remove all non-digits
  const digits = value.replace(/\D/g, "")

  // If empty, return empty
  if (digits.length === 0) {
    return ""
  }

  // Format as XX XXX XX XX (without +998)
  let formatted = ""

  if (digits.length > 0) {
    formatted += digits.slice(0, 2)
  }
  if (digits.length > 2) {
    formatted += " " + digits.slice(2, 5)
  }
  if (digits.length > 5) {
    formatted += " " + digits.slice(5, 7)
  }
  if (digits.length > 7) {
    formatted += " " + digits.slice(7, 9)
  }

  return formatted
}

export function formatFullPhoneNumber(value: string): string {
  let digits = value.replace(/\D/g, "")

  if (!digits.startsWith("998")) {
    if (digits.length === 0) {
      return "+998 "
    }
    digits = "998" + digits.replace(/^998/, "")
  }

  digits = digits.slice(0, 12)

  let formatted = "+998 "
  const remaining = digits.slice(3)

  if (remaining.length > 0) {
    formatted += remaining.slice(0, 2)
  }
  if (remaining.length > 2) {
    formatted += " " + remaining.slice(2, 5)
  }
  if (remaining.length > 5) {
    formatted += " " + remaining.slice(5, 7)
  }
  if (remaining.length > 7) {
    formatted += " " + remaining.slice(7, 9)
  }

  return formatted
}

export function validateUzbekPhone(phone: string): boolean {
  const digits = phone.replace(/\D/g, "")
  return digits.length === 12 && digits.startsWith("998")
}

export function formatCardNumber(value: string): string {
  const digits = value.replace(/\D/g, "").slice(0, 16)
  const groups = digits.match(/.{1,4}/g) || []
  return groups.join(" ")
}

export function formatExpiryDate(value: string): string {
  const digits = value.replace(/\D/g, "")
  if (digits.length <= 2) {
    return digits
  }
  return `${digits.slice(0, 2)}/${digits.slice(2, 4)}`
}

export function validateCardNumber(cardNumber: string): boolean {
  const digits = cardNumber.replace(/\D/g, "")

  if (digits.length !== 16) {
    return false
  }

  // Luhn algorithm for card validation
  let sum = 0
  let isEven = false

  for (let i = digits.length - 1; i >= 0; i--) {
    let digit = Number.parseInt(digits[i], 10)

    if (isEven) {
      digit *= 2
      if (digit > 9) {
        digit -= 9
      }
    }

    sum += digit
    isEven = !isEven
  }

  return sum % 10 === 0
}

export function isValidUzbekCard(cardNumber: string): boolean {
  const digits = cardNumber.replace(/\D/g, "")

  if (digits.length !== 16) {
    return false
  }

  // Humo cards start with 9860
  // UzCard cards start with 8600
  // Also accept standard Visa (4), Mastercard (5), etc.
  const validPrefixes = ["9860", "8600", "4", "5"]

  return validPrefixes.some((prefix) => digits.startsWith(prefix))
}
