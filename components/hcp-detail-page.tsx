"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  ArrowLeft,
  MapPin,
  Phone,
  Mail,
  Building2,
  CheckCircle,
  XCircle,
  Calendar,
  TrendingUp,
  FileText,
  Activity,
} from "lucide-react"
import Link from "next/link"
import { getHCPById } from "@/lib/hcp-data"
import type { HCP } from "@/lib/hcp-data"

interface HCPDetailPageProps {
  hcpId: string
}

export function HCPDetailPage({ hcpId }: HCPDetailPageProps) {
  const [hcp, setHcp] = useState<HCP | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchHCP = async () => {
      setLoading(true)
      // Simulate network delay
      await new Promise((resolve) => setTimeout(resolve, 500))
      const hcpData = getHCPById(hcpId)
      setHcp(hcpData || null)
      setLoading(false)
    }

    fetchHCP()
  }, [hcpId])

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading HCP details...</p>
        </div>
      </div>
    )
  }

  if (!hcp) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-2">HCP Not Found</h1>
          <p className="text-muted-foreground mb-4">The requested healthcare provider could not be found.</p>
          <Link href="/">
            <Button>
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Portal
            </Button>
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card">
        <div className="flex items-center justify-between px-6 py-4">
          <div className="flex items-center gap-4">
            <Link href="/">
              <Button variant="ghost" size="sm">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Portal
              </Button>
            </Link>
            <div className="flex items-center gap-3">
              <Avatar className="h-10 w-10">
                <AvatarFallback className="bg-primary text-primary-foreground">
                  {hcp.name
                    .split(" ")
                    .map((n) => n[0])
                    .join("")}
                </AvatarFallback>
              </Avatar>
              <div>
                <h1 className="text-xl font-semibold">{hcp.name}</h1>
                <p className="text-sm text-muted-foreground">{hcp.specialty}</p>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Badge variant={hcp.isAligned ? "default" : "destructive"} className="flex items-center gap-1">
              {hcp.isAligned ? <CheckCircle className="h-3 w-3" /> : <XCircle className="h-3 w-3" />}
              {hcp.isAligned ? "Aligned" : "Unaligned"}
            </Badge>
            <Badge variant="outline">{hcp.territory}</Badge>
          </div>
        </div>
      </header>

      <div className="p-6 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - Basic Info */}
          <div className="space-y-6">
            {/* Contact Information */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Building2 className="h-5 w-5" />
                  Contact Information
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-start gap-3">
                  <MapPin className="h-4 w-4 text-muted-foreground mt-1" />
                  <div className="text-sm">
                    <div>{hcp.address}</div>
                    <div>
                      {hcp.city}, {hcp.state} {hcp.zip}
                    </div>
                  </div>
                </div>

                {hcp.phone && (
                  <div className="flex items-center gap-3">
                    <Phone className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm">{hcp.phone}</span>
                  </div>
                )}

                {hcp.email && (
                  <div className="flex items-center gap-3">
                    <Mail className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm">{hcp.email}</span>
                  </div>
                )}

                <div className="pt-2 border-t">
                  <div className="text-xs text-muted-foreground mb-1">NPI</div>
                  <div className="text-sm font-mono">{hcp.npi}</div>
                </div>
              </CardContent>
            </Card>

            {/* Affiliations */}
            {hcp.affiliations && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Building2 className="h-5 w-5" />
                    Affiliations
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {hcp.affiliations.map((affiliation, index) => (
                      <div key={index} className="text-sm p-2 bg-muted rounded-md">
                        {affiliation}
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Quick Stats */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Activity className="h-5 w-5" />
                  Quick Stats
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Prescription Volume</span>
                  <span className="font-semibold">{hcp.prescriptionVolume}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Patient Count</span>
                  <span className="font-semibold">{hcp.patientCount}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Last Contact</span>
                  <span className="text-sm">{hcp.lastContact}</span>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Right Column - Detailed Information */}
          <div className="lg:col-span-2">
            <Tabs defaultValue="overview" className="space-y-6">
              <TabsList className="grid w-full grid-cols-4">
                <TabsTrigger value="overview">Overview</TabsTrigger>
                <TabsTrigger value="activity">Activity</TabsTrigger>
                <TabsTrigger value="prescriptions">Prescriptions</TabsTrigger>
                <TabsTrigger value="notes">Notes</TabsTrigger>
              </TabsList>

              <TabsContent value="overview" className="space-y-6">
                {/* Alignment Status */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      {hcp.isAligned ? (
                        <CheckCircle className="h-5 w-5 text-green-600" />
                      ) : (
                        <XCircle className="h-5 w-5 text-red-600" />
                      )}
                      Alignment Status
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <span className="text-sm">Current Status</span>
                        <Badge variant={hcp.isAligned ? "default" : "destructive"}>
                          {hcp.isAligned ? "Aligned" : "Unaligned"}
                        </Badge>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm">Territory</span>
                        <Badge variant="outline">{hcp.territory}</Badge>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm">Therapeutic Area</span>
                        <Badge variant="secondary">{hcp.therapeuticArea}</Badge>
                      </div>
                      {!hcp.isAligned && (
                        <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-md">
                          <p className="text-sm text-red-800">
                            This HCP requires attention for proper territory alignment. Consider scheduling a meeting to
                            discuss alignment opportunities.
                          </p>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>

                {/* Performance Metrics */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <TrendingUp className="h-5 w-5" />
                      Performance Metrics
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="text-center p-4 bg-muted rounded-lg">
                        <div className="text-2xl font-bold text-primary">{hcp.prescriptionVolume}</div>
                        <div className="text-sm text-muted-foreground">Monthly Prescriptions</div>
                      </div>
                      <div className="text-center p-4 bg-muted rounded-lg">
                        <div className="text-2xl font-bold text-primary">{hcp.patientCount}</div>
                        <div className="text-sm text-muted-foreground">Active Patients</div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="activity" className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Calendar className="h-5 w-5" />
                      Recent Activity
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex items-start gap-3 p-3 border border-border rounded-md">
                        <div className="w-2 h-2 bg-primary rounded-full mt-2"></div>
                        <div className="flex-1">
                          <div className="text-sm font-medium">Territory Assignment Updated</div>
                          <div className="text-xs text-muted-foreground">January 15, 2024</div>
                        </div>
                      </div>
                      <div className="flex items-start gap-3 p-3 border border-border rounded-md">
                        <div className="w-2 h-2 bg-secondary rounded-full mt-2"></div>
                        <div className="flex-1">
                          <div className="text-sm font-medium">Contact Information Updated</div>
                          <div className="text-xs text-muted-foreground">December 8, 2023</div>
                        </div>
                      </div>
                      <div className="flex items-start gap-3 p-3 border border-border rounded-md">
                        <div className="w-2 h-2 bg-muted-foreground rounded-full mt-2"></div>
                        <div className="flex-1">
                          <div className="text-sm font-medium">Profile Created</div>
                          <div className="text-xs text-muted-foreground">November 20, 2023</div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="prescriptions" className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <FileText className="h-5 w-5" />
                      Prescription Data
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-center py-8 text-muted-foreground">
                      <FileText className="h-12 w-12 mx-auto mb-4 opacity-50" />
                      <p>Prescription data visualization would be displayed here.</p>
                      <p className="text-sm">Integration with prescription databases required.</p>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="notes" className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <FileText className="h-5 w-5" />
                      Notes & Comments
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    {hcp.notes ? (
                      <div className="p-4 bg-muted rounded-md">
                        <p className="text-sm">{hcp.notes}</p>
                      </div>
                    ) : (
                      <div className="text-center py-8 text-muted-foreground">
                        <p>No notes available for this HCP.</p>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>
    </div>
  )
}
