"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription } from "@/components/ui/alert"
import {
  ExternalLink,
  Key,
  TestTube,
  CheckCircle,
  XCircle,
  AlertTriangle,
  Copy,
  ArrowLeft,
  MessageSquare,
  Bug,
} from "lucide-react"
import Link from "next/link"

export default function AdminPage() {
  const [apiKey, setApiKey] = useState("")
  const [testResult, setTestResult] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(false)

  const testApiKey = async () => {
    if (!apiKey.trim()) {
      setTestResult({ success: false, error: "Please enter an API key" })
      return
    }

    setIsLoading(true)
    try {
      const response = await fetch("/api/test-gemini", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ apiKey: apiKey.trim() }),
      })

      const result = await response.json()
      setTestResult(result)
    } catch (error) {
      setTestResult({ success: false, error: "Network error" })
    } finally {
      setIsLoading(false)
    }
  }

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text)
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center mb-8">
          <Link href="/">
            <Button variant="ghost" className="mr-4">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Home
            </Button>
          </Link>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
            <p className="text-gray-600">Configure your application settings</p>
          </div>
        </div>

        {/* Admin Navigation Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Link href="/admin/telegram-setup">
            <Card className="hover:shadow-md transition-shadow cursor-pointer h-full">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MessageSquare className="w-5 h-5 text-blue-500" />
                  Telegram Bot Setup
                </CardTitle>
                <CardDescription>Configure Telegram notifications for bookings</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-600">
                  Set up your Telegram bot to receive booking notifications and payment screenshots.
                </p>
              </CardContent>
            </Card>
          </Link>

          <Link href="/debug-telegram">
            <Card className="hover:shadow-md transition-shadow cursor-pointer h-full">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Bug className="w-5 h-5 text-orange-500" />
                  Debug Telegram
                </CardTitle>
                <CardDescription>Troubleshoot Telegram bot issues</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-600">
                  Run diagnostic tests to identify and fix Telegram configuration problems.
                </p>
              </CardContent>
            </Card>
          </Link>

          <Link href="/trip">
            <Card className="hover:shadow-md transition-shadow cursor-pointer h-full">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <ExternalLink className="w-5 h-5 text-green-500" />
                  View Booking System
                </CardTitle>
                <CardDescription>See the booking interface as users will see it</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-600">
                  Preview the trip booking system and test the complete booking flow.
                </p>
              </CardContent>
            </Card>
          </Link>
        </div>

        <div className="grid gap-6">
          {/* Step 1: Get API Key */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Key className="w-5 h-5" />
                Step 1: Get Your Gemini API Key
              </CardTitle>
              <CardDescription>Create a free API key from Google AI Studio</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                <h4 className="font-semibold text-blue-800 mb-2">Free Tier Limits:</h4>
                <ul className="text-blue-700 text-sm space-y-1">
                  <li>• 15 requests per minute</li>
                  <li>• 1 million tokens per minute</li>
                  <li>• 1,500 requests per day</li>
                </ul>
              </div>

              <div className="bg-gray-50 p-4 rounded-lg">
                <h4 className="font-semibold mb-2">Instructions:</h4>
                <ol className="list-decimal list-inside space-y-2 text-sm">
                  <li>
                    Visit{" "}
                    <a
                      href="https://aistudio.google.com/app/apikey"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:underline inline-flex items-center gap-1"
                    >
                      Google AI Studio <ExternalLink className="w-3 h-3" />
                    </a>
                  </li>
                  <li>Sign in with your Google account</li>
                  <li>Click "Create API Key"</li>
                  <li>Select "Create API key in new project" or choose existing project</li>
                  <li>Copy the generated API key</li>
                </ol>
              </div>

              <Alert className="border-yellow-200 bg-yellow-50">
                <AlertTriangle className="w-4 h-4 text-yellow-600" />
                <AlertDescription className="text-yellow-800">
                  <strong>Important:</strong> Keep your API key secure and never share it publicly. The API key gives
                  access to your Google AI services.
                </AlertDescription>
              </Alert>
            </CardContent>
          </Card>

          {/* Step 2: Test API Key */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TestTube className="w-5 h-5" />
                Step 2: Test Your API Key
              </CardTitle>
              <CardDescription>Verify your API key works before adding to environment variables</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="apiKey">Paste your Gemini API Key here:</Label>
                <Input
                  id="apiKey"
                  type="password"
                  placeholder="AIzaSy..."
                  value={apiKey}
                  onChange={(e) => setApiKey(e.target.value)}
                  className="font-mono"
                />
              </div>

              <Button onClick={testApiKey} disabled={isLoading || !apiKey.trim()} className="w-full">
                {isLoading ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Testing API Key...
                  </>
                ) : (
                  <>
                    <TestTube className="w-4 h-4 mr-2" />
                    Test API Key
                  </>
                )}
              </Button>

              {testResult && (
                <Alert className={testResult.success ? "border-green-200 bg-green-50" : "border-red-200 bg-red-50"}>
                  <div className="flex items-center gap-2">
                    {testResult.success ? (
                      <CheckCircle className="w-4 h-4 text-green-600" />
                    ) : (
                      <XCircle className="w-4 h-4 text-red-600" />
                    )}
                    <AlertDescription>
                      {testResult.success ? (
                        <div>
                          <p className="font-semibold text-green-800">✅ API Key is Valid!</p>
                          <p className="text-green-700 text-sm">Model: {testResult.model}</p>
                          <p className="text-green-700 text-sm">You can now add this to your environment variables.</p>
                        </div>
                      ) : (
                        <div>
                          <p className="font-semibold text-red-800">❌ API Key Invalid</p>
                          <p className="text-red-700 text-sm">{testResult.error}</p>
                        </div>
                      )}
                    </AlertDescription>
                  </div>
                </Alert>
              )}
            </CardContent>
          </Card>

          {/* Step 3: Add to Environment */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Key className="w-5 h-5" />
                Step 3: Add to Environment Variables
              </CardTitle>
              <CardDescription>Configure your API key in the application</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="bg-gray-50 p-4 rounded-lg">
                <div className="flex justify-between items-center mb-2">
                  <h4 className="font-semibold">Add to your .env.local file:</h4>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => copyToClipboard(`GOOGLE_GEMINI_API_KEY=${apiKey || "your_api_key_here"}`)}
                  >
                    <Copy className="w-4 h-4 mr-1" />
                    Copy
                  </Button>
                </div>
                <pre className="bg-gray-800 text-green-400 p-3 rounded text-sm overflow-x-auto">
                  GOOGLE_GEMINI_API_KEY={apiKey || "your_api_key_here"}
                </pre>
              </div>

              <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                <h4 className="font-semibold text-blue-800 mb-2">For Vercel Deployment:</h4>
                <ol className="text-blue-700 text-sm space-y-1">
                  <li>1. Go to your Vercel project dashboard</li>
                  <li>2. Navigate to Settings → Environment Variables</li>
                  <li>
                    3. Add: Name: <code>GOOGLE_GEMINI_API_KEY</code>, Value: your API key
                  </li>
                  <li>4. Redeploy your application</li>
                </ol>
              </div>

              <Alert className="border-green-200 bg-green-50">
                <CheckCircle className="w-4 h-4 text-green-600" />
                <AlertDescription className="text-green-800">
                  <strong>After adding:</strong> Restart your development server with <code>npm run dev</code>
                </AlertDescription>
              </Alert>
            </CardContent>
          </Card>
        </div>

        <div className="mt-8 text-center">
          <Link href="/planner">
            <Button className="bg-blue-600 hover:bg-blue-700">
              Go to Travel Planner
              <ExternalLink className="w-4 h-4 ml-2" />
            </Button>
          </Link>
        </div>
      </div>
    </div>
  )
}
