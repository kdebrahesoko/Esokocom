import { useState } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Plus, Edit2, Trash2, Calendar, TrendingUp, TrendingDown, Minus, Search, Store, AlertCircle, RefreshCw } from 'lucide-react';
import { format } from 'date-fns';

import {
  useListMarketPrices,
  useCreateMarketPrice,
  useUpdateMarketPrice,
  useDeleteMarketPrice,
  getListMarketPricesQueryKey,
  type MarketPriceItem,
  MarketPriceInputTrend
} from '@workspace/api-client-react';

import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

const formSchema = z.object({
  commodity: z.string().min(1, 'Commodity is required').max(200),
  price: z.coerce.number().min(0, 'Price must be positive'),
  unit: z.string().min(1, 'Unit is required').max(100),
  currency: z.string().min(1, 'Currency is required').max(10),
  trend: z.nativeEnum(MarketPriceInputTrend),
  changePercent: z.coerce.number(),
  market: z.string().min(1, 'Market is required').max(200),
  updatedAt: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Must be YYYY-MM-DD')
});

type FormValues = z.infer<typeof formSchema>;

export default function MarketPricesTab() {
  const [searchTerm, setSearchTerm] = useState('');
  const [editingItem, setEditingItem] = useState<MarketPriceItem | null>(null);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [deletingId, setDeletingId] = useState<number | null>(null);
  
  const queryClient = useQueryClient();
  const { toast } = useToast();
  
  const { data: prices = [], isLoading, isError, error, refetch } = useListMarketPrices();
  const createMutation = useCreateMarketPrice();
  const updateMutation = useUpdateMarketPrice();
  const deleteMutation = useDeleteMarketPrice();

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      commodity: '',
      price: 0,
      unit: 'kg',
      currency: 'GHS',
      trend: 'stable',
      changePercent: 0,
      market: '',
      updatedAt: format(new Date(), 'yyyy-MM-dd')
    }
  });

  const openCreate = () => {
    form.reset({
      commodity: '',
      price: 0,
      unit: 'kg',
      currency: 'GHS',
      trend: 'stable',
      changePercent: 0,
      market: '',
      updatedAt: format(new Date(), 'yyyy-MM-dd')
    });
    setEditingItem(null);
    setIsFormOpen(true);
  };

  const openEdit = (item: MarketPriceItem) => {
    form.reset({
      commodity: item.commodity,
      price: item.price,
      unit: item.unit,
      currency: item.currency,
      trend: item.trend,
      changePercent: item.changePercent,
      market: item.market,
      updatedAt: item.updatedAt
    });
    setEditingItem(item);
    setIsFormOpen(true);
  };

  const onSubmit = (values: FormValues) => {
    if (editingItem) {
      updateMutation.mutate(
        { id: editingItem.id, data: values },
        {
          onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: getListMarketPricesQueryKey() });
            toast({ title: 'Price updated' });
            setIsFormOpen(false);
          },
          onError: (err) => {
            toast({ title: 'Failed to update', description: err.message, variant: 'destructive' });
          }
        }
      );
    } else {
      createMutation.mutate(
        { data: values },
        {
          onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: getListMarketPricesQueryKey() });
            toast({ title: 'Price created' });
            setIsFormOpen(false);
          },
          onError: (err) => {
            toast({ title: 'Failed to create', description: err.message, variant: 'destructive' });
          }
        }
      );
    }
  };

  const confirmDelete = () => {
    if (!deletingId) return;
    deleteMutation.mutate(
      { id: deletingId },
      {
        onSuccess: () => {
          queryClient.invalidateQueries({ queryKey: getListMarketPricesQueryKey() });
          toast({ title: 'Price deleted' });
          setDeletingId(null);
        },
        onError: (err) => {
          toast({ title: 'Failed to delete', description: err.message, variant: 'destructive' });
          setDeletingId(null);
        }
      }
    );
  };

  const filtered = prices.filter(p => 
    p.commodity.toLowerCase().includes(searchTerm.toLowerCase()) || 
    p.market.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getTrendIcon = (trend: string, percent: number) => {
    if (trend === 'up') return <span className="flex items-center text-emerald-600 font-medium text-xs"><TrendingUp className="w-3 h-3 mr-1" /> {percent > 0 ? `+${percent}%` : ''}</span>;
    if (trend === 'down') return <span className="flex items-center text-red-600 font-medium text-xs"><TrendingDown className="w-3 h-3 mr-1" /> {percent < 0 ? `${percent}%` : `-${percent}%`}</span>;
    return <span className="flex items-center text-gray-500 font-medium text-xs"><Minus className="w-3 h-3 mr-1" /> Stable</span>;
  };

  return (
    <div className="flex flex-col h-full">
      <div className="p-4 border-b flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-gray-50/50">
        <div className="relative max-w-sm w-full">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <Input
            placeholder="Search commodities or markets..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-9 bg-white"
            data-testid="input-search-prices"
          />
        </div>
        <Button 
          onClick={openCreate} 
          className="bg-[#D9531E] hover:bg-[#B34015] text-white"
          data-testid="button-create-price"
        >
          <Plus className="w-4 h-4 mr-2" />
          New Price Record
        </Button>
      </div>

      <div className="flex-1 p-0 overflow-auto">
        {isLoading ? (
          <div className="p-8 space-y-4">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="h-16 bg-gray-100 animate-pulse rounded-lg" />
            ))}
          </div>
        ) : isError ? (
          <div className="p-16 text-center text-red-700" data-testid="status-prices-error">
            <AlertCircle className="w-12 h-12 mx-auto mb-3 text-red-300" />
            <p className="text-lg font-medium">Could not load market prices</p>
            <p className="text-sm text-red-600 mt-1">{error.message}</p>
            <Button variant="outline" className="mt-4" onClick={() => refetch()} data-testid="button-retry-prices">
              <RefreshCw className="w-4 h-4 mr-2" /> Try again
            </Button>
          </div>
        ) : filtered.length === 0 ? (
          <div className="p-16 text-center text-gray-500">
            <TrendingUp className="w-12 h-12 mx-auto mb-3 text-gray-300" />
            <p className="text-lg font-medium text-gray-900">No market prices found</p>
            <p className="text-sm">Try adjusting your search or create a new one.</p>
          </div>
        ) : (
          <div className="min-w-[700px]">
            <div className="grid grid-cols-12 gap-4 p-4 border-b bg-gray-50 text-xs font-semibold text-gray-500 uppercase tracking-wider">
              <div className="col-span-3">Commodity</div>
              <div className="col-span-3">Market</div>
              <div className="col-span-2 text-right">Price</div>
              <div className="col-span-2">Trend</div>
              <div className="col-span-2 text-right">Updated</div>
            </div>
            <div className="divide-y">
              {filtered.map(item => (
                <div key={item.id} className="grid grid-cols-12 gap-4 p-4 items-center hover:bg-orange-50/30 transition-colors group" data-testid={`row-price-${item.id}`}>
                  <div className="col-span-3 font-semibold text-gray-900" data-testid={`text-price-commodity-${item.id}`}>
                    {item.commodity}
                  </div>
                  <div className="col-span-3 text-sm text-gray-600 flex items-center gap-1.5">
                    <Store className="w-3.5 h-3.5 text-gray-400" />
                    <span className="truncate">{item.market}</span>
                  </div>
                  <div className="col-span-2 text-right font-medium">
                    {item.currency} {item.price.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })} <span className="text-xs text-gray-500 font-normal">/{item.unit}</span>
                  </div>
                  <div className="col-span-2">
                    {getTrendIcon(item.trend, item.changePercent)}
                  </div>
                  <div className="col-span-2 flex items-center justify-between text-xs text-gray-500">
                    <div className="flex items-center gap-1">
                      <Calendar className="w-3 h-3" />
                      {item.updatedAt}
                    </div>
                    <div className="opacity-0 group-hover:opacity-100 transition-opacity flex gap-1 -mr-2">
                      <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => openEdit(item)} data-testid={`button-edit-price-${item.id}`}>
                        <Edit2 className="w-3.5 h-3.5 text-gray-600" />
                      </Button>
                      <Button variant="ghost" size="icon" className="h-7 w-7 hover:bg-red-50 hover:text-red-600" onClick={() => setDeletingId(item.id)} data-testid={`button-delete-price-${item.id}`}>
                        <Trash2 className="w-3.5 h-3.5" />
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>{editingItem ? 'Edit Market Price' : 'New Market Price'}</DialogTitle>
          </DialogHeader>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="commodity"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Commodity</FormLabel>
                      <FormControl>
                        <Input {...field} placeholder="e.g. Maize (White)" data-testid="input-price-commodity" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="market"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Market Name</FormLabel>
                      <FormControl>
                        <Input {...field} placeholder="e.g. Techiman Market" data-testid="input-price-market" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="grid grid-cols-3 gap-4">
                <FormField
                  control={form.control}
                  name="price"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Price</FormLabel>
                      <FormControl>
                        <Input {...field} type="number" step="0.01" data-testid="input-price-value" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="currency"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Currency</FormLabel>
                      <FormControl>
                        <Input {...field} placeholder="GHS" data-testid="input-price-currency" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="unit"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Unit</FormLabel>
                      <FormControl>
                        <Input {...field} placeholder="kg, bag, etc." data-testid="input-price-unit" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="grid grid-cols-3 gap-4">
                <FormField
                  control={form.control}
                  name="trend"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Trend</FormLabel>
                      <Select onValueChange={field.onChange} value={field.value}>
                        <FormControl>
                          <SelectTrigger data-testid="select-price-trend">
                            <SelectValue placeholder="Select trend" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="up">Going Up</SelectItem>
                          <SelectItem value="down">Going Down</SelectItem>
                          <SelectItem value="stable">Stable</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="changePercent"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Change %</FormLabel>
                      <FormControl>
                        <Input {...field} type="number" step="0.1" data-testid="input-price-change" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="updatedAt"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Date (YYYY-MM-DD)</FormLabel>
                      <FormControl>
                        <Input {...field} type="date" data-testid="input-price-date" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <DialogFooter className="pt-4">
                <Button type="button" variant="outline" onClick={() => setIsFormOpen(false)}>
                  Cancel
                </Button>
                <Button 
                  type="submit" 
                  className="bg-[#D9531E] hover:bg-[#B34015] text-white"
                  disabled={createMutation.isPending || updateMutation.isPending}
                  data-testid="button-save-price"
                >
                  {(createMutation.isPending || updateMutation.isPending) ? 'Saving...' : 'Save Price'}
                </Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>

      <AlertDialog open={deletingId !== null} onOpenChange={(open) => !open && setDeletingId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Market Price?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This record will be permanently removed.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction 
              onClick={confirmDelete} 
              className="bg-red-600 hover:bg-red-700 text-white"
              data-testid="button-confirm-delete-price"
            >
              {deleteMutation.isPending ? 'Deleting...' : 'Delete'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
