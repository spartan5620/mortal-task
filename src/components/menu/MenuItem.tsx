
import React from 'react';
import { MenuItem as MenuItemType } from '@/lib/types';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { formatPrice } from '@/lib/formatters';

interface MenuItemProps {
  item: MenuItemType;
  canteenId?: string;  // Make this optional
  onEdit?: (updatedItem: MenuItemType) => void;
  onDelete?: (itemId: string) => void;
}

const MenuItem = ({ item, canteenId, onEdit, onDelete }: MenuItemProps) => {
  return (
    <Card className={item.available ? '' : 'opacity-60'}>
      <CardContent className="p-4">
        <div className="flex justify-between items-start">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <h4 className="font-medium">{item.name}</h4>
              {!item.available && <Badge variant="outline">Unavailable</Badge>}
            </div>
            <p className="text-sm text-muted-foreground">{item.description}</p>
          </div>
          <div className="font-medium">{formatPrice(item.price)}</div>
        </div>
        
        {/* Only render edit/delete buttons if handlers are provided */}
        {(onEdit || onDelete) && (
          <div className="flex gap-2 mt-4 justify-end">
            {onEdit && (
              <button 
                className="text-sm text-blue-500 hover:text-blue-700"
                onClick={() => onEdit(item)}
              >
                Edit
              </button>
            )}
            {onDelete && (
              <button 
                className="text-sm text-red-500 hover:text-red-700"
                onClick={() => onDelete(item.id)}
              >
                Delete
              </button>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default MenuItem;
