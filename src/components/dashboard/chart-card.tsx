'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { LucideIcon } from 'lucide-react'

interface ChartCardProps {
  title: string
  description?: string
  icon: LucideIcon
  children: React.ReactNode
}

export function ChartCard({ title, description, icon: Icon, children }: ChartCardProps) {
  return (
    <Card className="col-span-2">
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <Icon className="h-5 w-5" />
          <span>{title}</span>
        </CardTitle>
        {description && (
          <p className="text-sm text-muted-foreground">{description}</p>
        )}
      </CardHeader>
      <CardContent className="pl-2">
        {children}
      </CardContent>
    </Card>
  )
}