"use client"

import React from "react"
import { useAgeCalculator } from "@/lib/hooks/use-age-calculator"
import { AgeCalculatorPreview } from "./age-calculator-preview"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Button } from "@/components/ui/button"
import { useToast } from "@/components/ui/use-toast"
import { 
  Calendar, 
  Clock, 
  Cake, 
  Star, 
  CheckCircle2, 
  AlertCircle,
  Baby,
  User,
  History,
  Rocket,
  Milestone,
  Dna,
  Share2,
  Tornado,
  CalendarDays,
  FileDown
} from "lucide-react"
import { generateAndDownloadPDF } from "@/lib/utils/pdf-download-utils"

export function AgeCalculatorForm() {
  const { birthDate, targetDate, setBirthDate, setTargetDate, calculations } = useAgeCalculator()
  const { toast } = useToast()
  const [isSharing, setIsSharing] = React.useState(false)
  const [isGeneratingPDF, setIsGeneratingPDF] = React.useState(false)

  const handleDownloadPDF = async () => {
    if (!calculations) return
    setIsGeneratingPDF(true)
    
    try {
      const { captureAgeCalculatorPreviewHTML } = await import("@/lib/utils/dom-capture-utils")
      const htmlContent = captureAgeCalculatorPreviewHTML()

      await generateAndDownloadPDF(
        htmlContent,
        `Age-Calculator-Report-${calculations.years}-years.pdf`
      )

      toast({
        title: "Success! 🎉",
        description: "Your age report has been generated and downloaded.",
      })
    } catch (error) {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to generate PDF",
        variant: "destructive",
      })
    } finally {
      setIsGeneratingPDF(false)
    }
  }

  const handleShare = async () => {
    if (isSharing) return
    setIsSharing(true)

    try {
      if (typeof navigator !== 'undefined' && navigator.share) {
        await navigator.share({
          title: 'My Age Insights',
          text: `I am ${calculations?.years} years old! Check your exact age and life milestones here:`,
          url: window.location.href,
        })
      } else {
        await navigator.clipboard.writeText(window.location.href)
        toast({
          title: "Link Copied!",
          description: "Share this tool with your friends.",
        })
      }
    } catch (error) {
      if (error instanceof Error && error.name !== 'AbortError') {
        toast({
          title: "Share Failed",
          description: "Could not open share menu. URL copied instead.",
          variant: "destructive",
        })
        navigator.clipboard.writeText(window.location.href)
      }
    } finally {
      setIsSharing(false)
    }
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
      {/* Input Section */}
      <div className="lg:col-span-5 space-y-6">
        <Card className="shadow-lg border-primary/10">
          <CardHeader className="bg-primary/5">
            <CardTitle className="text-2xl font-bold flex items-center gap-2">
              <History className="w-6 h-6 text-primary" />
              Age Calculator
            </CardTitle>
            <CardDescription>
              Enter details below to calculate age and get personalized insights.
            </CardDescription>
          </CardHeader>
          <CardContent className="pt-6 space-y-4">
            <div className="space-y-2">
              <Label htmlFor="birthDate">Date of Birth</Label>
              <Input
                id="birthDate"
                type="date"
                value={birthDate}
                onChange={(e) => setBirthDate(e.target.value)}
                className="hover:border-primary transition-colors"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="targetDate">Age at the Date of</Label>
              <Input
                id="targetDate"
                type="date"
                value={targetDate}
                onChange={(e) => setTargetDate(e.target.value)}
                className="hover:border-primary transition-colors"
              />
            </div>
            {!calculations && birthDate && (
              <p className="text-sm text-destructive flex items-center gap-1">
                <AlertCircle className="w-4 h-4" />
                Target date must be after birth date.
              </p>
            )}
          </CardContent>
        </Card>

        {calculations && (
          <Card className="border-primary/20 bg-primary/5">
            <CardHeader className="py-4">
              <CardTitle className="text-lg flex items-center gap-2">
                <Tornado className="w-5 h-5 text-primary" />
                Time Travel
              </CardTitle>
              <CardDescription>Quickly check your age in different years</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="grid grid-cols-3 gap-2">
                {[2000, 2010, 2022, 2025, 2030, 2050].map((year) => (
                  <Button 
                    key={year} 
                    variant="outline" 
                    size="sm"
                    className="text-[10px] h-8 font-bold hover:bg-primary hover:text-white"
                    onClick={() => setTargetDate(`${year}-01-01`)}
                  >
                    Jan {year}
                  </Button>
                ))}
              </div>
              <p className="text-[10px] text-muted-foreground italic">Click a year to see how old you were or will be then.</p>
            </CardContent>
          </Card>
        )}

        {calculations && (
          <Card className="border-accent/20">
            <CardHeader className="py-4">
              <CardTitle className="text-lg flex items-center gap-2">
                <Star className="w-5 h-5 text-accent" />
                Eligibility & Quick Facts
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div className={`p-3 rounded-lg border flex flex-col items-center gap-2 ${calculations.eligibility.voting ? 'bg-green-50 border-green-200' : 'bg-gray-50 border-gray-200'}`}>
                  <Badge variant={calculations.eligibility.voting ? "default" : "outline"} className={calculations.eligibility.voting ? "bg-green-600" : ""}>
                    {calculations.eligibility.voting ? "Eligible" : "Minor"}
                  </Badge>
                  <span className="text-xs font-medium text-center">Voting Rights</span>
                </div>
                <div className={`p-3 rounded-lg border flex flex-col items-center gap-2 ${calculations.eligibility.seniorCitizen ? 'bg-amber-50 border-amber-200' : 'bg-gray-50 border-gray-200'}`}>
                  <Badge variant={calculations.eligibility.seniorCitizen ? "default" : "outline"} className={calculations.eligibility.seniorCitizen ? "bg-amber-600" : ""}>
                    {calculations.eligibility.seniorCitizen ? "Senior" : "Regular"}
                  </Badge>
                  <span className="text-xs font-medium text-center">Benefit Status</span>
                </div>
              </div>
              
              {calculations.eligibility.retirement && (
                <div className="text-sm p-3 bg-blue-50 border border-blue-100 rounded-lg flex items-center gap-2">
                  <Clock className="w-4 h-4 text-blue-600" />
                  <span>Only <span className="font-bold">{calculations.eligibility.retirement} years</span> left until official retirement age!</span>
                </div>
              )}

              <div className="p-3 bg-purple-50 border border-purple-100 rounded-lg flex justify-between items-center">
                <div className="flex items-center gap-2">
                  <Star className="w-4 h-4 text-purple-600" />
                  <span className="text-sm">Zodiac Sign</span>
                </div>
                <Badge variant="outline" className="border-purple-200 text-purple-700 font-bold">
                  {calculations.zodiac.name}
                </Badge>
              </div>

              <div className="p-3 bg-orange-50 border border-orange-100 rounded-lg flex justify-between items-center">
                <div className="flex items-center gap-2">
                  <Dna className="w-4 h-4 text-orange-600" />
                  <span className="text-sm">Chinese Zodiac</span>
                </div>
                <Badge variant="outline" className="border-orange-200 text-orange-700 font-bold">
                  {calculations.chineseZodiac.name}
                </Badge>
              </div>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Result Section */}
      <div className="lg:col-span-7">
        {!calculations ? (
          <div className="h-full flex flex-col items-center justify-center p-8 border-2 border-dashed rounded-xl bg-muted/30">
            <Baby className="w-16 h-16 text-muted-foreground/30 mb-4" />
            <h3 className="text-xl font-medium text-muted-foreground">Waiting for your date of birth...</h3>
            <p className="text-sm text-muted-foreground">Enter your birth date on the left to see your insights.</p>
          </div>
        ) : (
          <div id="age-calculator-results" className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <Card className="bg-gradient-to-br from-primary to-primary/90 text-primary-foreground shadow-xl border-none overflow-hidden">
              <CardHeader>
                <CardTitle className="text-3xl font-black tracking-tight flex justify-between items-start">
                  <div>
                    <span className="text-5xl block">{calculations.years}</span>
                    <span className="text-lg opacity-80 uppercase tracking-widest">Years Old</span>
                  </div>
                  <Badge className="bg-white/20 hover:bg-white/30 text-white border-white/30 backdrop-blur-sm">
                    {calculations.months} M • {calculations.days} D
                  </Badge>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6 pt-0">
                <div className="space-y-2">
                  <div className="flex justify-between text-sm font-medium">
                    <span>Life Progress (Est. 80yr)</span>
                    <span>{calculations.lifeProgress}%</span>
                  </div>
                  <Progress value={calculations.lifeProgress} className="h-3 bg-white/20" />
                </div>
                
                <div className="pt-2 flex flex-col sm:flex-row gap-2 pdf-hide">
                  <Button 
                    variant="secondary" 
                    size="sm" 
                    className="flex-1 bg-white/10 hover:bg-white/20 text-white border-white/20"
                    onClick={handleShare}
                    disabled={isSharing || isGeneratingPDF}
                  >
                    <Share2 className="w-4 h-4 mr-2" />
                    {isSharing ? "Sharing..." : "Share Insights"}
                  </Button>
                  <Button 
                    variant="secondary" 
                    size="sm" 
                    className="flex-1 bg-white hover:bg-slate-100 text-primary"
                    onClick={handleDownloadPDF}
                    disabled={isSharing || isGeneratingPDF}
                  >
                    {isGeneratingPDF ? (
                      <Clock className="w-4 h-4 mr-2 animate-spin" />
                    ) : (
                      <FileDown className="w-4 h-4 mr-2" />
                    )}
                    {isGeneratingPDF ? "Generating..." : "Download PDF Report"}
                  </Button>
                </div>
              </CardContent>
            </Card>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Card>
                <CardHeader className="pb-2">
                  <CardDescription className="flex items-center gap-1">
                    <Cake className="w-4 h-4" /> Next Birthday
                  </CardDescription>
                  <CardTitle className="text-xl">
                    {calculations.nextBirthday.daysLeft === 0 ? "Today! 🎉" : `${calculations.nextBirthday.daysLeft} Days to go`}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">
                    It falls on a <span className="font-bold text-foreground">{calculations.nextBirthday.weekday}</span>.
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-2">
                  <CardDescription className="flex items-center gap-1">
                    <User className="w-4 h-4" /> Total Duration
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Months</span>
                    <span className="font-medium">{calculations.totalMonths.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Weeks</span>
                    <span className="font-medium">{calculations.totalWeeks.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Days</span>
                    <span className="font-medium">{calculations.totalDays.toLocaleString()}</span>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Fun Insights Section */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card className="border-blue-100 shadow-sm overflow-hidden hover:shadow-md transition-shadow">
                <CardHeader className="bg-blue-50/50 pb-3">
                  <CardTitle className="text-sm font-bold flex items-center gap-2 text-blue-800">
                    <Rocket className="w-4 h-4 text-blue-600" />
                    Age on Other Planets
                  </CardTitle>
                </CardHeader>
                <CardContent className="pt-4">
                  <div className="grid grid-cols-2 gap-4">
                    {calculations.planetaryAges.map((p) => (
                      <div key={p.planet} className="text-center p-3 rounded-xl bg-white border border-blue-50 shadow-sm relative overflow-hidden group">
                        <div className={`absolute top-0 left-0 w-1 h-full ${p.color}`} />
                        <div className="text-[10px] text-muted-foreground uppercase font-bold tracking-tighter">{p.planet}</div>
                        <div className="text-xl font-black text-blue-600">{p.age}</div>
                        <div className="text-[10px] text-blue-400">years</div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card className="border-indigo-100 shadow-sm overflow-hidden hover:shadow-md transition-shadow">
                <CardHeader className="bg-indigo-50/50 pb-3">
                  <CardTitle className="text-sm font-bold flex items-center gap-2 text-indigo-800">
                    <Milestone className="w-4 h-4 text-indigo-600" />
                    Fun Time Milestones
                  </CardTitle>
                </CardHeader>
                <CardContent className="pt-4 space-y-4">
                  {calculations.funMilestones.map((m) => (
                    <div key={m.label} className="flex justify-between items-center text-sm">
                      <div className="flex items-center gap-3">
                        <div className="p-2 rounded-full bg-indigo-50">
                          <Clock className="w-3 h-3 text-indigo-500" />
                        </div>
                        <div className="space-y-0.5">
                          <p className="font-bold text-slate-700">{m.label}</p>
                          <div className="flex items-center gap-2">
                            <span className={`text-[9px] px-1.5 py-0.5 rounded-full uppercase font-black ${m.status === 'passed' ? 'bg-green-100 text-green-700' : 'bg-amber-100 text-amber-700 animate-pulse'}`}>
                              {m.status}
                            </span>
                          </div>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-black text-indigo-900 bg-indigo-50 px-3 py-1.5 rounded-lg border border-indigo-100">
                          {new Date(m.date).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}
                        </p>
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>
            </div>

            <Card className="bg-accent/5 border-accent/20">
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <CheckCircle2 className="w-5 h-5 text-accent" />
                  Your Milestone Insights
                </CardTitle>
              </CardHeader>
              <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="text-sm space-y-1">
                  <p className="font-bold text-accent">Career Reflection</p>
                  <p className="text-muted-foreground italic">
                    {calculations.years < 20 ? "You are in the learning phase. Build strong foundations." :
                     calculations.years < 35 ? "The high-growth phase. Take risks and scale your skills." :
                     calculations.years < 50 ? "Consolidation phase. Leverage your experience." :
                     "Mentorship phase. Time to give back and enjoy the legacy."}
                  </p>
                </div>
                <div className="text-sm space-y-1">
                  <p className="font-bold text-accent">Health Tip</p>
                  <p className="text-muted-foreground italic">
                    {calculations.years < 25 ? "Perfect time for high-intensity sports and habit building." :
                     calculations.years < 45 ? "Focus on metabolic health and stress management as work peaks." :
                     "Prioritize mobility, strength training, and regular checkups."}
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Hidden Preview Component for PDF Generation */}
        {calculations && (
          <div className="hidden">
            <AgeCalculatorPreview calculations={calculations} birthDate={birthDate} />
          </div>
        )}
      </div>
    </div>
  )
}
