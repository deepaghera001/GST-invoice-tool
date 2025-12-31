/**
 * Test Scenario Selector Component
 * Production-safe: Returns null when TEST_MODE is disabled
 * Tree-shaken in production builds
 */

"use client"

import * as React from "react"
import { ChevronDown, FlaskConical, Info } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import { Badge } from "@/components/ui/badge"
import type { TestScenario, ScenarioCategory } from "../types"
import { CATEGORY_CONFIG } from "../types"

interface TestScenarioSelectorProps<T> {
  /** Array of test scenarios */
  scenarios: TestScenario<T>[]
  /** Callback when scenario is selected */
  onApply: (data: Partial<T>) => void
  /** Optional: Current scenario id */
  currentScenario?: string
  /** Optional: Label override */
  label?: string
}

/**
 * Test Scenario Selector Dropdown
 * Only renders when NEXT_PUBLIC_TEST_MODE is 'true'
 */
export function TestScenarioSelector<T>({
  scenarios,
  onApply,
  currentScenario,
  label = "Test Scenarios",
}: TestScenarioSelectorProps<T>) {
  // Production guard - returns null if not in test mode
  if (process.env.NEXT_PUBLIC_TEST_MODE !== 'true') {
    return null
  }

  // Group scenarios by category
  const groupedScenarios = React.useMemo(() => {
    const groups: Record<ScenarioCategory, TestScenario<T>[]> = {
      valid: [],
      invalid: [],
      "edge-case": [],
      partial: [],
    }

    scenarios.forEach((scenario) => {
      groups[scenario.category].push(scenario)
    })

    return groups
  }, [scenarios])

  const handleSelect = (scenario: TestScenario<T>) => {
    onApply(scenario.data)
  }

  return (
    <TooltipProvider>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="outline"
            size="sm"
            className="gap-2 border-amber-300 bg-amber-50 text-amber-700 hover:bg-amber-100 hover:text-amber-800"
          >
            <FlaskConical className="h-3.5 w-3.5" />
            {label}
            <ChevronDown className="h-3 w-3 opacity-50" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="start" className="w-72">
          <DropdownMenuLabel className="flex items-center gap-2 text-amber-700">
            <FlaskConical className="h-4 w-4" />
            Test Scenarios
          </DropdownMenuLabel>
          <DropdownMenuSeparator />

          {/* Valid Scenarios */}
          {groupedScenarios.valid.length > 0 && (
            <DropdownMenuGroup>
              <DropdownMenuLabel className="text-xs text-green-600 font-normal">
                {CATEGORY_CONFIG.valid.icon} Valid Data
              </DropdownMenuLabel>
              {groupedScenarios.valid.map((scenario) => (
                <ScenarioMenuItem
                  key={scenario.id}
                  scenario={scenario}
                  onSelect={handleSelect}
                  isActive={currentScenario === scenario.id}
                />
              ))}
            </DropdownMenuGroup>
          )}

          {/* Invalid Scenarios */}
          {groupedScenarios.invalid.length > 0 && (
            <>
              <DropdownMenuSeparator />
              <DropdownMenuGroup>
                <DropdownMenuLabel className="text-xs text-red-600 font-normal">
                  {CATEGORY_CONFIG.invalid.icon} Invalid Data
                </DropdownMenuLabel>
                {groupedScenarios.invalid.map((scenario) => (
                  <ScenarioMenuItem
                    key={scenario.id}
                    scenario={scenario}
                    onSelect={handleSelect}
                    isActive={currentScenario === scenario.id}
                  />
                ))}
              </DropdownMenuGroup>
            </>
          )}

          {/* Edge Cases */}
          {groupedScenarios["edge-case"].length > 0 && (
            <>
              <DropdownMenuSeparator />
              <DropdownMenuGroup>
                <DropdownMenuLabel className="text-xs text-amber-600 font-normal">
                  {CATEGORY_CONFIG["edge-case"].icon} Edge Cases
                </DropdownMenuLabel>
                {groupedScenarios["edge-case"].map((scenario) => (
                  <ScenarioMenuItem
                    key={scenario.id}
                    scenario={scenario}
                    onSelect={handleSelect}
                    isActive={currentScenario === scenario.id}
                  />
                ))}
              </DropdownMenuGroup>
            </>
          )}

          {/* Partial Data */}
          {groupedScenarios.partial.length > 0 && (
            <>
              <DropdownMenuSeparator />
              <DropdownMenuGroup>
                <DropdownMenuLabel className="text-xs text-blue-600 font-normal">
                  {CATEGORY_CONFIG.partial.icon} Partial Data
                </DropdownMenuLabel>
                {groupedScenarios.partial.map((scenario) => (
                  <ScenarioMenuItem
                    key={scenario.id}
                    scenario={scenario}
                    onSelect={handleSelect}
                    isActive={currentScenario === scenario.id}
                  />
                ))}
              </DropdownMenuGroup>
            </>
          )}
        </DropdownMenuContent>
      </DropdownMenu>
    </TooltipProvider>
  )
}

/**
 * Individual scenario menu item with tooltip
 */
function ScenarioMenuItem<T>({
  scenario,
  onSelect,
  isActive,
}: {
  scenario: TestScenario<T>
  onSelect: (scenario: TestScenario<T>) => void
  isActive?: boolean
}) {
  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <DropdownMenuItem
          onClick={() => onSelect(scenario)}
          className={`cursor-pointer ${isActive ? "bg-amber-50" : ""}`}
        >
          <div className="flex items-center justify-between w-full gap-2">
            <span className="text-sm truncate">{scenario.name}</span>
            {scenario.expectedErrors && scenario.expectedErrors.length > 0 && (
              <Badge variant="outline" className="text-xs px-1.5 py-0 h-5 border-red-200 text-red-600">
                {scenario.expectedErrors.length} errors
              </Badge>
            )}
            {scenario.description && (
              <Info className="h-3 w-3 text-muted-foreground flex-shrink-0" />
            )}
          </div>
        </DropdownMenuItem>
      </TooltipTrigger>
      {scenario.description && (
        <TooltipContent side="right" className="max-w-xs">
          <p className="text-xs">{scenario.description}</p>
          {scenario.expectedErrors && scenario.expectedErrors.length > 0 && (
            <p className="text-xs text-red-500 mt-1">
              Expected errors: {scenario.expectedErrors.join(", ")}
            </p>
          )}
        </TooltipContent>
      )}
    </Tooltip>
  )
}
