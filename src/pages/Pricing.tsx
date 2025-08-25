import { useState } from 'react';
import { Navigation } from '@/components/Navigation';
import { Footer } from '@/components/Footer';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

const Pricing = () => {
  const [method, setMethod] = useState('');
  const [route, setRoute] = useState('');
  const [category, setCategory] = useState('');
  const [weight, setWeight] = useState('');

  const methods = ['Air', 'Sea', 'Express'];
  const routes = ['Guangzhou', 'Shanghai', 'Beijing', 'Shenzhen'];
  const categories = ['Electronics', 'Clothing', 'Accessories', 'Home & Garden', 'Others'];

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <div className="container mx-auto px-4 py-16">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-maritime-blue mb-4">
            Shipping Charge Calculator
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Calculate your shipping costs instantly with our transparent pricing tool
          </p>
        </div>

        <div className="max-w-2xl mx-auto">
          <Card className="p-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <Label htmlFor="method" className="text-sm font-medium text-foreground">
                  * Method
                </Label>
                <Select value={method} onValueChange={setMethod}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select method" />
                  </SelectTrigger>
                  <SelectContent>
                    {methods.map((m) => (
                      <SelectItem key={m} value={m.toLowerCase()}>
                        {m}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="route" className="text-sm font-medium text-foreground">
                  * Route
                </Label>
                <Select value={route} onValueChange={setRoute}>
                  <SelectTrigger>
                    <SelectValue placeholder="Guangzhou" />
                  </SelectTrigger>
                  <SelectContent>
                    {routes.map((r) => (
                      <SelectItem key={r} value={r.toLowerCase()}>
                        {r}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="md:col-span-2">
                <Label htmlFor="category" className="text-sm font-medium text-foreground">
                  * Category
                </Label>
                <Select value={category} onValueChange={setCategory}>
                  <SelectTrigger>
                    <SelectValue placeholder="Search By category Name" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map((c) => (
                      <SelectItem key={c} value={c.toLowerCase()}>
                        {c}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="md:col-span-2">
                <Label htmlFor="weight" className="text-sm font-medium text-foreground">
                  * Weight
                </Label>
                <Input
                  id="weight"
                  type="number"
                  placeholder="Weight"
                  value={weight}
                  onChange={(e) => setWeight(e.target.value)}
                />
              </div>
            </div>

            <div className="mt-8 p-4 bg-accent/20 rounded-lg text-center">
              <p className="text-maritime-blue font-medium">
                Please Insert Category & Total Weight.
              </p>
            </div>

            <div className="mt-6 text-center">
              <Button variant="maritime" size="lg" className="px-8">
                Calculate Shipping Cost
              </Button>
            </div>
          </Card>

          <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card className="p-6 text-center">
              <h3 className="text-xl font-bold text-maritime-blue mb-2">Air Shipping</h3>
              <p className="text-3xl font-bold text-primary mb-2">৳180/kg</p>
              <p className="text-sm text-muted-foreground">5-7 days delivery</p>
            </Card>
            <Card className="p-6 text-center">
              <h3 className="text-xl font-bold text-maritime-blue mb-2">Sea Shipping</h3>
              <p className="text-3xl font-bold text-primary mb-2">৳120/kg</p>
              <p className="text-sm text-muted-foreground">15-20 days delivery</p>
            </Card>
            <Card className="p-6 text-center">
              <h3 className="text-xl font-bold text-maritime-blue mb-2">Express</h3>
              <p className="text-3xl font-bold text-primary mb-2">৳250/kg</p>
              <p className="text-sm text-muted-foreground">3-5 days delivery</p>
            </Card>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Pricing;