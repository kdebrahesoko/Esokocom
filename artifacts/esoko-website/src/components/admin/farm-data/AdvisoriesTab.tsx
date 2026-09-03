import { useState } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Plus, Edit2, Trash2, Calendar, FileText, Search, AlertCircle, RefreshCw } from 'lucide-react';
import { format } from 'date-fns';

import {
  useListAdvisories,
  useCreateAdvisory,
  useUpdateAdvisory,
  useDeleteAdvisory,
  getListAdvisoriesQueryKey,
  type AdvisoryItem,
  AdvisoryInputCategory
} from '@workspace/api-client-react';

import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
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
import { Badge } from '@/components/ui/badge';

const formSchema = z.object({
  category: z.nativeEnum(AdvisoryInputCategory),
  title: z.string().min(1, 'Title is required').max(500),
  body: z.string().min(1, 'Body is required').max(10000),
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Must be YYYY-MM-DD')
});

type FormValues = z.infer<typeof formSchema>;

export default function AdvisoriesTab() {
  const [searchTerm, setSearchTerm] = useState('');
  const [editingItem, setEditingItem] = useState<AdvisoryItem | null>(null);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [deletingId, setDeletingId] = useState<number | null>(null);
  
  const queryClient = useQueryClient();
  const { toast } = useToast();
  
  const { data: advisories = [], isLoading, isError, error, refetch } = useListAdvisories();
  const createMutation = useCreateAdvisory();
  const updateMutation = useUpdateAdvisory();
  const deleteMutation = useDeleteAdvisory();

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      category: 'weather',
      title: '',
      body: '',
      date: format(new Date(), 'yyyy-MM-dd')
    }
  });

  const openCreate = () => {
    form.reset({
      category: 'weather',
      title: '',
      body: '',
      date: format(new Date(), 'yyyy-MM-dd')
    });
    setEditingItem(null);
    setIsFormOpen(true);
  };

  const openEdit = (item: AdvisoryItem) => {
    form.reset({
      category: item.category,
      title: item.title,
      body: item.body,
      date: item.date
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
            queryClient.invalidateQueries({ queryKey: getListAdvisoriesQueryKey() });
            toast({ title: 'Advisory updated' });
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
            queryClient.invalidateQueries({ queryKey: getListAdvisoriesQueryKey() });
            toast({ title: 'Advisory created' });
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
          queryClient.invalidateQueries({ queryKey: getListAdvisoriesQueryKey() });
          toast({ title: 'Advisory deleted' });
          setDeletingId(null);
        },
        onError: (err) => {
          toast({ title: 'Failed to delete', description: err.message, variant: 'destructive' });
          setDeletingId(null);
        }
      }
    );
  };

  const filtered = advisories.filter(a => 
    a.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
    a.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getCategoryColor = (cat: string) => {
    switch (cat) {
      case 'weather': return 'bg-sky-100 text-sky-800 border-sky-200';
      case 'pest': return 'bg-red-100 text-red-800 border-red-200';
      case 'market': return 'bg-amber-100 text-amber-800 border-amber-200';
      case 'nutrition': return 'bg-emerald-100 text-emerald-800 border-emerald-200';
      case 'climate': return 'bg-indigo-100 text-indigo-800 border-indigo-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  return (
    <div className="flex flex-col h-full">
      <div className="p-4 border-b flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-gray-50/50">
        <div className="relative max-w-sm w-full">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <Input
            placeholder="Search advisories..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-9 bg-white"
            data-testid="input-search-advisories"
          />
        </div>
        <Button 
          onClick={openCreate} 
          className="bg-[#D9531E] hover:bg-[#B34015] text-white"
          data-testid="button-create-advisory"
        >
          <Plus className="w-4 h-4 mr-2" />
          New Advisory
        </Button>
      </div>

      <div className="flex-1 p-0 overflow-auto">
        {isLoading ? (
          <div className="p-8 space-y-4">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="h-20 bg-gray-100 animate-pulse rounded-lg" />
            ))}
          </div>
        ) : isError ? (
          <div className="p-16 text-center text-red-700" data-testid="status-advisories-error">
            <AlertCircle className="w-12 h-12 mx-auto mb-3 text-red-300" />
            <p className="text-lg font-medium">Could not load advisories</p>
            <p className="text-sm text-red-600 mt-1">{error.message}</p>
            <Button variant="outline" className="mt-4" onClick={() => refetch()} data-testid="button-retry-advisories">
              <RefreshCw className="w-4 h-4 mr-2" /> Try again
            </Button>
          </div>
        ) : filtered.length === 0 ? (
          <div className="p-16 text-center text-gray-500">
            <FileText className="w-12 h-12 mx-auto mb-3 text-gray-300" />
            <p className="text-lg font-medium text-gray-900">No advisories found</p>
            <p className="text-sm">Try adjusting your search or create a new one.</p>
          </div>
        ) : (
          <div className="divide-y">
            {filtered.map(item => (
              <div key={item.id} className="p-4 hover:bg-orange-50/30 transition-colors flex flex-col sm:flex-row sm:items-center gap-4 group" data-testid={`row-advisory-${item.id}`}>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <Badge variant="outline" className={`uppercase text-[10px] font-bold tracking-wider ${getCategoryColor(item.category)}`}>
                      {item.category}
                    </Badge>
                    <span className="text-xs text-gray-500 flex items-center gap-1">
                      <Calendar className="w-3 h-3" />
                      {item.date}
                    </span>
                  </div>
                  <h3 className="font-semibold text-gray-900 truncate" data-testid={`text-advisory-title-${item.id}`}>
                    {item.title}
                  </h3>
                  <p className="text-sm text-gray-600 line-clamp-1 mt-0.5">{item.body}</p>
                </div>
                <div className="flex items-center gap-2 opacity-100 sm:opacity-0 group-hover:opacity-100 transition-opacity">
                  <Button 
                    variant="outline" 
                    size="icon"
                    onClick={() => openEdit(item)}
                    data-testid={`button-edit-advisory-${item.id}`}
                  >
                    <Edit2 className="w-4 h-4 text-gray-600" />
                  </Button>
                  <Button 
                    variant="outline" 
                    size="icon"
                    onClick={() => setDeletingId(item.id)}
                    className="hover:bg-red-50 hover:text-red-600 hover:border-red-200"
                    data-testid={`button-delete-advisory-${item.id}`}
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>{editingItem ? 'Edit Advisory' : 'New Advisory'}</DialogTitle>
          </DialogHeader>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="category"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Category</FormLabel>
                      <Select onValueChange={field.onChange} value={field.value}>
                        <FormControl>
                          <SelectTrigger data-testid="select-advisory-category">
                            <SelectValue placeholder="Select a category" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="weather">Weather</SelectItem>
                          <SelectItem value="pest">Pest & Disease</SelectItem>
                          <SelectItem value="market">Market Intelligence</SelectItem>
                          <SelectItem value="nutrition">Nutrition</SelectItem>
                          <SelectItem value="climate">Climate Smart</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="date"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Date (YYYY-MM-DD)</FormLabel>
                      <FormControl>
                        <Input {...field} type="date" data-testid="input-advisory-date" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              
              <FormField
                control={form.control}
                name="title"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Title</FormLabel>
                    <FormControl>
                      <Input {...field} placeholder="Heavy rainfall expected in Ashanti region" data-testid="input-advisory-title" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="body"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Content Body</FormLabel>
                    <FormControl>
                      <Textarea 
                        {...field} 
                        rows={8} 
                        placeholder="Provide actionable advice for farmers..." 
                        data-testid="input-advisory-body"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <DialogFooter className="pt-4">
                <Button type="button" variant="outline" onClick={() => setIsFormOpen(false)}>
                  Cancel
                </Button>
                <Button 
                  type="submit" 
                  className="bg-[#D9531E] hover:bg-[#B34015] text-white"
                  disabled={createMutation.isPending || updateMutation.isPending}
                  data-testid="button-save-advisory"
                >
                  {(createMutation.isPending || updateMutation.isPending) ? 'Saving...' : 'Save Advisory'}
                </Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>

      <AlertDialog open={deletingId !== null} onOpenChange={(open) => !open && setDeletingId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Advisory?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This advisory will be permanently removed.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction 
              onClick={confirmDelete} 
              className="bg-red-600 hover:bg-red-700 text-white"
              data-testid="button-confirm-delete-advisory"
            >
              {deleteMutation.isPending ? 'Deleting...' : 'Delete'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
