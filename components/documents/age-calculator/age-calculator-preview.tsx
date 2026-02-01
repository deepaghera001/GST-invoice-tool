/**
 * Age Calculator Preview Component
 * Clean PDF-optimized preview without interactive elements
 */

"use client"

import type { AgeInsights } from "@/lib/hooks/use-age-calculator"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { 
  Cake, 
  Clock, 
  Star,
  CheckCircle2,
  Calendar,
  Globe
} from "lucide-react"

interface AgeCalculatorPreviewProps {
  calculations: AgeInsights
  birthDate: string
}

export function AgeCalculatorPreview({ calculations, birthDate }: AgeCalculatorPreviewProps) {
  return (
    <div id="age-calculator-preview" className="p-8 space-y-6 text-sm bg-white pdf-document-content">
      <style>{`
        /* PDF-specific styles for clean rendering */
        @media print {
          .age-calc-card {
            break-inside: avoid;
            page-break-inside: avoid;
          }
          .age-calc-grid > * {
            break-inside: avoid;
            page-break-inside: avoid;
          }
        }
      `}</style>

      {/* Header */}
      <div className="text-center border-b-2 border-primary pb-4">
        <h1 className="text-3xl font-black text-primary">AGE INSIGHTS REPORT</h1>
        <p className="text-sm text-muted-foreground mt-2">
          Birth Date: {new Date(birthDate).toLocaleDateString('en-IN', { day: '2-digit', month: 'long', year: 'numeric' })}
        </p>
        <p className="text-xs text-muted-foreground">
          Generated on {new Date().toLocaleDateString('en-IN', { day: '2-digit', month: 'long', year: 'numeric' })}
        </p>
      </div>

      {/* Main Age Display */}
      <div className="age-calc-card bg-gradient-to-br from-primary to-primary/90 text-primary-foreground rounded-lg p-6">
        <div className="flex justify-between items-start mb-4">
          <div>
            <div className="text-6xl font-black">{calculations.years}</div>
            <div className="text-lg opacity-80 uppercase tracking-widest mt-1">Years Old</div>
          </div>
          <Badge className="bg-white/20 text-white border-white/30">
            {calculations.months} M • {calculations.days} D
          </Badge>
        </div>
        
        <div className="space-y-2">
          <div className="flex justify-between text-sm font-medium">
            <span>Life Progress (Est. 80yr)</span>
            <span>{calculations.lifeProgress}%</span>
          </div>
          <Progress value={calculations.lifeProgress} className="h-2 bg-white/20" />
        </div>
      </div>

      {/* Basic Info Grid */}
      <div className="age-calc-grid grid grid-cols-2 gap-4">
        <div className="age-calc-card border rounded-lg p-4">
          <div className="flex items-center gap-2 text-xs text-muted-foreground mb-2">
            <Cake className="w-4 h-4" />
            Next Birthday
          </div>
          <div className="text-xl font-bold">
            {calculations.nextBirthday.daysLeft === 0 ? "Today!" : `${calculations.nextBirthday.daysLeft} Days`}
          </div>
          <p className="text-xs text-muted-foreground mt-1">
            Falls on {calculations.nextBirthday.weekday}
          </p>
        </div>

        <div className="age-calc-card border rounded-lg p-4">
          <div className="flex items-center gap-2 text-xs text-muted-foreground mb-2">
            <Clock className="w-4 h-4" />
            Total Days Lived
          </div>
          <div className="text-xl font-bold">{calculations.totalDays.toLocaleString()}</div>
          <p className="text-xs text-muted-foreground mt-1">Days on Earth</p>
        </div>
      </div>

      {/* Zodiac Signs */}
      <div className="age-calc-grid grid grid-cols-2 gap-4">
        <div className="age-calc-card border rounded-lg p-4 bg-purple-50">
          <div className="flex items-center gap-2 mb-2">
            <Star className="w-4 h-4 text-purple-600" />
            <span className="text-xs font-medium text-purple-900">Zodiac Sign</span>
          </div>
          <div className="text-lg font-bold text-purple-900">{calculations.zodiac.name}</div>
        </div>

        <div className="age-calc-card border rounded-lg p-4 bg-orange-50">
          <div className="flex items-center gap-2 mb-2">
            <Calendar className="w-4 h-4 text-orange-600" />
            <span className="text-xs font-medium text-orange-900">Chinese Zodiac</span>
          </div>
          <div className="text-lg font-bold text-orange-900">{calculations.chineseZodiac.name}</div>
        </div>
      </div>

      {/* Eligibility Status */}
      <div className="age-calc-card border rounded-lg p-4">
        <h3 className="text-sm font-bold mb-3 flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-primary" />
          Eligibility Status
        </h3>
        <div className="grid grid-cols-2 gap-3">
          <div className={`p-3 rounded border ${calculations.eligibility.voting ? 'bg-green-50 border-green-200' : 'bg-gray-50'}`}>
            <Badge variant={calculations.eligibility.voting ? "default" : "outline"} className={calculations.eligibility.voting ? "bg-green-600 mb-2" : "mb-2"}>
              {calculations.eligibility.voting ? "Eligible" : "Minor"}
            </Badge>
            <div className="text-xs font-medium">Voting Rights</div>
          </div>
          <div className={`p-3 rounded border ${calculations.eligibility.seniorCitizen ? 'bg-amber-50 border-amber-200' : 'bg-gray-50'}`}>
            <Badge variant={calculations.eligibility.seniorCitizen ? "default" : "outline"} className={calculations.eligibility.seniorCitizen ? "bg-amber-600 mb-2" : "mb-2"}>
              {calculations.eligibility.seniorCitizen ? "Senior" : "Regular"}
            </Badge>
            <div className="text-xs font-medium">Benefit Status</div>
          </div>
        </div>
      </div>

      {/* Planetary Ages */}
      <div className="age-calc-card border rounded-lg p-4">
        <h3 className="text-sm font-bold mb-3 flex items-center gap-2">
          <Globe className="w-4 h-4 text-primary" />
          Your Age on Other Planets
        </h3>
        <div className="grid grid-cols-2 gap-3">
          {calculations.planetaryAges.map((p) => (
            <div key={p.planet} className="flex justify-between items-center p-2 bg-slate-50 rounded">
              <span className="text-xs font-medium">{p.planet}</span>
              <span className="text-sm font-bold text-primary">{p.age} yrs</span>
            </div>
          ))}
        </div>
      </div>

      {/* Life Milestones */}
      <div className="age-calc-card border rounded-lg p-4">
        <h3 className="text-sm font-bold mb-3 flex items-center gap-2">
          <Clock className="w-4 h-4 text-primary" />
          Life Milestones Tracker
        </h3>
        <div className="space-y-2">
          {calculations.funMilestones.map((milestone) => (
            <div key={milestone.label} className="flex justify-between items-center p-2 bg-slate-50 rounded">
              <div className="flex items-center gap-2">
                <span className={`text-[9px] px-2 py-0.5 rounded-full uppercase font-bold ${
                  milestone.status === 'passed' 
                    ? 'bg-green-100 text-green-700' 
                    : 'bg-amber-100 text-amber-700'
                }`}>
                  {milestone.status}
                </span>
                <span className="text-xs font-medium">{milestone.label}</span>
              </div>
              <span className="text-xs text-muted-foreground">
                {new Date(milestone.date).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Insights */}
      <div className="age-calc-card border rounded-lg p-4 bg-accent/5">
        <h3 className="text-sm font-bold mb-3 flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-accent" />
          Your Milestone Insights
        </h3>
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-1">
            <p className="text-xs font-bold text-accent">Career Reflection</p>
            <p className="text-xs text-muted-foreground italic">
              {calculations.years < 20 ? "You are in the learning phase. Build strong foundations." :
               calculations.years < 35 ? "The high-growth phase. Take risks and scale your skills." :
               calculations.years < 50 ? "Consolidation phase. Leverage your experience." :
               "Mentorship phase. Time to give back and enjoy the legacy."}
            </p>
          </div>
          <div className="space-y-1">
            <p className="text-xs font-bold text-accent">Health Tip</p>
            <p className="text-xs text-muted-foreground italic">
              {calculations.years < 25 ? "Perfect time for high-intensity sports and habit building." :
               calculations.years < 45 ? "Focus on metabolic health and stress management as work peaks." :
               "Prioritize mobility, strength training, and regular checkups."}
            </p>
          </div>
        </div>
      </div>

      {/* Footer */}
      <Separator className="my-4" />
      <div className="text-center text-xs text-muted-foreground">
        <p>This report was generated by Workngin Age Calculator</p>
        <p className="mt-1">Visit us at workngin.com for more tools</p>
      </div>
    </div>
  )
}
