
import { Link } from 'react-router-dom';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Clock, MapPin, Info } from 'lucide-react';
import { Canteen } from '@/lib/types';

interface CanteenCardProps {
  canteen: Canteen;
}

const CanteenCard = ({ canteen }: CanteenCardProps) => {
  const defaultImage = 'https://images.unsplash.com/photo-1581954548122-53a79dff3938?q=80&w=800&auto=format&fit=crop';
  
  // Format time for display
  const formatTime = (time: string) => {
    const [hours, minutes] = time.split(':');
    const hour = parseInt(hours);
    const period = hour >= 12 ? 'PM' : 'AM';
    const formattedHour = hour % 12 || 12;
    return `${formattedHour}:${minutes} ${period}`;
  };

  // Get current day's operating hours
  const getCurrentDayHours = () => {
    const days = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];
    const today = days[new Date().getDay()];
    
    const daySchedule = canteen.schedule.regularHours.find(
      (day) => day.day === today
    );
    
    if (!daySchedule || daySchedule.shifts.length === 0) {
      return 'Closed today';
    }
    
    return daySchedule.shifts.map(shift => 
      `${formatTime(shift.start)} - ${formatTime(shift.end)}`
    ).join(', ');
  };

  return (
    <Card className="overflow-hidden h-full transition-all duration-300 hover:shadow-md">
      <div className="aspect-video relative overflow-hidden">
        <img
          src={canteen.profileImage || defaultImage}
          alt={canteen.name}
          className="w-full h-full object-cover transition-transform duration-700 hover:scale-105"
        />
        <div className="absolute top-3 right-3">
          <Badge variant={canteen.isOpen ? "default" : "secondary"} className="font-medium">
            {canteen.isOpen ? 'Open Now' : 'Closed'}
          </Badge>
        </div>
      </div>
      
      <CardHeader className="pb-2">
        <h3 className="text-xl font-medium">{canteen.name}</h3>
      </CardHeader>
      
      <CardContent className="pb-2 space-y-2">
        <div className="flex items-start gap-2 text-sm text-muted-foreground">
          <MapPin size={16} className="mt-0.5 shrink-0" />
          <span>{canteen.location}</span>
        </div>
        
        <div className="flex items-start gap-2 text-sm text-muted-foreground">
          <Clock size={16} className="mt-0.5 shrink-0" />
          <span>{getCurrentDayHours()}</span>
        </div>
        
        {canteen.specialOffers.length > 0 && (
          <div className="mt-2 pt-2 border-t">
            <Badge variant="outline" className="bg-accent/50">
              {canteen.specialOffers[0].title}
            </Badge>
          </div>
        )}
      </CardContent>
      
      <CardFooter>
        <Link
          to={`/canteen/${canteen.id}`}
          className="inline-flex items-center text-sm font-medium text-primary"
        >
          <Info size={16} className="mr-1" />
          View Details
        </Link>
      </CardFooter>
    </Card>
  );
};

export default CanteenCard;
