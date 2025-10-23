'use client'

import * as React from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { createClient } from '@/lib/supabase/client'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { AlertCircle } from 'lucide-react'
import { Separator } from '@/components/ui/separator'

interface AddContactSheetProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onSuccess?: () => void
  contact?: {
    id: string
    email: string
    first_name?: string | null
    last_name?: string | null
    company_name?: string | null
    job_title?: string | null
    industry?: string | null
    state?: string | null
    status?: string | null
    phone?: string | null
    website?: string | null
  } | null
}

// Industry options (alphabetical)
const INDUSTRIES = [
  'Federal Government',
  'Financial/Insurance',
  'School District',
  'State Government',
  'University',
]

// Status options
const STATUSES = [
  'Valid',
  'Hard Bounce',
  'Soft Bounce',
  'Unsubscribe',
  'Do Not Contact',
]

// US States
const US_STATES = [
  'AL', 'AK', 'AZ', 'AR', 'CA', 'CO', 'CT', 'DE', 'FL', 'GA',
  'HI', 'ID', 'IL', 'IN', 'IA', 'KS', 'KY', 'LA', 'ME', 'MD',
  'MA', 'MI', 'MN', 'MS', 'MO', 'MT', 'NE', 'NV', 'NH', 'NJ',
  'NM', 'NY', 'NC', 'ND', 'OH', 'OK', 'OR', 'PA', 'RI', 'SC',
  'SD', 'TN', 'TX', 'UT', 'VT', 'VA', 'WA', 'WV', 'WI', 'WY'
]

export function AddContactSheet({ open, onOpenChange, onSuccess, contact }: AddContactSheetProps) {
  const isEditMode = !!contact
  const [isSubmitting, setIsSubmitting] = React.useState(false)
  const [error, setError] = React.useState<string | null>(null)
  
  // Required fields - initialize from contact if in edit mode
  const [email, setEmail] = React.useState(contact?.email || '')
  const [state, setState] = React.useState(contact?.state || '')
  const [industry, setIndustry] = React.useState(contact?.industry || '')
  
  // Optional fields
  const [firstName, setFirstName] = React.useState(contact?.first_name || '')
  const [lastName, setLastName] = React.useState(contact?.last_name || '')
  const [companyName, setCompanyName] = React.useState(contact?.company_name || '')
  const [jobTitle, setJobTitle] = React.useState(contact?.job_title || '')
  const [phone, setPhone] = React.useState(contact?.phone || '')
  const [website, setWebsite] = React.useState(contact?.website || '')
  const [status, setStatus] = React.useState(contact?.status || 'Valid')
  
  // Update form when contact prop changes (for edit mode)
  React.useEffect(() => {
    if (contact) {
      setEmail(contact.email || '')
      setState(contact.state || '')
      setIndustry(contact.industry || '')
      setFirstName(contact.first_name || '')
      setLastName(contact.last_name || '')
      setCompanyName(contact.company_name || '')
      setJobTitle(contact.job_title || '')
      setPhone(contact.phone || '')
      setWebsite(contact.website || '')
      setStatus(contact.status || 'Valid')
    } else {
      // Reset to defaults for add mode
      setEmail('')
      setState('')
      setIndustry('')
      setFirstName('')
      setLastName('')
      setCompanyName('')
      setJobTitle('')
      setPhone('')
      setWebsite('')
      setStatus('Valid')
    }
  }, [contact, open])

  const handleReset = () => {
    setEmail('')
    setState('')
    setIndustry('')
    setFirstName('')
    setLastName('')
    setCompanyName('')
    setJobTitle('')
    setPhone('')
    setWebsite('')
    setStatus('Valid')
    setError(null)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)

    // Validate required fields
    if (!email || !state || !industry || !status || !companyName) {
      setError('Email, Industry, State, Company Name, and Status are required')
      return
    }

    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      setError('Please enter a valid email address')
      return
    }

    setIsSubmitting(true)

    try {
      const supabase = createClient()
      
      const contactData = {
        email,
        state,
        industry,
        company_name: companyName,
        status,
        first_name: firstName || null,
        last_name: lastName || null,
        job_title: jobTitle || null,
        phone: phone || null,
        website: website || null,
      }

      if (isEditMode && contact?.id) {
        // Update existing contact
        const { data, error: updateError } = await supabase
          .from('contacts')
          .update(contactData)
          .eq('id', contact.id)
          .select()

        if (updateError) {
          console.error('Supabase update error:', updateError)
          throw new Error(updateError.message || 'Database update failed')
        }

        console.log('Contact updated successfully:', data)
      } else {
        // Insert new contact
        const { data, error: insertError } = await supabase
          .from('contacts')
          .insert(contactData)
          .select()

        if (insertError) {
          console.error('Supabase insert error:', insertError)
          throw new Error(insertError.message || 'Database insert failed')
        }

        console.log('Contact added successfully:', data)
      }

      // Dispatch custom event to notify dashboard of change
      window.dispatchEvent(new Event('contactAdded'))

      // Call onSuccess callback to refresh data
      onSuccess?.()

      // Reset and close
      handleReset()
      onOpenChange(false)
    } catch (err) {
      console.error('Error adding contact:', err)
      const errorMessage = err instanceof Error ? err.message : 'Failed to add contact. Please check your database connection.'
      setError(errorMessage)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{isEditMode ? 'Edit Contact' : 'Add New Contact'}</DialogTitle>
          <DialogDescription>
            {isEditMode 
              ? 'Update the contact information. Fields marked with * are required.'
              : 'Add a contact to your database. Fields marked with * are required.'
            }
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6 py-6">
          {/* Error Message */}
          {error && (
            <div className="flex items-center gap-2 p-3 border border-destructive rounded-lg bg-destructive/10 text-destructive text-sm">
              <AlertCircle className="h-4 w-4 shrink-0" />
              <p>{error}</p>
            </div>
          )}

          {/* Required Fields */}
          <div className="space-y-4">
            <h4 className="text-sm font-semibold mb-3">Required Information</h4>
            <div className="space-y-4">
              <div className="space-y-1.5">
                <Label htmlFor="email" className="text-sm font-medium">
                  Email <span className="text-destructive">*</span>
                </Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="contact@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="companyName" className="text-sm font-medium">
                  Company Name <span className="text-destructive">*</span>
                </Label>
                <Input
                  id="companyName"
                  placeholder="Acme Corp"
                  value={companyName}
                  onChange={(e) => setCompanyName(e.target.value)}
                  required
                />
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div className="space-y-1.5">
                  <Label htmlFor="industry" className="text-sm font-medium">
                    Industry <span className="text-destructive">*</span>
                  </Label>
                  <Select value={industry} onValueChange={setIndustry} required>
                    <SelectTrigger id="industry" className="w-full">
                      <SelectValue placeholder="Select" className="truncate" />
                    </SelectTrigger>
                    <SelectContent position="popper" className="max-h-[300px]">
                      {INDUSTRIES.map((ind) => (
                        <SelectItem key={ind} value={ind} className="cursor-pointer">
                          {ind}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-1.5">
                  <Label htmlFor="state" className="text-sm font-medium">
                    State <span className="text-destructive">*</span>
                  </Label>
                  <Select value={state} onValueChange={setState} required>
                    <SelectTrigger id="state" className="w-full">
                      <SelectValue placeholder="Select" className="truncate" />
                    </SelectTrigger>
                    <SelectContent position="popper" className="max-h-[300px]">
                      {US_STATES.map((s) => (
                        <SelectItem key={s} value={s} className="cursor-pointer">
                          {s}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-1.5">
                  <Label htmlFor="status" className="text-sm font-medium">
                    Status <span className="text-destructive">*</span>
                  </Label>
                  <Select value={status} onValueChange={setStatus} required>
                    <SelectTrigger id="status" className="w-full">
                      <SelectValue placeholder="Select" className="truncate" />
                    </SelectTrigger>
                    <SelectContent position="popper" className="max-h-[300px]">
                      {STATUSES.map((s) => (
                        <SelectItem key={s} value={s} className="cursor-pointer">
                          {s}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>
          </div>

          <Separator />

          {/* Optional Fields */}
          <div className="space-y-4">
            <h4 className="text-sm font-semibold mb-3">Additional Information</h4>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <Label htmlFor="firstName" className="text-sm">First Name</Label>
                  <Input
                    id="firstName"
                    placeholder="John"
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                  />
                </div>

                <div className="space-y-1.5">
                  <Label htmlFor="lastName" className="text-sm">Last Name</Label>
                  <Input
                    id="lastName"
                    placeholder="Doe"
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="jobTitle" className="text-sm">Job Title</Label>
                <Input
                  id="jobTitle"
                  placeholder="Marketing Director"
                  value={jobTitle}
                  onChange={(e) => setJobTitle(e.target.value)}
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <Label htmlFor="phone" className="text-sm">Phone</Label>
                  <Input
                    id="phone"
                    type="tel"
                    placeholder="(555) 123-4567"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                  />
                </div>

                <div className="space-y-1.5">
                  <Label htmlFor="website" className="text-sm">Website</Label>
                  <Input
                    id="website"
                    type="text"
                    placeholder="example.com"
                    value={website}
                    onChange={(e) => setWebsite(e.target.value)}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <DialogFooter className="gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => {
                handleReset()
                onOpenChange(false)
              }}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting 
                ? (isEditMode ? 'Updating...' : 'Adding...') 
                : (isEditMode ? 'Update Contact' : 'Add Contact')
              }
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}

