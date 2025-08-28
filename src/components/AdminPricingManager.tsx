import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { Pencil, Trash2, Plus, Save, X } from 'lucide-react';

interface PricingRule {
  id: string;
  shipping_method: string;
  weight_from: number;
  weight_to: number | null;
  price_per_kg: number;
  currency: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export const AdminPricingManager: React.FC = () => {
  const [pricingRules, setPricingRules] = useState<PricingRule[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingRule, setEditingRule] = useState<PricingRule | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const { toast } = useToast();

  const [formData, setFormData] = useState({
    shipping_method: '',
    weight_from: '',
    weight_to: '',
    price_per_kg: '',
    currency: 'BDT',
    is_active: true,
  });

  useEffect(() => {
    fetchPricingRules();
  }, []);

  const fetchPricingRules = async () => {
    try {
      const { data, error } = await supabase
        .from('dynamic_pricing')
        .select('*')
        .order('shipping_method', { ascending: true })
        .order('weight_from', { ascending: true });

      if (error) throw error;
      setPricingRules(data || []);
    } catch (error) {
      console.error('Error fetching pricing rules:', error);
      toast({
        title: 'Error',
        description: 'Failed to fetch pricing rules',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      const ruleData = {
        shipping_method: formData.shipping_method,
        weight_from: parseFloat(formData.weight_from),
        weight_to: formData.weight_to ? parseFloat(formData.weight_to) : null,
        price_per_kg: parseFloat(formData.price_per_kg),
        currency: formData.currency,
        is_active: formData.is_active,
        updated_by: (await supabase.auth.getUser()).data.user?.id,
      };

      let error;
      
      if (editingRule) {
        ({ error } = await supabase
          .from('dynamic_pricing')
          .update(ruleData)
          .eq('id', editingRule.id));
      } else {
        ({ error } = await supabase
          .from('dynamic_pricing')
          .insert({ ...ruleData, created_by: (await supabase.auth.getUser()).data.user?.id }));
      }

      if (error) throw error;

      toast({
        title: 'Success',
        description: `Pricing rule ${editingRule ? 'updated' : 'created'} successfully`,
      });

      setIsDialogOpen(false);
      resetForm();
      fetchPricingRules();
    } catch (error) {
      console.error('Error saving pricing rule:', error);
      toast({
        title: 'Error',
        description: 'Failed to save pricing rule',
        variant: 'destructive',
      });
    }
  };

  const handleEdit = (rule: PricingRule) => {
    setEditingRule(rule);
    setFormData({
      shipping_method: rule.shipping_method,
      weight_from: rule.weight_from.toString(),
      weight_to: rule.weight_to?.toString() || '',
      price_per_kg: rule.price_per_kg.toString(),
      currency: rule.currency,
      is_active: rule.is_active,
    });
    setIsDialogOpen(true);
  };

  const handleDelete = async (id: string) => {
    try {
      const { error } = await supabase
        .from('dynamic_pricing')
        .delete()
        .eq('id', id);

      if (error) throw error;

      toast({
        title: 'Success',
        description: 'Pricing rule deleted successfully',
      });

      fetchPricingRules();
    } catch (error) {
      console.error('Error deleting pricing rule:', error);
      toast({
        title: 'Error',
        description: 'Failed to delete pricing rule',
        variant: 'destructive',
      });
    }
  };

  const resetForm = () => {
    setFormData({
      shipping_method: '',
      weight_from: '',
      weight_to: '',
      price_per_kg: '',
      currency: 'BDT',
      is_active: true,
    });
    setEditingRule(null);
  };

  const formatWeightRange = (from: number, to: number | null) => {
    if (to === null) {
      return `${from} KG+`;
    }
    return `${from} - ${to} KG`;
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-white">Shipping Charge Management</h2>
          <p className="text-gray-300">Customize shipping rates and categories</p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={resetForm} className="bg-primary hover:bg-primary/90">
              <Plus className="h-4 w-4 mr-2" />
              Add New Rate
            </Button>
          </DialogTrigger>
          <DialogContent className="bg-slate-900 border-white/10">
            <DialogHeader>
              <DialogTitle className="text-white">
                {editingRule ? 'Edit Pricing Rule' : 'Add New Pricing Rule'}
              </DialogTitle>
              <DialogDescription className="text-gray-300">
                Configure shipping rates for different weight ranges and methods.
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="shipping_method" className="text-white">Shipping Method</Label>
                  <Select
                    value={formData.shipping_method}
                    onValueChange={(value) => setFormData({ ...formData, shipping_method: value })}
                  >
                    <SelectTrigger className="bg-black/20 border-white/10 text-white">
                      <SelectValue placeholder="Select method" />
                    </SelectTrigger>
                    <SelectContent className="bg-slate-900 border-white/10">
                      <SelectItem value="Air">Air</SelectItem>
                      <SelectItem value="Sea">Sea</SelectItem>
                      <SelectItem value="Hand Carry">Hand Carry</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="currency" className="text-white">Currency</Label>
                  <Select
                    value={formData.currency}
                    onValueChange={(value) => setFormData({ ...formData, currency: value })}
                  >
                    <SelectTrigger className="bg-black/20 border-white/10 text-white">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-slate-900 border-white/10">
                      <SelectItem value="BDT">BDT (৳)</SelectItem>
                      <SelectItem value="USD">USD ($)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="weight_from" className="text-white">Weight From (KG)</Label>
                  <Input
                    id="weight_from"
                    type="number"
                    step="0.1"
                    value={formData.weight_from}
                    onChange={(e) => setFormData({ ...formData, weight_from: e.target.value })}
                    className="bg-black/20 border-white/10 text-white"
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="weight_to" className="text-white">Weight To (KG) - Optional</Label>
                  <Input
                    id="weight_to"
                    type="number"
                    step="0.1"
                    value={formData.weight_to}
                    onChange={(e) => setFormData({ ...formData, weight_to: e.target.value })}
                    className="bg-black/20 border-white/10 text-white"
                    placeholder="Leave empty for unlimited"
                  />
                </div>
              </div>
              <div>
                <Label htmlFor="price_per_kg" className="text-white">Price per KG</Label>
                <Input
                  id="price_per_kg"
                  type="number"
                  step="0.01"
                  value={formData.price_per_kg}
                  onChange={(e) => setFormData({ ...formData, price_per_kg: e.target.value })}
                  className="bg-black/20 border-white/10 text-white"
                  required
                />
              </div>
              <div className="flex items-center justify-between pt-4">
                <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                  <X className="h-4 w-4 mr-2" />
                  Cancel
                </Button>
                <Button type="submit" className="bg-primary hover:bg-primary/90">
                  <Save className="h-4 w-4 mr-2" />
                  {editingRule ? 'Update' : 'Create'} Rule
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <Card className="bg-black/20 border-white/10">
        <CardHeader>
          <CardTitle className="text-white">Current Pricing Rules</CardTitle>
          <CardDescription className="text-gray-300">
            Manage your shipping rates for different methods and weight ranges
          </CardDescription>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="text-center py-8 text-gray-300">Loading pricing rules...</div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow className="border-white/10">
                  <TableHead className="text-gray-300">Method</TableHead>
                  <TableHead className="text-gray-300">Weight Range</TableHead>
                  <TableHead className="text-gray-300">Price per KG</TableHead>
                  <TableHead className="text-gray-300">Status</TableHead>
                  <TableHead className="text-gray-300">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {pricingRules.map((rule) => (
                  <TableRow key={rule.id} className="border-white/10">
                    <TableCell className="text-white font-medium">
                      {rule.shipping_method}
                    </TableCell>
                    <TableCell className="text-gray-300">
                      {formatWeightRange(rule.weight_from, rule.weight_to)}
                    </TableCell>
                    <TableCell className="text-white">
                      {rule.currency === 'BDT' ? '৳' : '$'}{rule.price_per_kg}
                    </TableCell>
                    <TableCell>
                      <Badge variant={rule.is_active ? "default" : "secondary"}>
                        {rule.is_active ? 'Active' : 'Inactive'}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex space-x-2">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleEdit(rule)}
                          className="text-white border-white/10 hover:bg-white/10"
                        >
                          <Pencil className="h-4 w-4" />
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleDelete(rule.id)}
                          className="text-red-400 border-red-400/30 hover:bg-red-400/10"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
};