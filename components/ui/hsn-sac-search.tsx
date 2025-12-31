/**
 * HSN/SAC Code Search Component
 * Reusable component for searching and selecting HSN/SAC codes
 * Auto-fills GST rate for SAC (service) codes
 */

"use client"

import { useState, useEffect, useCallback } from "react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { Search, Briefcase, Package, Info } from "lucide-react"
import { searchHSNSACCodes, type HSNCode } from "@/lib/invoice/data/hsn-sac-codes"

interface HSNSACSearchProps {
  /** Currently selected code */
  value?: string
  /** Callback when a code is selected */
  onSelect: (code: string, gstRate: number | null, codeDetails: HSNCode) => void
  /** Placeholder text */
  placeholder?: string
  /** Disabled state */
  disabled?: boolean
}

export function HSNSACSearch({
  value,
  onSelect,
  placeholder = "Search HSN/SAC Code",
  disabled = false,
}: HSNSACSearchProps) {
  const [open, setOpen] = useState(false)
  const [query, setQuery] = useState("")
  const [results, setResults] = useState<HSNCode[]>([])

  // Search when query changes or popover opens
  useEffect(() => {
    if (open) {
      const searchResults = searchHSNSACCodes(query)
      setResults(searchResults)
    }
  }, [open, query])

  const handleSelect = useCallback((code: HSNCode) => {
    onSelect(code.code, code.gstRate ?? null, code)
    setOpen(false)
    setQuery("")
  }, [onSelect])

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          size="sm"
          className="w-full justify-start gap-2"
          disabled={disabled}
        >
          <Search className="h-4 w-4 text-muted-foreground" />
          <span className="text-muted-foreground">
            {value ? `Selected: ${value}` : placeholder}
          </span>
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[360px] p-0" align="start">
        <Command shouldFilter={false}>
          <CommandInput
            placeholder="Type code, 'service', 'IT', 'consulting'..."
            value={query}
            onValueChange={setQuery}
          />
          <CommandList className="max-h-[300px]">
            {results.length === 0 ? (
              <CommandEmpty className="py-6 text-center">
                <p className="text-sm text-muted-foreground">No codes found</p>
                <p className="text-xs text-muted-foreground mt-1">
                  Try searching by code number or description
                </p>
              </CommandEmpty>
            ) : (
              <>
                {/* SAC (Services) Group */}
                {results.filter(r => r.type === "SAC").length > 0 && (
                  <CommandGroup heading={
                    <span className="flex items-center gap-2">
                      <Briefcase className="h-3 w-3" />
                      Services (SAC) - Auto-fills GST
                    </span>
                  }>
                    {results.filter(r => r.type === "SAC").map((code) => (
                      <CommandItem
                        key={code.code}
                        value={code.code}
                        onSelect={() => handleSelect(code)}
                        className="cursor-pointer py-3 data-[selected=true]:bg-primary data-[selected=true]:text-primary-foreground"
                      >
                        <div className="flex flex-col gap-1 w-full">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              <span className="font-mono font-semibold">{code.code}</span>
                              <Badge variant="secondary" className="text-[10px] px-1.5 py-0">
                                SAC
                              </Badge>
                            </div>
                            {code.gstRate && (
                              <Badge className="bg-green-100 text-green-700 hover:bg-green-100 text-xs">
                                {code.gstRate}% GST
                              </Badge>
                            )}
                          </div>
                          <span className="text-xs opacity-80 line-clamp-1">
                            {code.description}
                          </span>
                        </div>
                      </CommandItem>
                    ))}
                  </CommandGroup>
                )}

                {/* HSN (Goods) Group */}
                {results.filter(r => r.type === "HSN").length > 0 && (
                  <CommandGroup heading={
                    <span className="flex items-center gap-2">
                      <Package className="h-3 w-3" />
                      Goods (HSN) - Verify GST rate
                    </span>
                  }>
                    {results.filter(r => r.type === "HSN").map((code) => (
                      <CommandItem
                        key={code.code}
                        value={code.code}
                        onSelect={() => handleSelect(code)}
                        className="cursor-pointer py-3 data-[selected=true]:bg-primary data-[selected=true]:text-primary-foreground"
                      >
                        <div className="flex flex-col gap-1 w-full">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              <span className="font-mono font-semibold">{code.code}</span>
                              <Badge variant="outline" className="text-[10px] px-1.5 py-0">
                                HSN
                              </Badge>
                            </div>
                          </div>
                          <span className="text-xs opacity-80 line-clamp-1">
                            {code.description}
                          </span>
                          {code.notes && (
                            <span className="text-[10px] text-amber-600 flex items-center gap-1">
                              <Info className="h-3 w-3" />
                              {code.notes}
                            </span>
                          )}
                        </div>
                      </CommandItem>
                    ))}
                  </CommandGroup>
                )}
              </>
            )}
          </CommandList>
        </Command>
        
        {/* Footer hint */}
        <div className="border-t p-2 bg-muted/30">
          <p className="text-[10px] text-muted-foreground text-center">
            💡 SAC codes auto-fill GST rate • HSN codes require manual verification
          </p>
        </div>
      </PopoverContent>
    </Popover>
  )
}
