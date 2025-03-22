
import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Layout from '@/components/layout/Layout';
import CanteenDetailComponent from '@/components/canteen/CanteenDetail';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { ChevronLeft } from 'lucide-react';
import { Canteen } from '@/lib/types';
import { getCanteenById, getAllCanteens, updateCanteen } from '@/data/mockData';

const CanteenDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [canteen, setCanteen] = useState<Canteen | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (id) {
      // Find canteen by ID and check current schedule to determine if open
      const foundCanteen = getCanteenById(id);
      
      if (foundCanteen) {
        // Check if canteen should be open based on current time and schedule
        const updatedCanteen = checkCanteenOpenStatus(foundCanteen);
        setCanteen(updatedCanteen);
      }
      
      setLoading(false);
    }
  }, [id]);

  // Function to check if canteen should be open based on current time and schedule
  const checkCanteenOpenStatus = (canteen: Canteen): Canteen => {
    // Don't change status if owner has manually set it closed
    if (!canteen.isOpen) {
      return canteen;
    }
    
    const now = new Date();
    const days = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];
    const today = days[now.getDay()];
    
    // Check if today is in closed dates
    const isClosed = canteen.schedule.closedDates.some(
      (closedDate) => new Date(closedDate.date).toDateString() === now.toDateString()
    );
    
    if (isClosed) {
      const updatedCanteen = {
        ...canteen,
        isOpen: false
      };
      return updatedCanteen;
    }
    
    // Check if current time is within any shift
    const currentHour = now.getHours();
    const currentMinute = now.getMinutes();
    const currentTimeInMinutes = currentHour * 60 + currentMinute;
    
    const todaySchedule = canteen.schedule.regularHours.find(day => day.day === today);
    
    if (!todaySchedule || todaySchedule.shifts.length === 0) {
      const updatedCanteen = {
        ...canteen,
        isOpen: false
      };
      return updatedCanteen;
    }
    
    // Check if current time falls within any shift
    const isWithinShift = todaySchedule.shifts.some(shift => {
      const [startHour, startMinute] = shift.start.split(':').map(Number);
      const [endHour, endMinute] = shift.end.split(':').map(Number);
      
      const startTimeInMinutes = startHour * 60 + startMinute;
      const endTimeInMinutes = endHour * 60 + endMinute;
      
      // Handle shifts that go past midnight
      if (endTimeInMinutes < startTimeInMinutes) {
        return (
          currentTimeInMinutes >= startTimeInMinutes ||
          currentTimeInMinutes <= endTimeInMinutes
        );
      }
      
      return (
        currentTimeInMinutes >= startTimeInMinutes &&
        currentTimeInMinutes <= endTimeInMinutes
      );
    });
    
    const updatedCanteen = {
      ...canteen,
      isOpen: isWithinShift
    };
    
    return updatedCanteen;
  };

  // Handle canteen updates
  const handleCanteenUpdate = (updatedCanteen: Canteen) => {
    // Save updated canteen to storage and update local state
    updateCanteen(updatedCanteen);
    setCanteen(updatedCanteen);
  };

  if (loading) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-8">
          <div className="animate-pulse space-y-6">
            <div className="aspect-video rounded-lg bg-muted" />
            <div className="space-y-3">
              <Skeleton className="h-8 w-64" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-3/4" />
            </div>
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
            The canteen you're looking for doesn't exist or has been removed.
          </p>
          <Button onClick={() => navigate('/')}>
            <ChevronLeft size={16} className="mr-2" />
            Back to All Canteens
          </Button>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        <div className="mb-6">
          <Button
            variant="ghost"
            className="mb-4"
            onClick={() => navigate('/')}
          >
            <ChevronLeft size={16} className="mr-2" />
            Back to All Canteens
          </Button>
        </div>
        
        <CanteenDetailComponent
          canteen={canteen}
          onUpdate={handleCanteenUpdate}
        />
      </div>
    </Layout>
  );
};

export default CanteenDetail;
