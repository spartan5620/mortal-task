
import React from 'react';
import { MenuItem as MenuItemType } from '@/lib/types';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { formatPrice } from '@/lib/formatters';

interface MenuItemProps {
  item: MenuItemType;
}

const MenuItem = ({ item }: MenuItemProps) => {
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
      </CardContent>
    </Card>
  );
};

export default MenuItem;
