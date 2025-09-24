"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Calculator, Gauge, Clock, Waves, Weight } from "lucide-react"

export default function Tools() {
  // Air Consumption Calculator State
  const [airCalc, setAirCalc] = useState({
    tankSize: "",
    startPressure: "",
    endPressure: "",
    depth: "",
    time: "",
    result: null as number | null,
  })

  // SAC Calculator State
  const [sacCalc, setSacCalc] = useState({
    airUsed: "",
    depth: "",
    time: "",
    result: null as number | null,
  })

  // MOD Calculator State
  const [modCalc, setModCalc] = useState({
    oxygenPercentage: "",
    maxPPO2: "1.4",
    result: null as number | null,
  })

  // Weighting Calculator State
  const [weightCalc, setWeightCalc] = useState({
    bodyWeight: "",
    suitType: "",
    experience: "",
    saltwater: "true",
    result: null as number | null,
  })

  // NDL Reference Data
  const ndlTable = [
    { depth: 10, ndl: "No Limit" },
    { depth: 12, ndl: "No Limit" },
    { depth: 15, ndl: "No Limit" },
    { depth: 18, ndl: "56 min" },
    { depth: 20, ndl: "45 min" },
    { depth: 22, ndl: "37 min" },
    { depth: 25, ndl: "29 min" },
    { depth: 30, ndl: "20 min" },
    { depth: 35, ndl: "14 min" },
    { depth: 40, ndl: "9 min" },
  ]

  const calculateAirDuration = () => {
    const tankSize = Number.parseFloat(airCalc.tankSize)
    const startPressure = Number.parseFloat(airCalc.startPressure)
    const endPressure = Number.parseFloat(airCalc.endPressure)
    const depth = Number.parseFloat(airCalc.depth)

    if (tankSize && startPressure && endPressure && depth) {
      const usableAir = (startPressure - endPressure) * tankSize
      const pressureAtDepth = depth / 10 + 1
      const airConsumptionRate = 20 // L/min at surface (average)
      const duration = usableAir / (airConsumptionRate * pressureAtDepth)
      setAirCalc((prev) => ({ ...prev, result: Math.round(duration) }))
    }
  }

  const calculateSAC = () => {
    const airUsed = Number.parseFloat(sacCalc.airUsed)
    const depth = Number.parseFloat(sacCalc.depth)
    const time = Number.parseFloat(sacCalc.time)

    if (airUsed && depth && time) {
      const pressureAtDepth = depth / 10 + 1
      const sac = airUsed / time / pressureAtDepth
      setSacCalc((prev) => ({ ...prev, result: Math.round(sac * 10) / 10 }))
    }
  }

  const calculateMOD = () => {
    const oxygenPercentage = Number.parseFloat(modCalc.oxygenPercentage)
    const maxPPO2 = Number.parseFloat(modCalc.maxPPO2)

    if (oxygenPercentage && maxPPO2) {
      const mod = (maxPPO2 / (oxygenPercentage / 100) - 1) * 10
      setModCalc((prev) => ({ ...prev, result: Math.round(mod) }))
    }
  }

  const calculateWeighting = () => {
    const bodyWeight = Number.parseFloat(weightCalc.bodyWeight)
    const saltwater = weightCalc.saltwater === "true"
    const suitType = weightCalc.suitType
    const experience = weightCalc.experience

    if (bodyWeight && suitType && experience) {
      let baseWeight = bodyWeight * 0.1 // 10% of body weight as starting point

      // Adjust for suit type
      if (suitType === "wetsuit-3mm") baseWeight += 2
      if (suitType === "wetsuit-5mm") baseWeight += 4
      if (suitType === "wetsuit-7mm") baseWeight += 6
      if (suitType === "drysuit") baseWeight += 8

      // Adjust for experience
      if (experience === "beginner") baseWeight += 2
      if (experience === "advanced") baseWeight -= 2

      // Adjust for water type
      if (saltwater) baseWeight += 2

      setWeightCalc((prev) => ({ ...prev, result: Math.round(baseWeight) }))
    }
  }

  return (
    <div className="min-h-screen ocean-bg p-4 pt-20 md:pt-24 pb-20 md:pb-8">
      <div className="container mx-auto py-8 max-w-4xl">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-ocean-900 mb-2">Dive Planning Tools</h1>
          <p className="text-ocean-600">Essential calculators and references for safe diving</p>
        </div>

        <Tabs defaultValue="air-calc" className="space-y-6">
          <TabsList className="grid w-full grid-cols-5 bg-white/80 backdrop-blur-sm">
            <TabsTrigger value="air-calc" className="text-xs">
              Air Calc
            </TabsTrigger>
            <TabsTrigger value="sac-calc" className="text-xs">
              SAC Rate
            </TabsTrigger>
            <TabsTrigger value="ndl-ref" className="text-xs">
              NDL Ref
            </TabsTrigger>
            <TabsTrigger value="mod-calc" className="text-xs">
              MOD Calc
            </TabsTrigger>
            <TabsTrigger value="weight-calc" className="text-xs">
              Weighting
            </TabsTrigger>
          </TabsList>

          {/* Air Consumption Calculator */}
          <TabsContent value="air-calc">
            <Card className="bg-white/95 backdrop-blur-sm border-ocean-200">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-ocean-900">
                  <Calculator className="w-5 h-5" />
                  Air Consumption / Gas Duration Calculator
                </CardTitle>
                <p className="text-sm text-ocean-600">Calculate how long your tank will last at a specific depth</p>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="tank-size">Tank Size (L)</Label>
                    <Input
                      id="tank-size"
                      type="number"
                      placeholder="e.g. 12"
                      value={airCalc.tankSize}
                      onChange={(e) => setAirCalc((prev) => ({ ...prev, tankSize: e.target.value }))}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="start-pressure">Start Pressure (bar)</Label>
                    <Input
                      id="start-pressure"
                      type="number"
                      placeholder="e.g. 200"
                      value={airCalc.startPressure}
                      onChange={(e) => setAirCalc((prev) => ({ ...prev, startPressure: e.target.value }))}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="end-pressure">Reserve Pressure (bar)</Label>
                    <Input
                      id="end-pressure"
                      type="number"
                      placeholder="e.g. 50"
                      value={airCalc.endPressure}
                      onChange={(e) => setAirCalc((prev) => ({ ...prev, endPressure: e.target.value }))}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="depth">Depth (m)</Label>
                    <Input
                      id="depth"
                      type="number"
                      placeholder="e.g. 20"
                      value={airCalc.depth}
                      onChange={(e) => setAirCalc((prev) => ({ ...prev, depth: e.target.value }))}
                    />
                  </div>
                </div>
                <Button onClick={calculateAirDuration} className="w-full bg-ocean-500 hover:bg-ocean-600">
                  Calculate Duration
                </Button>
                {airCalc.result && (
                  <div className="p-4 bg-ocean-50 rounded-lg text-center">
                    <p className="text-lg font-semibold text-ocean-900">
                      Estimated Duration: <span className="text-ocean-600">{airCalc.result} minutes</span>
                    </p>
                    <p className="text-sm text-ocean-600 mt-1">
                      Based on average consumption rate of 20 L/min at surface
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* SAC Calculator */}
          <TabsContent value="sac-calc">
            <Card className="bg-white/95 backdrop-blur-sm border-ocean-200">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-ocean-900">
                  <Gauge className="w-5 h-5" />
                  Surface Air Consumption (SAC) Calculator
                </CardTitle>
                <p className="text-sm text-ocean-600">Track your personal air consumption rate</p>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="air-used">Air Used (L)</Label>
                    <Input
                      id="air-used"
                      type="number"
                      placeholder="e.g. 1800"
                      value={sacCalc.airUsed}
                      onChange={(e) => setSacCalc((prev) => ({ ...prev, airUsed: e.target.value }))}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="sac-depth">Average Depth (m)</Label>
                    <Input
                      id="sac-depth"
                      type="number"
                      placeholder="e.g. 15"
                      value={sacCalc.depth}
                      onChange={(e) => setSacCalc((prev) => ({ ...prev, depth: e.target.value }))}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="dive-time">Dive Time (min)</Label>
                    <Input
                      id="dive-time"
                      type="number"
                      placeholder="e.g. 45"
                      value={sacCalc.time}
                      onChange={(e) => setSacCalc((prev) => ({ ...prev, time: e.target.value }))}
                    />
                  </div>
                </div>
                <Button onClick={calculateSAC} className="w-full bg-ocean-500 hover:bg-ocean-600">
                  Calculate SAC Rate
                </Button>
                {sacCalc.result && (
                  <div className="p-4 bg-ocean-50 rounded-lg text-center">
                    <p className="text-lg font-semibold text-ocean-900">
                      Your SAC Rate: <span className="text-ocean-600">{sacCalc.result} L/min</span>
                    </p>
                    <p className="text-sm text-ocean-600 mt-1">
                      {sacCalc.result < 15
                        ? "Excellent"
                        : sacCalc.result < 20
                          ? "Good"
                          : sacCalc.result < 25
                            ? "Average"
                            : "Needs improvement"}
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* NDL Reference */}
          <TabsContent value="ndl-ref">
            <Card className="bg-white/95 backdrop-blur-sm border-ocean-200">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-ocean-900">
                  <Clock className="w-5 h-5" />
                  No-Decompression Limit (NDL) Reference
                </CardTitle>
                <p className="text-sm text-ocean-600">Quick reference for safe bottom times (PADI RDP)</p>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {ndlTable.map((entry, index) => (
                    <div key={index} className="flex justify-between items-center p-3 bg-ocean-50 rounded-lg">
                      <span className="font-medium text-ocean-900">{entry.depth}m</span>
                      <span className="text-ocean-600">{entry.ndl}</span>
                    </div>
                  ))}
                </div>
                <div className="mt-4 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                  <p className="text-sm text-yellow-800">
                    <strong>Warning:</strong> These are reference values only. Always use your dive computer or tables
                    for actual dive planning.
                  </p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* MOD Calculator */}
          <TabsContent value="mod-calc">
            <Card className="bg-white/95 backdrop-blur-sm border-ocean-200">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-ocean-900">
                  <Waves className="w-5 h-5" />
                  Maximum Operating Depth (MOD) for Nitrox
                </CardTitle>
                <p className="text-sm text-ocean-600">Calculate safe depth limits for enriched air</p>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="oxygen-percentage">Oxygen Percentage (%)</Label>
                    <Input
                      id="oxygen-percentage"
                      type="number"
                      placeholder="e.g. 32"
                      value={modCalc.oxygenPercentage}
                      onChange={(e) => setModCalc((prev) => ({ ...prev, oxygenPercentage: e.target.value }))}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="max-ppo2">Max PPO2</Label>
                    <Select
                      value={modCalc.maxPPO2}
                      onValueChange={(value) => setModCalc((prev) => ({ ...prev, maxPPO2: value }))}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="1.4">1.4 (Conservative)</SelectItem>
                        <SelectItem value="1.6">1.6 (Standard)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <Button onClick={calculateMOD} className="w-full bg-ocean-500 hover:bg-ocean-600">
                  Calculate MOD
                </Button>
                {modCalc.result && (
                  <div className="p-4 bg-ocean-50 rounded-lg text-center">
                    <p className="text-lg font-semibold text-ocean-900">
                      Maximum Operating Depth: <span className="text-ocean-600">{modCalc.result}m</span>
                    </p>
                    <p className="text-sm text-ocean-600 mt-1">
                      Do not exceed this depth with {modCalc.oxygenPercentage}% oxygen
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Weighting Calculator */}
          <TabsContent value="weight-calc">
            <Card className="bg-white/95 backdrop-blur-sm border-ocean-200">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-ocean-900">
                  <Weight className="w-5 h-5" />
                  Weighting Calculator
                </CardTitle>
                <p className="text-sm text-ocean-600">Estimate starting weights for proper buoyancy</p>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="body-weight">Body Weight (kg)</Label>
                    <Input
                      id="body-weight"
                      type="number"
                      placeholder="e.g. 70"
                      value={weightCalc.bodyWeight}
                      onChange={(e) => setWeightCalc((prev) => ({ ...prev, bodyWeight: e.target.value }))}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="suit-type">Suit Type</Label>
                    <Select
                      value={weightCalc.suitType}
                      onValueChange={(value) => setWeightCalc((prev) => ({ ...prev, suitType: value }))}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select suit type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="swimsuit">Swimsuit/Rashguard</SelectItem>
                        <SelectItem value="wetsuit-3mm">3mm Wetsuit</SelectItem>
                        <SelectItem value="wetsuit-5mm">5mm Wetsuit</SelectItem>
                        <SelectItem value="wetsuit-7mm">7mm Wetsuit</SelectItem>
                        <SelectItem value="drysuit">Drysuit</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="experience">Experience Level</Label>
                    <Select
                      value={weightCalc.experience}
                      onValueChange={(value) => setWeightCalc((prev) => ({ ...prev, experience: value }))}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select experience" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="beginner">Beginner</SelectItem>
                        <SelectItem value="intermediate">Intermediate</SelectItem>
                        <SelectItem value="advanced">Advanced</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="water-type">Water Type</Label>
                    <Select
                      value={weightCalc.saltwater}
                      onValueChange={(value) => setWeightCalc((prev) => ({ ...prev, saltwater: value }))}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="true">Saltwater</SelectItem>
                        <SelectItem value="false">Freshwater</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <Button onClick={calculateWeighting} className="w-full bg-ocean-500 hover:bg-ocean-600">
                  Calculate Weight
                </Button>
                {weightCalc.result && (
                  <div className="p-4 bg-ocean-50 rounded-lg text-center">
                    <p className="text-lg font-semibold text-ocean-900">
                      Estimated Weight: <span className="text-ocean-600">{weightCalc.result}kg</span>
                    </p>
                    <p className="text-sm text-ocean-600 mt-1">
                      This is a starting point - adjust based on buoyancy check
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
