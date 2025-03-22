
import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import Layout from '@/components/layout/Layout';
import MenuItem from '@/components/menu/MenuItem';
import MenuItemForm from '@/components/menu/MenuItemForm';
import ImageUpload from '@/components/ui/ImageUpload';
import ScheduleCalendar from '@/components/schedule/ScheduleCalendar';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { toast } from '@/components/ui/use-toast';
import { useAuth } from '@/lib/auth';
import { withAuth } from '@/lib/auth';
import { Canteen, MenuItem as MenuItemType } from '@/lib/types';
import {
  getCanteenByOwnerId,
  updateCanteen,
  addMenuItem,
  updateMenuItem,
  deleteMenuItem,
  updateCanteenStatus,
  updateCanteenProfileImage,
  addCanteenMenuImage,
  removeCanteenMenuImage,
} from '@/data/mockData';
import {
  Coffee,
  Calendar,
  Image,
  Settings,
  Plus,
  Utensils,
  Info,
  Clock,
  X,
} from 'lucide-react';

const CanteenDashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [canteen, setCanteen] = useState<Canteen | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('menu');
  const [isAddingMenuItem, setIsAddingMenuItem] = useState(false);
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [location_, setLocation] = useState('');
  const [isOpen, setIsOpen] = useState(false);

  // Load the owner's canteen
  useEffect(() => {
    if (user?.canteenId) {
      const userCanteen = getCanteenByOwnerId(user.id);
      
      if (userCanteen) {
        setCanteen(userCanteen);
        setName(userCanteen.name);
        setDescription(userCanteen.description);
        setLocation(userCanteen.location);
        setIsOpen(userCanteen.isOpen);
      }
      
      setLoading(false);
    }
  }, [user]);

  // Set active tab based on URL
  useEffect(() => {
    if (location.pathname.includes('/schedule')) {
      setActiveTab('schedule');
    } else if (location.pathname.includes('/images')) {
      setActiveTab('images');
    } else if (location.pathname.includes('/settings')) {
      setActiveTab('settings');
    } else {
      setActiveTab('menu');
    }
  }, [location.pathname]);

  // Handle canteen info update
  const handleCanteenInfoUpdate = () => {
    if (!canteen) return;
    
    if (!name.trim() || !description.trim() || !location_.trim()) {
      toast({
        title: "Error",
        description: "All fields are required",
        variant: "destructive",
      });
      return;
    }
    
    const updatedCanteen: Canteen = {
      ...canteen,
      name,
      description,
      location: location_,
    };
    
    updateCanteen(updatedCanteen);
    setCanteen(updatedCanteen);
    
    toast({
      title: "Canteen Updated",
      description: "Your canteen information has been updated successfully",
    });
  };

  // Handle status change
  const handleStatusChange = (newStatus: boolean) => {
    if (!canteen) return;
    
    updateCanteenStatus(canteen.id, newStatus);
    
    const updatedCanteen: Canteen = {
      ...canteen,
      isOpen: newStatus,
    };
    
    setCanteen(updatedCanteen);
    setIsOpen(newStatus);
    
    toast({
      title: newStatus ? "Canteen Opened" : "Canteen Closed",
      description: `Your canteen is now ${newStatus ? 'open' : 'closed'} for business`,
    });
  };

  // Handle adding a new menu item
  const handleAddMenuItem = (newItem: MenuItemType) => {
    if (!canteen) return;
    
    const updatedCanteen: Canteen = {
      ...canteen,
      menu: [...canteen.menu, newItem],
    };
    
    setCanteen(updatedCanteen);
    setIsAddingMenuItem(false);
  };

  // Handle updating a menu item
  const handleUpdateMenuItem = (updatedItem: MenuItemType) => {
    if (!canteen) return;
    
    const updatedMenu = canteen.menu.map((item) =>
      item.id === updatedItem.id ? updatedItem : item
    );
    
    const updatedCanteen: Canteen = {
      ...canteen,
      menu: updatedMenu,
    };
    
    setCanteen(updatedCanteen);
  };

  // Handle deleting a menu item
  const handleDeleteMenuItem = (itemId: string) => {
    if (!canteen) return;
    
    const updatedMenu = canteen.menu.filter((item) => item.id !== itemId);
    
    const updatedCanteen: Canteen = {
      ...canteen,
      menu: updatedMenu,
    };
    
    setCanteen(updatedCanteen);
  };

  // Handle updating the schedule
  const handleScheduleUpdate = (updatedCanteen: Canteen) => {
    setCanteen(updatedCanteen);
  };

  // Handle profile image upload
  const handleProfileImageUpload = (imageUrl: string) => {
    if (!canteen) return;
    
    updateCanteenProfileImage(canteen.id, imageUrl);
    
    const updatedCanteen: Canteen = {
      ...canteen,
      profileImage: imageUrl,
    };
    
    setCanteen(updatedCanteen);
    
    toast({
      title: "Profile Image Updated",
      description: "Your canteen profile image has been updated",
    });
  };

  // Handle menu image upload
  const handleMenuImageUpload = (imageUrl: string) => {
    if (!canteen) return;
    
    if (canteen.menuImages.length >= 5) {
      toast({
        title: "Maximum Images Reached",
        description: "You can only upload up to 5 menu images",
        variant: "destructive",
      });
      return;
    }
    
    addCanteenMenuImage(canteen.id, imageUrl);
    
    const updatedCanteen: Canteen = {
      ...canteen,
      menuImages: [...canteen.menuImages, imageUrl],
    };
    
    setCanteen(updatedCanteen);
    
    toast({
      title: "Menu Image Added",
      description: "A new menu image has been added to your canteen",
    });
  };

  // Handle removing a menu image
  const handleRemoveMenuImage = (imageUrl: string) => {
    if (!canteen) return;
    
    removeCanteenMenuImage(canteen.id, imageUrl);
    
    const updatedCanteen: Canteen = {
      ...canteen,
      menuImages: canteen.menuImages.filter((url) => url !== imageUrl),
    };
    
    setCanteen(updatedCanteen);
    
    toast({
      title: "Menu Image Removed",
      description: "The menu image has been removed from your canteen",
    });
  };

  if (loading) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-8">
          <div className="animate-pulse space-y-6">
            <div className="h-8 w-64 bg-muted rounded-md" />
            <div className="h-32 w-full bg-muted rounded-md" />
          </div>
        </div>
      </Layout>
    );
  }

  if (!canteen) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-12 text-center">
          <h2 className="text-2xl font-bold mb-4">Canteen Not Found</h2>
          <p className="text-muted-foreground mb-6">
            You don't have a canteen associated with your account. Please contact the administrator.
          </p>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-bold">{canteen.name}</h1>
            <p className="text-muted-foreground">Owner Dashboard</p>
          </div>
          
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2">
              <Switch
                id="canteen-status"
                checked={isOpen}
                onCheckedChange={handleStatusChange}
              />
              <Label htmlFor="canteen-status" className="font-medium">
                {isOpen ? 'Open' : 'Closed'}
              </Label>
            </div>
            
            <Button onClick={() => navigate(`/canteen/${canteen.id}`)}>
              <Info size={16} className="mr-2" />
              View Public Page
            </Button>
          </div>
        </div>
        
        <Tabs defaultValue={activeTab} className="space-y-8" value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid grid-cols-2 md:grid-cols-4 w-full">
            <TabsTrigger value="menu" onClick={() => navigate('/owner-dashboard')}>
              <Utensils size={16} className="mr-2" />
              Menu
            </TabsTrigger>
            <TabsTrigger value="schedule" onClick={() => navigate('/owner-dashboard/schedule')}>
              <Calendar size={16} className="mr-2" />
              Schedule
            </TabsTrigger>
            <TabsTrigger value="images" onClick={() => navigate('/owner-dashboard/images')}>
              <Image size={16} className="mr-2" />
              Images
            </TabsTrigger>
            <TabsTrigger value="settings" onClick={() => navigate('/owner-dashboard/settings')}>
              <Settings size={16} className="mr-2" />
              Settings
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="menu" className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold">Menu Items</h2>
              <Button
                onClick={() => setIsAddingMenuItem(!isAddingMenuItem)}
                variant={isAddingMenuItem ? "secondary" : "default"}
                className="space-x-2"
              >
                {isAddingMenuItem ? (
                  <>
                    <X size={16} />
                    <span>Cancel</span>
                  </>
                ) : (
                  <>
                    <Plus size={16} />
                    <span>Add Item</span>
                  </>
                )}
              </Button>
            </div>
            
            {isAddingMenuItem && (
              <div className="mb-6">
                <h3 className="text-lg font-medium mb-3">New Menu Item</h3>
                <MenuItemForm
                  canteenId={canteen.id}
                  onSubmit={handleAddMenuItem}
                  onCancel={() => setIsAddingMenuItem(false)}
                />
              </div>
            )}
            
            {canteen.menu.length > 0 ? (
              <div className="space-y-8">
                {/* Group menu items by category */}
                {Array.from(
                  new Set(canteen.menu.map((item) => item.category))
                ).map((category) => (
                  <div key={category} className="space-y-4">
                    <h3 className="text-lg font-medium flex items-center gap-2">
                      <Coffee size={18} className="text-muted-foreground" />
                      <span>{category}</span>
                      <Separator className="flex-1" />
                    </h3>
                    
                    <div className="grid grid-cols-1 gap-4">
                      {canteen.menu
                        .filter((item) => item.category === category)
                        .map((item) => (
                          <MenuItem
                            key={item.id}
                            item={item}
                            canteenId={canteen.id}
                            onEdit={handleUpdateMenuItem}
                            onDelete={handleDeleteMenuItem}
                          />
                        ))}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12 border rounded-lg bg-muted/5">
                <Coffee size={48} className="mx-auto mb-4 text-muted-foreground" />
                <h3 className="text-xl font-medium mb-2">No Menu Items</h3>
                <p className="text-muted-foreground max-w-md mx-auto mb-6">
                  Your canteen doesn't have any menu items yet. Add your first item to get started.
                </p>
                {!isAddingMenuItem && (
                  <Button onClick={() => setIsAddingMenuItem(true)}>
                    <Plus size={16} className="mr-2" />
                    Add First Item
                  </Button>
                )}
              </div>
            )}
          </TabsContent>
          
          <TabsContent value="schedule" className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold">Schedule Management</h2>
            </div>
            
            <div className="text-muted-foreground mb-6">
              <p>
                Set your regular operating hours and special closings. Customers will be able
                to see when your canteen is open or closed.
              </p>
            </div>
            
            <ScheduleCalendar
              canteen={canteen}
              onUpdate={handleScheduleUpdate}
            />
          </TabsContent>
          
          <TabsContent value="images" className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold">Image Management</h2>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <Card>
                <CardHeader>
                  <CardTitle>Profile Image</CardTitle>
                  <CardDescription>
                    This image will be displayed as the main image for your canteen
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <ImageUpload
                    onImageUpload={handleProfileImageUpload}
                    existingImage={canteen.profileImage}
                    label="Upload Profile Image"
                  />
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle>Menu Images</CardTitle>
                  <CardDescription>
                    Upload up to 5 images showcasing your menu items or canteen
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                      {canteen.menuImages.map((image, index) => (
                        <div key={index} className="relative rounded-md overflow-hidden">
                          <img
                            src={image}
                            alt={`Menu ${index + 1}`}
                            className="w-full h-32 object-cover"
                          />
                          <button
                            onClick={() => handleRemoveMenuImage(image)}
                            className="absolute top-2 right-2 bg-black/50 text-white p-1 rounded-full hover:bg-black/70 transition-colors"
                          >
                            <X size={16} />
                          </button>
                        </div>
                      ))}
                      
                      {canteen.menuImages.length < 5 && (
                        <div className="col-span-1">
                          <ImageUpload
                            onImageUpload={handleMenuImageUpload}
                            label="Add Image"
                            className="h-32"
                          />
                        </div>
                      )}
                    </div>
                    
                    <p className="text-sm text-muted-foreground">
                      {canteen.menuImages.length}/5 images uploaded
                    </p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
          
          <TabsContent value="settings" className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold">Canteen Settings</h2>
            </div>
            
            <Card>
              <CardHeader>
                <CardTitle>Canteen Information</CardTitle>
                <CardDescription>
                  Update your canteen's basic information
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Canteen Name</Label>
                  <Input
                    id="name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Enter canteen name"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Enter a brief description of your canteen"
                    rows={3}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="location">Location</Label>
                  <Input
                    id="location"
                    value={location_}
                    onChange={(e) => setLocation(e.target.value)}
                    placeholder="Enter canteen location"
                  />
                </div>
              </CardContent>
              <CardFooter>
                <Button onClick={handleCanteenInfoUpdate}>
                  Save Changes
                </Button>
              </CardFooter>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </Layout>
  );
};

export default withAuth(CanteenDashboard, ['owner']);
