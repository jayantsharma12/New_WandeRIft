"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft, RefreshCw, CheckCircle, XCircle, Bug } from "lucide-react"
import Link from "next/link"

export default function DebugTelegramPage() {
  const [debugResult, setDebugResult] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(false)

  const runDebug = async () => {
    setIsLoading(true)
    try {
      const response = await fetch("/api/debug-telegram")
      const result = await response.json()
      setDebugResult(result)
    } catch (error) {
      setDebugResult({ success: false, error: "Network error" })
    } finally {
      setIsLoading(false)
    }
  }

  // Add this new test function after the existing runDebug function
  const testBookingFlow = async () => {
    setIsLoading(true)
    try {
      // Test the actual booking notification function
      const testBookingData = {
        tripId: "TEST-001",
        userName: "Test User",
        userEmail: "test@example.com",
        userPhone: "1234567890",
        numTravelers: "2",
        paymentMethodId: "UPI Test",
        screenshotUrl: "https://example.com/test-screenshot.jpg",
        submittedAt: new Date().toLocaleString("en-IN", {
          timeZone: "Asia/Kolkata",
          dateStyle: "full",
          timeStyle: "short",
        }),
      }

      const response = await fetch("/api/test-booking-notification", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(testBookingData),
      })

      const result = await response.json()
      setDebugResult((prev: any) => ({
        ...prev,
        bookingTest: result,
      }))
    } catch (error) {
      setDebugResult((prev: any) => ({
        ...prev,
        bookingTest: { success: false, error: "Network error" },
      }))
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    runDebug()
  }, [])

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center mb-8">
          <Link href="/admin">
            <Button variant="ghost" className="mr-4">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Admin
            </Button>
          </Link>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Telegram Debug Tool</h1>
            <p className="text-gray-600">Diagnose Telegram bot issues step by step</p>
          </div>
        </div>

        <div className="grid gap-6">
          {/* Debug Test */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Bug className="w-5 h-5" />
                Telegram Debug Test
              </CardTitle>
              <CardDescription>Run comprehensive tests on your Telegram configuration</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Button onClick={runDebug} disabled={isLoading} className="w-full">
                {isLoading ? (
                  <>
                    <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                    Running Debug Tests...
                  </>
                ) : (
                  <>
                    <Bug className="w-4 h-4 mr-2" />
                    Run Debug Test
                  </>
                )}
              </Button>

              {/* Add this button after the existing "Run Debug Test" button */}
              <Button
                onClick={testBookingFlow}
                disabled={isLoading}
                className="w-full mt-2 bg-transparent"
                variant="outline"
              >
                {isLoading ? (
                  <>
                    <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                    Testing Booking Notification...
                  </>
                ) : (
                  <>
                    <Bug className="w-4 h-4 mr-2" />
                    Test Booking Notification
                  </>
                )}
              </Button>

              {debugResult && (
                <div className="space-y-4">
                  {/* Overall Status */}
                  <Alert className={debugResult.success ? "border-green-200 bg-green-50" : "border-red-200 bg-red-50"}>
                    <div className="flex items-center gap-2">
                      {debugResult.success ? (
                        <CheckCircle className="w-4 h-4 text-green-600" />
                      ) : (
                        <XCircle className="w-4 h-4 text-red-600" />
                      )}
                      <AlertDescription>
                        {debugResult.success ? (
                          <div>
                            <p className="font-semibold text-green-800">✅ Debug Test Passed!</p>
                            <p className="text-green-700">Check your Telegram for the test message.</p>
                          </div>
                        ) : (
                          <div>
                            <p className="font-semibold text-red-800">❌ Debug Test Failed</p>
                            <p className="text-red-700">{debugResult.error}</p>
                          </div>
                        )}
                      </AlertDescription>
                    </div>
                  </Alert>

                  {/* Debug Details */}
                  {debugResult.debug && (
                    <Card>
                      <CardHeader>
                        <CardTitle className="text-lg">Debug Details</CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        {/* Environment Variables */}
                        <div>
                          <h4 className="font-semibold mb-2">Environment Variables:</h4>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                            <div className="flex items-center justify-between p-2 bg-gray-50 rounded">
                              <span>Bot Token Present</span>
                              <Badge variant={debugResult.debug.hasBotToken ? "default" : "destructive"}>
                                {debugResult.debug.hasBotToken ? "✅ Yes" : "❌ No"}
                              </Badge>
                            </div>
                            <div className="flex items-center justify-between p-2 bg-gray-50 rounded">
                              <span>Chat ID Present</span>
                              <Badge variant={debugResult.debug.hasChatId ? "default" : "destructive"}>
                                {debugResult.debug.hasChatId ? "✅ Yes" : "❌ No"}
                              </Badge>
                            </div>
                            <div className="flex items-center justify-between p-2 bg-gray-50 rounded">
                              <span>Bot Token Format</span>
                              <Badge variant={debugResult.debug.botTokenFormat ? "default" : "destructive"}>
                                {debugResult.debug.botTokenFormat ? "✅ Valid" : "❌ Invalid"}
                              </Badge>
                            </div>
                            <div className="flex items-center justify-between p-2 bg-gray-50 rounded">
                              <span>Chat ID Format</span>
                              <Badge variant={debugResult.debug.chatIdFormat ? "default" : "destructive"}>
                                {debugResult.debug.chatIdFormat ? "✅ Valid" : "❌ Invalid"}
                              </Badge>
                            </div>
                          </div>
                        </div>

                        {/* Current Values */}
                        <div>
                          <h4 className="font-semibold mb-2">Current Values:</h4>
                          <div className="bg-gray-50 p-3 rounded">
                            <p className="text-sm">
                              <strong>Bot Token Length:</strong> {debugResult.debug.botTokenLength} characters
                            </p>
                            <p className="text-sm">
                              <strong>Chat ID:</strong> {debugResult.debug.chatIdValue}
                            </p>
                          </div>
                        </div>

                        {/* Bot Info */}
                        {debugResult.debug.botInfo && (
                          <div>
                            <h4 className="font-semibold mb-2">Bot Information:</h4>
                            <div className="bg-blue-50 p-3 rounded border border-blue-200">
                              <p className="text-sm text-blue-800">
                                <strong>Bot Name:</strong> {debugResult.debug.botInfo.first_name}
                              </p>
                              <p className="text-sm text-blue-800">
                                <strong>Username:</strong> @{debugResult.debug.botInfo.username}
                              </p>
                              <p className="text-sm text-blue-800">
                                <strong>Bot ID:</strong> {debugResult.debug.botInfo.id}
                              </p>
                            </div>
                          </div>
                        )}

                        {/* Message Test Result */}
                        {debugResult.debug.messageResult && (
                          <div>
                            <h4 className="font-semibold mb-2">Message Test Result:</h4>
                            <div className="bg-gray-50 p-3 rounded">
                              <pre className="text-xs overflow-x-auto">
                                {JSON.stringify(debugResult.debug.messageResult, null, 2)}
                              </pre>
                            </div>
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  )}
                </div>
              )}

              {/* Add this section after the existing debug results to show booking test results */}
              {debugResult?.bookingTest && (
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Booking Notification Test</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <Alert
                      className={
                        debugResult.bookingTest.success ? "border-green-200 bg-green-50" : "border-red-200 bg-red-50"
                      }
                    >
                      <div className="flex items-center gap-2">
                        {debugResult.bookingTest.success ? (
                          <CheckCircle className="w-4 h-4 text-green-600" />
                        ) : (
                          <XCircle className="w-4 h-4 text-red-600" />
                        )}
                        <AlertDescription>
                          {debugResult.bookingTest.success ? (
                            <div>
                              <p className="font-semibold text-green-800">✅ Booking Notification Sent!</p>
                              <p className="text-green-700">Check your Telegram for the booking test message.</p>
                            </div>
                          ) : (
                            <div>
                              <p className="font-semibold text-red-800">❌ Booking Notification Failed</p>
                              <p className="text-red-700">{debugResult.bookingTest.error}</p>
                            </div>
                          )}
                        </AlertDescription>
                      </div>
                    </Alert>

                    {debugResult.bookingTest.details && (
                      <div className="mt-4 bg-gray-50 p-3 rounded">
                        <pre className="text-xs overflow-x-auto">
                          {JSON.stringify(debugResult.bookingTest.details, null, 2)}
                        </pre>
                      </div>
                    )}
                  </CardContent>
                </Card>
              )}
            </CardContent>
          </Card>

          {/* Quick Fixes */}
          <Card>
            <CardHeader>
              <CardTitle>Quick Fixes</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="border-l-4 border-blue-500 pl-4">
                  <h4 className="font-semibold text-blue-800">If you're not receiving messages:</h4>
                  <ul className="text-sm text-blue-700 space-y-1">
                    <li>• Make sure you've sent at least one message to your bot first</li>
                    <li>• Check that your chat ID is correct (it should be a number)</li>
                    <li>• Verify your bot token is valid</li>
                    <li>• Try unblocking and restarting your bot in Telegram</li>
                  </ul>
                </div>

                <div className="border-l-4 border-yellow-500 pl-4">
                  <h4 className="font-semibold text-yellow-800">If booking notifications aren't working:</h4>
                  <ul className="text-sm text-yellow-700 space-y-1">
                    <li>• Check that this debug test works first</li>
                    <li>• Make sure your .env.local file is in the project root</li>
                    <li>• Restart your development server after changing environment variables</li>
                    <li>• Check the browser console for any errors during booking</li>
                  </ul>
                </div>

                <div className="border-l-4 border-green-500 pl-4">
                  <h4 className="font-semibold text-green-800">If everything looks correct:</h4>
                  <ul className="text-sm text-green-700 space-y-1">
                    <li>• Try making a test booking to see if notifications work</li>
                    <li>• Check your Telegram app notifications are enabled</li>
                    <li>• Look for the bot messages in your Telegram chat list</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="mt-8 text-center space-x-4">
          <Link href="/admin/telegram-setup">
            <Button variant="outline">Setup Guide</Button>
          </Link>
          <Link href="/trip">
            <Button className="bg-blue-600 hover:bg-blue-700">Test Booking</Button>
          </Link>
        </div>
      </div>
    </div>
  )
}
