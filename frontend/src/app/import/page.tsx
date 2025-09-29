'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Upload, FileText, Download, CheckCircle, AlertCircle, Info } from 'lucide-react';

export default function ImportPage() {
  const [dragActive, setDragActive] = useState(false);
  const [uploadedFile, setUploadedFile] = useState<string | null>(null);

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      setUploadedFile(e.dataTransfer.files[0].name);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setUploadedFile(e.target.files[0].name);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center space-x-3">
        <Upload className="w-6 h-6" />
        <h1 className="text-3xl font-bold">Import</h1>
      </div>
      
      {/* Import Options */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card>
          <CardContent className="p-6 text-center">
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mx-auto mb-4">
              <FileText className="w-6 h-6 text-blue-600" />
            </div>
            <h3 className="font-medium mb-2">CSV Import</h3>
            <p className="text-sm text-muted-foreground">Upload product data via CSV file</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6 text-center">
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mx-auto mb-4">
              <Upload className="w-6 h-6 text-green-600" />
            </div>
            <h3 className="font-medium mb-2">Amazon Sync</h3>
            <p className="text-sm text-muted-foreground">Import directly from Amazon Seller Central</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6 text-center">
            <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mx-auto mb-4">
              <Download className="w-6 h-6 text-purple-600" />
            </div>
            <h3 className="font-medium mb-2">Template</h3>
            <p className="text-sm text-muted-foreground">Download CSV template</p>
          </CardContent>
        </Card>
      </div>

      {/* File Upload Area */}
      <Card>
        <CardHeader>
          <CardTitle>Upload Product Data</CardTitle>
          <CardDescription>
            Import your product catalog, pricing rules, and inventory data from CSV files
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div
            className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
              dragActive 
                ? 'border-blue-500 bg-blue-50' 
                : 'border-gray-300 hover:border-gray-400'
            }`}
            onDragEnter={handleDrag}
            onDragLeave={handleDrag}
            onDragOver={handleDrag}
            onDrop={handleDrop}
          >
            <Upload className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <div className="space-y-2">
              <p className="text-lg font-medium">Drop your CSV file here</p>
              <p className="text-sm text-muted-foreground">or click to browse files</p>
            </div>
            <input
              type="file"
              accept=".csv"
              onChange={handleFileChange}
              className="hidden"
              id="file-upload"
            />
            <Label htmlFor="file-upload">
              <Button variant="outline" className="mt-4" asChild>
                <span>Choose File</span>
              </Button>
            </Label>
          </div>

          {uploadedFile && (
            <div className="flex items-center justify-between p-4 bg-green-50 border border-green-200 rounded-lg">
              <div className="flex items-center space-x-3">
                <CheckCircle className="w-5 h-5 text-green-600" />
                <div>
                  <p className="font-medium text-green-900">File uploaded successfully</p>
                  <p className="text-sm text-green-700">{uploadedFile}</p>
                </div>
              </div>
              <Button size="sm">Process Import</Button>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Import History */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Imports</CardTitle>
          <CardDescription>Track your import history and status</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="flex items-center justify-between p-3 border rounded-lg">
              <div className="flex items-center space-x-3">
                <CheckCircle className="w-5 h-5 text-green-600" />
                <div>
                  <p className="font-medium">products_batch_1.csv</p>
                  <p className="text-sm text-muted-foreground">147 products imported • 2 hours ago</p>
                </div>
              </div>
              <Button variant="outline" size="sm">View Details</Button>
            </div>
            
            <div className="flex items-center justify-between p-3 border rounded-lg">
              <div className="flex items-center space-x-3">
                <AlertCircle className="w-5 h-5 text-orange-600" />
                <div>
                  <p className="font-medium">pricing_rules.csv</p>
                  <p className="text-sm text-muted-foreground">23 rules imported, 3 errors • 1 day ago</p>
                </div>
              </div>
              <Button variant="outline" size="sm">View Errors</Button>
            </div>
            
            <div className="flex items-center justify-between p-3 border rounded-lg">
              <div className="flex items-center space-x-3">
                <CheckCircle className="w-5 h-5 text-green-600" />
                <div>
                  <p className="font-medium">inventory_update.csv</p>
                  <p className="text-sm text-muted-foreground">89 products updated • 3 days ago</p>
                </div>
              </div>
              <Button variant="outline" size="sm">View Details</Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Help Section */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Info className="w-5 h-5" />
            Import Guidelines
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <h4 className="font-medium mb-2">Required CSV Format</h4>
              <p className="text-sm text-muted-foreground mb-2">Your CSV file should include the following columns:</p>
              <div className="bg-gray-50 p-3 rounded-lg text-sm font-mono">
                SKU, ASIN, Title, Price, Min_Price, Max_Price, Strategy
              </div>
            </div>
            
            <div>
              <h4 className="font-medium mb-2">File Size Limits</h4>
              <p className="text-sm text-muted-foreground">Maximum file size: 10MB (approximately 50,000 products)</p>
            </div>
            
            <Button variant="outline" className="w-full">
              <Download className="w-4 h-4 mr-2" />
              Download CSV Template
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}