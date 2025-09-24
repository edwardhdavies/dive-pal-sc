"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ChevronRight, Waves, SkipForward } from "lucide-react"

interface FormData {
  temp_min?: number
  temp_max?: number
  marine_life: string[]
  coral_type: string[]
  visibility_min?: number
  site_type: string[]
  access_type?: string
  entry_difficulty?: string
}

interface ChatFlowProps {
  onComplete: (data: FormData) => void
}

const questions = [
  {
    id: "temp_min",
    title: "What is the minimum temperature?",
    placeholder: "e.g. 24",
    helper: "Water temperature in Celsius (optional)",
    type: "number",
  },
  {
    id: "temp_max",
    title: "What is the maximum temperature?",
    placeholder: "e.g. 30",
    helper: "Maximum water temperature in Celsius (optional)",
    type: "number",
  },
  {
    id: "marine_life",
    title: "What marine life would you like to see?",
    placeholder: "e.g. turtles, sharks",
    helper: "Comma-separated list of marine animals (optional)",
    type: "text",
  },
  {
    id: "coral_type",
    title: "What types of coral do you prefer?",
    placeholder: "e.g. branching, table",
    helper: "Comma-separated coral types (optional)",
    type: "text",
  },
  {
    id: "visibility_min",
    title: "What is your minimum visibility requirement?",
    placeholder: "e.g. 20",
    helper: "Minimum visibility in meters (optional)",
    type: "number",
  },
  {
    id: "site_type",
    title: "What type of site would you like to explore?",
    placeholder: "e.g. reef, wreck",
    helper: "Comma-separated site types (optional)",
    type: "text",
  },
  {
    id: "access_difficulty",
    title: "Access type and entry difficulty",
    helper: "Choose your preferred access method and skill level",
    type: "select",
  },
]

export default function ChatFlow({ onComplete }: ChatFlowProps) {
  const [currentStep, setCurrentStep] = useState(0)
  const [formData, setFormData] = useState<FormData>({
    marine_life: [],
    coral_type: [],
    site_type: [],
  })
  const [currentInput, setCurrentInput] = useState("")
  const [accessType, setAccessType] = useState("")
  const [difficulty, setDifficulty] = useState("")

  const currentQuestion = questions[currentStep]

  const handleNext = () => {
    const questionId = currentQuestion.id

    if (questionId === "access_difficulty") {
      setFormData((prev) => ({
        ...prev,
        access_type: accessType || undefined,
        entry_difficulty: difficulty || undefined,
      }))
    } else if (currentInput.trim() && currentInput.toLowerCase() !== "skip") {
      if (questionId === "temp_min" || questionId === "temp_max" || questionId === "visibility_min") {
        const numValue = Number.parseFloat(currentInput)
        if (!isNaN(numValue)) {
          setFormData((prev) => ({ ...prev, [questionId]: numValue }))
        }
      } else if (questionId === "marine_life" || questionId === "coral_type" || questionId === "site_type") {
        const arrayValue = currentInput
          .split(",")
          .map((item) => item.trim())
          .filter(Boolean)
        setFormData((prev) => ({ ...prev, [questionId]: arrayValue }))
      }
    }

    if (currentStep < questions.length - 1) {
      setCurrentStep(currentStep + 1)
      setCurrentInput("")
      setAccessType("")
      setDifficulty("")
    } else {
      onComplete(formData)
    }
  }

  const handleSkip = () => {
    handleNext()
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleNext()
    }
  }

  return (
    <div className="w-full max-w-md mx-auto">
      <Card className="float-animation shadow-lg border-0 bg-card/95 backdrop-blur-sm">
        <CardHeader className="text-center pb-4">
          <div className="flex items-center justify-center gap-2 mb-2">
            <div className="w-12 h-12 bg-primary rounded-full flex items-center justify-center">
              <Waves className="w-6 h-6 text-primary-foreground" />
            </div>
            <CardTitle className="text-2xl font-bold text-primary">Dive Pal</CardTitle>
          </div>
          <div className="flex justify-center gap-1 mb-4">
            {questions.map((_, index) => (
              <div
                key={index}
                className={`w-2 h-2 rounded-full transition-colors ${index <= currentStep ? "bg-primary" : "bg-muted"}`}
              />
            ))}
          </div>
        </CardHeader>

        <CardContent className="space-y-4">
          <div className="space-y-3">
            <h3 className="text-lg font-semibold text-balance">{currentQuestion.title}</h3>
            <p className="text-sm text-muted-foreground">{currentQuestion.helper}</p>

            {currentQuestion.type === "select" ? (
              <div className="space-y-3">
                <div>
                  <label className="text-sm font-medium mb-2 block">Access Type</label>
                  <Select value={accessType} onValueChange={setAccessType}>
                    <SelectTrigger className="bg-input border-border">
                      <SelectValue placeholder="Choose access type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="boat">Boat</SelectItem>
                      <SelectItem value="shore">Shore</SelectItem>
                      <SelectItem value="any">Any</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <label className="text-sm font-medium mb-2 block">Entry Difficulty</label>
                  <Select value={difficulty} onValueChange={setDifficulty}>
                    <SelectTrigger className="bg-input border-border">
                      <SelectValue placeholder="Choose difficulty level" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="beginner">Beginner</SelectItem>
                      <SelectItem value="intermediate">Intermediate</SelectItem>
                      <SelectItem value="advanced">Advanced</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            ) : (
              <Input
                type={currentQuestion.type}
                placeholder={currentQuestion.placeholder}
                value={currentInput}
                onChange={(e) => setCurrentInput(e.target.value)}
                onKeyPress={handleKeyPress}
                className="bg-input border-border text-lg p-4 rounded-xl"
                autoFocus
              />
            )}
          </div>

          <div className="flex gap-2 pt-4">
            <Button variant="outline" onClick={handleSkip} className="flex-1 ripple-effect bg-transparent">
              <SkipForward className="w-4 h-4 mr-2" />
              Skip
            </Button>
            <Button onClick={handleNext} className="flex-1 bg-primary hover:bg-primary/90 ripple-effect">
              {currentStep === questions.length - 1 ? "Search" : "Next"}
              <ChevronRight className="w-4 h-4 ml-2" />
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
