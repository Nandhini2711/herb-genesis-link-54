import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { MapPin, Leaf, Calendar, User } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { herbService } from "@/lib/supabase";
import { HerbRecord } from "@/types/herb";

const FarmerForm = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    herbName: "",
    farmerName: "",
    location: "",
    harvestDate: "",
    notes: "",
  });

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const getCurrentLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          setFormData(prev => ({ 
            ...prev, 
            location: `${latitude.toFixed(6)}, ${longitude.toFixed(6)}` 
          }));
          toast({
            title: "Location captured",
            description: "GPS coordinates have been added to your entry.",
          });
        },
        (error) => {
          toast({
            title: "Location access denied",
            description: "Please enter your location manually.",
            variant: "destructive",
          });
        }
      );
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const herbData = {
        herb_name: formData.herbName,
        farmer_name: formData.farmerName,
        location: formData.location,
        harvest_date: formData.harvestDate,
        notes: formData.notes || undefined,
      };

      const newRecord = await herbService.createHerb(herbData);

      toast({
        title: "Herb record created!",
        description: `Successfully recorded ${formData.herbName} batch.`,
      });

      // Navigate to dashboard with the new record ID
      navigate('/dashboard', { state: { newRecordId: newRecord.id } });
    } catch (error) {
      console.error('Error creating herb record:', error);
      toast({
        title: "Error", 
        description: "Failed to create herb record. Please check your Supabase configuration.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const isFormValid = formData.herbName && formData.farmerName && formData.location && formData.harvestDate;

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-sage p-4">
      <div className="container mx-auto max-w-2xl">
        <div className="mb-8 text-center animate-fade-in">
          <h1 className="text-4xl font-bold bg-gradient-hero bg-clip-text text-transparent mb-2">
            AyurChain
          </h1>
          <p className="text-muted-foreground">Record your herb harvest details</p>
        </div>

        <Card className="shadow-herb animate-fade-in">
          <CardHeader className="bg-gradient-earth rounded-t-lg">
            <CardTitle className="flex items-center gap-2 text-foreground">
              <Leaf className="w-5 h-5 text-forest" />
              New Herb Record
            </CardTitle>
            <CardDescription>
              Fill in the details for your herb batch to generate a unique QR code for traceability.
            </CardDescription>
          </CardHeader>
          <CardContent className="p-6">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="herbName" className="flex items-center gap-2">
                    <Leaf className="w-4 h-4 text-forest" />
                    Herb Name
                  </Label>
                  <Input
                    id="herbName"
                    placeholder="e.g., Turmeric, Ashwagandha"
                    value={formData.herbName}
                    onChange={(e) => handleInputChange("herbName", e.target.value)}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="farmerName" className="flex items-center gap-2">
                    <User className="w-4 h-4 text-forest" />
                    Farmer Name
                  </Label>
                  <Input
                    id="farmerName"
                    placeholder="Your full name"
                    value={formData.farmerName}
                    onChange={(e) => handleInputChange("farmerName", e.target.value)}
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="location" className="flex items-center gap-2">
                    <MapPin className="w-4 h-4 text-forest" />
                    Location
                  </Label>
                  <div className="flex gap-2">
                    <Input
                      id="location"
                      placeholder="Farm location or GPS coordinates"
                      value={formData.location}
                      onChange={(e) => handleInputChange("location", e.target.value)}
                      required
                    />
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={getCurrentLocation}
                      className="shrink-0"
                    >
                      <MapPin className="w-4 h-4" />
                    </Button>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="harvestDate" className="flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-forest" />
                    Harvest Date
                  </Label>
                  <Input
                    id="harvestDate"
                    type="date"
                    value={formData.harvestDate}
                    onChange={(e) => handleInputChange("harvestDate", e.target.value)}
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="notes">Additional Notes (Optional)</Label>
                <Textarea
                  id="notes"
                  placeholder="Any additional information about the harvest, organic certification, etc."
                  value={formData.notes}
                  onChange={(e) => handleInputChange("notes", e.target.value)}
                  className="min-h-[80px]"
                />
              </div>

              <Button
                type="submit"
                className="w-full bg-gradient-primary hover:opacity-90 transition-opacity"
                disabled={!isFormValid || isSubmitting}
              >
                {isSubmitting ? "Creating Record..." : "Create Herb Record & Generate QR Code"}
              </Button>
            </form>
          </CardContent>
        </Card>

        <div className="mt-6 text-center">
          <Button variant="outline" onClick={() => navigate('/')}>
            Back to Home
          </Button>
        </div>
      </div>
    </div>
  );
};

export default FarmerForm;