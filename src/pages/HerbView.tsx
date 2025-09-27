import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { QRCodeSVG } from "qrcode.react";
import { Leaf, MapPin, Calendar, User, ArrowLeft, CheckCircle, AlertCircle } from "lucide-react";
import { herbService } from "@/lib/supabase";
import { HerbRecord } from "@/types/herb";
import GoogleMap from "../components/GoogleMap";
import HerbTimeline from "../components/HerbTimeline";

const HerbView = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [herbRecord, setHerbRecord] = useState<HerbRecord | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadHerbAndRecordScan = async () => {
      if (!id) {
        setLoading(false);
        return;
      }

      try {
        // Load herb record
        const record = await herbService.getHerbById(id);
        
        // Transform Supabase data to component interface
        const transformedRecord = {
          id: record.id,
          herbName: record.herb_name,
          farmerName: record.farmer_name,
          location: record.location,
          harvestDate: record.harvest_date,
          notes: record.notes,
          qrCodeUrl: record.qr_code_url,
          createdAt: record.created_at,
        };
        
        setHerbRecord(transformedRecord);
        
        // Record this scan for analytics
        await herbService.recordScan(id);
      } catch (error) {
        console.error('Error loading herb:', error);
        setHerbRecord(null);
      } finally {
        setLoading(false);
      }
    };

    loadHerbAndRecordScan();
  }, [id]);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const formatDateTime = (dateString: string) => {
    return new Date(dateString).toLocaleString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getQRCodeUrl = () => {
    return window.location.href;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background to-sage p-4 flex items-center justify-center">
        <div className="text-center">
          <Leaf className="w-8 h-8 animate-pulse text-forest mx-auto mb-2" />
          <p className="text-muted-foreground">Loading herb details...</p>
        </div>
      </div>
    );
  }

  if (!herbRecord) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background to-sage p-4 flex items-center justify-center">
        <Card className="max-w-md text-center">
          <CardContent className="p-8">
            <AlertCircle className="w-16 h-16 mx-auto mb-4 text-destructive" />
            <h2 className="text-xl font-semibold mb-2">Herb Record Not Found</h2>
            <p className="text-muted-foreground mb-6">
              The herb record you're looking for doesn't exist or may have been removed.
            </p>
            <Button onClick={() => navigate('/')}>
              Return to Home
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-sage p-4">
      <div className="container mx-auto max-w-4xl">
        <div className="mb-6 animate-fade-in">
          <Button 
            variant="outline" 
            onClick={() => navigate('/')}
            className="mb-4"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Home
          </Button>
          
          <div className="text-center">
            <h1 className="text-4xl font-bold bg-gradient-hero bg-clip-text text-transparent mb-2">
              Herb Traceability
            </h1>
            <p className="text-muted-foreground">Verified Ayurvedic herb information</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main herb information */}
          <div className="lg:col-span-2 space-y-6">
            {/* Timeline */}
            <HerbTimeline record={herbRecord} />
            <Card className="shadow-herb animate-fade-in">
              <CardHeader className="bg-gradient-earth rounded-t-lg">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Leaf className="w-8 h-8 text-forest" />
                    <div>
                      <CardTitle className="text-2xl text-foreground">
                        {herbRecord.herbName}
                      </CardTitle>
                      <CardDescription className="text-sm">
                        Batch ID: {herbRecord.id}
                      </CardDescription>
                    </div>
                  </div>
                  <Badge variant="secondary" className="bg-herb text-forest flex items-center gap-1">
                    <CheckCircle className="w-3 h-3" />
                    Verified
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div className="flex items-start gap-3">
                      <User className="w-5 h-5 text-forest mt-1" />
                      <div>
                        <h3 className="font-semibold text-foreground">Farmer</h3>
                        <p className="text-muted-foreground">{herbRecord.farmerName}</p>
                      </div>
                    </div>
                    
                    <div className="flex items-start gap-3">
                      <Calendar className="w-5 h-5 text-forest mt-1" />
                      <div>
                        <h3 className="font-semibold text-foreground">Harvest Date</h3>
                        <p className="text-muted-foreground">{formatDate(herbRecord.harvestDate)}</p>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div className="flex items-start gap-3">
                      <MapPin className="w-5 h-5 text-forest mt-1" />
                      <div>
                        <h3 className="font-semibold text-foreground">Location</h3>
                        <p className="text-muted-foreground">{herbRecord.location}</p>
                      </div>
                    </div>
                    
                    <div className="flex items-start gap-3">
                      <CheckCircle className="w-5 h-5 text-forest mt-1" />
                      <div>
                        <h3 className="font-semibold text-foreground">Record Created</h3>
                        <p className="text-muted-foreground">{formatDateTime(herbRecord.createdAt)}</p>
                      </div>
                    </div>
                  </div>
                </div>

                {herbRecord.notes && (
                  <div className="mt-6 p-4 bg-sage rounded-lg">
                    <h3 className="font-semibold text-foreground mb-2">Additional Notes</h3>
                    <p className="text-muted-foreground">{herbRecord.notes}</p>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Trust & Verification */}
            <Card className="shadow-card-soft animate-fade-in">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-foreground">
                  <CheckCircle className="w-5 h-5 text-forest" />
                  Trust & Verification
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
                  <div className="p-4 bg-herb/20 rounded-lg">
                    <CheckCircle className="w-8 h-8 text-forest mx-auto mb-2" />
                    <h4 className="font-semibold text-foreground">Verified Origin</h4>
                    <p className="text-sm text-muted-foreground">Location and farmer verified</p>
                  </div>
                  <div className="p-4 bg-herb/20 rounded-lg">
                    <Leaf className="w-8 h-8 text-forest mx-auto mb-2" />
                    <h4 className="font-semibold text-foreground">Authentic Herb</h4>
                    <p className="text-sm text-muted-foreground">Genuine Ayurvedic herb</p>
                  </div>
                  <div className="p-4 bg-herb/20 rounded-lg">
                    <Calendar className="w-8 h-8 text-forest mx-auto mb-2" />
                    <h4 className="font-semibold text-foreground">Fresh Harvest</h4>
                    <p className="text-sm text-muted-foreground">Recently harvested</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Google Map */}
            <GoogleMap location={herbRecord.location} farmerName={herbRecord.farmerName} />
          </div>

          {/* QR Code sidebar */}
          <div className="space-y-6">
            <Card className="shadow-card-soft animate-fade-in">
              <CardHeader className="text-center">
                <CardTitle className="text-lg">Share this Record</CardTitle>
                <CardDescription>
                  QR code for this herb batch
                </CardDescription>
              </CardHeader>
              <CardContent className="text-center">
                <div className="bg-white p-6 rounded-lg inline-block">
                  <QRCodeSVG
                    value={getQRCodeUrl()}
                    size={200}
                    bgColor="#ffffff"
                    fgColor="#000000"
                    level="M"
                    includeMargin={true}
                  />
                </div>
                <p className="text-xs text-muted-foreground mt-3">
                  Scan to share this herb's traceability information
                </p>
              </CardContent>
            </Card>

            <Card className="shadow-card-soft animate-fade-in">
              <CardHeader>
                <CardTitle className="text-lg">About AyurChain</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground mb-4">
                  AyurChain ensures the authenticity and traceability of Ayurvedic herbs from farm to consumer, 
                  providing transparency in the supply chain.
                </p>
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={() => navigate('/')}
                  className="w-full"
                >
                  Learn More
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HerbView;