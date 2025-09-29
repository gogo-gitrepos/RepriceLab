'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
// Simple Textarea component
const Textarea = ({ className, ...props }: React.TextareaHTMLAttributes<HTMLTextAreaElement>) => (
  <textarea className={`w-full px-3 py-2 border rounded-md bg-background ${className || ''}`} {...props} />
);
import { Building2, MapPin, Phone, Globe, Users } from 'lucide-react';

export default function CompanySettingsPage() {
  const [companyInfo, setCompanyInfo] = useState({
    name: 'Your Company Name',
    address: '123 Business St, City, State 12345',
    phone: '+1 (555) 123-4567',
    website: 'https://yourcompany.com',
    description: 'Your company description...',
    taxId: 'TAX123456789',
    employees: '10-50'
  });

  const handleSave = () => {
    // Save company information
    console.log('Saving company info:', companyInfo);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center space-x-3">
        <Building2 className="w-6 h-6" />
        <h1 className="text-3xl font-bold">Company Settings</h1>
      </div>
      
      {/* Company Information */}
      <Card>
        <CardHeader>
          <CardTitle>Company Information</CardTitle>
          <CardDescription>
            Manage your business information and legal details
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="company-name">Company Name</Label>
              <Input 
                id="company-name"
                value={companyInfo.name}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setCompanyInfo({...companyInfo, name: e.target.value})}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="tax-id">Tax ID / EIN</Label>
              <Input 
                id="tax-id"
                value={companyInfo.taxId}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setCompanyInfo({...companyInfo, taxId: e.target.value})}
              />
            </div>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="address">Business Address</Label>
            <Textarea 
              id="address"
              value={companyInfo.address}
              onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setCompanyInfo({...companyInfo, address: e.target.value})}
              rows={3}
            />
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="phone">Phone Number</Label>
              <Input 
                id="phone"
                type="tel"
                value={companyInfo.phone}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setCompanyInfo({...companyInfo, phone: e.target.value})}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="website">Website</Label>
              <Input 
                id="website"
                type="url"
                value={companyInfo.website}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setCompanyInfo({...companyInfo, website: e.target.value})}
              />
            </div>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="description">Company Description</Label>
            <Textarea 
              id="description"
              value={companyInfo.description}
              onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setCompanyInfo({...companyInfo, description: e.target.value})}
              rows={4}
              placeholder="Describe your business..."
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="employees">Number of Employees</Label>
            <select 
              id="employees"
              value={companyInfo.employees}
              onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setCompanyInfo({...companyInfo, employees: e.target.value})}
              className="w-full px-3 py-2 border rounded-md bg-background"
            >
              <option value="1">Just me</option>
              <option value="2-5">2-5 employees</option>
              <option value="6-10">6-10 employees</option>
              <option value="10-50">10-50 employees</option>
              <option value="50-200">50-200 employees</option>
              <option value="200+">200+ employees</option>
            </select>
          </div>
          
          <div className="flex justify-end">
            <Button onClick={handleSave}>Save Changes</Button>
          </div>
        </CardContent>
      </Card>

      {/* Business Preferences */}
      <Card>
        <CardHeader>
          <CardTitle>Business Preferences</CardTitle>
          <CardDescription>Configure your business operating preferences</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="timezone">Timezone</Label>
              <select 
                id="timezone"
                className="w-full px-3 py-2 border rounded-md bg-background"
              >
                <option value="UTC-8">Pacific Time (UTC-8)</option>
                <option value="UTC-5">Eastern Time (UTC-5)</option>
                <option value="UTC">UTC</option>
                <option value="UTC+1">Central European Time (UTC+1)</option>
              </select>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="currency">Default Currency</Label>
              <select 
                id="currency"
                className="w-full px-3 py-2 border rounded-md bg-background"
              >
                <option value="USD">USD - US Dollar</option>
                <option value="EUR">EUR - Euro</option>
                <option value="GBP">GBP - British Pound</option>
                <option value="CAD">CAD - Canadian Dollar</option>
              </select>
            </div>
          </div>
          
          <div className="flex items-center justify-between">
            <div>
              <div className="font-medium">Fiscal Year Start</div>
              <p className="text-sm text-muted-foreground">When does your fiscal year begin?</p>
            </div>
            <select className="px-3 py-2 border rounded-md bg-background">
              <option value="january">January</option>
              <option value="april">April</option>
              <option value="july">July</option>
              <option value="october">October</option>
            </select>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}