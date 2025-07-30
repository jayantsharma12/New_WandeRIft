"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { CheckCircle, XCircle, AlertTriangle, RefreshCw, ExternalLink } from "lucide-react"

interface DebugResults {
  credentialsCheck: {
    hasBotToken: boolean
    hasChatId: boolean
    botTokenLength: number
    chatIdValue: string
  }
  placeholderCheck: {
    isBotTokenPlaceholder: boolean
    isChatIdPlaceholder: boolean
  }
  formatCheck: {
    isChatIdValidFormat: boolean
    chatIdFormat: string
  }
  botApiTest: {
    success: boolean
    botInfo?: any
    error?: string
  } | null
  chatTest: {
    success: boolean
    chatInfo?: any
    error?: string
    errorCode?: number
  } | null
}

export default function DebugTelegramDetailed() {
  const [results, setResults] = useState<DebugResults | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const runDebugTests = async () => {
    setLoading(true)
    setError(null)

    try {
      const response = await fetch("/api/debug-telegram-detailed")
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`)
      }

      const data = await response.json()
      setResults(data)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unknown error occurred")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    runDebugTests()
  }, [])

  const getStatusIcon = (success: boolean | null) => {
    if (success === null) return <AlertTriangle className="h-5 w-5 text-yellow-500" />
    return success ? <CheckCircle className="h-5 w-5 text-green-500" /> : <XCircle className="h-5 w-5 text-red-500" />
  }

  const getStatusBadge = (success: boolean | null) => {
    if (success === null) return <Badge variant="secondary">Skipped</Badge>
    return success ? <Badge variant="default">Pass</Badge> : <Badge variant="destructive">Fail</Badge>
  }

  if (error) {
    return (
      <div className="container mx-auto p-6">
        <Alert>
          <XCircle className="h-4 w-4" />
          <AlertDescription>Debug test failed: {error}</AlertDescription>
        </Alert>
        <Button onClick={runDebugTests} className="mt-4">
          <RefreshCw className="h-4 w-4 mr-2" />
          Retry Tests
        </Button>
      </div>
    )
  }

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Telegram Integration Debug</h1>
          <p className="text-muted-foreground">Comprehensive testing of your Telegram bot configuration</p>
        </div>
        <Button onClick={runDebugTests} disabled={loading}>
          <RefreshCw className={`h-4 w-4 mr-2 ${loading ? "animate-spin" : ""}`} />
          {loading ? "Testing..." : "Refresh Tests"}
        </Button>
      </div>

      {!results && loading && (
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center space-x-2">
              <RefreshCw className="h-5 w-5 animate-spin" />
              <span>Running comprehensive Telegram tests...</span>
            </div>
          </CardContent>
        </Card>
      )}

      {results && (
        <div className="grid gap-6">
          {/* Test 1: Credentials Check */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <div>
                <CardTitle className="flex items-center space-x-2">
                  {getStatusIcon(results.credentialsCheck.hasBotToken && results.credentialsCheck.hasChatId)}
                  <span>1. Environment Variables Check</span>
                </CardTitle>
                <CardDescription>Checking if TELEGRAM_BOT_TOKEN and TELEGRAM_CHAT_ID are set</CardDescription>
              </div>
              {getStatusBadge(results.credentialsCheck.hasBotToken && results.credentialsCheck.hasChatId)}
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span>Bot Token Present:</span>
                  <Badge variant={results.credentialsCheck.hasBotToken ? "default" : "destructive"}>
                    {results.credentialsCheck.hasBotToken ? "Yes" : "No"}
                  </Badge>
                </div>
                <div className="flex justify-between">
                  <span>Chat ID Present:</span>
                  <Badge variant={results.credentialsCheck.hasChatId ? "default" : "destructive"}>
                    {results.credentialsCheck.hasChatId ? "Yes" : "No"}
                  </Badge>
                </div>
                <div className="flex justify-between">
                  <span>Bot Token Length:</span>
                  <span className="font-mono">{results.credentialsCheck.botTokenLength} chars</span>
                </div>
                <div className="flex justify-between">
                  <span>Chat ID Value:</span>
                  <span className="font-mono">{results.credentialsCheck.chatIdValue}</span>
                </div>
              </div>
              {(!results.credentialsCheck.hasBotToken || !results.credentialsCheck.hasChatId) && (
                <Alert className="mt-4">
                  <AlertTriangle className="h-4 w-4" />
                  <AlertDescription>
                    <strong>Solution:</strong> Add missing environment variables to your .env.local file:
                    <br />
                    {!results.credentialsCheck.hasBotToken && "TELEGRAM_BOT_TOKEN=your_bot_token_here"}
                    <br />
                    {!results.credentialsCheck.hasChatId && "TELEGRAM_CHAT_ID=your_chat_id_here"}
                  </AlertDescription>
                </Alert>
              )}
            </CardContent>
          </Card>

          {/* Test 2: Placeholder Check */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <div>
                <CardTitle className="flex items-center space-x-2">
                  {getStatusIcon(
                    !results.placeholderCheck.isBotTokenPlaceholder && !results.placeholderCheck.isChatIdPlaceholder,
                  )}
                  <span>2. Placeholder Values Check</span>
                </CardTitle>
                <CardDescription>Checking if you're still using placeholder values</CardDescription>
              </div>
              {getStatusBadge(
                !results.placeholderCheck.isBotTokenPlaceholder && !results.placeholderCheck.isChatIdPlaceholder,
              )}
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span>Bot Token is Placeholder:</span>
                  <Badge variant={results.placeholderCheck.isBotTokenPlaceholder ? "destructive" : "default"}>
                    {results.placeholderCheck.isBotTokenPlaceholder ? "Yes" : "No"}
                  </Badge>
                </div>
                <div className="flex justify-between">
                  <span>Chat ID is Placeholder:</span>
                  <Badge variant={results.placeholderCheck.isChatIdPlaceholder ? "destructive" : "default"}>
                    {results.placeholderCheck.isChatIdPlaceholder ? "Yes" : "No"}
                  </Badge>
                </div>
              </div>
              {(results.placeholderCheck.isBotTokenPlaceholder || results.placeholderCheck.isChatIdPlaceholder) && (
                <Alert className="mt-4">
                  <AlertTriangle className="h-4 w-4" />
                  <AlertDescription>
                    <strong>Solution:</strong> Replace placeholder values with real ones:
                    <br />
                    {results.placeholderCheck.isBotTokenPlaceholder && (
                      <>
                        Get your bot token from{" "}
                        <a
                          href="https://t.me/BotFather"
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-600 hover:underline inline-flex items-center"
                        >
                          @BotFather <ExternalLink className="h-3 w-3 ml-1" />
                        </a>
                        <br />
                      </>
                    )}
                    {results.placeholderCheck.isChatIdPlaceholder && (
                      <>
                        Get your chat ID from{" "}
                        <a href="/admin/telegram-setup" className="text-blue-600 hover:underline">
                          Telegram Setup Page
                        </a>
                      </>
                    )}
                  </AlertDescription>
                </Alert>
              )}
            </CardContent>
          </Card>

          {/* Test 3: Format Check */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <div>
                <CardTitle className="flex items-center space-x-2">
                  {getStatusIcon(results.formatCheck.isChatIdValidFormat)}
                  <span>3. Chat ID Format Check</span>
                </CardTitle>
                <CardDescription>Checking if chat ID has the correct format</CardDescription>
              </div>
              {getStatusBadge(results.formatCheck.isChatIdValidFormat)}
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span>Valid Format:</span>
                  <Badge variant={results.formatCheck.isChatIdValidFormat ? "default" : "destructive"}>
                    {results.formatCheck.isChatIdValidFormat ? "Yes" : "No"}
                  </Badge>
                </div>
                <div className="flex justify-between">
                  <span>Chat Type:</span>
                  <span className="font-mono">{results.formatCheck.chatIdFormat}</span>
                </div>
              </div>
              {!results.formatCheck.isChatIdValidFormat && (
                <Alert className="mt-4">
                  <AlertTriangle className="h-4 w-4" />
                  <AlertDescription>
                    <strong>Solution:</strong> Chat ID must be a number (e.g., 123456789 for personal chats or
                    -123456789 for groups). Visit the{" "}
                    <a href="/admin/telegram-setup" className="text-blue-600 hover:underline">
                      Telegram Setup Page
                    </a>{" "}
                    to get the correct format.
                  </AlertDescription>
                </Alert>
              )}
            </CardContent>
          </Card>

          {/* Test 4: Bot API Test */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <div>
                <CardTitle className="flex items-center space-x-2">
                  {getStatusIcon(results.botApiTest?.success || null)}
                  <span>4. Bot API Connection Test</span>
                </CardTitle>
                <CardDescription>Testing if the bot token works with Telegram API</CardDescription>
              </div>
              {getStatusBadge(results.botApiTest?.success || null)}
            </CardHeader>
            <CardContent>
              {results.botApiTest?.success ? (
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span>Bot Username:</span>
                    <span className="font-mono">@{results.botApiTest.botInfo?.username}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Bot Name:</span>
                    <span>{results.botApiTest.botInfo?.first_name}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Can Join Groups:</span>
                    <Badge variant={results.botApiTest.botInfo?.can_join_groups ? "default" : "secondary"}>
                      {results.botApiTest.botInfo?.can_join_groups ? "Yes" : "No"}
                    </Badge>
                  </div>
                </div>
              ) : (
                <div>
                  <p className="text-red-600 mb-2">Error: {results.botApiTest?.error}</p>
                  <Alert>
                    <AlertTriangle className="h-4 w-4" />
                    <AlertDescription>
                      <strong>Solution:</strong> Check your bot token. Get a new one from{" "}
                      <a
                        href="https://t.me/BotFather"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:underline inline-flex items-center"
                      >
                        @BotFather <ExternalLink className="h-3 w-3 ml-1" />
                      </a>
                    </AlertDescription>
                  </Alert>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Test 5: Chat Access Test */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <div>
                <CardTitle className="flex items-center space-x-2">
                  {getStatusIcon(results.chatTest?.success || null)}
                  <span>5. Chat Accessibility Test</span>
                </CardTitle>
                <CardDescription>Testing if the bot can access your chat</CardDescription>
              </div>
              {getStatusBadge(results.chatTest?.success || null)}
            </CardHeader>
            <CardContent>
              {results.chatTest?.success ? (
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span>Chat Type:</span>
                    <span className="font-mono">{results.chatTest.chatInfo?.type}</span>
                  </div>
                  {results.chatTest.chatInfo?.first_name && (
                    <div className="flex justify-between">
                      <span>Name:</span>
                      <span>{results.chatTest.chatInfo.first_name}</span>
                    </div>
                  )}
                  {results.chatTest.chatInfo?.username && (
                    <div className="flex justify-between">
                      <span>Username:</span>
                      <span className="font-mono">@{results.chatTest.chatInfo.username}</span>
                    </div>
                  )}
                </div>
              ) : (
                <div>
                  <p className="text-red-600 mb-2">
                    Error: {results.chatTest?.error} {results.chatTest?.errorCode && `(${results.chatTest.errorCode})`}
                  </p>
                  <Alert>
                    <AlertTriangle className="h-4 w-4" />
                    <AlertDescription>
                      <strong>Solution:</strong>
                      {results.chatTest?.errorCode === 400 && results.chatTest?.error?.includes("chat not found") ? (
                        <>
                          {" "}
                          You need to start a conversation with your bot first. Go to Telegram, find your bot, and send
                          any message (like "hello").
                        </>
                      ) : (
                        <>
                          {" "}
                          Check your chat ID. Visit the{" "}
                          <a href="/admin/telegram-setup" className="text-blue-600 hover:underline">
                            Telegram Setup Page
                          </a>{" "}
                          to get the correct chat ID.
                        </>
                      )}
                    </AlertDescription>
                  </Alert>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Overall Status */}
          <Card>
            <CardHeader>
              <CardTitle>Overall Status</CardTitle>
            </CardHeader>
            <CardContent>
              {results.credentialsCheck.hasBotToken &&
              results.credentialsCheck.hasChatId &&
              !results.placeholderCheck.isBotTokenPlaceholder &&
              !results.placeholderCheck.isChatIdPlaceholder &&
              results.formatCheck.isChatIdValidFormat &&
              results.botApiTest?.success &&
              results.chatTest?.success ? (
                <Alert>
                  <CheckCircle className="h-4 w-4" />
                  <AlertDescription>
                    <strong>✅ All tests passed!</strong> Your Telegram integration is properly configured and should
                    work correctly.
                  </AlertDescription>
                </Alert>
              ) : (
                <Alert>
                  <XCircle className="h-4 w-4" />
                  <AlertDescription>
                    <strong>❌ Some tests failed.</strong> Please fix the issues above for Telegram notifications to
                    work properly.
                  </AlertDescription>
                </Alert>
              )}
            </CardContent>
          </Card>
        </div>
      )}

      <div className="flex space-x-4">
        <Button asChild>
          <a href="/admin/telegram-setup">Configure Telegram</a>
        </Button>
        <Button variant="outline" asChild>
          <a href="/trip">Test Booking</a>
        </Button>
        <Button variant="outline" asChild>
          <a href="/admin">Admin Dashboard</a>
        </Button>
      </div>
    </div>
  )
}
