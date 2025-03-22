
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Layout from '@/components/layout/Layout';
import { withAuth } from '@/lib/auth';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import {
  Coffee,
  Users,
  Settings,
  Edit,
  Trash2,
  Eye,
} from 'lucide-react';
import { Canteen, User } from '@/lib/types';
import { getAllCanteens } from '@/data/mockData';

const Admin = () => {
  const navigate = useNavigate();
  const [canteens, setCanteens] = useState<Canteen[]>([]);
  const [stats, setStats] = useState({
    totalCanteens: 0,
    openCanteens: 0,
    totalMenuItems: 0,
  });

  useEffect(() => {
    // Get all canteens
    const allCanteens = getAllCanteens();
    setCanteens(allCanteens);
    
    // Calculate stats
    const openCanteens = allCanteens.filter((canteen) => canteen.isOpen).length;
    const totalMenuItems = allCanteens.reduce(
      (total, canteen) => total + canteen.menu.length,
      0
    );
    
    setStats({
      totalCanteens: allCanteens.length,
      openCanteens,
      totalMenuItems,
    });
  }, []);

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-bold">Admin Dashboard</h1>
            <p className="text-muted-foreground">Manage all university canteens</p>
          </div>
        </div>
        
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Total Canteens</p>
                  <h2 className="text-3xl font-bold">{stats.totalCanteens}</h2>
                </div>
                <div className="bg-primary/10 p-3 rounded-full">
                  <Coffee size={24} className="text-primary" />
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Open Canteens</p>
                  <h2 className="text-3xl font-bold">{stats.openCanteens}</h2>
                </div>
                <div className="bg-green-500/10 p-3 rounded-full">
                  <Coffee size={24} className="text-green-500" />
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Total Menu Items</p>
                  <h2 className="text-3xl font-bold">{stats.totalMenuItems}</h2>
                </div>
                <div className="bg-orange-500/10 p-3 rounded-full">
                  <Coffee size={24} className="text-orange-500" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
        
        {/* Canteens Table */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>All Canteens</CardTitle>
            <CardDescription>
              Manage and monitor all university canteens
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Location</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Menu Items</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {canteens.map((canteen) => (
                  <TableRow key={canteen.id}>
                    <TableCell className="font-medium">{canteen.name}</TableCell>
                    <TableCell>{canteen.location}</TableCell>
                    <TableCell>
                      <Badge variant={canteen.isOpen ? "default" : "secondary"}>
                        {canteen.isOpen ? 'Open' : 'Closed'}
                      </Badge>
                    </TableCell>
                    <TableCell>{canteen.menu.length}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => navigate(`/canteen/${canteen.id}`)}
                          className="h-8 w-8"
                        >
                          <Eye size={16} />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
                
                {canteens.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center py-8 text-muted-foreground">
                      No canteens found
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
        
        {/* User Credentials */}
        <Card>
          <CardHeader>
            <CardTitle>User Credentials</CardTitle>
            <CardDescription>
              System login credentials for administrators and canteen owners
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-medium mb-2">Admin Login</h3>
                <div className="grid grid-cols-2 gap-2 text-sm border p-3 rounded-md bg-muted/10">
                  <div className="font-medium">Username:</div>
                  <div>admin</div>
                  <div className="font-medium">Password:</div>
                  <div>admin123</div>
                </div>
              </div>
              
              <div>
                <h3 className="text-lg font-medium mb-2">Canteen Owner Logins</h3>
                <div className="space-y-3">
                  <div className="border p-3 rounded-md bg-muted/10">
                    <div className="font-medium mb-1">Central Canteen Owner</div>
                    <div className="grid grid-cols-2 gap-2 text-sm">
                      <div className="font-medium">Username:</div>
                      <div>central_owner</div>
                      <div className="font-medium">Password:</div>
                      <div>central123</div>
                    </div>
                  </div>
                  
                  <div className="border p-3 rounded-md bg-muted/10">
                    <div className="font-medium mb-1">North Canteen Owner</div>
                    <div className="grid grid-cols-2 gap-2 text-sm">
                      <div className="font-medium">Username:</div>
                      <div>north_owner</div>
                      <div className="font-medium">Password:</div>
                      <div>north123</div>
                    </div>
                  </div>
                  
                  <div className="border p-3 rounded-md bg-muted/10">
                    <div className="font-medium mb-1">South Canteen Owner</div>
                    <div className="grid grid-cols-2 gap-2 text-sm">
                      <div className="font-medium">Username:</div>
                      <div>south_owner</div>
                      <div className="font-medium">Password:</div>
                      <div>south123</div>
                    </div>
                  </div>
                  
                  <div className="border p-3 rounded-md bg-muted/10">
                    <div className="font-medium mb-1">East Canteen Owner</div>
                    <div className="grid grid-cols-2 gap-2 text-sm">
                      <div className="font-medium">Username:</div>
                      <div>east_owner</div>
                      <div className="font-medium">Password:</div>
                      <div>east123</div>
                    </div>
                  </div>
                  
                  <div className="border p-3 rounded-md bg-muted/10">
                    <div className="font-medium mb-1">West Canteen Owner</div>
                    <div className="grid grid-cols-2 gap-2 text-sm">
                      <div className="font-medium">Username:</div>
                      <div>west_owner</div>
                      <div className="font-medium">Password:</div>
                      <div>west123</div>
                    </div>
                  </div>
                </div>
              </div>
              
              <div>
                <h3 className="text-lg font-medium mb-2">Guest Access</h3>
                <div className="grid grid-cols-2 gap-2 text-sm border p-3 rounded-md bg-muted/10">
                  <div className="font-medium">Username:</div>
                  <div>guest</div>
                  <div className="font-medium">Password:</div>
                  <div>guest123</div>
                </div>
              </div>
            </div>
          </CardContent>
          <CardFooter className="text-sm text-muted-foreground">
            These credentials are for demonstration purposes only. In a real system, owners would set their own secure passwords.
          </CardFooter>
        </Card>
      </div>
    </Layout>
  );
};

export default withAuth(Admin, ['admin']);
