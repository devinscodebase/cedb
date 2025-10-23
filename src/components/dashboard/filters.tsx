'use client'

import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Badge } from '@/components/ui/badge'
import { BadgeCheck, Building2, MapPin, Calendar, X } from 'lucide-react'

/**
 * Contact Filters Component
 * 
 * Provides filter controls for Industry, State, Status, and Date Added
 */

// Filter options - will be populated from database
const INDUSTRIES = [
  'Federal Government',
  'Financial/Insurance',
  'School District',
  'State Government',
  'University',
]

const US_STATES = [
  'AL', 'AK', 'AZ', 'AR', 'CA', 'CO', 'CT', 'DE', 'FL', 'GA',
  'HI', 'ID', 'IL', 'IN', 'IA', 'KS', 'KY', 'LA', 'ME', 'MD',
  'MA', 'MI', 'MN', 'MS', 'MO', 'MT', 'NE', 'NV', 'NH', 'NJ',
  'NM', 'NY', 'NC', 'ND', 'OH', 'OK', 'OR', 'PA', 'RI', 'SC',
  'SD', 'TN', 'TX', 'UT', 'VT', 'VA', 'WA', 'WV', 'WI', 'WY',
]

const STATUSES = [
  'Valid',
  'Hard Bounce',
  'Soft Bounce',
  'Unsubscribe',
  'Do Not Contact',
]

const DATE_RANGES = [
  { label: 'Today', value: 'today' },
  { label: 'Last 7 days', value: '7days' },
  { label: 'Last 30 days', value: '30days' },
  { label: 'Last 90 days', value: '90days' },
  { label: 'This year', value: 'year' },
]

interface FiltersProps {
  selectedIndustries: string[]
  selectedStates: string[]
  selectedStatuses: string[]
  selectedDateRange: string | null
  onIndustryChange: (industries: string[]) => void
  onStateChange: (states: string[]) => void
  onStatusChange: (statuses: string[]) => void
  onDateRangeChange: (range: string | null) => void
  onClearAll: () => void
}

export function Filters({
  selectedIndustries,
  selectedStates,
  selectedStatuses,
  selectedDateRange,
  onIndustryChange,
  onStateChange,
  onStatusChange,
  onDateRangeChange,
  onClearAll,
}: FiltersProps) {
  const activeFiltersCount = 
    selectedIndustries.length + 
    selectedStates.length + 
    selectedStatuses.length + 
    (selectedDateRange ? 1 : 0)

  const handleIndustryToggle = (industry: string) => {
    const newSelection = selectedIndustries.includes(industry)
      ? selectedIndustries.filter((i) => i !== industry)
      : [...selectedIndustries, industry]
    onIndustryChange(newSelection)
  }

  const handleStateToggle = (state: string) => {
    const newSelection = selectedStates.includes(state)
      ? selectedStates.filter((s) => s !== state)
      : [...selectedStates, state]
    onStateChange(newSelection)
  }

  const handleStatusToggle = (status: string) => {
    const newSelection = selectedStatuses.includes(status)
      ? selectedStatuses.filter((s) => s !== status)
      : [...selectedStatuses, status]
    onStatusChange(newSelection)
  }

  const handleRemoveStatus = (status: string) => {
    onStatusChange(selectedStatuses.filter((s) => s !== status))
  }

  const handleRemoveIndustry = (industry: string) => {
    onIndustryChange(selectedIndustries.filter((i) => i !== industry))
  }

  const handleRemoveState = (state: string) => {
    onStateChange(selectedStates.filter((s) => s !== state))
  }

  return (
    <div className="space-y-3">
      {/* Filters Section Title */}
      <div className="flex items-center gap-2">
        <h3 className="text-sm font-medium text-muted-foreground">Filters</h3>
        <div className="h-px flex-1 bg-border" />
      </div>

      {/* Filter Buttons - Reordered by importance */}
      <div className="flex flex-wrap items-center gap-2">
        {/* Status Filter - Most important for email lists */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="sm" className="h-9">
              <BadgeCheck className="mr-2 h-4 w-4" />
              Status
              {selectedStatuses.length > 0 && (
                <Badge variant="secondary" className="ml-2 h-5 px-1">
                  {selectedStatuses.length}
                </Badge>
              )}
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="start" className="w-56">
            <DropdownMenuLabel>Filter by Status</DropdownMenuLabel>
            <DropdownMenuSeparator />
            {STATUSES.map((status) => (
              <DropdownMenuCheckboxItem
                key={status}
                checked={selectedStatuses.includes(status)}
                onCheckedChange={() => handleStatusToggle(status)}
              >
                {status}
              </DropdownMenuCheckboxItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>

        {/* Industry Filter - Primary segmentation */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="sm" className="h-9">
              <Building2 className="mr-2 h-4 w-4" />
              Industry
              {selectedIndustries.length > 0 && (
                <Badge variant="secondary" className="ml-2 h-5 px-1">
                  {selectedIndustries.length}
                </Badge>
              )}
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="start" className="w-56">
            <DropdownMenuLabel>Filter by Industry</DropdownMenuLabel>
            <DropdownMenuSeparator />
            {INDUSTRIES.map((industry) => (
              <DropdownMenuCheckboxItem
                key={industry}
                checked={selectedIndustries.includes(industry)}
                onCheckedChange={() => handleIndustryToggle(industry)}
              >
                {industry}
              </DropdownMenuCheckboxItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>

        {/* State Filter - Geographic segmentation */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="sm" className="h-9">
              <MapPin className="mr-2 h-4 w-4" />
              State
              {selectedStates.length > 0 && (
                <Badge variant="secondary" className="ml-2 h-5 px-1">
                  {selectedStates.length}
                </Badge>
              )}
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="start" className="w-56 max-h-80 overflow-y-auto">
            <DropdownMenuLabel>Filter by State (USA)</DropdownMenuLabel>
            <DropdownMenuSeparator />
            {US_STATES.map((state) => (
              <DropdownMenuCheckboxItem
                key={state}
                checked={selectedStates.includes(state)}
                onCheckedChange={() => handleStateToggle(state)}
              >
                {state}
              </DropdownMenuCheckboxItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>

        {/* Date Range Filter - Temporal filter */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="sm" className="h-9">
              <Calendar className="mr-2 h-4 w-4" />
              Date Added
              {selectedDateRange && (
                <Badge variant="secondary" className="ml-2 h-5 px-1">
                  1
                </Badge>
              )}
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="start" className="w-56">
            <DropdownMenuLabel>Filter by Date Added</DropdownMenuLabel>
            <DropdownMenuSeparator />
            {DATE_RANGES.map((range) => (
              <DropdownMenuCheckboxItem
                key={range.value}
                checked={selectedDateRange === range.value}
                onCheckedChange={() => 
                  onDateRangeChange(selectedDateRange === range.value ? null : range.value)
                }
              >
                {range.label}
              </DropdownMenuCheckboxItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>

        {/* Clear All Filters */}
        {activeFiltersCount > 0 && (
          <Button
            variant="ghost"
            size="sm"
            onClick={onClearAll}
            className="h-9"
          >
            Clear all
            <X className="ml-2 h-4 w-4" />
          </Button>
        )}
      </div>

      {/* Active Filter Chips */}
      {activeFiltersCount > 0 && (
        <div className="flex flex-wrap items-center gap-2">
          {/* Status Chips */}
          {selectedStatuses.map((status) => (
            <Badge
              key={status}
              variant="secondary"
              className="h-7 gap-1 pr-1"
            >
              <span className="text-xs">Status: {status}</span>
              <button
                onClick={() => handleRemoveStatus(status)}
                className="ml-1 rounded-sm hover:bg-muted"
              >
                <X className="h-3 w-3" />
              </button>
            </Badge>
          ))}

          {/* Industry Chips */}
          {selectedIndustries.map((industry) => (
            <Badge
              key={industry}
              variant="secondary"
              className="h-7 gap-1 pr-1"
            >
              <span className="text-xs">Industry: {industry}</span>
              <button
                onClick={() => handleRemoveIndustry(industry)}
                className="ml-1 rounded-sm hover:bg-muted"
              >
                <X className="h-3 w-3" />
              </button>
            </Badge>
          ))}

          {/* State Chips */}
          {selectedStates.map((state) => (
            <Badge
              key={state}
              variant="secondary"
              className="h-7 gap-1 pr-1"
            >
              <span className="text-xs">State: {state}</span>
              <button
                onClick={() => handleRemoveState(state)}
                className="ml-1 rounded-sm hover:bg-muted"
              >
                <X className="h-3 w-3" />
              </button>
            </Badge>
          ))}

          {/* Date Range Chip */}
          {selectedDateRange && (
            <Badge
              variant="secondary"
              className="h-7 gap-1 pr-1"
            >
              <span className="text-xs">
                Date: {DATE_RANGES.find((r) => r.value === selectedDateRange)?.label}
              </span>
              <button
                onClick={() => onDateRangeChange(null)}
                className="ml-1 rounded-sm hover:bg-muted"
              >
                <X className="h-3 w-3" />
              </button>
            </Badge>
          )}
        </div>
      )}
    </div>
  )
}

