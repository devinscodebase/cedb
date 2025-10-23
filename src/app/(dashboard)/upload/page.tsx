'use client'

import * as React from 'react'
import { useRouter } from 'next/navigation'
import Papa from 'papaparse'
import { ArrowLeft, CheckCircle2, AlertCircle, FileText } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Badge } from '@/components/ui/badge'
import Link from 'next/link'
import { getCsvFile, deleteCsvFile } from '@/lib/csv-storage'

type ColumnMapping = {
  [csvColumn: string]: string
}

const DB_FIELDS = [
  { value: 'email', label: 'Email *', required: true },
  { value: 'first_name', label: 'First Name' },
  { value: 'last_name', label: 'Last Name' },
  { value: 'company_name', label: 'Company Name' },
  { value: 'industry', label: 'Industry' },
  { value: 'state', label: 'State' },
  { value: 'status', label: 'Status' },
  { value: 'job_title', label: 'Job Title' },
  { value: 'phone', label: 'Phone' },
  { value: 'website', label: 'Website' },
  { value: 'notes', label: 'Notes' },
  { value: 'skip', label: '— Skip Column —' },
]

export default function UploadPage() {
  const router = useRouter()
  const [csvData, setCsvData] = React.useState<string[][]>([])
  const [csvHeaders, setCsvHeaders] = React.useState<string[]>([])
  const [columnMapping, setColumnMapping] = React.useState<ColumnMapping>({})
  const [fileName, setFileName] = React.useState('')
  const [isImporting, setIsImporting] = React.useState(false)

  // Load and parse CSV file from IndexedDB on mount
  React.useEffect(() => {
    getCsvFile()
      .then((result) => {
        if (!result) {
          // No data, redirect back to dashboard
          router.push('/dashboard')
          return
        }

        const { file, fileName: storedFileName } = result
        setFileName(storedFileName)

        // Parse CSV
        Papa.parse(file, {
          complete: (results) => {
            const data = results.data as string[][]
            if (data.length === 0) {
              router.push('/dashboard')
              return
            }

            const headers = data[0]
            const rows = data.slice(1)

            setCsvHeaders(headers)
            setCsvData(rows)
            
            // Auto-map columns
            const autoMapping: ColumnMapping = {}
            headers.forEach((header: string) => {
              const lowerHeader = header.toLowerCase().trim()
              if (lowerHeader.includes('email')) autoMapping[header] = 'email'
              else if (lowerHeader.includes('first') && lowerHeader.includes('name')) autoMapping[header] = 'first_name'
              else if (lowerHeader.includes('last') && lowerHeader.includes('name')) autoMapping[header] = 'last_name'
              else if (lowerHeader.includes('company')) autoMapping[header] = 'company_name'
              else if (lowerHeader.includes('industry')) autoMapping[header] = 'industry'
              else if (lowerHeader.includes('state')) autoMapping[header] = 'state'
              else if (lowerHeader.includes('status')) autoMapping[header] = 'status'
              else if (lowerHeader.includes('job') || lowerHeader.includes('title')) autoMapping[header] = 'job_title'
              else if (lowerHeader.includes('phone')) autoMapping[header] = 'phone'
              else if (lowerHeader.includes('website')) autoMapping[header] = 'website'
              else if (lowerHeader.includes('note')) autoMapping[header] = 'notes'
              else autoMapping[header] = 'skip'
            })
            
            setColumnMapping(autoMapping)
          },
          error: () => {
            router.push('/dashboard')
          }
        })
      })
      .catch(() => {
        router.push('/dashboard')
      })
  }, [router])

  const handleImport = async () => {
    setIsImporting(true)
    
    // TODO: Implement actual import logic with Supabase
    // This would involve:
    // 1. Using csvData and columnMapping
    // 2. Validating data
    // 3. Inserting into Supabase
    // 4. Handling duplicates
    // 5. Showing progress
    
    // Simulate import
    await new Promise((resolve) => setTimeout(resolve, 2000))
    
    // Clear IndexedDB
    await deleteCsvFile()
    
    setIsImporting(false)
    
    // TODO: Show success toast
    console.log('Import complete!', {
      totalRows: csvData.length,
      mapping: columnMapping
    })
    
    // Redirect to dashboard
    router.push('/dashboard')
  }

  const handleCancel = async () => {
    await deleteCsvFile()
    router.push('/dashboard')
  }

  const isValidMapping = React.useMemo(() => {
    return Object.values(columnMapping).includes('email')
  }, [columnMapping])

  if (csvHeaders.length === 0) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <p className="text-muted-foreground">Loading...</p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link href="/dashboard">
            <Button variant="ghost" size="icon">
              <ArrowLeft className="h-4 w-4" />
            </Button>
          </Link>
          <div>
            <h2 className="text-3xl font-bold tracking-tight">Map CSV Columns</h2>
            <p className="text-muted-foreground">
              Map your CSV columns to database fields
            </p>
          </div>
        </div>
        {isValidMapping ? (
          <Badge variant="default" className="bg-green-500">
            <CheckCircle2 className="h-3 w-3 mr-1" />
            Ready to import
          </Badge>
        ) : (
          <Badge variant="destructive">
            <AlertCircle className="h-3 w-3 mr-1" />
            Email field required
          </Badge>
        )}
      </div>

      {/* File Info */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-3">
            <FileText className="h-5 w-5 text-primary" />
            <div>
              <CardTitle className="text-base">{fileName}</CardTitle>
              <CardDescription>
                {csvData.length + 1} total rows • {csvData.length} data rows
              </CardDescription>
            </div>
          </div>
        </CardHeader>
      </Card>

      {/* Column Mapping */}
      <Card>
        <CardHeader>
          <CardTitle>Column Mapping</CardTitle>
          <CardDescription>
            Map each CSV column to a database field. Email is required.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4">
            {csvHeaders.map((header, index) => (
              <div key={index} className="grid md:grid-cols-[300px_1fr] gap-4 items-center">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium text-muted-foreground">
                    CSV Column:
                  </span>
                  <span className="text-sm font-mono bg-muted px-3 py-1.5 rounded">
                    {header}
                  </span>
                </div>
                <Select
                  value={columnMapping[header] || 'skip'}
                  onValueChange={(value) => {
                    setColumnMapping((prev) => ({
                      ...prev,
                      [header]: value,
                    }))
                  }}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {DB_FIELDS.map((field) => (
                      <SelectItem key={field.value} value={field.value}>
                        {field.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Preview */}
      <Card>
        <CardHeader>
          <CardTitle>Data Preview</CardTitle>
          <CardDescription>
            First 5 rows of your CSV file
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="border rounded-lg overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-muted">
                  <tr>
                    {csvHeaders.map((header, index) => (
                      <th
                        key={index}
                        className="px-4 py-3 text-left font-medium whitespace-nowrap"
                      >
                        {header}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {csvData.slice(0, 5).map((row, rowIndex) => (
                    <tr key={rowIndex} className="border-t">
                      {row.map((cell, cellIndex) => (
                        <td
                          key={cellIndex}
                          className="px-4 py-3 text-muted-foreground whitespace-nowrap"
                        >
                          {cell || '—'}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Actions */}
      <div className="flex items-center justify-end gap-4">
        <Button variant="outline" onClick={handleCancel} disabled={isImporting}>
          Cancel
        </Button>
        <Button
          onClick={handleImport}
          disabled={!isValidMapping || isImporting}
          size="lg"
        >
          {isImporting ? 'Importing...' : `Import ${csvData.length} Contacts`}
        </Button>
      </div>
    </div>
  )
}

