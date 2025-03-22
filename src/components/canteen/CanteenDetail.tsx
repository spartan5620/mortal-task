
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Canteen, MenuItem } from '@/lib/types';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  Clock, MapPin, Calendar, ChevronLeft, ChevronRight, 
  Coffee, Clock8, ExternalLink 
} from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { useAuth } from '@/lib/auth';

interface CanteenDetailProps {
  canteen: Canteen;
  onUpdate?: (updatedCanteen: Canteen) => void;
}

const CanteenDetail = ({ canteen, onUpdate }: CanteenDetailProps) => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [activeTab, setActiveTab] = useState('menu');

  const defaultImage = 'https://images.unsplash.com/photo-1581954548122-53a79dff3938?q=80&w=800&auto=format&fit=crop';
  const displayImages = [
    canteen.profileImage || defaultImage,
    ...canteen.menuImages
  ].filter(Boolean);

  // Group menu items by category
  const menuCategories = canteen.menu.reduce((categories, item) => {
    if (!categories[item.category]) {
      categories[item.category] = [];
    }
    categories[item.category].push(item);
    return categories;
  }, {} as Record<string, MenuItem[]>);

  // Format time for display
  const formatTime = (time: string) => {
    const [hours, minutes] = time.split(':');
    const hour = parseInt(hours);
    const period = hour >= 12 ? 'PM' : 'AM';
    const formattedHour = hour % 12 || 12;
    return `${formattedHour}:${minutes} ${period}`;
  };

  // Check if the user is the owner of this canteen
  const isOwner = user?.role === 'owner' && user.canteenId === canteen.id;
  const isAdmin = user?.role === 'admin';

  return (
    <div className="space-y-6">
      {/* Header with image gallery */}
      <div className="relative rounded-lg overflow-hidden bg-muted">
        <div className="aspect-video md:aspect-[21/9] relative overflow-hidden">
          <img
            src={displayImages[activeImageIndex]}
            alt={canteen.name}
            className="w-full h-full object-cover animate-fade-in"
          />
          
          {displayImages.length > 1 && (
            <>
              <button
                onClick={() => setActiveImageIndex((prev) => (prev === 0 ? displayImages.length - 1 : prev - 1))}
                className="absolute left-4 top-1/2 -translate-y-1/2 bg-black/40 text-white p-2 rounded-full hover:bg-black/60 transition-colors"
                aria-label="Previous image"
              >
                <ChevronLeft size={20} />
              </button>
              <button
                onClick={() => setActiveImageIndex((prev) => (prev === displayImages.length - 1 ? 0 : prev + 1))}
                className="absolute right-4 top-1/2 -translate-y-1/2 bg-black/40 text-white p-2 rounded-full hover:bg-black/60 transition-colors"
                aria-label="Next image"
              >
                <ChevronRight size={20} />
              </button>
              <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
                {displayImages.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setActiveImageIndex(index)}
                    className={`w-2 h-2 rounded-full transition-colors ${
                      activeImageIndex === index ? 'bg-white' : 'bg-white/40'
                    }`}
                    aria-label={`Go to image ${index + 1}`}
                  />
                ))}
              </div>
            </>
          )}
        </div>
      </div>

      {/* Canteen info */}
      <div className="flex flex-col md:flex-row justify-between gap-6">
        <div className="space-y-3">
          <div className="flex items-center gap-3">
            <h1 className="text-3xl font-bold">{canteen.name}</h1>
            <Badge variant={canteen.isOpen ? "default" : "secondary"} className="font-medium text-xs">
              {canteen.isOpen ? 'Open Now' : 'Closed'}
            </Badge>
          </div>
          
          <p className="text-muted-foreground">{canteen.description}</p>
          
          <div className="flex flex-col sm:flex-row gap-4 text-sm pt-2">
            <div className="flex items-center gap-2 text-muted-foreground">
              <MapPin size={16} className="shrink-0" />
              <span>{canteen.location}</span>
            </div>
            
            <div className="flex items-center gap-2 text-muted-foreground">
              <Clock size={16} className="shrink-0" />
              <span>See schedule tab for opening hours</span>
            </div>
          </div>
        </div>
        
        {(isOwner || isAdmin) && (
          <div className="flex flex-wrap gap-2">
            <Button onClick={() => navigate(isOwner ? '/owner-dashboard' : `/admin/canteens/${canteen.id}`)}>
              {isOwner ? 'Manage My Canteen' : 'Edit Canteen'}
            </Button>
          </div>
        )}
      </div>

      {/* Special offers */}
      {canteen.specialOffers.length > 0 && (
        <div className="bg-accent/20 p-4 rounded-lg border">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
            <div className="flex items-center gap-2">
              <Badge variant="outline" className="bg-accent/50 font-medium">
                Special Offer
              </Badge>
              <h3 className="font-medium">{canteen.specialOffers[0].title}</h3>
            </div>
            <p className="text-sm text-muted-foreground">{canteen.specialOffers[0].description}</p>
          </div>
        </div>
      )}
      
      {/* Content tabs */}
      <Tabs defaultValue="menu" className="space-y-4" onValueChange={setActiveTab} value={activeTab}>
        <TabsList className="grid grid-cols-2 md:w-[400px]">
          <TabsTrigger value="menu">
            <Coffee className="mr-2 h-4 w-4" />
            Menu
          </TabsTrigger>
          <TabsTrigger value="schedule">
            <Calendar className="mr-2 h-4 w-4" />
            Schedule
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="menu" className="space-y-6">
          {Object.keys(menuCategories).length > 0 ? (
            Object.entries(menuCategories).map(([category, items]) => (
              <div key={category} className="space-y-4">
                <h3 className="text-lg font-medium flex items-center gap-2">
                  <span>{category}</span>
                  <Separator className="flex-1" />
                </h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {items.map((item) => (
                    <Card key={item.id} className={item.available ? '' : 'opacity-60'}>
                      <CardContent className="p-4">
                        <div className="flex justify-between items-start">
                          <div className="space-y-1">
                            <div className="flex items-center gap-2">
                              <h4 className="font-medium">{item.name}</h4>
                              {!item.available && <Badge variant="outline">Unavailable</Badge>}
                            </div>
                            <p className="text-sm text-muted-foreground">{item.description}</p>
                          </div>
                          <div className="font-medium">₹{item.price.toFixed(2)}</div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            ))
          ) : (
            <p className="text-muted-foreground text-center py-8">No menu items available</p>
          )}
        </TabsContent>
        
        <TabsContent value="schedule" className="space-y-6">
          <Card>
            <CardContent className="p-6 space-y-4">
              <h3 className="text-lg font-medium flex items-center gap-2">
                <Clock8 size={18} className="text-muted-foreground" />
                <span>Regular Operating Hours</span>
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {canteen.schedule.regularHours.map((day) => (
                  <div key={day.id} className="flex justify-between items-center p-3 rounded-md border">
                    <div className="font-medium capitalize">{day.day}</div>
                    <div className="text-sm text-muted-foreground">
                      {day.shifts.length > 0 ? (
                        day.shifts.map((shift, index) => (
                          <div key={index}>
                            {formatTime(shift.start)} - {formatTime(shift.end)}
                          </div>
                        ))
                      ) : (
                        'Closed'
                      )}
                    </div>
                  </div>
                ))}
              </div>
              
              {canteen.schedule.closedDates.length > 0 && (
                <>
                  <h3 className="text-lg font-medium flex items-center gap-2 pt-4">
                    <Calendar size={18} className="text-muted-foreground" />
                    <span>Special Closings</span>
                  </h3>
                  
                  <div className="space-y-2">
                    {canteen.schedule.closedDates.map((closedDate) => (
                      <div key={closedDate.id} className="flex justify-between items-center p-3 rounded-md border border-destructive/20 bg-destructive/5">
                        <div className="font-medium">
                          {new Date(closedDate.date).toLocaleDateString('en-US', {
                            weekday: 'short',
                            month: 'short',
                            day: 'numeric',
                          })}
                        </div>
                        <div className="text-sm text-muted-foreground">{closedDate.reason}</div>
                      </div>
                    ))}
                  </div>
                </>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default CanteenDetail;
