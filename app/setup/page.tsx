"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"
import {
  ExternalLink,
  Bot,
  Key,
  MessageCircle,
  TestTube,
  RefreshCw,
  CheckCircle,
  XCircle,
  AlertTriangle,
} from "lucide-react"

export default function SetupPage() {
  const [testResult, setTestResult] = useState<any>(null)
  const [chatIds, setChatIds] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(false)

  const testTelegram = async () => {
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

  const getChatIds = async () => {
    setIsLoading(true)
    try {
      const response = await fetch("/api/get-chat-id")
      const result = await response.json()
      setChatIds(result)
    } catch (error) {
      setChatIds({ success: false, error: "Network error" })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Telegram Bot Setup Guide</h1>
          <p className="text-gray-600">Follow these steps to configure your Telegram bot integration</p>
        </div>

        {/* Important Warning */}
        <Alert className="mb-6 border-red-200 bg-red-50">
          <AlertTriangle className="w-4 h-4 text-red-600" />
          <AlertDescription className="text-red-800">
            <strong>Common Issue:</strong> You're currently using the bot's own ID (8363204311) as the chat ID. Bots
            cannot send messages to themselves. You need to use YOUR personal chat ID instead!
          </AlertDescription>
        </Alert>

        <div className="grid gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Bot className="w-5 h-5" />
                Step 1: Create Telegram Bot (✅ Done)
              </CardTitle>
              <CardDescription>You already have a bot token, so this step is complete</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="bg-green-50 p-4 rounded-lg border border-green-200">
                <p className="text-green-800">
                  ✅ Your bot token starts with: <code>8363204311:...</code>
                  <br />✅ Bot ID: <code>8363204311</code>
                </p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MessageCircle className="w-5 h-5" />
                Step 2: Get YOUR Personal Chat ID (❌ This is the issue!)
              </CardTitle>
              <CardDescription>You need YOUR chat ID, not the bot's ID</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Alert className="border-yellow-200 bg-yellow-50">
                <AlertTriangle className="w-4 h-4 text-yellow-600" />
                <AlertDescription className="text-yellow-800">
                  <strong>The Problem:</strong> You're using <code>8363204311</code> (the bot's ID) as your chat ID.
                  This won't work because bots can't message themselves.
                </AlertDescription>
              </Alert>

              <div className="bg-gray-50 p-4 rounded-lg">
                <h4 className="font-semibold mb-2">How to get YOUR chat ID:</h4>
                <ol className="list-decimal list-inside space-y-2 text-sm">
                  <li>Open Telegram on your phone/computer</li>
                  <li>
                    Search for your bot: <Badge variant="secondary">@your_bot_username</Badge>
                  </li>
                  <li>Click "START" and send any message (like "hello")</li>
                  <li>Use the tool below to find your personal chat ID</li>
                </ol>
              </div>

              <div className="space-y-4">
                <Button onClick={getChatIds} disabled={isLoading} className="w-full">
                  {isLoading ? (
                    <>
                      <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                      Getting Chat IDs...
                    </>
                  ) : (
                    <>
                      <MessageCircle className="w-4 h-4 mr-2" />
                      Find My Personal Chat ID
                    </>
                  )}
                </Button>

                {chatIds && (
                  <Alert className={chatIds.success ? "border-green-200 bg-green-50" : "border-red-200 bg-red-50"}>
                    <AlertDescription>
                      {chatIds.success ? (
                        <div>
                          <p className="font-semibold text-green-800 mb-2">Available Chat IDs:</p>
                          {chatIds.chats.length > 0 ? (
                            <div className="space-y-2">
                              {chatIds.chats.map((chat: any) => (
                                <div key={chat.id} className="bg-white p-3 rounded border">
                                  <div className="flex items-center justify-between mb-2">
                                    <strong>Chat ID:</strong>
                                    <Badge variant={chat.id === "8363204311" ? "destructive" : "default"}>
                                      {chat.id}
                                    </Badge>
                                  </div>
                                  <p>
                                    <strong>Name:</strong> {chat.title}
                                  </p>
                                  <p>
                                    <strong>Type:</strong> {chat.type}
                                  </p>
                                  {chat.id === "8363204311" ? (
                                    <p className="text-red-600 text-sm mt-1">
                                      ❌ This is the bot's ID - don't use this!
                                    </p>
                                  ) : (
                                    <p className="text-green-600 text-sm mt-1">
                                      ✅ Use this chat ID in your environment variables
                                    </p>
                                  )}
                                </div>
                              ))}
                            </div>
                          ) : (
                            <div className="bg-yellow-50 p-3 rounded border border-yellow-200">
                              <p className="text-yellow-700">
                                No personal chats found. Make sure you've:
                                <br />
                                1. Started your bot in Telegram
                                <br />
                                2. Sent at least one message to your bot
                                <br />
                                3. Refreshed this page
                              </p>
                            </div>
                          )}
                        </div>
                      ) : (
                        <p className="text-red-800">Error: {chatIds.error}</p>
                      )}
                    </AlertDescription>
                  </Alert>
                )}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Key className="w-5 h-5" />
                Step 3: Update Environment Variables
              </CardTitle>
              <CardDescription>Replace the chat ID with your personal one</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="bg-gray-50 p-4 rounded-lg">
                <h4 className="font-semibold mb-2">Update your .env.local file:</h4>
                <pre className="bg-gray-800 text-green-400 p-3 rounded text-sm overflow-x-auto">
                  {`TELEGRAM_BOT_TOKEN=8363204311:AAHEzNTNb2QDrhQRZ7hxsOpd5TDds93c02A
TELEGRAM_CHAT_ID=YOUR_PERSONAL_CHAT_ID_HERE`}
                </pre>
                <p className="text-sm text-gray-600 mt-2">
                  Replace <code>YOUR_PERSONAL_CHAT_ID_HERE</code> with the chat ID you found above (it should be
                  different from 8363204311)
                </p>
              </div>

              <Alert className="border-blue-200 bg-blue-50">
                <AlertDescription className="text-blue-800">
                  <strong>After updating:</strong> Restart your development server with <code>npm run dev</code>
                </AlertDescription>
              </Alert>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TestTube className="w-5 h-5" />
                Step 4: Test Your Setup
              </CardTitle>
              <CardDescription>Verify your Telegram integration is working</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Button onClick={testTelegram} disabled={isLoading} className="w-full">
                {isLoading ? (
                  <>
                    <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                    Testing...
                  </>
                ) : (
                  <>
                    <TestTube className="w-4 h-4 mr-2" />
                    Test Telegram Connection
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
                          <p className="font-semibold text-green-800">✅ Success!</p>
                          <p className="text-green-700">Check your Telegram for the test message!</p>
                        </div>
                      ) : (
                        <div>
                          <p className="font-semibold text-red-800">❌ Error:</p>
                          <p className="text-red-700">{testResult.error}</p>
                        </div>
                      )}
                    </AlertDescription>
                  </div>
                </Alert>
              )}
            </CardContent>
          </Card>
        </div>

        <div className="mt-8 text-center">
          <a
            href="/"
            className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Go to Booking Form
            <ExternalLink className="w-4 h-4 ml-2" />
          </a>
        </div>
      </div>
    </div>
  )
}
