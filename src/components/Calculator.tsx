import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Calculator as CalculatorIcon, Lock } from 'lucide-react';

export const Calculator = () => {
  const [method, setMethod] = useState('');
  const [route, setRoute] = useState('');
  const [category, setCategory] = useState('');
  const [weight, setWeight] = useState('');
  const [height, setHeight] = useState('');

  const handleCalculate = () => {
    // This would require login in a real app
    alert('Please login to calculate shipping charges');
  };

  return (
    <div className="py-16 bg-muted/50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-foreground mb-4">
            Shipping Charge & CBM Calculator
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Calculate your shipping costs instantly with our advanced calculator. 
            Get accurate quotes for your cargo.
          </p>
        </div>

        <Card className="max-w-4xl mx-auto p-8 shadow-card">
          <div className="flex items-center gap-3 mb-8">
            <div className="w-12 h-12 bg-gradient-hero rounded-xl flex items-center justify-center">
              <CalculatorIcon className="w-6 h-6 text-white" />
            </div>
            <h3 className="text-2xl font-semibold text-foreground">Calculate Shipping Cost</h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="space-y-2">
              <Label htmlFor="method">Shipping Method</Label>
              <Select value={method} onValueChange={setMethod}>
                <SelectTrigger>
                  <SelectValue placeholder="Select method" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="air">Air (7-15 days)</SelectItem>
                  <SelectItem value="sea">Sea (25-35 days, 100KG min)</SelectItem>
                  <SelectItem value="hand-carry">Hand Carry (3-5 days)</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="route">Route</Label>
              <Select value={route} onValueChange={setRoute}>
                <SelectTrigger>
                  <SelectValue placeholder="Select route" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="guangzhou-bangladesh">Guangzhou → Bangladesh (7-10 days)</SelectItem>
                  <SelectItem value="hongkong-bangladesh">China → Bangladesh via Hong Kong (10-15 days)</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="category">Category</Label>
              <Select value={category} onValueChange={setCategory}>
                <SelectTrigger>
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="general">General Products (Guangzhou route)</SelectItem>
                  <SelectItem value="batteries">Batteries (Hong Kong route only)</SelectItem>
                  <SelectItem value="liquids">Liquids (Hong Kong route only)</SelectItem>
                  <SelectItem value="chemicals">Chemicals (Hong Kong route only)</SelectItem>
                  <SelectItem value="cosmetics">Cosmetics (Hong Kong route only)</SelectItem>
                  <SelectItem value="food">Food Items (Hong Kong route only)</SelectItem>
                  <SelectItem value="powders">Powders (Hong Kong route only)</SelectItem>
                  <SelectItem value="personal">Personal Use/Samples (Hand Carry only)</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="weight">Weight (KG)</Label>
              <Input
                id="weight"
                type="number"
                placeholder="Enter weight"
                value={weight}
                onChange={(e) => setWeight(e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="height">Height/CBM</Label>
              <Input
                id="height"
                type="number"
                placeholder="Enter CBM"
                value={height}
                onChange={(e) => setHeight(e.target.value)}
              />
            </div>

            <div className="flex items-end">
              <Button 
                onClick={handleCalculate}
                className="w-full gap-2"
                disabled={!method || !route || !category || !weight}
              >
                <Lock className="w-4 h-4" />
                Calculate (Login Required)
              </Button>
            </div>
          </div>

          <div className="mt-8 p-4 bg-muted/50 rounded-lg">
            <p className="text-sm text-muted-foreground text-center">
              <strong>Note:</strong> Login is required to access the shipping calculator. 
              Create an account to get instant quotes and manage your shipments.
            </p>
          </div>
        </Card>
      </div>
    </div>
  );
};