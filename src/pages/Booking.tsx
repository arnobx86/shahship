import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { Navigation } from '@/components/Navigation';
import { Footer } from '@/components/Footer';
import { Plus, Trash2, Package, MapPin, Calculator } from 'lucide-react';

export default function Booking() {
  const [shippingMethod, setShippingMethod] = useState('');
  const [shippingMark, setShippingMark] = useState('');
  const [trackingNumbers, setTrackingNumbers] = useState(['']);
  const [itemName, setItemName] = useState('');
  const [category, setCategory] = useState('');
  const [totalCarton, setTotalCarton] = useState('');
  const [totalQuantity, setTotalQuantity] = useState('');
  const [totalWeight, setTotalWeight] = useState('');
  const [deliveryMethod, setDeliveryMethod] = useState('');
  const [district, setDistrict] = useState('');
  const [city, setCity] = useState('');
  const [street, setStreet] = useState('');
  const [note, setNote] = useState('');
  const [agreeTerms, setAgreeTerms] = useState(false);

  const addTrackingNumber = () => {
    setTrackingNumbers([...trackingNumbers, '']);
  };

  const removeTrackingNumber = (index: number) => {
    if (trackingNumbers.length > 1) {
      setTrackingNumbers(trackingNumbers.filter((_, i) => i !== index));
    }
  };

  const updateTrackingNumber = (index: number, value: string) => {
    const updated = [...trackingNumbers];
    updated[index] = value;
    setTrackingNumbers(updated);
  };

  const calculateTotal = () => {
    const weight = parseFloat(totalWeight) || 0;
    const rate = 150; // Rate per KG (example)
    return weight * rate;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!agreeTerms) {
      alert('Please agree to Terms & Conditions and Privacy Policy');
      return;
    }
    alert('Booking placed successfully! You will receive a confirmation email shortly.');
  };

  const isFormValid = itemName && category && totalCarton && totalQuantity && 
                     totalWeight && deliveryMethod && district && city && street && agreeTerms;

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      <div className="container mx-auto px-4 py-8">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-foreground mb-4">Create Booking</h1>
          <p className="text-lg text-muted-foreground">
            Fill in the details below to create your shipping booking
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Left Side - Booking Form */}
          <div className="lg:col-span-2 space-y-8">
            {/* Booking Information */}
            <Card className="p-6">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 bg-gradient-hero rounded-lg flex items-center justify-center">
                  <Package className="w-5 h-5 text-white" />
                </div>
                <h2 className="text-xl font-semibold">Booking Information</h2>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="shipping-method">Shipping Method *</Label>
                  <Select value={shippingMethod} onValueChange={setShippingMethod}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select shipping method" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="air">Air Freight</SelectItem>
                      <SelectItem value="sea">Sea Freight</SelectItem>
                      <SelectItem value="hand-carry">Hand Carry</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="shipping-mark">Shipping Mark</Label>
                  <Input
                    id="shipping-mark"
                    placeholder="Enter shipping mark"
                    value={shippingMark}
                    onChange={(e) => setShippingMark(e.target.value)}
                  />
                </div>
              </div>

              <div className="mt-6">
                <Label className="mb-3 block">Tracking Numbers</Label>
                <div className="space-y-3">
                  {trackingNumbers.map((tracking, index) => (
                    <div key={index} className="flex gap-2">
                      <Input
                        placeholder={`Tracking number ${index + 1}`}
                        value={tracking}
                        onChange={(e) => updateTrackingNumber(index, e.target.value)}
                        className="flex-1"
                      />
                      {trackingNumbers.length > 1 && (
                        <Button
                          type="button"
                          variant="outline"
                          size="icon"
                          onClick={() => removeTrackingNumber(index)}
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      )}
                    </div>
                  ))}
                  <Button
                    type="button"
                    variant="outline"
                    onClick={addTrackingNumber}
                    className="gap-2"
                  >
                    <Plus className="w-4 h-4" />
                    Add More Tracking
                  </Button>
                </div>
              </div>
            </Card>

            {/* Item Details */}
            <Card className="p-6">
              <h2 className="text-xl font-semibold mb-6">Item Details</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="item-name">Item Name *</Label>
                  <Input
                    id="item-name"
                    placeholder="Enter item name"
                    value={itemName}
                    onChange={(e) => setItemName(e.target.value)}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="category">Category *</Label>
                  <Select value={category} onValueChange={setCategory}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="electronics">Electronics</SelectItem>
                      <SelectItem value="clothing">Clothing & Textiles</SelectItem>
                      <SelectItem value="machinery">Machinery</SelectItem>
                      <SelectItem value="general">General Cargo</SelectItem>
                      <SelectItem value="medical">Medical Equipment</SelectItem>
                      <SelectItem value="food">Food Items</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="total-carton">Total Carton *</Label>
                  <Input
                    id="total-carton"
                    type="number"
                    placeholder="Enter total carton"
                    value={totalCarton}
                    onChange={(e) => setTotalCarton(e.target.value)}
                    min="1"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="total-quantity">Total Quantity *</Label>
                  <Input
                    id="total-quantity"
                    type="number"
                    placeholder="Enter total quantity"
                    value={totalQuantity}
                    onChange={(e) => setTotalQuantity(e.target.value)}
                    min="1"
                    required
                  />
                </div>

                <div className="space-y-2 md:col-span-2">
                  <Label htmlFor="total-weight">Total Weight (KG) *</Label>
                  <Input
                    id="total-weight"
                    type="number"
                    placeholder="Enter total weight"
                    value={totalWeight}
                    onChange={(e) => setTotalWeight(e.target.value)}
                    min="0.1"
                    step="0.1"
                    required
                  />
                </div>
              </div>

              <div className="mt-4 p-4 bg-muted/50 rounded-lg">
                <p className="text-sm text-muted-foreground">
                  <strong>সিস্টেম মেসেজ:</strong> সঠিক তথ্য প্রদান করুন এবং নিশ্চিত হয়ে নিন যে সমস্ত তথ্য সঠিক।
                </p>
              </div>
            </Card>

            {/* Delivery Information */}
            <Card className="p-6">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 bg-gradient-hero rounded-lg flex items-center justify-center">
                  <MapPin className="w-5 h-5 text-white" />
                </div>
                <h2 className="text-xl font-semibold">Delivery Information</h2>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="delivery-method">Delivery Method *</Label>
                  <Select value={deliveryMethod} onValueChange={setDeliveryMethod}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select delivery method" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="home-delivery">Home Delivery</SelectItem>
                      <SelectItem value="pickup">Warehouse Pickup</SelectItem>
                      <SelectItem value="office-delivery">Office Delivery</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="district">District *</Label>
                  <Select value={district} onValueChange={setDistrict}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select district" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="dhaka">Dhaka</SelectItem>
                      <SelectItem value="chittagong">Chittagong</SelectItem>
                      <SelectItem value="sylhet">Sylhet</SelectItem>
                      <SelectItem value="rajshahi">Rajshahi</SelectItem>
                      <SelectItem value="khulna">Khulna</SelectItem>
                      <SelectItem value="barishal">Barishal</SelectItem>
                      <SelectItem value="rangpur">Rangpur</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="city">City *</Label>
                  <Input
                    id="city"
                    placeholder="Enter city name"
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="street">Street Address *</Label>
                  <Input
                    id="street"
                    placeholder="Enter street address"
                    value={street}
                    onChange={(e) => setStreet(e.target.value)}
                    required
                  />
                </div>

                <div className="space-y-2 md:col-span-2">
                  <Label htmlFor="note">Special Instructions (Optional)</Label>
                  <Textarea
                    id="note"
                    placeholder="Any special delivery instructions..."
                    value={note}
                    onChange={(e) => setNote(e.target.value)}
                  />
                </div>
              </div>
            </Card>

            {/* Terms and Submit */}
            <Card className="p-6">
              <div className="space-y-6">
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="terms"
                    checked={agreeTerms}
                    onCheckedChange={(checked) => setAgreeTerms(checked === true)}
                  />
                  <label
                    htmlFor="terms"
                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                  >
                    I agree to the{' '}
                    <a href="/terms" className="text-primary hover:underline">
                      Terms & Conditions
                    </a>{' '}
                    and{' '}
                    <a href="/privacy" className="text-primary hover:underline">
                      Privacy Policy
                    </a>
                  </label>
                </div>

                <Button
                  onClick={handleSubmit}
                  disabled={!isFormValid}
                  size="lg"
                  variant="hero"
                  className="w-full"
                >
                  Place Booking
                </Button>
              </div>
            </Card>
          </div>

          {/* Right Side - Summary */}
          <div className="space-y-6">
            <Card className="p-6 sticky top-8">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 bg-gradient-hero rounded-lg flex items-center justify-center">
                  <Calculator className="w-5 h-5 text-white" />
                </div>
                <h3 className="text-xl font-semibold">Summary</h3>
              </div>

              <div className="space-y-4">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Total Weight:</span>
                  <span className="font-medium">{totalWeight || 0} KG</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Rate per KG:</span>
                  <span className="font-medium">৳150</span>
                </div>
                <hr />
                <div className="flex justify-between text-lg font-semibold">
                  <span>Total Charge:</span>
                  <span className="text-primary">৳{calculateTotal()}</span>
                </div>
              </div>

              <div className="mt-6 p-4 bg-muted/50 rounded-lg">
                <h4 className="font-semibold mb-2">Warehouse Address:</h4>
                <p className="text-sm text-muted-foreground">
                  House 123, Road 456<br />
                  Gulshan, Dhaka-1212<br />
                  Bangladesh
                </p>
              </div>

              <div className="mt-4 p-4 bg-primary/10 rounded-lg">
                <p className="text-sm text-primary">
                  <strong>নির্দেশনা:</strong> সঠিক তথ্য প্রদান করুন এবং পেমেন্ট সম্পূর্ণ করার আগে সমস্ত বিবরণ যাচাই করুন।
                </p>
              </div>
            </Card>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}