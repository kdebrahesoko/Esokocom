import { useState } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Plus, Edit2, Trash2, Clock, MessageSquare, Search, Send, AlertCircle, RefreshCw } from 'lucide-react';

import {
  useListSmsAlerts,
  useCreateSmsAlert,
  useUpdateSmsAlert,
  useDeleteSmsAlert,
  getListSmsAlertsQueryKey,
  type SmsAlertItem,
  SmsAlertInputType
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
  FormDescription,
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
  type: z.nativeEnum(SmsAlertInputType),
  message: z.string().min(1, 'Message is required').max(1600, 'Message too long'),
  timestamp: z.string().min(1, 'Timestamp is required')
});

type FormValues = z.infer<typeof formSchema>;

function toLocalDateTimeInput(value: string | Date): string {
  const date = new Date(value);
  const local = new Date(date.getTime() - date.getTimezoneOffset() * 60_000);
  return local.toISOString().slice(0, 16);
}

export default function SmsAlertsTab() {
  const [searchTerm, setSearchTerm] = useState('');
  const [editingItem, setEditingItem] = useState<SmsAlertItem | null>(null);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [deletingId, setDeletingId] = useState<number | null>(null);
  
  const queryClient = useQueryClient();
  const { toast } = useToast();
  
  const { data: alerts = [], isLoading, isError, error, refetch } = useListSmsAlerts();
  const createMutation = useCreateSmsAlert();
  const updateMutation = useUpdateSmsAlert();
  const deleteMutation = useDeleteSmsAlert();

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      type: 'advisory',
      message: '',
      timestamp: toLocalDateTimeInput(new Date())
    }
  });

  const openCreate = () => {
    form.reset({
      type: 'advisory',
      message: '',
      timestamp: toLocalDateTimeInput(new Date())
    });
    setEditingItem(null);
    setIsFormOpen(true);
  };

  const openEdit = (item: SmsAlertItem) => {
    form.reset({
      type: item.type,
      message: item.message,
      timestamp: toLocalDateTimeInput(item.timestamp)
    });
    setEditingItem(item);
    setIsFormOpen(true);
  };

  const onSubmit = (values: FormValues) => {
    const data = { ...values, timestamp: new Date(values.timestamp).toISOString() };
    if (editingItem) {
      updateMutation.mutate(
        { id: editingItem.id, data },
        {
          onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: getListSmsAlertsQueryKey() });
            toast({ title: 'SMS alert updated' });
            setIsFormOpen(false);
          },
          onError: (err) => {
            toast({ title: 'Failed to update', description: err.message, variant: 'destructive' });
          }
        }
      );
    } else {
      createMutation.mutate(
        { data },
        {
          onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: getListSmsAlertsQueryKey() });
            toast({ title: 'SMS alert created' });
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
          queryClient.invalidateQueries({ queryKey: getListSmsAlertsQueryKey() });
          toast({ title: 'SMS alert deleted' });
          setDeletingId(null);
        },
        onError: (err) => {
          toast({ title: 'Failed to delete', description: err.message, variant: 'destructive' });
          setDeletingId(null);
        }
      }
    );
  };

  const filtered = alerts.filter(a => 
    a.message.toLowerCase().includes(searchTerm.toLowerCase()) || 
    a.type.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'weather': return 'bg-sky-100 text-sky-800 border-sky-200';
      case 'pest': return 'bg-red-100 text-red-800 border-red-200';
      case 'market': return 'bg-amber-100 text-amber-800 border-amber-200';
      case 'survey': return 'bg-purple-100 text-purple-800 border-purple-200';
      case 'advisory': return 'bg-emerald-100 text-emerald-800 border-emerald-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const formatDate = (isoString: string) => {
    try {
      const date = new Date(isoString);
      return new Intl.DateTimeFormat('en-GB', { 
        dateStyle: 'medium', 
        timeStyle: 'short' 
      }).format(date);
    } catch {
      return isoString;
    }
  };

  return (
    <div className="flex flex-col h-full">
      <div className="p-4 border-b flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-gray-50/50">
        <div className="relative max-w-sm w-full">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <Input
            placeholder="Search message content..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-9 bg-white"
            data-testid="input-search-sms"
          />
        </div>
        <Button 
          onClick={openCreate} 
          className="bg-[#D9531E] hover:bg-[#B34015] text-white"
          data-testid="button-create-sms"
        >
          <Plus className="w-4 h-4 mr-2" />
          New SMS Alert
        </Button>
      </div>

      <div className="flex-1 p-0 overflow-auto bg-gray-50/30">
        {isLoading ? (
          <div className="p-8 space-y-4 max-w-4xl mx-auto">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="h-24 bg-white border border-gray-100 shadow-sm animate-pulse rounded-2xl" />
            ))}
          </div>
        ) : isError ? (
          <div className="p-16 text-center text-red-700" data-testid="status-sms-error">
            <AlertCircle className="w-12 h-12 mx-auto mb-3 text-red-300" />
            <p className="text-lg font-medium">Could not load SMS alerts</p>
            <p className="text-sm text-red-600 mt-1">{error.message}</p>
            <Button variant="outline" className="mt-4" onClick={() => refetch()} data-testid="button-retry-sms">
              <RefreshCw className="w-4 h-4 mr-2" /> Try again
            </Button>
          </div>
        ) : filtered.length === 0 ? (
          <div className="p-16 text-center text-gray-500">
            <MessageSquare className="w-12 h-12 mx-auto mb-3 text-gray-300" />
            <p className="text-lg font-medium text-gray-900">No SMS alerts found</p>
            <p className="text-sm">Try adjusting your search or draft a new alert.</p>
          </div>
        ) : (
          <div className="p-4 max-w-4xl mx-auto space-y-4">
            {filtered.map(item => (
              <div key={item.id} className="bg-white border border-gray-200 shadow-sm rounded-2xl p-5 hover:border-[#D9531E]/30 transition-colors group relative" data-testid={`row-sms-${item.id}`}>
                <div className="flex justify-between items-start gap-4 mb-3">
                  <div className="flex items-center gap-3">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center ${getTypeColor(item.type).replace('text-', 'text-').replace('bg-', 'bg-').replace('border-', 'border-')}`}>
                      <Send className="w-4 h-4" />
                    </div>
                    <div>
                      <Badge variant="outline" className={`uppercase text-[10px] font-bold tracking-wider mb-1 ${getTypeColor(item.type)}`}>
                        {item.type}
                      </Badge>
                      <div className="text-xs text-gray-500 flex items-center gap-1 font-medium">
                        <Clock className="w-3 h-3" />
                        {formatDate(item.timestamp)}
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-1 opacity-100 sm:opacity-0 group-hover:opacity-100 transition-opacity">
                    <Button 
                      variant="ghost" 
                      size="icon"
                      className="h-8 w-8 text-gray-400 hover:text-gray-900 bg-gray-50 hover:bg-gray-100 rounded-full"
                      onClick={() => openEdit(item)}
                      data-testid={`button-edit-sms-${item.id}`}
                    >
                      <Edit2 className="w-3.5 h-3.5" />
                    </Button>
                    <Button 
                      variant="ghost" 
                      size="icon"
                      onClick={() => setDeletingId(item.id)}
                      className="h-8 w-8 text-gray-400 hover:text-red-600 bg-gray-50 hover:bg-red-50 rounded-full"
                      data-testid={`button-delete-sms-${item.id}`}
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </Button>
                  </div>
                </div>
                
                <div className="bg-gray-50 p-4 rounded-xl text-gray-800 text-sm font-medium leading-relaxed relative font-mono" data-testid={`text-sms-message-${item.id}`}>
                  {item.message}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
        <DialogContent className="max-w-xl">
          <DialogHeader>
            <DialogTitle>{editingItem ? 'Edit SMS Alert' : 'Draft SMS Alert'}</DialogTitle>
          </DialogHeader>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="type"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Alert Type</FormLabel>
                      <Select onValueChange={field.onChange} value={field.value}>
                        <FormControl>
                          <SelectTrigger data-testid="select-sms-type">
                            <SelectValue placeholder="Select type" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="advisory">General Advisory</SelectItem>
                          <SelectItem value="weather">Weather Alert</SelectItem>
                          <SelectItem value="market">Market Update</SelectItem>
                          <SelectItem value="pest">Pest Outbreak</SelectItem>
                          <SelectItem value="survey">Survey Request</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="timestamp"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Send time</FormLabel>
                      <FormControl>
                        <Input {...field} type="datetime-local" data-testid="input-sms-timestamp" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name="message"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Message Content</FormLabel>
                    <FormControl>
                      <Textarea 
                        {...field} 
                        rows={5} 
                        className="font-mono text-sm resize-none"
                        placeholder="Type SMS message here..." 
                        data-testid="input-sms-message"
                      />
                    </FormControl>
                    <div className="flex justify-between items-center mt-1">
                      <FormDescription>
                        Keep it concise for SMS delivery.
                      </FormDescription>
                      <span className={`text-xs font-medium ${field.value.length > 160 ? 'text-amber-600' : 'text-gray-400'}`}>
                        {field.value.length} / 160 chars ({Math.ceil(Math.max(field.value.length, 1) / 160)} segment{Math.ceil(Math.max(field.value.length, 1) / 160) !== 1 ? 's' : ''})
                      </span>
                    </div>
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
                  data-testid="button-save-sms"
                >
                  {(createMutation.isPending || updateMutation.isPending) ? 'Saving...' : (editingItem ? 'Save Changes' : 'Send Alert')}
                </Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>

      <AlertDialog open={deletingId !== null} onOpenChange={(open) => !open && setDeletingId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete SMS Alert?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This record will be permanently removed.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction 
              onClick={confirmDelete} 
              className="bg-red-600 hover:bg-red-700 text-white"
              data-testid="button-confirm-delete-sms"
            >
              {deleteMutation.isPending ? 'Deleting...' : 'Delete'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
