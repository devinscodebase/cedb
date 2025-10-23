'use client'

import { useState } from 'react'
import { Separator } from '@/components/ui/separator'
import { Button } from '@/components/ui/button'
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip'
import { CSVUploadDialog } from '@/components/dashboard/csv-upload-dialog'
import { AddContactSheet } from '@/components/dashboard/add-contact-sheet' // Dialog component
import { Database, Upload, Plus, PanelLeftClose, PanelLeft } from 'lucide-react'
import Link from 'next/link'

/**
 * Dashboard Layout
 * 
 * Main layout for the dashboard with sidebar navigation and header
 */
export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const [isCollapsed, setIsCollapsed] = useState(false)
  const [isImportDialogOpen, setIsImportDialogOpen] = useState(false)
  const [isAddContactOpen, setIsAddContactOpen] = useState(false)

  return (
    <TooltipProvider>
      <div className="flex min-h-screen">
      {/* Sidebar */}
      <aside className={`${isCollapsed ? 'w-16' : 'w-64'} relative border-r bg-muted/40 transition-all duration-300`}>
        <div className="flex h-full flex-col">
          {/* Logo/Brand */}
          <div className="flex h-16 items-center border-b px-4">
            <Link href="/dashboard" className="flex items-center gap-2 font-semibold">
              <Database className="h-6 w-6 shrink-0" />
              {!isCollapsed && <span>CEDB</span>}
            </Link>
          </div>

          {/* Navigation */}
          <nav className="flex-1 space-y-1 p-4">
            <Link href="/dashboard">
              <Button variant="ghost" className={`w-full ${isCollapsed ? 'justify-center' : 'justify-start'}`}>
                <Database className={`h-4 w-4 shrink-0 ${!isCollapsed && 'mr-2'}`} />
                {!isCollapsed && 'Contacts'}
              </Button>
            </Link>
          </nav>

          {/* User Info */}
          {!isCollapsed && (
            <div className="border-t p-4">
              <p className="text-sm text-muted-foreground">
                Revenx Internal Tool
              </p>
            </div>
          )}
        </div>

        {/* Collapse/Expand Toggle Button - At border intersection */}
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="outline"
              size="icon"
              className="absolute -right-3 top-13 z-20 h-6 w-6 rounded-full border-2 bg-background shadow-md hover:shadow-lg transition-all"
              onClick={() => setIsCollapsed(!isCollapsed)}
            >
              {isCollapsed ? (
                <PanelLeft className="h-3 w-3" />
              ) : (
                <PanelLeftClose className="h-3 w-3" />
              )}
            </Button>
          </TooltipTrigger>
          <TooltipContent side="right">
            <p>{isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}</p>
          </TooltipContent>
        </Tooltip>
      </aside>

      {/* Main Content */}
      <div className="flex flex-1 flex-col">
        {/* Header */}
        <header className="sticky top-0 z-10 flex h-16 items-center gap-4 border-b bg-background px-6">
          <div className="flex flex-1 items-center justify-between">
            <h1 className="text-xl font-semibold">Cold Email Database</h1>
            
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setIsImportDialogOpen(true)}
              >
                <Upload className="mr-2 h-4 w-4" />
                Import CSV
              </Button>
              <Button size="sm" onClick={() => setIsAddContactOpen(true)}>
                <Plus className="mr-2 h-4 w-4" />
                Add Contact
              </Button>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 p-6">
          {children}
        </main>
      </div>
    </div>

    {/* CSV Upload Dialog */}
    <CSVUploadDialog
      open={isImportDialogOpen}
      onOpenChange={setIsImportDialogOpen}
    />

    {/* Add Contact Sheet */}
    <AddContactSheet
      open={isAddContactOpen}
      onOpenChange={setIsAddContactOpen}
    />
    </TooltipProvider>
  )
}

