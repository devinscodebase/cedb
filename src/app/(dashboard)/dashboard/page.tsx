'use client'

import { useState, useMemo, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Filters } from '@/components/dashboard/filters'
import { DataTable, Contact } from '@/components/dashboard/data-table'
import { AddContactSheet } from '@/components/dashboard/add-contact-sheet'
import { Search, Mail, BadgeCheck } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'

/**
 * Dashboard Page
 * 
 * Main dashboard view showing contacts table and statistics
 */
export default function DashboardPage() {
  // State for contacts data
  const [contacts, setContacts] = useState<Contact[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [refreshTrigger, setRefreshTrigger] = useState(0)
  
  // State for edit contact dialog
  const [editingContact, setEditingContact] = useState<any | null>(null)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)

  // Fetch contacts from Supabase
  useEffect(() => {
    async function fetchContacts() {
      try {
        setIsLoading(true)
        setError(null)
        
        const supabase = createClient()
        const { data, error: fetchError } = await supabase
          .from('contacts')
          .select('*')
          .is('deleted_at', null) // Only fetch non-deleted contacts
          .order('created_at', { ascending: false })

        if (fetchError) {
          console.error('Error fetching contacts:', fetchError)
          throw new Error(fetchError.message)
        }

        // Transform database data to match Contact type
        const transformedContacts: Contact[] = (data || []).map((row) => ({
          id: row.id,
          email: row.email,
          name: [row.first_name, row.last_name].filter(Boolean).join(' ') || null,
          company: row.company_name,
          industry: row.industry,
          state: row.state,
          status: row.status as Contact['status'],
          created_at: row.created_at,
        }))

        setContacts(transformedContacts)
      } catch (err) {
        console.error('Failed to fetch contacts:', err)
        setError(err instanceof Error ? err.message : 'Failed to load contacts')
      } finally {
        setIsLoading(false)
      }
    }

    fetchContacts()
  }, [refreshTrigger])

  // Listen for contact added events
  useEffect(() => {
    const handleContactAdded = () => {
      console.log('Contact added event received, refreshing data...')
      setRefreshTrigger((prev) => prev + 1)
    }

    window.addEventListener('contactAdded', handleContactAdded)
    return () => window.removeEventListener('contactAdded', handleContactAdded)
  }, [])

  // Filter state
  const [selectedIndustries, setSelectedIndustries] = useState<string[]>([])
  const [selectedStates, setSelectedStates] = useState<string[]>([])
  const [selectedStatuses, setSelectedStatuses] = useState<string[]>([])
  const [selectedDateRange, setSelectedDateRange] = useState<string | null>(null)
  const [searchQuery, setSearchQuery] = useState('')

  const handleClearFilters = () => {
    setSelectedIndustries([])
    setSelectedStates([])
    setSelectedStatuses([])
    setSelectedDateRange(null)
    setSearchQuery('')
  }

  // Handle edit contact
  const handleEditContact = async (contact: Contact) => {
    try {
      // Fetch full contact data from Supabase to get all fields
      const supabase = createClient()
      const { data, error: fetchError } = await supabase
        .from('contacts')
        .select('*')
        .eq('id', contact.id)
        .single()

      if (fetchError) {
        console.error('Error fetching contact for edit:', fetchError)
        return
      }

      setEditingContact(data)
      setIsEditDialogOpen(true)
    } catch (err) {
      console.error('Failed to fetch contact:', err)
    }
  }

  // Filter contacts based on all active filters
  const filteredContacts = useMemo(() => {
    let filtered = contacts

    // Filter by search query
    if (searchQuery) {
      const query = searchQuery.toLowerCase()
      filtered = filtered.filter(
        (contact) =>
          contact.name?.toLowerCase().includes(query) ||
          contact.email.toLowerCase().includes(query) ||
          contact.company?.toLowerCase().includes(query)
      )
    }

    // Filter by industries
    if (selectedIndustries.length > 0) {
      filtered = filtered.filter((contact) =>
        contact.industry ? selectedIndustries.includes(contact.industry) : false
      )
    }

    // Filter by states
    if (selectedStates.length > 0) {
      filtered = filtered.filter((contact) =>
        contact.state ? selectedStates.includes(contact.state) : false
      )
    }

    // Filter by statuses
    if (selectedStatuses.length > 0) {
      filtered = filtered.filter((contact) =>
        contact.status ? selectedStatuses.includes(contact.status) : false
      )
    }

    // Filter by date range
    if (selectedDateRange) {
      const now = Date.now()
      const contactDate = (contact: Contact) => new Date(contact.created_at).getTime()

      switch (selectedDateRange) {
        case 'today':
          filtered = filtered.filter((contact) => {
            const diff = now - contactDate(contact)
            return diff < 24 * 60 * 60 * 1000 // Less than 24 hours
          })
          break
        case 'last_7_days':
          filtered = filtered.filter((contact) => {
            const diff = now - contactDate(contact)
            return diff < 7 * 24 * 60 * 60 * 1000
          })
          break
        case 'last_30_days':
          filtered = filtered.filter((contact) => {
            const diff = now - contactDate(contact)
            return diff < 30 * 24 * 60 * 60 * 1000
          })
          break
        case 'last_90_days':
          filtered = filtered.filter((contact) => {
            const diff = now - contactDate(contact)
            return diff < 90 * 24 * 60 * 60 * 1000
          })
          break
        case 'this_year':
          const thisYear = new Date().getFullYear()
          filtered = filtered.filter((contact) => {
            return new Date(contact.created_at).getFullYear() === thisYear
          })
          break
      }
    }

    return filtered
  }, [
    contacts,
    searchQuery,
    selectedIndustries,
    selectedStates,
    selectedStatuses,
    selectedDateRange,
  ])

  // Calculate stats based on filtered data
  const totalContacts = filteredContacts.length
  const validContacts = filteredContacts.filter((c) => c.status === 'Valid').length

  // Stats based on filtered data
  const stats = [
    {
      title: 'Total Contacts',
      value: totalContacts.toString(),
      description: 'All contacts in database',
      icon: Mail,
    },
    {
      title: 'Valid Contacts',
      value: validContacts.toString(),
      description: 'Contacts with valid status',
      icon: BadgeCheck,
    },
  ]

  return (
    <div className="space-y-6" suppressHydrationWarning>
      {/* Page Header */}
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Dashboard</h2>
        <p className="text-muted-foreground">
          Manage your cold email contacts and campaigns
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-2">
        {stats.map((stat) => (
          <Card key={stat.title}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                {stat.title}
              </CardTitle>
              <stat.icon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
              <p className="text-xs text-muted-foreground">
                {stat.description}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Contacts Table */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Contacts</CardTitle>
              <CardDescription>
                View and manage your email contacts
              </CardDescription>
            </div>
          </div>
          
          {/* Search and Filters */}
          <div className="space-y-4 pt-4">
            {/* Search Bar */}
            <div className="relative">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search contacts by name, email, or company..."
                className="pl-8"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>

            {/* Filters */}
            <Filters
              selectedIndustries={selectedIndustries}
              selectedStates={selectedStates}
              selectedStatuses={selectedStatuses}
              selectedDateRange={selectedDateRange}
              onIndustryChange={setSelectedIndustries}
              onStateChange={setSelectedStates}
              onStatusChange={setSelectedStatuses}
              onDateRangeChange={setSelectedDateRange}
              onClearAll={handleClearFilters}
            />
          </div>
        </CardHeader>
        
        <CardContent>
          {/* Loading State */}
          {isLoading ? (
            <div className="flex flex-col items-center justify-center rounded-lg border border-dashed p-12">
              <div className="flex h-20 w-20 items-center justify-center rounded-full bg-muted">
                <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
              </div>
              <h3 className="mt-4 text-lg font-semibold">Loading contacts...</h3>
              <p className="mt-2 text-center text-sm text-muted-foreground">
                Please wait while we fetch your data
              </p>
            </div>
          ) : error ? (
            /* Error State */
            <div className="flex flex-col items-center justify-center rounded-lg border border-destructive bg-destructive/10 p-12">
              <div className="flex h-20 w-20 items-center justify-center rounded-full bg-destructive/20">
                <Mail className="h-10 w-10 text-destructive" />
              </div>
              <h3 className="mt-4 text-lg font-semibold text-destructive">Failed to load contacts</h3>
              <p className="mt-2 text-center text-sm text-muted-foreground">
                {error}
              </p>
              <div className="mt-6">
                <Button onClick={() => window.location.reload()}>
                  Retry
                </Button>
              </div>
            </div>
          ) : contacts.length === 0 ? (
            /* No data at all - Initial empty state */
            <div className="flex flex-col items-center justify-center rounded-lg border border-dashed p-12">
              <div className="flex h-20 w-20 items-center justify-center rounded-full bg-muted">
                <Mail className="h-10 w-10 text-muted-foreground" />
              </div>
              <h3 className="mt-4 text-lg font-semibold">No contacts yet</h3>
              <p className="mt-2 text-center text-sm text-muted-foreground">
                Get started by uploading a CSV file or adding contacts manually
              </p>
              <div className="mt-6 flex gap-2">
                <Button>
                  <Mail className="mr-2 h-4 w-4" />
                  Add Contact
                </Button>
                <Button variant="outline">
                  Import CSV
                </Button>
              </div>
            </div>
          ) : filteredContacts.length === 0 ? (
            /* Filters returned no results */
            <div className="flex flex-col items-center justify-center rounded-lg border border-dashed p-12">
              <div className="flex h-20 w-20 items-center justify-center rounded-full bg-muted">
                <Search className="h-10 w-10 text-muted-foreground" />
              </div>
              <h3 className="mt-4 text-lg font-semibold">No contacts match your filters</h3>
              <p className="mt-2 text-center text-sm text-muted-foreground">
                Try adjusting your search criteria or clearing some filters
              </p>
              <div className="mt-6">
                <Button variant="outline" onClick={handleClearFilters}>
                  Clear all filters
                </Button>
              </div>
            </div>
          ) : (
            /* Show data table */
            <DataTable 
              data={filteredContacts} 
              onEditContact={handleEditContact}
            />
          )}
        </CardContent>
      </Card>

      {/* Edit Contact Dialog */}
      <AddContactSheet
        open={isEditDialogOpen}
        onOpenChange={(open) => {
          setIsEditDialogOpen(open)
          if (!open) {
            setEditingContact(null)
          }
        }}
        contact={editingContact}
        onSuccess={() => setRefreshTrigger((prev) => prev + 1)}
      />
    </div>
  )
}

