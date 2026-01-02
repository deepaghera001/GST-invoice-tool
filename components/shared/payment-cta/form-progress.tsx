/**
 * Form Progress Component
 * Shows completion progress while user fills the form
 * Uses satisfying animations to encourage completion (psychology-driven)
 * 
 * Animation Philosophy:
 * - Slow enough to notice and appreciate (700-1000ms)
 * - Easing that feels "weighty" and satisfying
 * - Celebrates milestones to trigger dopamine
 */

"use client"

import { CheckCircle2, Circle } from "lucide-react"
import { cn } from "@/lib/utils"
import type { FormProgressProps } from "./types"

export function FormProgress({
  completedSections,
  totalSections,
  isComplete,
  sectionLabels,
  sectionStatus,
}: FormProgressProps) {
  const progressPercentage = Math.round((completedSections / totalSections) * 100)
  
  // Milestone messages for psychological satisfaction
  const getMilestoneMessage = () => {
    if (isComplete) return "✓ All details complete"
    if (progressPercentage >= 80) return "Almost there! 🎯"
    if (progressPercentage >= 50) return "Halfway done! Keep going 💪"
    if (progressPercentage >= 30) return "Great start! 👍"
    return `${completedSections} of ${totalSections} sections complete`
  }

  return (
    <div className="space-y-3">
      {/* Progress bar */}
      <div className="space-y-2">
        <div className="flex items-center justify-between text-xs">
          <span 
            className={cn(
              "transition-all duration-500 ease-out",
              isComplete 
                ? "text-green-600 dark:text-green-500 font-medium" 
                : progressPercentage >= 50 
                  ? "text-primary font-medium"
                  : "text-muted-foreground"
            )}
          >
            {getMilestoneMessage()}
          </span>
          <span 
            className={cn(
              "font-semibold tabular-nums transition-all duration-700 ease-out",
              isComplete 
                ? "text-green-600 dark:text-green-500 scale-110" 
                : progressPercentage >= 80
                  ? "text-primary"
                  : "text-muted-foreground"
            )}
          >
            {progressPercentage}%
          </span>
        </div>
        
        {/* Progress bar with satisfying animation */}
        <div className="h-2 bg-muted rounded-full overflow-hidden shadow-inner">
          <div
            className={cn(
              "h-full rounded-full relative",
              // Slow, satisfying transition (700ms with custom easing)
              "transition-all duration-700 ease-[cubic-bezier(0.34,1.56,0.64,1)]",
              isComplete 
                ? "bg-gradient-to-r from-green-500 to-emerald-400" 
                : progressPercentage >= 80
                  ? "bg-gradient-to-r from-primary to-primary/80"
                  : "bg-primary"
            )}
            style={{ width: `${progressPercentage}%` }}
          >
            {/* Shimmer effect for active progress */}
            {!isComplete && progressPercentage > 0 && (
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-shimmer" />
            )}
            {/* Pulse effect when complete */}
            {isComplete && (
              <div className="absolute inset-0 bg-white/20 animate-pulse" />
            )}
          </div>
        </div>
      </div>

      {/* Section checklist (optional - only if labels provided) */}
      {sectionLabels && sectionStatus && (
        <div className="grid grid-cols-2 gap-x-4 gap-y-1.5 text-xs">
          {sectionLabels.map((label, index) => {
            const key = Object.keys(sectionStatus)[index]
            const isCompleted = key ? sectionStatus[key] : false
            return (
              <div
                key={label}
                className={cn(
                  "flex items-center gap-1.5 transition-all duration-500 ease-out",
                  isCompleted 
                    ? "text-green-600 dark:text-green-500 translate-x-0.5" 
                    : "text-muted-foreground"
                )}
              >
                {isCompleted ? (
                  <CheckCircle2 
                    className={cn(
                      "h-3.5 w-3.5 transition-all duration-500",
                      "animate-in zoom-in-50 spin-in-180"
                    )} 
                  />
                ) : (
                  <Circle className="h-3.5 w-3.5 transition-opacity duration-300" />
                )}
                <span className="transition-all duration-300">{label}</span>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
