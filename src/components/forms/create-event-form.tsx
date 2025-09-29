'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Calendar, MapPin, Users, Ticket, DollarSign, X } from 'lucide-react'
import { createEvent } from '@/lib/api/events'

interface CreateEventFormProps {
  onSuccess?: () => void
  onCancel?: () => void
}

export function CreateEventForm({ onSuccess, onCancel }: CreateEventFormProps) {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: '',
    date: '',
    time: '',
    venue: '',
    address: '',
    capacity: '',
    price: '',
    image_url: ''
  })
  
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const categories = [
    'Music',
    'Sports', 
    'Technology',
    'Business',
    'Art',
    'Food & Drink',
    'Education',
    'Health & Wellness',
    'Other'
  ]

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))
    setError('')
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    // Validation
    if (!formData.title || !formData.category || !formData.date || !formData.venue || !formData.price) {
      setError('Please fill in all required fields')
      return
    }

    setLoading(true)
    setError('')

    try {
      await createEvent({
        title: formData.title,
        description: formData.description,
        category: formData.category,
        date: formData.date,
        time: formData.time,
        venue: formData.venue,
        address: formData.address,
        capacity: parseInt(formData.capacity) || 0,
        price: parseFloat(formData.price),
        image_url: formData.image_url || `https://picsum.photos/seed/${formData.title.replace(/\s+/g, '')}/400/200.jpg`
      })

      // Reset form
      setFormData({
        title: '',
        description: '',
        category: '',
        date: '',
        time: '',
        venue: '',
        address: '',
        capacity: '',
        price: '',
        image_url: ''
      })

      onSuccess?.()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create event')
    } finally {
      setLoading(false)
    }
  }

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center space-x-2">
            <Calendar className="h-5 w-5" />
            <span>Create New Event</span>
          </CardTitle>
          {onCancel && (
            <Button variant="ghost" size="sm" onClick={onCancel}>
              <X className="h-4 w-4" />
            </Button>
          )}
        </div>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          {error && (
            <div className="p-3 text-sm text-red-600 bg-red-50 border border-red-200 rounded-md">
              {error}
            </div>
          )}

          {/* Basic Information */}
          <div className="space-y-4">
            <div>
              <Label htmlFor="title" className="flex items-center space-x-2">
                <Calendar className="h-4 w-4" />
                <span>Event Title *</span>
              </Label>
              <Input
                id="title"
                value={formData.title}
                onChange={(e) => handleInputChange('title', e.target.value)}
                placeholder="Enter event title"
                required
              />
            </div>

            <div>
              <Label htmlFor="category">Category *</Label>
              <Select value={formData.category} onValueChange={(value) => handleInputChange('category', value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map(category => (
                    <SelectItem key={category} value={category}>{category}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => handleInputChange('description', e.target.value)}
                placeholder="Describe your event"
                rows={3}
              />
            </div>
          </div>

          {/* Date & Time */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="date">Date *</Label>
              <Input
                id="date"
                type="date"
                value={formData.date}
                onChange={(e) => handleInputChange('date', e.target.value)}
                required
              />
            </div>
            <div>
              <Label htmlFor="time">Time</Label>
              <Input
                id="time"
                type="time"
                value={formData.time}
                onChange={(e) => handleInputChange('time', e.target.value)}
              />
            </div>
          </div>

          {/* Venue Information */}
          <div className="space-y-4">
            <div>
              <Label htmlFor="venue" className="flex items-center space-x-2">
                <MapPin className="h-4 w-4" />
                <span>Venue *</span>
              </Label>
              <Input
                id="venue"
                value={formData.venue}
                onChange={(e) => handleInputChange('venue', e.target.value)}
                placeholder="Enter venue name"
                required
              />
            </div>

            <div>
              <Label htmlFor="address">Address</Label>
              <Input
                id="address"
                value={formData.address}
                onChange={(e) => handleInputChange('address', e.target.value)}
                placeholder="Enter venue address"
              />
            </div>
          </div>

          {/* Capacity & Pricing */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="capacity" className="flex items-center space-x-2">
                <Users className="h-4 w-4" />
                <span>Capacity</span>
              </Label>
              <Input
                id="capacity"
                type="number"
                value={formData.capacity}
                onChange={(e) => handleInputChange('capacity', e.target.value)}
                placeholder="Maximum attendees"
                min="1"
              />
            </div>
            <div>
              <Label htmlFor="price" className="flex items-center space-x-2">
                <DollarSign className="h-4 w-4" />
                <span>Ticket Price ($) *</span>
              </Label>
              <Input
                id="price"
                type="number"
                value={formData.price}
                onChange={(e) => handleInputChange('price', e.target.value)}
                placeholder="0.00"
                step="0.01"
                min="0"
                required
              />
            </div>
          </div>

          {/* Image URL */}
          <div>
            <Label htmlFor="image_url" className="flex items-center space-x-2">
              <Ticket className="h-4 w-4" />
              <span>Image URL (optional)</span>
            </Label>
            <Input
              id="image_url"
              value={formData.image_url}
              onChange={(e) => handleInputChange('image_url', e.target.value)}
              placeholder="https://example.com/image.jpg"
            />
          </div>

          {/* Actions */}
          <div className="flex justify-end space-x-3 pt-4">
            {onCancel && (
              <Button type="button" variant="outline" onClick={onCancel}>
                Cancel
              </Button>
            )}
            <Button type="submit" disabled={loading}>
              {loading ? 'Creating Event...' : 'Create Event'}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}