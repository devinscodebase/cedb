'use client'

import * as React from 'react'
import { useRouter } from 'next/navigation'
import Papa from 'papaparse'
import { Upload, X, FileText, AlertCircle } from 'lucide-react'

import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { storeCsvFile } from '@/lib/csv-storage'

interface CSVUploadDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function CSVUploadDialog({ open, onOpenChange }: CSVUploadDialogProps) {
  const router = useRouter()
  const [file, setFile] = React.useState<File | null>(null)
  const [isDragging, setIsDragging] = React.useState(false)
  const [error, setError] = React.useState<string | null>(null)
  const [isProcessing, setIsProcessing] = React.useState(false)
  const fileInputRef = React.useRef<HTMLInputElement>(null)

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(true)
  }

  const handleDragLeave = () => {
    setIsDragging(false)
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
    
    const droppedFile = e.dataTransfer.files[0]
    if (droppedFile) {
      handleFileSelect(droppedFile)
    }
  }

  const handleFileSelect = (selectedFile: File) => {
    setError(null)

    // Validate file type
    if (!selectedFile.name.endsWith('.csv')) {
      setError('Please upload a CSV file')
      return
    }

    // Validate file size (100MB limit - IndexedDB can handle much larger files)
    const maxSize = 100 * 1024 * 1024 // 100MB
    if (selectedFile.size > maxSize) {
      setError(`File size must be less than ${(maxSize / 1024 / 1024).toFixed(0)}MB. Current size: ${(selectedFile.size / 1024 / 1024).toFixed(2)}MB`)
      return
    }

    setFile(selectedFile)
  }

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0]
    if (selectedFile) {
      handleFileSelect(selectedFile)
    }
  }

  const handleReset = () => {
    setFile(null)
    setError(null)
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }

  const handleContinue = async () => {
    if (!file) return

    setIsProcessing(true)
    setError(null)

    // Quick validation parse - just read first few rows
    Papa.parse(file, {
      preview: 10, // Only parse first 10 rows for validation
      complete: (results) => {
        if (results.errors.length > 0) {
          setError('Error parsing CSV file')
          setIsProcessing(false)
          return
        }

        const data = results.data as string[][]
        if (data.length === 0) {
          setError('CSV file is empty')
          setIsProcessing(false)
          return
        }

        // Store file in IndexedDB (supports much larger files than sessionStorage)
        storeCsvFile(file)
          .then(() => {
            // Close dialog and navigate to upload page
            onOpenChange(false)
            handleReset()
            router.push('/upload')
          })
          .catch((e) => {
            const errorMsg = e instanceof Error ? e.message : 'Unknown error'
            if (errorMsg.includes('quota') || errorMsg.includes('QuotaExceededError')) {
              setError(`Storage quota exceeded. Try a smaller CSV file or clear your browser data.`)
            } else {
              setError(`Failed to store file: ${errorMsg}`)
            }
            setIsProcessing(false)
          })
      },
      error: () => {
        setError('Failed to parse CSV file')
        setIsProcessing(false)
      },
    })
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>Import Contacts from CSV</DialogTitle>
          <DialogDescription>
            Upload a CSV file to import your contacts
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          {/* File Upload Area */}
          {!file ? (
            <div
              className={`relative border-2 border-dashed rounded-lg p-12 text-center transition-colors ${
                isDragging
                  ? 'border-primary bg-primary/5'
                  : 'border-muted-foreground/25 hover:border-muted-foreground/50'
              }`}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
            >
              <input
                ref={fileInputRef}
                type="file"
                accept=".csv"
                className="hidden"
                onChange={handleFileInputChange}
              />
              <Upload className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
              <h3 className="text-lg font-semibold mb-2">
                Drop your CSV file here
              </h3>
              <p className="text-sm text-muted-foreground mb-4">
                or click to browse (max 100MB)
              </p>
              <Button
                type="button"
                variant="outline"
                onClick={() => fileInputRef.current?.click()}
              >
                Select File
              </Button>
            </div>
          ) : (
            /* Selected File Info */
            <div className="flex items-center justify-between p-4 border rounded-lg bg-muted/50">
              <div className="flex items-center gap-3">
                <FileText className="h-8 w-8 text-primary" />
                <div>
                  <p className="font-medium">{file.name}</p>
                  <p className="text-sm text-muted-foreground">
                    {(file.size / 1024).toFixed(2)} KB
                  </p>
                </div>
              </div>
              <Button
                variant="ghost"
                size="icon"
                onClick={handleReset}
                disabled={isProcessing}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          )}

          {/* Error Message */}
          {error && (
            <div className="flex items-center gap-2 p-4 border border-destructive rounded-lg bg-destructive/10 text-destructive">
              <AlertCircle className="h-4 w-4 shrink-0" />
              <p className="text-sm">{error}</p>
            </div>
          )}
        </div>

        <DialogFooter>
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={isProcessing}
          >
            Cancel
          </Button>
          <Button
            onClick={handleContinue}
            disabled={!file || isProcessing}
          >
            {isProcessing ? "Let's goo!!" : 'Map Fields'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}


