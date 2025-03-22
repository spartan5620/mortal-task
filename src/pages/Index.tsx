
import { useState, useEffect } from 'react';
import Layout from '@/components/layout/Layout';
import CanteenCard from '@/components/canteen/CanteenCard';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Canteen } from '@/lib/types';
import { getAllCanteens, initializeLocalStorage } from '@/data/mockData';
import { Search, Coffee, SlidersHorizontal, X } from 'lucide-react';

const Index = () => {
  const [canteens, setCanteens] = useState<Canteen[]>([]);
  const [filteredCanteens, setFilteredCanteens] = useState<Canteen[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterOpen, setFilterOpen] = useState(true);

  useEffect(() => {
    // Initialize local storage with mock data
    initializeLocalStorage();
    
    // Get all canteens
    const allCanteens = getAllCanteens();
    setCanteens(allCanteens);
    setFilteredCanteens(allCanteens);
  }, []);

  useEffect(() => {
    // Filter canteens based on search term and open status
    const filtered = canteens.filter(
      (canteen) =>
        (filterOpen ? canteen.isOpen : true) &&
        (searchTerm
          ? canteen.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            canteen.location.toLowerCase().includes(searchTerm.toLowerCase())
          : true)
    );
    
    setFilteredCanteens(filtered);
  }, [searchTerm, filterOpen, canteens]);

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        {/* Hero section */}
        <section className="text-center py-12 md:py-16 mb-6">
          <h1 className="text-4xl md:text-5xl font-bold mb-4 animate-fade-in">
            University Canteens
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto mb-8 animate-slide-up">
            Discover and explore all canteens available across the university campus
          </p>
          
          {/* Search and filters */}
          <div className="max-w-2xl mx-auto mb-8 animate-slide-up delay-100">
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="relative flex-grow">
                <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search canteens by name or location..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-9"
                />
                {searchTerm && (
                  <button
                    onClick={() => setSearchTerm('')}
                    className="absolute right-3 top-3 text-muted-foreground hover:text-foreground"
                  >
                    <X size={16} />
                  </button>
                )}
              </div>
              
              <Button
                variant={filterOpen ? "default" : "outline"}
                onClick={() => setFilterOpen(!filterOpen)}
                className="min-w-[140px]"
              >
                {filterOpen ? (
                  <>
                    <Coffee className="mr-2 h-4 w-4" />
                    Open Now
                  </>
                ) : (
                  <>
                    <SlidersHorizontal className="mr-2 h-4 w-4" />
                    Show All
                  </>
                )}
              </Button>
            </div>
          </div>
        </section>
        
        {/* Canteen Grid */}
        <section className="py-6">
          {filteredCanteens.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredCanteens.map((canteen) => (
                <div key={canteen.id} className="animate-fade-in">
                  <CanteenCard canteen={canteen} />
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <h3 className="text-xl font-medium mb-2">No canteens found</h3>
              <p className="text-muted-foreground">
                {searchTerm
                  ? `No canteens match "${searchTerm}"`
                  : filterOpen
                  ? 'No canteens are currently open'
                  : 'No canteens available'}
              </p>
              
              {(searchTerm || filterOpen) && (
                <div className="mt-4">
                  {searchTerm && (
                    <Button
                      variant="outline"
                      onClick={() => setSearchTerm('')}
                      className="mx-2"
                    >
                      Clear Search
                    </Button>
                  )}
                  
                  {filterOpen && (
                    <Button
                      variant="outline"
                      onClick={() => setFilterOpen(false)}
                      className="mx-2"
                    >
                      Show All Canteens
                    </Button>
                  )}
                </div>
              )}
            </div>
          )}
        </section>
      </div>
    </Layout>
  );
};

export default Index;
