'use client'

import { useState, useEffect, useRef } from 'react'
import { Loader2, MapPin, X } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Popover, PopoverAnchor, PopoverContent } from '@/components/ui/popover'
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandItem,
  CommandList,
} from '@/components/ui/command'
import { searchLocations, type NominatimResult } from '@/lib/geocode'

export interface LocationSelection {
  display_name: string
  latitude: number
  longitude: number
}

interface LocationPickerProps {
  initialValue?: string
  onSelect: (selection: LocationSelection | null) => void
  error?: string
}

export function LocationPicker({ initialValue, onSelect, error }: LocationPickerProps) {
  const [query, setQuery] = useState(initialValue ?? '')
  const [results, setResults] = useState<NominatimResult[]>([])
  const [loading, setLoading] = useState(false)
  const [selected, setSelected] = useState(!!initialValue)
  const [open, setOpen] = useState(false)
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (selected) return
    if (debounceRef.current) clearTimeout(debounceRef.current)

    debounceRef.current = setTimeout(async () => {
      if (query.trim().length < 2) {
        setResults([])
        setOpen(false)
        return
      }
      setLoading(true)
      const hits = await searchLocations(query)
      setResults(hits)
      setOpen(hits.length > 0)
      setLoading(false)
    }, 350)

    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current)
    }
  }, [query, selected])

  function handleSelect(result: NominatimResult) {
    setSelected(true)
    setQuery(result.display_name)
    setResults([])
    setOpen(false)
    onSelect({
      display_name: result.display_name,
      latitude: parseFloat(result.lat),
      longitude: parseFloat(result.lon),
    })
    inputRef.current?.focus()
  }

  function handleClear() {
    setSelected(false)
    setQuery('')
    setResults([])
    setOpen(false)
    onSelect(null)
    inputRef.current?.focus()
  }

  function handleQueryChange(e: React.ChangeEvent<HTMLInputElement>) {
    const val = e.target.value
    setQuery(val)
    if (selected) {
      setSelected(false)
      onSelect(null)
    }
  }

  return (
    <div className="space-y-2">
      <Label htmlFor="location-search">Address / Location</Label>
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverAnchor asChild>
          <div className="relative">
            <Input
              ref={inputRef}
              id="location-search"
              value={query}
              onChange={handleQueryChange}
              onFocus={() => {
                if (results.length > 0 && !selected) setOpen(true)
              }}
              placeholder="Search for a place…"
              autoComplete="off"
              className={error ? 'border-destructive pr-8' : 'pr-8'}
              aria-expanded={open}
              aria-haspopup="listbox"
              aria-autocomplete="list"
              role="combobox"
            />
            <div className="absolute right-2 top-1/2 -translate-y-1/2">
              {loading && <Loader2 className="h-3.5 w-3.5 animate-spin text-muted-foreground" />}
              {!loading && selected && (
                <button
                  type="button"
                  onClick={handleClear}
                  className="text-muted-foreground hover:text-foreground"
                  aria-label="Clear location"
                >
                  <X className="h-3.5 w-3.5" />
                </button>
              )}
            </div>
          </div>
        </PopoverAnchor>
        <PopoverContent
          align="start"
          onOpenAutoFocus={(e) => e.preventDefault()}
          className="p-0 w-[var(--radix-popper-anchor-width)]"
        >
          <Command shouldFilter={false}>
            <CommandList>
              {results.length === 0 ? (
                <CommandEmpty>No results found.</CommandEmpty>
              ) : (
                <CommandGroup>
                  {results.map((r) => (
                    <CommandItem
                      key={r.place_id}
                      value={r.display_name}
                      onSelect={() => handleSelect(r)}
                      className="flex items-start gap-2 min-h-[44px] py-2.5 cursor-pointer"
                    >
                      <MapPin className="h-3.5 w-3.5 shrink-0 mt-0.5 text-muted-foreground" />
                      <span className="line-clamp-2 text-sm">{r.display_name}</span>
                    </CommandItem>
                  ))}
                </CommandGroup>
              )}
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>

      {selected && (
        <p className="flex items-center gap-1 text-xs text-green-700">
          <MapPin className="h-3 w-3 shrink-0" />
          Coordinates confirmed
        </p>
      )}

      {!selected && query.trim().length > 0 && !loading && !open && (
        <p className="text-xs text-muted-foreground">
          Select from the list to lock in coordinates
        </p>
      )}

      {error && <p className="text-xs text-destructive">{error}</p>}
    </div>
  )
}
