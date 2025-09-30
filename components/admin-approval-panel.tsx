"use client"

import { useState, useMemo } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { CheckCircle, XCircle, Clock, MapPin, UserPlus, Eye } from "lucide-react"
import {
  getPendingChanges,
  approvePendingChange,
  rejectPendingChange,
  getHCPById,
  type PendingChange,
} from "@/lib/hcp-data"
import { useAuth } from "@/components/auth-provider"
import { toast } from "@/hooks/use-toast"

export function AdminApprovalPanel() {
  const { user } = useAuth()
  const [adminNotes, setAdminNotes] = useState("")
  const [selectedChange, setSelectedChange] = useState<PendingChange | null>(null)
  const [isProcessing, setIsProcessing] = useState(false)

  const pendingChanges = useMemo(() => getPendingChanges("pending"), [])
  const allChanges = useMemo(() => getPendingChanges(), [])

  const handleApprove = async (changeId: string) => {
    if (!user) return

    setIsProcessing(true)
    try {
      const success = approvePendingChange(changeId, user.email, adminNotes)
      if (success) {
        toast({
          title: "Request Approved",
          description: "The change has been approved and applied.",
        })
        setAdminNotes("")
        setSelectedChange(null)
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to approve request.",
        variant: "destructive",
      })
    } finally {
      setIsProcessing(false)
    }
  }

  const handleReject = async (changeId: string) => {
    if (!user || !adminNotes.trim()) {
      toast({
        title: "Error",
        description: "Please provide a reason for rejection.",
        variant: "destructive",
      })
      return
    }

    setIsProcessing(true)
    try {
      const success = rejectPendingChange(changeId, user.email, adminNotes)
      if (success) {
        toast({
          title: "Request Rejected",
          description: "The change has been rejected.",
        })
        setAdminNotes("")
        setSelectedChange(null)
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to reject request.",
        variant: "destructive",
      })
    } finally {
      setIsProcessing(false)
    }
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "pending":
        return (
          <Badge variant="outline" className="text-yellow-600 border-yellow-200">
            <Clock className="h-3 w-3 mr-1" />
            Pending
          </Badge>
        )
      case "approved":
        return (
          <Badge variant="outline" className="text-green-600 border-green-200">
            <CheckCircle className="h-3 w-3 mr-1" />
            Approved
          </Badge>
        )
      case "rejected":
        return (
          <Badge variant="outline" className="text-red-600 border-red-200">
            <XCircle className="h-3 w-3 mr-1" />
            Rejected
          </Badge>
        )
      default:
        return null
    }
  }

  const formatChangeDetails = (change: PendingChange) => {
    if (change.type === "territory_change") {
      const hcp = getHCPById(change.data.hcpId!)
      return {
        title: `Territory Change: ${hcp?.name}`,
        details: `${change.data.currentTerritory} → ${change.data.newTerritory}`,
        icon: <MapPin className="h-4 w-4" />,
      }
    } else {
      return {
        title: `New HCP: ${change.data.newHCP?.name}`,
        details: `${change.data.newHCP?.specialty} in ${change.data.newHCP?.territory}`,
        icon: <UserPlus className="h-4 w-4" />,
      }
    }
  }

  // Only show admin panel if user is admin
  if (!user || user.role !== "Admin") {
    return null
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <CheckCircle className="h-5 w-5" />
          Admin Approval Panel
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="pending" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="pending">Pending ({pendingChanges.length})</TabsTrigger>
            <TabsTrigger value="approved">Approved</TabsTrigger>
            <TabsTrigger value="rejected">Rejected</TabsTrigger>
          </TabsList>

          <TabsContent value="pending" className="space-y-4">
            {pendingChanges.length === 0 ? (
              <p className="text-muted-foreground text-center py-8">No pending requests</p>
            ) : (
              pendingChanges.map((change) => {
                const details = formatChangeDetails(change)
                return (
                  <Card key={change.id} className="border-l-4 border-l-yellow-400">
                    <CardContent className="p-4">
                      <div className="flex items-start justify-between">
                        <div className="flex items-start gap-3">
                          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-yellow-100">
                            {details.icon}
                          </div>
                          <div>
                            <h4 className="font-medium">{details.title}</h4>
                            <p className="text-sm text-muted-foreground">{details.details}</p>
                            <p className="text-xs text-muted-foreground mt-1">
                              Requested by {change.requestedBy} on {new Date(change.requestedAt).toLocaleDateString()}
                            </p>
                            {change.reason && (
                              <p className="text-sm mt-2 p-2 bg-muted rounded">
                                <strong>Reason:</strong> {change.reason}
                              </p>
                            )}
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <Dialog>
                            <DialogTrigger asChild>
                              <Button variant="outline" size="sm" onClick={() => setSelectedChange(change)}>
                                <Eye className="h-4 w-4 mr-2" />
                                Review
                              </Button>
                            </DialogTrigger>
                            <DialogContent>
                              <DialogHeader>
                                <DialogTitle>Review Request</DialogTitle>
                              </DialogHeader>
                              <div className="space-y-4">
                                <div>
                                  <h4 className="font-medium">{details.title}</h4>
                                  <p className="text-sm text-muted-foreground">{details.details}</p>
                                </div>

                                {change.reason && (
                                  <div>
                                    <Label>Reason</Label>
                                    <p className="text-sm p-2 bg-muted rounded mt-1">{change.reason}</p>
                                  </div>
                                )}

                                <div>
                                  <Label htmlFor="adminNotes">
                                    Admin Notes (optional for approval, required for rejection)
                                  </Label>
                                  <Textarea
                                    id="adminNotes"
                                    value={adminNotes}
                                    onChange={(e) => setAdminNotes(e.target.value)}
                                    placeholder="Add notes about this decision..."
                                  />
                                </div>

                                <div className="flex justify-end gap-2">
                                  <Button
                                    variant="outline"
                                    onClick={() => handleReject(change.id)}
                                    disabled={isProcessing}
                                    className="text-red-600 hover:text-red-700"
                                  >
                                    <XCircle className="h-4 w-4 mr-2" />
                                    Reject
                                  </Button>
                                  <Button
                                    onClick={() => handleApprove(change.id)}
                                    disabled={isProcessing}
                                    className="text-green-600 hover:text-green-700"
                                  >
                                    <CheckCircle className="h-4 w-4 mr-2" />
                                    Approve
                                  </Button>
                                </div>
                              </div>
                            </DialogContent>
                          </Dialog>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                )
              })
            )}
          </TabsContent>

          <TabsContent value="approved" className="space-y-4">
            {allChanges
              .filter((c) => c.status === "approved")
              .map((change) => {
                const details = formatChangeDetails(change)
                return (
                  <Card key={change.id} className="border-l-4 border-l-green-400">
                    <CardContent className="p-4">
                      <div className="flex items-start justify-between">
                        <div className="flex items-start gap-3">
                          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-green-100">
                            {details.icon}
                          </div>
                          <div>
                            <h4 className="font-medium">{details.title}</h4>
                            <p className="text-sm text-muted-foreground">{details.details}</p>
                            <p className="text-xs text-muted-foreground mt-1">
                              Approved by {change.reviewedBy} on{" "}
                              {change.reviewedAt ? new Date(change.reviewedAt).toLocaleDateString() : "N/A"}
                            </p>
                            {change.adminNotes && (
                              <p className="text-sm mt-2 p-2 bg-green-50 rounded">
                                <strong>Admin Notes:</strong> {change.adminNotes}
                              </p>
                            )}
                          </div>
                        </div>
                        {getStatusBadge(change.status)}
                      </div>
                    </CardContent>
                  </Card>
                )
              })}
          </TabsContent>

          <TabsContent value="rejected" className="space-y-4">
            {allChanges
              .filter((c) => c.status === "rejected")
              .map((change) => {
                const details = formatChangeDetails(change)
                return (
                  <Card key={change.id} className="border-l-4 border-l-red-400">
                    <CardContent className="p-4">
                      <div className="flex items-start justify-between">
                        <div className="flex items-start gap-3">
                          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-red-100">
                            {details.icon}
                          </div>
                          <div>
                            <h4 className="font-medium">{details.title}</h4>
                            <p className="text-sm text-muted-foreground">{details.details}</p>
                            <p className="text-xs text-muted-foreground mt-1">
                              Rejected by {change.reviewedBy} on{" "}
                              {change.reviewedAt ? new Date(change.reviewedAt).toLocaleDateString() : "N/A"}
                            </p>
                            {change.adminNotes && (
                              <p className="text-sm mt-2 p-2 bg-red-50 rounded">
                                <strong>Rejection Reason:</strong> {change.adminNotes}
                              </p>
                            )}
                          </div>
                        </div>
                        {getStatusBadge(change.status)}
                      </div>
                    </CardContent>
                  </Card>
                )
              })}
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  )
}
