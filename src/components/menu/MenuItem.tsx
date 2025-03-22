
import { useState } from 'react';
import { MenuItem as MenuItemType } from '@/lib/types';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Edit, Trash2 } from 'lucide-react';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { updateMenuItem, deleteMenuItem } from '@/data/mockData';
import { toast } from '@/components/ui/use-toast';
import MenuItemForm from './MenuItemForm';

interface MenuItemProps {
  item: MenuItemType;
  canteenId: string;
  onEdit: (updatedItem: MenuItemType) => void;
  onDelete: (itemId: string) => void;
  isEditable?: boolean;
}

const MenuItem = ({ item, canteenId, onEdit, onDelete, isEditable = true }: MenuItemProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [availability, setAvailability] = useState(item.available);

  const handleAvailabilityChange = (checked: boolean) => {
    setAvailability(checked);
    
    const updatedItem: MenuItemType = {
      ...item,
      available: checked,
    };
    
    updateMenuItem(canteenId, updatedItem);
    onEdit(updatedItem);
    
    toast({
      title: `Item ${checked ? 'Available' : 'Unavailable'}`,
      description: `${item.name} is now ${checked ? 'available' : 'unavailable'} on the menu.`,
    });
  };

  const handleDelete = () => {
    deleteMenuItem(canteenId, item.id);
    onDelete(item.id);
    setIsDeleteDialogOpen(false);
    
    toast({
      title: "Item Deleted",
      description: `${item.name} has been removed from the menu.`,
    });
  };

  return (
    <>
      {isEditing ? (
        <MenuItemForm
          initialValues={item}
          canteenId={canteenId}
          onSubmit={(updatedItem) => {
            onEdit(updatedItem);
            setIsEditing(false);
          }}
          onCancel={() => setIsEditing(false)}
        />
      ) : (
        <Card className={!item.available ? 'opacity-70' : ''}>
          <CardContent className="p-4">
            <div className="flex flex-col sm:flex-row justify-between gap-3">
              <div className="space-y-1.5">
                <div className="flex items-center gap-2">
                  <h4 className="font-medium">{item.name}</h4>
                  {!item.available && (
                    <Badge variant="outline" className="text-xs">Unavailable</Badge>
                  )}
                </div>
                <p className="text-sm text-muted-foreground">{item.description}</p>
                <div className="text-sm font-medium mt-1">
                  ${item.price.toFixed(2)}
                </div>
              </div>
              
              {isEditable && (
                <div className="flex items-center gap-2 self-end sm:self-center">
                  <div className="flex items-center gap-1.5">
                    <Switch
                      checked={availability}
                      onCheckedChange={handleAvailabilityChange}
                      id={`available-${item.id}`}
                    />
                    <span className="text-xs text-muted-foreground">Available</span>
                  </div>
                  
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setIsEditing(true)}
                    className="h-8 w-8"
                  >
                    <Edit size={16} />
                  </Button>
                  
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setIsDeleteDialogOpen(true)}
                    className="h-8 w-8 text-destructive hover:text-destructive"
                  >
                    <Trash2 size={16} />
                  </Button>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      )}
      
      <AlertDialog
        open={isDeleteDialogOpen}
        onOpenChange={setIsDeleteDialogOpen}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete "{item.name}" from your menu.
              This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} className="bg-destructive text-destructive-foreground">
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};

export default MenuItem;
