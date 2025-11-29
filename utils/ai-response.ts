import type { Language } from "@/contexts/language-context"

interface AIResponse {
  diagnosis: string
  symptoms: string[]
  recommendations: string[]
  severity: "low" | "medium" | "high"
}

const plantResponses: Record<Language, Record<string, AIResponse>> = {
  uz: {
    default: {
      diagnosis: "O'simlik kasalligi aniqlandi",
      symptoms: ["Barglarda sariq dog'lar", "O'simlik sust o'sishi", "Ildiz chirishi belgilari"],
      recommendations: [
        "Zararlangan barglarni olib tashlang",
        "Sug'orishni kamaytiring",
        "Fungitsid qo'llang",
        "Tuproq haroratini nazorat qiling",
      ],
      severity: "medium",
    },
    tomato: {
      diagnosis: "Pomidor fitoftorozi (kech kuydirish)",
      symptoms: ["Barglarda qo'ng'ir dog'lar", "Mevada chirish", "Poyada qoramtir chiziqlar"],
      recommendations: [
        "Zararlangan o'simliklarni darhol olib tashlang",
        "Mis asosidagi fungitsidlar qo'llang",
        "Shamollatishni yaxshilang",
        "Sug'orishda barglarni ho'llamang",
      ],
      severity: "high",
    },
  },
  ru: {
    default: {
      diagnosis: "Обнаружено заболевание растения",
      symptoms: ["Желтые пятна на листьях", "Замедленный рост растения", "Признаки корневой гнили"],
      recommendations: [
        "Удалите пораженные листья",
        "Сократите полив",
        "Примените фунгицид",
        "Контролируйте температуру почвы",
      ],
      severity: "medium",
    },
    tomato: {
      diagnosis: "Фитофтороз томатов (поздняя гниль)",
      symptoms: ["Коричневые пятна на листьях", "Гниение плодов", "Темные полосы на стеблях"],
      recommendations: [
        "Немедленно удалите пораженные растения",
        "Примените медьсодержащие фунгициды",
        "Улучшите вентиляцию",
        "Не мочите листья при поливе",
      ],
      severity: "high",
    },
  },
  en: {
    default: {
      diagnosis: "Plant disease detected",
      symptoms: ["Yellow spots on leaves", "Stunted plant growth", "Signs of root rot"],
      recommendations: ["Remove affected leaves", "Reduce watering", "Apply fungicide", "Monitor soil temperature"],
      severity: "medium",
    },
    tomato: {
      diagnosis: "Tomato Late Blight (Phytophthora)",
      symptoms: ["Brown spots on leaves", "Fruit rot", "Dark streaks on stems"],
      recommendations: [
        "Remove affected plants immediately",
        "Apply copper-based fungicides",
        "Improve ventilation",
        "Avoid wetting leaves when watering",
      ],
      severity: "high",
    },
  },
}

const animalResponses: Record<Language, Record<string, AIResponse>> = {
  uz: {
    default: {
      diagnosis: "Hayvon kasalligi aniqlandi",
      symptoms: ["Ishtaha pasayishi", "Harorat ko'tarilishi", "Sust harakat"],
      recommendations: [
        "Veterinarni chaqiring",
        "Kasallangan hayvonni ajrating",
        "Toza suv va ozuqa bering",
        "Yashash joyini tozalang",
      ],
      severity: "medium",
    },
    cow: {
      diagnosis: "Sigir mastiti (yelini yallig'lanishi)",
      symptoms: ["Sut miqdori kamayishi", "Yelinda qattiqlik", "Sutda rang o'zgarishi", "Harorat ko'tarilishi"],
      recommendations: [
        "Antibiotik davolash boshlang",
        "Sogish tartibini ko'paytiring",
        "Yelini iliq kompres bilan davolang",
        "Gigiena qoidalariga rioya qiling",
      ],
      severity: "high",
    },
  },
  ru: {
    default: {
      diagnosis: "Обнаружено заболевание животного",
      symptoms: ["Снижение аппетита", "Повышение температуры", "Вялость движений"],
      recommendations: [
        "Вызовите ветеринара",
        "Изолируйте больное животное",
        "Обеспечьте чистой водой и кормом",
        "Очистите место содержания",
      ],
      severity: "medium",
    },
    cow: {
      diagnosis: "Мастит коров (воспаление вымени)",
      symptoms: ["Снижение удоя молока", "Уплотнения в вымени", "Изменение цвета молока", "Повышение температуры"],
      recommendations: [
        "Начните лечение антибиотиками",
        "Увеличьте частоту дойки",
        "Лечите вымя теплыми компрессами",
        "Соблюдайте правила гигиены",
      ],
      severity: "high",
    },
  },
  en: {
    default: {
      diagnosis: "Animal disease detected",
      symptoms: ["Loss of appetite", "Elevated temperature", "Lethargy"],
      recommendations: [
        "Call a veterinarian",
        "Isolate the sick animal",
        "Provide clean water and feed",
        "Clean the living area",
      ],
      severity: "medium",
    },
    cow: {
      diagnosis: "Bovine Mastitis (udder inflammation)",
      symptoms: ["Decreased milk production", "Hardness in udder", "Change in milk color", "Elevated temperature"],
      recommendations: [
        "Start antibiotic treatment",
        "Increase milking frequency",
        "Treat udder with warm compresses",
        "Follow hygiene protocols",
      ],
      severity: "high",
    },
  },
}

export async function generateAIResponse(userMessage: string, language: Language): Promise<string> {
  // Simulate network delay
  await new Promise((resolve) => setTimeout(resolve, 1000 + Math.random() * 1500))

  const lowerMessage = userMessage.toLowerCase()

  // Detect if plant or animal related
  const isPlant =
    lowerMessage.includes("plant") ||
    lowerMessage.includes("o'simlik") ||
    lowerMessage.includes("растен") ||
    lowerMessage.includes("pomidor") ||
    lowerMessage.includes("томат") ||
    lowerMessage.includes("tomato") ||
    lowerMessage.includes("leaf") ||
    lowerMessage.includes("barg") ||
    lowerMessage.includes("лист")

  const isAnimal =
    lowerMessage.includes("animal") ||
    lowerMessage.includes("hayvon") ||
    lowerMessage.includes("животн") ||
    lowerMessage.includes("cow") ||
    lowerMessage.includes("sigir") ||
    lowerMessage.includes("коров") ||
    lowerMessage.includes("chicken") ||
    lowerMessage.includes("tovuq") ||
    lowerMessage.includes("кур")

  const isTomato = lowerMessage.includes("pomidor") || lowerMessage.includes("томат") || lowerMessage.includes("tomato")

  const isCow = lowerMessage.includes("cow") || lowerMessage.includes("sigir") || lowerMessage.includes("коров")

  let response: AIResponse

  if (isAnimal || (!isPlant && isCow)) {
    response = isCow ? animalResponses[language].cow : animalResponses[language].default
  } else {
    response = isTomato ? plantResponses[language].tomato : plantResponses[language].default
  }

  const severityEmoji = {
    low: "🟢",
    medium: "🟡",
    high: "🔴",
  }

  const formatResponse = (lang: Language): string => {
    const labels = {
      uz: {
        diagnosis: "Tashxis",
        symptoms: "Belgilar",
        recommendations: "Tavsiyalar",
        severity: "Xavf darajasi",
      },
      ru: {
        diagnosis: "Диагноз",
        symptoms: "Симптомы",
        recommendations: "Рекомендации",
        severity: "Степень риска",
      },
      en: {
        diagnosis: "Diagnosis",
        symptoms: "Symptoms",
        recommendations: "Recommendations",
        severity: "Severity",
      },
    }

    const l = labels[lang]

    return `**${l.diagnosis}:** ${response.diagnosis}

**${l.symptoms}:**
${response.symptoms.map((s) => `• ${s}`).join("\n")}

**${l.recommendations}:**
${response.recommendations.map((r, i) => `${i + 1}. ${r}`).join("\n")}

**${l.severity}:** ${severityEmoji[response.severity]} ${
      response.severity === "high"
        ? lang === "uz"
          ? "Yuqori"
          : lang === "ru"
            ? "Высокий"
            : "High"
        : response.severity === "medium"
          ? lang === "uz"
            ? "O'rta"
            : lang === "ru"
              ? "Средний"
              : "Medium"
          : lang === "uz"
            ? "Past"
            : lang === "ru"
              ? "Низкий"
              : "Low"
    }`
  }

  return formatResponse(language)
}
