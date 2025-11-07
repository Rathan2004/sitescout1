import { useQuery, useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router";
import { ArrowLeft, Users, FileText, DollarSign, Shield, Check, X } from "lucide-react";
import { formatCurrency, formatDate } from "@/utils/formatters";
import { toast } from "sonner";
import { Id } from "@/convex/_generated/dataModel";
import { useState } from "react";

function HandlerRegistrationItem({ handler }: { handler: any }) {
  const updateHandlerStatus = useMutation(api.admin.updateHandlerStatus);
  const [isUpdating, setIsUpdating] = useState(false);

  const handleApprove = async () => {
    setIsUpdating(true);
    try {
      await updateHandlerStatus({
        registrationId: handler._id as Id<"handlerRegistrations">,
        status: "approved",
      });
      toast.success(`${handler.name} has been approved!`);
    } catch (error) {
      toast.error("Failed to approve handler");
    } finally {
      setIsUpdating(false);
    }
  };

  const handleReject = async () => {
    setIsUpdating(true);
    try {
      await updateHandlerStatus({
        registrationId: handler._id as Id<"handlerRegistrations">,
        status: "rejected",
      });
      toast.success(`${handler.name} has been rejected`);
    } catch (error) {
      toast.error("Failed to reject handler");
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <div className="flex items-center justify-between border-b pb-4">
      <div className="flex-1">
        <p className="font-semibold">{handler.name}</p>
        <p className="text-sm text-muted-foreground">{handler.email}</p>
        <p className="text-xs text-muted-foreground capitalize">{handler.serviceType}</p>
        <p className="text-xs text-muted-foreground">${handler.hourlyRate}/hr • {handler.experience} years exp</p>
      </div>
      <div className="flex items-center gap-2">
        <Badge variant={handler.status === 'approved' ? 'default' : handler.status === 'rejected' ? 'destructive' : 'secondary'}>
          {handler.status}
        </Badge>
        {handler.status === 'pending' && (
          <>
            <Button
              size="sm"
              variant="default"
              onClick={handleApprove}
              disabled={isUpdating}
            >
              <Check className="h-4 w-4 mr-1" />
              Approve
            </Button>
            <Button
              size="sm"
              variant="destructive"
              onClick={handleReject}
              disabled={isUpdating}
            >
              <X className="h-4 w-4 mr-1" />
              Reject
            </Button>
          </>
        )}
      </div>
    </div>
  );
}

export default function AdminPanel() {
  const navigate = useNavigate();
  const stats = useQuery(api.admin.getPlatformStats);
  const users = useQuery(api.admin.getAllUsers);
  const listings = useQuery(api.admin.getAllListings);
  const transactions = useQuery(api.admin.getAllTransactions);
  const handlers = useQuery(api.admin.getAllHandlerRegistrations);
  const analyticsSummary = useQuery(api.analytics.getAnalyticsSummary, {});

  if (!stats || !users || !listings || !transactions || !handlers) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-current border-r-transparent"></div>
          <p className="mt-4 text-muted-foreground">Loading admin panel...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Navbar */}
      <nav className="sticky top-0 z-50 bg-background/80 backdrop-blur-lg border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-4">
              <Button variant="ghost" size="icon" onClick={() => navigate('/')}>
                <ArrowLeft className="h-5 w-5" />
              </Button>
              <div className="flex items-center gap-2">
                <Shield className="h-6 w-6 text-primary" />
                <span className="text-xl font-bold">Admin Panel</span>
              </div>
            </div>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Overview */}
        <div className="grid md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                <Users className="h-4 w-4" />
                Total Users
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{stats.totalUsers}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                <FileText className="h-4 w-4" />
                Active Listings
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{stats.activeListings}</div>
              <p className="text-xs text-muted-foreground">of {stats.totalListings} total</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                <DollarSign className="h-4 w-4" />
                Total Revenue
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{formatCurrency(stats.totalRevenue, 'USD', '$')}</div>
              <p className="text-xs text-muted-foreground">{stats.completedTransactions} transactions</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                <Shield className="h-4 w-4" />
                Handlers
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{stats.approvedHandlers}</div>
              <p className="text-xs text-muted-foreground">of {stats.totalHandlers} registered</p>
            </CardContent>
          </Card>
        </div>

        {/* Analytics Summary */}
        {analyticsSummary && (
          <Card className="mb-8">
            <CardHeader>
              <CardTitle>Analytics Overview</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-5 gap-4">
                <div>
                  <p className="text-sm text-muted-foreground">Listing Views</p>
                  <p className="text-2xl font-bold">{analyticsSummary.listingViews}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Listings Created</p>
                  <p className="text-2xl font-bold">{analyticsSummary.listingsCreated}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Transactions</p>
                  <p className="text-2xl font-bold">{analyticsSummary.transactionsCompleted}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">New Users</p>
                  <p className="text-2xl font-bold">{analyticsSummary.usersRegistered}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">New Handlers</p>
                  <p className="text-2xl font-bold">{analyticsSummary.handlersRegistered}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Detailed Tables */}
        <Tabs defaultValue="users" className="space-y-4">
          <TabsList>
            <TabsTrigger value="users">Users</TabsTrigger>
            <TabsTrigger value="listings">Listings</TabsTrigger>
            <TabsTrigger value="transactions">Transactions</TabsTrigger>
            <TabsTrigger value="handlers">Handlers</TabsTrigger>
          </TabsList>

          <TabsContent value="users">
            <Card>
              <CardHeader>
                <CardTitle>All Users</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {users.map((user) => (
                    <div key={user._id} className="flex items-center justify-between border-b pb-4">
                      <div>
                        <p className="font-semibold">{user.name || "Anonymous"}</p>
                        <p className="text-sm text-muted-foreground">{user.email || "No email"}</p>
                      </div>
                      <Badge>{user.role || "user"}</Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="listings">
            <Card>
              <CardHeader>
                <CardTitle>All Listings</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {listings.map((listing) => (
                    <div key={listing._id} className="flex items-center justify-between border-b pb-4">
                      <div>
                        <p className="font-semibold">{listing.title}</p>
                        <p className="text-sm text-muted-foreground">{listing.domain}</p>
                      </div>
                      <div className="text-right">
                        <p className="font-semibold">{formatCurrency(listing.price, listing.currency, '$')}</p>
                        <Badge variant={listing.status === 'active' ? 'default' : 'secondary'}>
                          {listing.status}
                        </Badge>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="transactions">
            <Card>
              <CardHeader>
                <CardTitle>All Transactions</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {transactions.map((transaction) => (
                    <div key={transaction._id} className="flex items-center justify-between border-b pb-4">
                      <div>
                        <p className="font-semibold">Transaction #{transaction._id.slice(-6)}</p>
                        <p className="text-sm text-muted-foreground">
                          {formatDate(new Date(transaction._creationTime).toISOString())}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="font-semibold">{formatCurrency(transaction.amount, transaction.currency, '$')}</p>
                        <Badge variant={transaction.status === 'completed' ? 'default' : 'secondary'}>
                          {transaction.status}
                        </Badge>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="handlers">
            <Card>
              <CardHeader>
                <CardTitle>Handler Registrations</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {handlers.map((handler) => (
                    <HandlerRegistrationItem 
                      key={handler._id} 
                      handler={handler}
                    />
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}