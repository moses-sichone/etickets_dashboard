'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { useAuth } from '@/contexts/auth-context'
import { debug, debugAuthStatus, getLogs } from '@/lib/debug'
import { Eye, EyeOff, RefreshCw, Trash2 } from 'lucide-react'

export function AuthDebugPanel() {
  const { user, getAccessToken } = useAuth()
  const [showLogs, setShowLogs] = useState(false)
  const [logs, setLogs] = useState<any[]>([])

  const refreshLogs = () => {
    const currentLogs = getLogs()
    setLogs(currentLogs.slice(-20)) // Show last 20 logs
  }

  const clearLogs = () => {
    debug.clearLogs()
    setLogs([])
  }

  const checkAuth = () => {
    debugAuthStatus()
    refreshLogs()
  }

  const token = getAccessToken()

  return (
    <Card className="w-full max-w-4xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span>Authentication Debug Panel</span>
          <div className="flex space-x-2">
            <Button size="sm" variant="outline" onClick={checkAuth}>
              <RefreshCw className="h-4 w-4 mr-1" />
              Check Auth
            </Button>
            <Button size="sm" variant="outline" onClick={refreshLogs}>
              <Eye className="h-4 w-4 mr-1" />
              {showLogs ? 'Hide' : 'Show'} Logs
            </Button>
            <Button size="sm" variant="outline" onClick={clearLogs}>
              <Trash2 className="h-4 w-4 mr-1" />
              Clear
            </Button>
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Current User Status */}
        <div>
          <h3 className="text-lg font-semibold mb-2">Current User Status</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-gray-600">Authenticated</p>
              <Badge variant={user ? "default" : "destructive"}>
                {user ? "Yes" : "No"}
              </Badge>
            </div>
            <div>
              <p className="text-sm text-gray-600">User ID</p>
              <p className="font-mono text-sm">{user?.id || 'N/A'}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Email</p>
              <p className="font-mono text-sm">{user?.email || 'N/A'}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Role</p>
              <Badge variant="secondary">{user?.role || 'N/A'}</Badge>
            </div>
          </div>
        </div>

        {/* Token Status */}
        <div>
          <h3 className="text-lg font-semibold mb-2">Token Status</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-gray-600">Has Access Token</p>
              <Badge variant={token ? "default" : "destructive"}>
                {token ? "Yes" : "No"}
              </Badge>
            </div>
            <div>
              <p className="text-sm text-gray-600">Token Length</p>
              <p className="font-mono text-sm">{token ? `${token.length} chars` : 'N/A'}</p>
            </div>
            <div className="md:col-span-2">
              <p className="text-sm text-gray-600">Token Preview</p>
              <p className="font-mono text-xs bg-gray-100 p-2 rounded break-all">
                {token ? `${token.substring(0, 100)}...` : 'No token available'}
              </p>
            </div>
          </div>
        </div>

        {/* Debug Logs */}
        {showLogs && (
          <div>
            <h3 className="text-lg font-semibold mb-2">Debug Logs</h3>
            <div className="bg-gray-50 p-4 rounded max-h-96 overflow-y-auto">
              {logs.length === 0 ? (
                <p className="text-gray-500 text-sm">No logs available</p>
              ) : (
                <div className="space-y-2">
                  {logs.map((log, index) => (
                    <div key={index} className="text-xs font-mono">
                      <span className="text-gray-500">
                        [{log.timestamp.toLocaleTimeString()}]
                      </span>
                      <span className={`ml-2 ${
                        log.level === 'error' ? 'text-red-600' :
                        log.level === 'warn' ? 'text-yellow-600' :
                        'text-blue-600'
                      }`}>
                        [{log.level.toUpperCase()}]
                      </span>
                      <span className="ml-2">{log.message}</span>
                      {log.data && (
                        <pre className="ml-4 text-gray-600 overflow-x-auto">
                          {JSON.stringify(log.data, null, 2)}
                        </pre>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}