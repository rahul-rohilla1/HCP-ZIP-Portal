"use client"

import { useState, useMemo } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { ArrowUpDown, ArrowUp, ArrowDown, Search, MoreHorizontal, Eye, Edit, MapPin } from "lucide-react"
import Link from "next/link"
import type { HCP } from "@/lib/hcp-data"
import { TerritoryChangeDialog } from "@/components/territory-change-dialog"

interface HCPTableProps {
  hcps: HCP[]
}

type SortField = keyof HCP
type SortDirection = "asc" | "desc"

export function HCPTable({ hcps }: HCPTableProps) {
  const [searchQuery, setSearchQuery] = useState("")
  const [sortField, setSortField] = useState<SortField>("name")
  const [sortDirection, setSortDirection] = useState<SortDirection>("asc")
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 10

  const filteredAndSortedHCPs = useMemo(() => {
    let filtered = [...hcps]

    // Apply table search query
    if (searchQuery) {
      const query = searchQuery.toLowerCase()
      filtered = filtered.filter(
        (hcp) =>
          hcp.name.toLowerCase().includes(query) ||
          hcp.npi.includes(query) ||
          hcp.city.toLowerCase().includes(query) ||
          hcp.state.toLowerCase().includes(query) ||
          hcp.specialty.toLowerCase().includes(query),
      )
    }

    // Sort
    filtered.sort((a, b) => {
      let aValue = a[sortField]
      let bValue = b[sortField]

      // Handle different data types
      if (typeof aValue === "string" && typeof bValue === "string") {
        aValue = aValue.toLowerCase()
        bValue = bValue.toLowerCase()
      }

      if (aValue < bValue) return sortDirection === "asc" ? -1 : 1
      if (aValue > bValue) return sortDirection === "asc" ? 1 : -1
      return 0
    })

    return filtered
  }, [hcps, searchQuery, sortField, sortDirection])

  // Pagination
  const totalPages = Math.ceil(filteredAndSortedHCPs.length / itemsPerPage)
  const paginatedHCPs = filteredAndSortedHCPs.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage)

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc")
    } else {
      setSortField(field)
      setSortDirection("asc")
    }
  }

  const getSortIcon = (field: SortField) => {
    if (sortField !== field) return <ArrowUpDown className="h-4 w-4" />
    return sortDirection === "asc" ? <ArrowUp className="h-4 w-4" /> : <ArrowDown className="h-4 w-4" />
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>HCP Territory Management</CardTitle>
          <div className="flex items-center gap-4">
            <TerritoryChangeDialog mode="add" />
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search HCPs..."
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value)
                  setCurrentPage(1) // Reset to first page when searching
                }}
                className="pl-10 w-64"
              />
            </div>
            <div className="text-sm text-muted-foreground">
              {filteredAndSortedHCPs.length} HCP{filteredAndSortedHCPs.length !== 1 ? "s" : ""}
            </div>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>
                  <Button variant="ghost" onClick={() => handleSort("name")} className="h-auto p-0 font-semibold">
                    Prescriber Name
                    {getSortIcon("name")}
                  </Button>
                </TableHead>
                <TableHead>
                  <Button variant="ghost" onClick={() => handleSort("npi")} className="h-auto p-0 font-semibold">
                    NPI
                    {getSortIcon("npi")}
                  </Button>
                </TableHead>
                <TableHead>Address</TableHead>
                <TableHead>
                  <Button variant="ghost" onClick={() => handleSort("city")} className="h-auto p-0 font-semibold">
                    City
                    {getSortIcon("city")}
                  </Button>
                </TableHead>
                <TableHead>
                  <Button variant="ghost" onClick={() => handleSort("state")} className="h-auto p-0 font-semibold">
                    State
                    {getSortIcon("state")}
                  </Button>
                </TableHead>
                <TableHead>Zip</TableHead>
                <TableHead>
                  <Button variant="ghost" onClick={() => handleSort("territory")} className="h-auto p-0 font-semibold">
                    Territory
                    {getSortIcon("territory")}
                  </Button>
                </TableHead>
                <TableHead>
                  <Button variant="ghost" onClick={() => handleSort("specialty")} className="h-auto p-0 font-semibold">
                    Specialty
                    {getSortIcon("specialty")}
                  </Button>
                </TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {paginatedHCPs.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={9} className="text-center py-8 text-muted-foreground">
                    No HCPs found matching your criteria.
                  </TableCell>
                </TableRow>
              ) : (
                paginatedHCPs.map((hcp) => (
                  <TableRow key={hcp.id} className="hover:bg-muted/50">
                    <TableCell className="font-medium">
                      <Link href={`/hcp/${hcp.id}`} className="text-primary hover:underline">
                        {hcp.name}
                      </Link>
                    </TableCell>
                    <TableCell className="font-mono text-sm">{hcp.npi}</TableCell>
                    <TableCell className="text-sm">{hcp.address}</TableCell>
                    <TableCell>{hcp.city}</TableCell>
                    <TableCell>{hcp.state}</TableCell>
                    <TableCell>{hcp.zip}</TableCell>
                    <TableCell>
                      <Badge variant="outline" className="text-xs">
                        {hcp.territory}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge variant="secondary" className="text-xs">
                        {hcp.specialty}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <TerritoryChangeDialog
                          hcp={hcp}
                          mode="change"
                          trigger={
                            <Button variant="outline" size="sm">
                              <MapPin className="h-4 w-4 mr-1" />
                              Change
                            </Button>
                          }
                        />
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem asChild>
                              <Link href={`/hcp/${hcp.id}`} className="flex items-center gap-2">
                                <Eye className="h-4 w-4" />
                                View Details
                              </Link>
                            </DropdownMenuItem>
                            <DropdownMenuItem className="flex items-center gap-2">
                              <Edit className="h-4 w-4" />
                              Edit HCP
                            </DropdownMenuItem>
                            <DropdownMenuItem className="flex items-center gap-2">
                              <MapPin className="h-4 w-4" />
                              View on Map
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center justify-between mt-4">
            <div className="text-sm text-muted-foreground">
              Showing {(currentPage - 1) * itemsPerPage + 1} to{" "}
              {Math.min(currentPage * itemsPerPage, filteredAndSortedHCPs.length)} of {filteredAndSortedHCPs.length}{" "}
              results
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentPage(currentPage - 1)}
                disabled={currentPage === 1}
              >
                Previous
              </Button>
              <div className="flex items-center gap-1">
                {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                  const page = i + 1
                  return (
                    <Button
                      key={page}
                      variant={currentPage === page ? "default" : "outline"}
                      size="sm"
                      onClick={() => setCurrentPage(page)}
                      className="w-8 h-8 p-0"
                    >
                      {page}
                    </Button>
                  )
                })}
                {totalPages > 5 && (
                  <>
                    <span className="text-muted-foreground">...</span>
                    <Button
                      variant={currentPage === totalPages ? "default" : "outline"}
                      size="sm"
                      onClick={() => setCurrentPage(totalPages)}
                      className="w-8 h-8 p-0"
                    >
                      {totalPages}
                    </Button>
                  </>
                )}
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentPage(currentPage + 1)}
                disabled={currentPage === totalPages}
              >
                Next
              </Button>
            </div>
          </div>
        )}

        {/* Table Summary */}
        <div className="mt-4 p-4 bg-muted/30 rounded-lg">
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4 text-sm">
            <div>
              <div className="font-medium text-foreground">Total HCPs</div>
              <div className="text-muted-foreground">{filteredAndSortedHCPs.length}</div>
            </div>
            <div>
              <div className="font-medium text-primary">Territories</div>
              <div className="text-muted-foreground">
                {[...new Set(filteredAndSortedHCPs.map((hcp) => hcp.territory))].length}
              </div>
            </div>
            <div>
              <div className="font-medium text-secondary">Specialties</div>
              <div className="text-muted-foreground">
                {[...new Set(filteredAndSortedHCPs.map((hcp) => hcp.specialty))].length}
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
