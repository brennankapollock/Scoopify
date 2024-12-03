export interface InventoryItem {
  id: string;
  name: string;
  category: 'consumable' | 'equipment';
  quantity: number;
  unit: 'box' | 'piece' | 'bottle';
  minThreshold: number;
  lastRestocked: string;
  costPerUnit: number;
  supplier?: string;
  location?: string;
}

export interface InventoryTrend {
  itemId: string;
  date: string;
  quantity: number;
  type: 'usage' | 'restock';
}

export interface InventoryCount {
  id: string;
  date: string;
  countedBy: string;
  items: {
    itemId: string;
    counted: number;
    expected: number;
    difference: number;
  }[];
  notes?: string;
  status: 'draft' | 'completed';
}