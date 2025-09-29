'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Store, MapPin, Phone, Mail, Globe, User, Building, X, FileText } from 'lucide-react'
import { createMerchant } from '@/lib/api/merchants'

interface OnboardMerchantFormProps {
  onSuccess?: () => void
  onCancel?: () => void
}

export function OnboardMerchantForm({ onSuccess, onCancel }: OnboardMerchantFormProps) {
  const [formData, setFormData] = useState({
    business_name: '',
    business_type: '',
    description: '',
    contact_name: '',
    contact_email: '',
    contact_phone: '',
    address: '',
    city: '',
    country: '',
    website: '',
    tax_id: '',
    business_license: ''
  })
  
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const businessTypes = [
    'Event Organizer',
    'Venue Owner', 
    'Ticket Reseller',
    'Promoter',
    'Festival Organizer',
    'Conference Organizer',
    'Sports Organization',
    'Entertainment Company',
    'Other'
  ]

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))
    setError('')
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    // Validation
    if (!formData.business_name || !formData.business_type || !formData.contact_name || !formData.contact_email) {
      setError('Please fill in all required fields')
      return
    }

    setLoading(true)
    setError('')

    try {
      await createMerchant({
        business_name: formData.business_name,
        business_type: formData.business_type,
        description: formData.description,
        contact_name: formData.contact_name,
        contact_email: formData.contact_email,
        contact_phone: formData.contact_phone,
        address: formData.address,
        city: formData.city,
        country: formData.country,
        website: formData.website,
        tax_id: formData.tax_id,
        business_license: formData.business_license,
        status: 'pending' // Default status for new merchants
      })

      // Reset form
      setFormData({
        business_name: '',
        business_type: '',
        description: '',
        contact_name: '',
        contact_email: '',
        contact_phone: '',
        address: '',
        city: '',
        country: '',
        website: '',
        tax_id: '',
        business_license: ''
      })

      onSuccess?.()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to onboard merchant')
    } finally {
      setLoading(false)
    }
  }

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center space-x-2">
            <Store className="h-5 w-5" />
            <span>Onboard New Merchant</span>
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

          {/* Business Information */}
          <div className="space-y-4">
            <div>
              <Label htmlFor="business_name" className="flex items-center space-x-2">
                <Building className="h-4 w-4" />
                <span>Business Name *</span>
              </Label>
              <Input
                id="business_name"
                value={formData.business_name}
                onChange={(e) => handleInputChange('business_name', e.target.value)}
                placeholder="Enter business name"
                required
              />
            </div>

            <div>
              <Label htmlFor="business_type">Business Type *</Label>
              <Select value={formData.business_type} onValueChange={(value) => handleInputChange('business_type', value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select business type" />
                </SelectTrigger>
                <SelectContent>
                  {businessTypes.map(type => (
                    <SelectItem key={type} value={type}>{type}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="description">Business Description</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => handleInputChange('description', e.target.value)}
                placeholder="Describe the business"
                rows={3}
              />
            </div>
          </div>

          {/* Contact Information */}
          <div className="space-y-4">
            <div>
              <Label htmlFor="contact_name" className="flex items-center space-x-2">
                <User className="h-4 w-4" />
                <span>Contact Name *</span>
              </Label>
              <Input
                id="contact_name"
                value={formData.contact_name}
                onChange={(e) => handleInputChange('contact_name', e.target.value)}
                placeholder="Full name of contact person"
                required
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="contact_email" className="flex items-center space-x-2">
                  <Mail className="h-4 w-4" />
                  <span>Email *</span>
                </Label>
                <Input
                  id="contact_email"
                  type="email"
                  value={formData.contact_email}
                  onChange={(e) => handleInputChange('contact_email', e.target.value)}
                  placeholder="contact@business.com"
                  required
                />
              </div>
              <div>
                <Label htmlFor="contact_phone" className="flex items-center space-x-2">
                  <Phone className="h-4 w-4" />
                  <span>Phone</span>
                </Label>
                <Input
                  id="contact_phone"
                  type="tel"
                  value={formData.contact_phone}
                  onChange={(e) => handleInputChange('contact_phone', e.target.value)}
                  placeholder="+1 (555) 123-4567"
                />
              </div>
            </div>
          </div>

          {/* Address Information */}
          <div className="space-y-4">
            <div>
              <Label htmlFor="address" className="flex items-center space-x-2">
                <MapPin className="h-4 w-4" />
                <span>Business Address</span>
              </Label>
              <Input
                id="address"
                value={formData.address}
                onChange={(e) => handleInputChange('address', e.target.value)}
                placeholder="Street address"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="city">City</Label>
                <Input
                  id="city"
                  value={formData.city}
                  onChange={(e) => handleInputChange('city', e.target.value)}
                  placeholder="City"
                />
              </div>
              <div>
                <Label htmlFor="country">Country</Label>
                <Input
                  id="country"
                  value={formData.country}
                  onChange={(e) => handleInputChange('country', e.target.value)}
                  placeholder="Country"
                />
              </div>
            </div>
          </div>

          {/* Online Presence */}
          <div>
            <Label htmlFor="website" className="flex items-center space-x-2">
              <Globe className="h-4 w-4" />
              <span>Website</span>
            </Label>
            <Input
              id="website"
              type="url"
              value={formData.website}
              onChange={(e) => handleInputChange('website', e.target.value)}
              placeholder="https://business.com"
            />
          </div>

          {/* Legal Information */}
          <div className="space-y-4">
            <div>
              <Label htmlFor="tax_id" className="flex items-center space-x-2">
                <FileText className="h-4 w-4" />
                <span>Tax ID / EIN</span>
              </Label>
              <Input
                id="tax_id"
                value={formData.tax_id}
                onChange={(e) => handleInputChange('tax_id', e.target.value)}
                placeholder="Tax identification number"
              />
            </div>

            <div>
              <Label htmlFor="business_license">Business License Number</Label>
              <Input
                id="business_license"
                value={formData.business_license}
                onChange={(e) => handleInputChange('business_license', e.target.value)}
                placeholder="Business license number"
              />
            </div>
          </div>

          {/* Actions */}
          <div className="flex justify-end space-x-3 pt-4">
            {onCancel && (
              <Button type="button" variant="outline" onClick={onCancel}>
                Cancel
              </Button>
            )}
            <Button type="submit" disabled={loading}>
              {loading ? 'Onboarding Merchant...' : 'Onboard Merchant'}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}