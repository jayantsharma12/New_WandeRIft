"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Badge } from "@/components/ui/badge"
import { RefreshCw, CheckCircle, XCircle, AlertTriangle } from "lucide-react"

export default function DebugPage() {
  const [envVars, setEnvVars] = useState<any>(null)
  const [showTokens, setShowTokens] = useState(false)
  const [testResult, setTestResult] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    // Check environment variables on client side
    checkEnvironment()
  }, [])

  const checkEnvironment = () => {
    // This will show what's available on client side
    const clientEnv = {
      hasToken: typeof window !== "undefined" && !!process.env.NEXT_PUBLIC_TELEGRAM_BOT_TOKEN,
      hasChatId: typeof window !== "undefined" && !!process.env.NEXT_PUBLIC_TELEGRAM_CHAT_ID,
      nodeEnv: process.env.NODE_ENV,
    }
    setEnvVars(clientEnv)
  }

  const testConnection = async () => {
    setIsLoading(true)
    try {
      const response = await fetch("/api/test-telegram")
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
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Debug Telegram Setup</h1>
          <p className="text-gray-600">Diagnose and fix Telegram bot configuration issues</p>
        </div>

        <div className="grid gap-6">
          {/* Environment Variables Check */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <AlertTriangle className="w-5 h-5" />
                Environment Variables
              </CardTitle>
              <CardDescription>Check if your environment variables are properly set</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Alert className="border-yellow-200 bg-yellow-50">
                <AlertTriangle className="w-4 h-4 text-yellow-600" />
                <AlertDescription className="text-yellow-800">
                  <strong>Important:</strong> Environment variables are only available on the server side. The test
                  below will check server-side configuration.
                </AlertDescription>
              </Alert>

              <div className="bg-gray-50 p-4 rounded-lg">
                <h4 className="font-semibold mb-3">Required Environment Variables:</h4>
                <div className="space-y-2 text-sm">
                  <div className="flex items-center justify-between p-2 bg-white rounded border">
                    <span className="font-mono">TELEGRAM_BOT_TOKEN</span>
                    <Badge variant="outline">Server Only</Badge>
                  </div>
                  <div className="flex items-center justify-between p-2 bg-white rounded border">
                    <span className="font-mono">TELEGRAM_CHAT_ID</span>
                    <Badge variant="outline">Server Only</Badge>
                  </div>
                </div>
              </div>

              <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                <h4 className="font-semibold text-blue-800 mb-2">How to set environment variables:</h4>
                <div className="text-blue-700 text-sm space-y-2">
                  <p>
                    <strong>Local development:</strong> Add to <code>.env.local</code> file in your project root
                  </p>
                  <p>
                    <strong>Vercel deployment:</strong> Add in Project Settings → Environment Variables
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Bot Token Format Guide */}
          <Card>
            <CardHeader>
              <CardTitle>Bot Token Format</CardTitle>
              <CardDescription>Your bot token should follow this exact format</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="bg-gray-50 p-4 rounded-lg">
                <h4 className="font-semibold mb-2">Correct Format:</h4>
                <div className="bg-gray-800 text-green-400 p-3 rounded font-mono text-sm">
                  123456789:ABCdefGHIjklMNOpqrsTUVwxyz
                </div>
                <p className="text-sm text-gray-600 mt-2">
                  • Starts with bot ID (numbers)
                  <br />• Followed by a colon (:)
                  <br />• Then 35 characters of letters, numbers, underscores, and hyphens
                </p>
              </div>

              <div className="bg-red-50 p-4 rounded-lg border border-red-200">
                <h4 className="font-semibold text-red-800 mb-2">Common Mistakes:</h4>
                <ul className="text-red-700 text-sm space-y-1">
                  <li>• Missing the colon (:)</li>
                  <li>• Extra spaces at the beginning or end</li>
                  <li>• Using the wrong token (not from BotFather)</li>
                  <li>• Token is expired or revoked</li>
                </ul>
              </div>
            </CardContent>
          </Card>

          {/* Connection Test */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <RefreshCw className="w-5 h-5" />
                Connection Test
              </CardTitle>
              <CardDescription>Test your Telegram bot configuration</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Button onClick={testConnection} disabled={isLoading} className="w-full">
                {isLoading ? (
                  <>
                    <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                    Testing Connection...
                  </>
                ) : (
                  <>
                    <RefreshCw className="w-4 h-4 mr-2" />
                    Test Telegram Connection
                  </>
                )}
              </Button>

              {testResult && (
                <Alert className={testResult.success ? "border-green-200 bg-green-50" : "border-red-200 bg-red-50"}>
                  <div className="flex items-start gap-2">
                    {testResult.success ? (
                      <CheckCircle className="w-5 h-5 text-green-600 mt-0.5" />
                    ) : (
                      <XCircle className="w-5 h-5 text-red-600 mt-0.5" />
                    )}
                    <div className="flex-1">
                      <AlertDescription>
                        {testResult.success ? (
                          <div className="space-y-2">
                            <p className="font-semibold text-green-800">✅ Connection Successful!</p>
                            {testResult.botInfo && (
                              <div className="text-green-700 text-sm">
                                <p>
                                  <strong>Bot Name:</strong> {testResult.botInfo.first_name}
                                </p>
                                <p>
                                  <strong>Username:</strong> @{testResult.botInfo.username}
                                </p>
                                <p>
                                  <strong>Bot ID:</strong> {testResult.botInfo.id}
                                </p>
                              </div>
                            )}
                            <p className="text-green-700 text-sm">Check your Telegram for the test message!</p>
                          </div>
                        ) : (
                          <div className="space-y-2">
                            <p className="font-semibold text-red-800">❌ Connection Failed</p>
                            <p className="text-red-700 text-sm">{testResult.error}</p>
                            {testResult.debugInfo && (
                              <div className="text-red-700 text-xs bg-red-100 p-2 rounded mt-2">
                                <p>
                                  <strong>Debug Info:</strong>
                                </p>
                                <pre>{JSON.stringify(testResult.debugInfo, null, 2)}</pre>
                              </div>
                            )}
                          </div>
                        )}
                      </AlertDescription>
                    </div>
                  </div>
                </Alert>
              )}
            </CardContent>
          </Card>

          {/* Quick Setup */}
          <Card>
            <CardHeader>
              <CardTitle>Quick Setup Steps</CardTitle>
              <CardDescription>Follow these steps if you're getting errors</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h4 className="font-semibold mb-2">1. Create .env.local file in your project root:</h4>
                  <div className="bg-gray-800 text-green-400 p-3 rounded font-mono text-sm">
                    TELEGRAM_BOT_TOKEN=your_actual_bot_token_here
                    <br />
                    TELEGRAM_CHAT_ID=your_actual_chat_id_here
                  </div>
                </div>

                <div className="bg-gray-50 p-4 rounded-lg">
                  <h4 className="font-semibold mb-2">2. Restart your development server:</h4>
                  <div className="bg-gray-800 text-green-400 p-3 rounded font-mono text-sm">npm run dev</div>
                </div>

                <div className="bg-gray-50 p-4 rounded-lg">
                  <h4 className="font-semibold mb-2">3. Test the connection above</h4>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="mt-8 flex gap-4 justify-center">
          <a
            href="/setup"
            className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Setup Guide
          </a>
          <a
            href="/"
            className="inline-flex items-center px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
          >
            Booking Form
          </a>
        </div>
      </div>
    </div>
  )
}
