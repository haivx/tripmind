'use client'

import { Printer } from 'lucide-react'
import { Button } from '@/components/ui/button'

export function ExportPdfButton() {
  return (
    <Button
      variant="outline"
      size="sm"
      className="rounded-full no-print"
      onClick={() => window.print()}
    >
      <Printer className="h-4 w-4 mr-1.5" />
      Export PDF
    </Button>
  )
}
