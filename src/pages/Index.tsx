import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useNavigate } from "react-router-dom";
import { Leaf, MapPin, QrCode, BarChart3, Users, CheckCircle } from "lucide-react";

const Index = () => {
  const navigate = useNavigate();

  const features = [
    {
      icon: <Leaf className="w-8 h-8 text-forest" />,
      title: "Herb Tracking",
      description: "Record detailed information about herb harvests including location, date, and farmer details."
    },
    {
      icon: <QrCode className="w-8 h-8 text-forest" />,
      title: "QR Code Generation",
      description: "Generate unique QR codes for each herb batch to enable easy traceability."
    },
    {
      icon: <CheckCircle className="w-8 h-8 text-forest" />,
      title: "Consumer Verification",
      description: "Consumers can scan QR codes to verify the authenticity and origin of herbs."
    },
    {
      icon: <BarChart3 className="w-8 h-8 text-forest" />,
      title: "Dashboard Management",
      description: "Comprehensive dashboard to manage all herb records and download QR codes."
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-sage/20 to-herb/10">
      {/* Hero Section */}
      <section className="relative py-20 px-4">
        <div className="container mx-auto max-w-6xl text-center">
          <div className="animate-fade-in">
            <Badge variant="secondary" className="mb-6 bg-herb/20 text-forest border-forest/20">
              <Leaf className="w-4 h-4 mr-2" />
              Ayurvedic Herb Traceability
            </Badge>
            
            <h1 className="text-5xl md:text-7xl font-bold mb-6">
              <span className="bg-gradient-hero bg-clip-text text-transparent">
                AyurChain
              </span>
            </h1>
            
            <p className="text-xl md:text-2xl text-muted-foreground mb-8 max-w-3xl mx-auto leading-relaxed">
              Ensuring authenticity and traceability of Ayurvedic herbs from farm to consumer through blockchain-inspired technology.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center max-w-lg mx-auto">
              <Button 
                size="lg" 
                onClick={() => navigate('/farmer')}
                className="bg-gradient-primary hover:opacity-90 transition-all shadow-herb"
              >
                <Leaf className="w-5 h-5 mr-2" />
                Record Herbs
              </Button>
              <Button 
                variant="outline" 
                size="lg"
                onClick={() => navigate('/dashboard')}
                className="border-forest/30 text-forest hover:bg-forest/5"
              >
                <BarChart3 className="w-5 h-5 mr-2" />
                View Dashboard
              </Button>
            </div>
          </div>
        </div>
        
        {/* Decorative elements */}
        <div className="absolute top-20 left-10 opacity-20">
          <Leaf className="w-16 h-16 text-forest animate-pulse" />
        </div>
        <div className="absolute bottom-20 right-10 opacity-20">
          <Leaf className="w-12 h-12 text-herb animate-pulse" style={{ animationDelay: '1s' }} />
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-4">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-16 animate-fade-in">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              Complete Traceability Solution
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              From farmers to consumers, ensure every Ayurvedic herb is tracked, verified, and trusted.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature, index) => (
              <Card 
                key={index} 
                className="text-center shadow-card-soft hover:shadow-herb transition-all duration-300 animate-fade-in border-forest/10"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <CardHeader>
                  <div className="mx-auto mb-4 p-3 bg-herb/20 rounded-full w-fit">
                    {feature.icon}
                  </div>
                  <CardTitle className="text-lg text-foreground">
                    {feature.title}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">
                    {feature.description}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-20 px-4 bg-gradient-earth">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-16 animate-fade-in">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              How AyurChain Works
            </h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Card className="text-center shadow-card-soft animate-fade-in">
              <CardHeader>
                <div className="mx-auto mb-4 w-12 h-12 bg-gradient-primary rounded-full flex items-center justify-center text-white font-bold text-lg">
                  1
                </div>
                <CardTitle className="text-foreground">Farmers Record</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Farmers input herb details, harvest date, GPS location, and their information to create a permanent record.
                </p>
              </CardContent>
            </Card>
            
            <Card className="text-center shadow-card-soft animate-fade-in" style={{ animationDelay: '0.1s' }}>
              <CardHeader>
                <div className="mx-auto mb-4 w-12 h-12 bg-gradient-primary rounded-full flex items-center justify-center text-white font-bold text-lg">
                  2
                </div>
                <CardTitle className="text-foreground">QR Code Generated</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  A unique QR code is automatically generated for each herb batch, linking to all traceability data.
                </p>
              </CardContent>
            </Card>
            
            <Card className="text-center shadow-card-soft animate-fade-in" style={{ animationDelay: '0.2s' }}>
              <CardHeader>
                <div className="mx-auto mb-4 w-12 h-12 bg-gradient-primary rounded-full flex items-center justify-center text-white font-bold text-lg">
                  3
                </div>
                <CardTitle className="text-foreground">Consumers Verify</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Consumers scan the QR code to instantly access complete herb information and verify authenticity.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4">
        <div className="container mx-auto max-w-4xl text-center">
          <Card className="shadow-herb bg-gradient-to-br from-card to-herb/5 animate-fade-in">
            <CardContent className="p-12">
              <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
                Ready to Start Tracking?
              </h2>
              <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
                Join the revolution in Ayurvedic herb traceability. Start recording your herb harvests today.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button 
                  size="lg" 
                  onClick={() => navigate('/farmer')}
                  className="bg-gradient-primary hover:opacity-90 transition-all shadow-herb"
                >
                  <Users className="w-5 h-5 mr-2" />
                  I'm a Farmer
                </Button>
                <Button 
                  variant="outline" 
                  size="lg"
                  onClick={() => navigate('/dashboard')}
                  className="border-forest/30 text-forest hover:bg-forest/5"
                >
                  <QrCode className="w-5 h-5 mr-2" />
                  Scan QR Code
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 px-4 border-t border-border">
        <div className="container mx-auto max-w-6xl text-center">
          <p className="text-muted-foreground">
            © 2024 AyurChain. Ensuring authenticity in Ayurvedic herbs.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
