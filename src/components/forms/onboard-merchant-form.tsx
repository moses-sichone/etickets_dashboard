'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Store, Phone, Mail, User, Building, X, FileText } from 'lucide-react'
import { createMerchant } from '@/lib/api/merchants'

interface OnboardMerchantFormProps {
  onSuccess?: () => void
  onCancel?: () => void
}

export function OnboardMerchantForm({ onSuccess, onCancel }: OnboardMerchantFormProps) {
  const [formData, setFormData] = useState({
    business_name: '',
    contact_person: '',
    contact_email: '',
    contact_phone: '',
    tax_information: '',
    verification_state: 'pending' as 'pending' | 'approved' | 'rejected' | 'suspended'
  })
  
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))
    setError('')
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    // Validation
    if (!formData.business_name || !formData.contact_person || !formData.contact_email) {
      setError('Please fill in all required fields')
      return
    }

    setLoading(true)
    setError('')

    try {
      await createMerchant({
        business_name: formData.business_name,
        contact_person: formData.contact_person,
        contact_email: formData.contact_email,
        contact_phone: formData.contact_phone,
        tax_information: formData.tax_information,
        verification_state: formData.verification_state
      })

      // Reset form
      setFormData({
        business_name: '',
        contact_person: '',
        contact_email: '',
        contact_phone: '',
        tax_information: '',
        verification_state: 'pending'
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
          </div>

          {/* Contact Information */}
          <div className="space-y-4">
            <div>
              <Label htmlFor="contact_person" className="flex items-center space-x-2">
                <User className="h-4 w-4" />
                <span>Contact Person *</span>
              </Label>
              <Input
                id="contact_person"
                value={formData.contact_person}
                onChange={(e) => handleInputChange('contact_person', e.target.value)}
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

          {/* Tax Information */}
          <div>
            <Label htmlFor="tax_information" className="flex items-center space-x-2">
              <FileText className="h-4 w-4" />
              <span>Tax Information</span>
            </Label>
            <Input
              id="tax_information"
              value={formData.tax_information}
              onChange={(e) => handleInputChange('tax_information', e.target.value)}
              placeholder="Tax identification number"
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
              {loading ? 'Onboarding Merchant...' : 'Onboard Merchant'}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}