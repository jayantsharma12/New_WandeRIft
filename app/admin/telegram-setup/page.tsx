"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft, RefreshCw, CheckCircle, XCircle, AlertTriangle, Copy, Settings } from "lucide-react"
import Link from "next/link"

export default function TelegramSetupPage() {
  const [chatIds, setChatIds] = useState<any>(null)
  const [configStatus, setConfigStatus] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(false)

  const checkConfig = async () => {
    try {
      const response = await fetch("/api/check-telegram-config")
      const result = await response.json()
      setConfigStatus(result)
    } catch (error) {
      console.error("Failed to check config:", error)
    }
  }

  const getChatIds = async () => {
    setIsLoading(true)
    try {
      const response = await fetch("/api/telegram-setup")
      const result = await response.json()
      setChatIds(result)
    } catch (error) {
      setChatIds({ success: false, error: "Network error" })
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    checkConfig()
    getChatIds()
  }, [])

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text)
  }

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
            <h1 className="text-3xl font-bold text-gray-900">Telegram Bot Setup</h1>
            <p className="text-gray-600">Configure your Telegram bot for booking notifications</p>
          </div>
        </div>

        {/* Configuration Status */}
        {configStatus && (
          <Card className="mb-6">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Settings className="w-5 h-5" />
                Current Configuration Status
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex items-center justify-between p-3 bg-gray-50 rounded">
                  <span>Bot Token</span>
                  {configStatus.config.hasBotToken && configStatus.config.botTokenValid ? (
                    <Badge className="bg-green-100 text-green-800">✅ Configured</Badge>
                  ) : (
                    <Badge variant="destructive">❌ Missing/Invalid</Badge>
                  )}
                </div>
                <div className="flex items-center justify-between p-3 bg-gray-50 rounded">
                  <span>Chat ID</span>
                  {configStatus.config.hasChatId && configStatus.config.chatIdValid ? (
                    <Badge className="bg-green-100 text-green-800">✅ Configured</Badge>
                  ) : (
                    <Badge variant="destructive">❌ Missing/Invalid</Badge>
                  )}
                </div>
              </div>

              {configStatus.config.isConfigured ? (
                <Alert className="mt-4 border-green-200 bg-green-50">
                  <CheckCircle className="w-4 h-4 text-green-600" />
                  <AlertDescription className="text-green-800">
                    🎉 Telegram is fully configured! Booking notifications will be sent automatically.
                  </AlertDescription>
                </Alert>
              ) : (
                <Alert className="mt-4 border-yellow-200 bg-yellow-50">
                  <AlertTriangle className="w-4 h-4 text-yellow-600" />
                  <AlertDescription className="text-yellow-800">
                    ⚠️ Telegram is not fully configured. Bookings will still work, but you won't receive notifications.
                  </AlertDescription>
                </Alert>
              )}
            </CardContent>
          </Card>
        )}

        <div className="grid gap-6">
          {/* Step 1: Create Bot */}
          <Card>
            <CardHeader>
              <CardTitle>Step 1: Create a Telegram Bot</CardTitle>
              <CardDescription>If you haven't already created a bot, follow these steps</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <ol className="list-decimal list-inside space-y-2">
                <li>
                  Open Telegram and search for <Badge variant="outline">@BotFather</Badge>
                </li>
                <li>
                  Send the message <Badge variant="outline">/newbot</Badge> to BotFather
                </li>
                <li>Follow the instructions to name your bot</li>
                <li>
                  BotFather will give you a token like{" "}
                  <Badge variant="outline">123456789:ABCdefGHIjklMNOpqrsTUVwxyz</Badge>
                </li>
                <li>
                  Add this token to your <Badge variant="outline">.env.local</Badge> file as{" "}
                  <Badge variant="outline">TELEGRAM_BOT_TOKEN</Badge>
                </li>
              </ol>

              <div className="bg-gray-50 p-4 rounded-lg">
                <h4 className="font-semibold mb-2">Example .env.local entry:</h4>
                <pre className="bg-gray-800 text-green-400 p-3 rounded text-sm overflow-x-auto">
                  TELEGRAM_BOT_TOKEN=123456789:ABCdefGHIjklMNOpqrsTUVwxyz
                </pre>
              </div>
            </CardContent>
          </Card>

          {/* Step 2: Get Chat ID */}
          <Card>
            <CardHeader>
              <CardTitle>Step 2: Get Your Chat ID</CardTitle>
              <CardDescription>Find your personal chat ID to receive notifications</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Alert className="border-yellow-200 bg-yellow-50">
                <AlertTriangle className="w-4 h-4 text-yellow-600" />
                <AlertDescription className="text-yellow-800">
                  <strong>Important:</strong> You must send a message to your bot first before it can send messages to
                  you.
                </AlertDescription>
              </Alert>

              <ol className="list-decimal list-inside space-y-2">
                <li>Open Telegram and search for your bot by username</li>
                <li>Send any message to your bot (e.g., "hello")</li>
                <li>Click the button below to find your chat ID</li>
              </ol>

              <Button onClick={getChatIds} disabled={isLoading} className="w-full">
                {isLoading ? (
                  <>
                    <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                    Finding Chat IDs...
                  </>
                ) : (
                  <>
                    <RefreshCw className="w-4 h-4 mr-2" />
                    Refresh Chat IDs
                  </>
                )}
              </Button>

              {chatIds && (
                <div className="mt-4">
                  {chatIds.success ? (
                    <div className="space-y-4">
                      <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                        <p className="text-blue-800">
                          <strong>Bot Token:</strong> {chatIds.botToken}
                        </p>
                      </div>

                      <h4 className="font-semibold">Available Chat IDs:</h4>
                      {chatIds.chats.length > 0 ? (
                        <div className="space-y-2">
                          {chatIds.chats.map((chat: any) => (
                            <div key={chat.id} className="bg-white p-3 rounded border">
                              <div className="flex items-center justify-between mb-2">
                                <strong>Chat ID:</strong>
                                <div className="flex items-center gap-2">
                                  <Badge>{chat.id}</Badge>
                                  <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => copyToClipboard(chat.id.toString())}
                                  >
                                    <Copy className="w-3 h-3" />
                                  </Button>
                                </div>
                              </div>
                              <p>
                                <strong>Name:</strong> {chat.title}
                              </p>
                              <p>
                                <strong>Type:</strong> {chat.type}
                              </p>
                              <p className="text-green-600 text-sm mt-1">
                                ✅ Use this chat ID in your environment variables
                              </p>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <div className="bg-yellow-50 p-3 rounded border border-yellow-200">
                          <p className="text-yellow-700">
                            No chats found. Make sure you've:
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
                    <Alert className="border-red-200 bg-red-50">
                      <XCircle className="w-4 h-4 text-red-600" />
                      <AlertDescription className="text-red-800">Error: {chatIds.error}</AlertDescription>
                    </Alert>
                  )}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Step 3: Update Environment Variables */}
          <Card>
            <CardHeader>
              <CardTitle>Step 3: Update Environment Variables</CardTitle>
              <CardDescription>Add the chat ID to your environment variables</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="bg-gray-50 p-4 rounded-lg">
                <div className="flex justify-between items-center mb-2">
                  <h4 className="font-semibold">Complete .env.local file example:</h4>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() =>
                      copyToClipboard(`TELEGRAM_BOT_TOKEN=your_bot_token_here
TELEGRAM_CHAT_ID=your_chat_id_here
GOOGLE_GEMINI_API_KEY=your_gemini_api_key_here`)
                    }
                  >
                    <Copy className="w-4 h-4 mr-1" />
                    Copy Template
                  </Button>
                </div>
                <pre className="bg-gray-800 text-green-400 p-3 rounded text-sm overflow-x-auto">
                  {`# Telegram Bot Configuration
TELEGRAM_BOT_TOKEN=123456789:ABCdefGHIjklMNOpqrsTUVwxyz
TELEGRAM_CHAT_ID=987654321

# Google Gemini API
GOOGLE_GEMINI_API_KEY=AIzaSy...

# Vercel Blob (automatically provided)
BLOB_READ_WRITE_TOKEN=vercel_blob_rw_...`}
                </pre>
              </div>

              <Alert className="border-red-200 bg-red-50">
                <XCircle className="w-4 h-4 text-red-600" />
                <AlertDescription className="text-red-800">
                  <strong>Replace the placeholder values:</strong>
                  <br />• Replace <code>your_bot_token_here</code> with your actual bot token
                  <br />• Replace <code>your_chat_id_here</code> with your actual chat ID (a number)
                  <br />• Replace <code>your_gemini_api_key_here</code> with your Gemini API key
                </AlertDescription>
              </Alert>

              <Alert className="border-green-200 bg-green-50">
                <CheckCircle className="w-4 h-4 text-green-600" />
                <AlertDescription className="text-green-800">
                  <strong>After updating:</strong> Restart your development server with <code>npm run dev</code>
                </AlertDescription>
              </Alert>
            </CardContent>
          </Card>

          {/* Common Issues */}
          <Card>
            <CardHeader>
              <CardTitle>Common Issues & Solutions</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="border-l-4 border-red-500 pl-4">
                  <h4 className="font-semibold text-red-800">Invalid chat ID format error</h4>
                  <p className="text-sm text-red-700">
                    • Make sure you're using the actual chat ID number (e.g., 123456789)
                    <br />• Don't use placeholder text like "your_personal_chat_id_here"
                    <br />• Chat IDs are always numbers, sometimes negative (e.g., -123456789)
                  </p>
                </div>

                <div className="border-l-4 border-yellow-500 pl-4">
                  <h4 className="font-semibold text-yellow-800">Chat not found error</h4>
                  <p className="text-sm text-yellow-700">
                    • Make sure you've sent at least one message to your bot
                    <br />• Check that you're using the correct chat ID
                    <br />• Ensure your bot token is valid
                  </p>
                </div>

                <div className="border-l-4 border-blue-500 pl-4">
                  <h4 className="font-semibold text-blue-800">Environment variables not working</h4>
                  <p className="text-sm text-blue-700">
                    • Make sure the .env.local file is in your project root
                    <br />• Restart your development server after adding variables
                    <br />• Check for typos in the variable names
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="mt-8 text-center space-x-4">
          <Button onClick={checkConfig} variant="outline">
            <RefreshCw className="w-4 h-4 mr-2" />
            Check Configuration
          </Button>
          <Link href="/trip">
            <Button className="bg-blue-600 hover:bg-blue-700">Test Booking System</Button>
          </Link>
        </div>
      </div>
    </div>
  )
}
