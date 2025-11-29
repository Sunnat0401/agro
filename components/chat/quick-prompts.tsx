"use client"

import { motion } from "framer-motion"
import { useLanguage } from "@/contexts/language-context"
import { Leaf, PawPrint, HelpCircle, Sparkles } from "lucide-react"

interface QuickPromptsProps {
  onSelect: (prompt: string) => void
}

export function QuickPrompts({ onSelect }: QuickPromptsProps) {
  const { language } = useLanguage()

  const prompts = {
    uz: [
      { icon: Leaf, text: "Pomidor barglarida sariq dog'lar paydo bo'ldi", label: "O'simlik" },
      { icon: PawPrint, text: "Sigir suti kam bo'lib qoldi va yelini qattiq", label: "Hayvon" },
      { icon: HelpCircle, text: "Bodring nima uchun so'lib qoladi?", label: "Savol" },
      { icon: Sparkles, text: "Qanday o'g'it ishlatish kerak?", label: "Maslahat" },
    ],
    ru: [
      { icon: Leaf, text: "На листьях помидоров появились желтые пятна", label: "Растение" },
      { icon: PawPrint, text: "У коровы уменьшился удой и затвердело вымя", label: "Животное" },
      { icon: HelpCircle, text: "Почему вянут огурцы?", label: "Вопрос" },
      { icon: Sparkles, text: "Какое удобрение использовать?", label: "Совет" },
    ],
    en: [
      { icon: Leaf, text: "Yellow spots appeared on tomato leaves", label: "Plant" },
      { icon: PawPrint, text: "Cow's milk production decreased and udder is hard", label: "Animal" },
      { icon: HelpCircle, text: "Why are my cucumbers wilting?", label: "Question" },
      { icon: Sparkles, text: "What fertilizer should I use?", label: "Advice" },
    ],
  }

  return (
    <div className="grid grid-cols-2 gap-2">
      {prompts[language].map((prompt, index) => (
        <motion.button
          key={index}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 + index * 0.1 }}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => onSelect(prompt.text)}
          className="flex flex-col items-start gap-2 rounded-xl border border-border bg-card p-4 text-left transition-colors hover:border-green-600/50 hover:bg-accent"
        >
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-green-600/10 text-green-600">
            <prompt.icon className="h-4 w-4" />
          </div>
          <span className="text-xs font-medium text-green-600">{prompt.label}</span>
          <span className="line-clamp-2 text-sm text-foreground">{prompt.text}</span>
        </motion.button>
      ))}
    </div>
  )
}
