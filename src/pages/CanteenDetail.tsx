
import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Layout from '@/components/layout/Layout';
import CanteenDetailComponent from '@/components/canteen/CanteenDetail';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { ChevronLeft } from 'lucide-react';
import { Canteen } from '@/lib/types';
import { getCanteenById, getAllCanteens } from '@/data/mockData';

const CanteenDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [canteen, setCanteen] = useState<Canteen | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (id) {
      // Find canteen by ID
      const foundCanteen = getCanteenById(id);
      
      if (foundCanteen) {
        setCanteen(foundCanteen);
      }
      
      setLoading(false);
    }
  }, [id]);

  // Handle canteen updates
  const handleCanteenUpdate = (updatedCanteen: Canteen) => {
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
