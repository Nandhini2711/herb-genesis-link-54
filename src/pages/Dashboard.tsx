import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { QRCodeSVG } from "qrcode.react";
import { Leaf, MapPin, Calendar, User, Eye, Download, Plus, Search, BarChart3 } from "lucide-react";
import { herbService } from "@/lib/supabase";
import { HerbRecord } from "@/types/herb";

const Dashboard = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [herbRecords, setHerbRecords] = useState<HerbRecord[]>([]);
  const [filteredRecords, setFilteredRecords] = useState<HerbRecord[]>([]);
  const [highlightedRecordId, setHighlightedRecordId] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState("newest");

  useEffect(() => {
    const loadHerbs = async () => {
      try {
        const records = await herbService.getAllHerbs();
        // Transform Supabase data to match component interface
        const transformedRecords = records.map(record => ({
          id: record.id,
          herbName: record.herb_name,
          farmerName: record.farmer_name,
          location: record.location,
          harvestDate: record.harvest_date,
          notes: record.notes,
          qrCodeUrl: record.qr_code_url,
          createdAt: record.created_at,
        }));
        setHerbRecords(transformedRecords);
      } catch (error) {
        console.error('Error loading herbs:', error);
      }
    };

    loadHerbs();

    // Highlight newly created record
    if (location.state?.newRecordId) {
      setHighlightedRecordId(location.state.newRecordId);
      setTimeout(() => setHighlightedRecordId(null), 3000);
    }
  }, [location.state]);

  // Filter and sort records
  useEffect(() => {
    let filtered = herbRecords.filter(record =>
      record.herbName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      record.farmerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      record.location.toLowerCase().includes(searchTerm.toLowerCase())
    );

    // Sort records
    switch (sortBy) {
      case "newest":
        filtered.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
        break;
      case "oldest":
        filtered.sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());
        break;
      case "herbName":
        filtered.sort((a, b) => a.herbName.localeCompare(b.herbName));
        break;
      case "farmerName":
        filtered.sort((a, b) => a.farmerName.localeCompare(b.farmerName));
        break;
    }

    setFilteredRecords(filtered);
  }, [herbRecords, searchTerm, sortBy]);

  const handleViewRecord = (recordId: string) => {
    navigate(`/herb/${recordId}`);
  };

  const downloadQRCode = (recordId: string, herbName: string) => {
    const svg = document.getElementById(`qr-${recordId}`);
    if (svg) {
      const svgData = new XMLSerializer().serializeToString(svg);
      const canvas = document.createElement("canvas");
      const ctx = canvas.getContext("2d");
      const img = new Image();
      
      img.onload = () => {
        canvas.width = img.width;
        canvas.height = img.height;
        ctx?.drawImage(img, 0, 0);
        
        const pngFile = canvas.toDataURL("image/png");
        const downloadLink = document.createElement("a");
        downloadLink.download = `${herbName}-QR-${recordId}.png`;
        downloadLink.href = pngFile;
        downloadLink.click();
      };
      
      img.src = "data:image/svg+xml;base64," + btoa(svgData);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const getQRCodeUrl = (recordId: string) => {
    return `${window.location.origin}/herb/${recordId}`;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-sage p-4">
      <div className="container mx-auto max-w-6xl">
        <div className="mb-8 text-center animate-fade-in">
          <h1 className="text-4xl font-bold bg-gradient-hero bg-clip-text text-transparent mb-2">
            AyurChain Dashboard
          </h1>
          <p className="text-muted-foreground">Manage your herb records and QR codes</p>
        </div>

        {/* Analytics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card className="shadow-card-soft animate-fade-in">
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-herb/20 rounded-lg">
                  <Leaf className="w-6 h-6 text-forest" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-foreground">{herbRecords.length}</p>
                  <p className="text-sm text-muted-foreground">Total Herbs</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card className="shadow-card-soft animate-fade-in">
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-earth/20 rounded-lg">
                  <User className="w-6 h-6 text-forest" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-foreground">
                    {new Set(herbRecords.map(r => r.farmerName)).size}
                  </p>
                  <p className="text-sm text-muted-foreground">Active Farmers</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card className="shadow-card-soft animate-fade-in">
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-sage/20 rounded-lg">
                  <BarChart3 className="w-6 h-6 text-forest" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-foreground">
                    {herbRecords.length > 0 ? Math.round(herbRecords.length / new Set(herbRecords.map(r => r.farmerName)).size * 10) / 10 : 0}
                  </p>
                  <p className="text-sm text-muted-foreground">Avg per Farmer</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="mb-6 space-y-4">
          <div className="flex flex-col md:flex-row justify-between gap-4">
            <div>
              <h2 className="text-2xl font-semibold text-foreground">Herb Records</h2>
              <p className="text-muted-foreground">
                {filteredRecords.length} of {herbRecords.length} {herbRecords.length === 1 ? 'record' : 'records'}
              </p>
            </div>
            <Button 
              onClick={() => navigate('/farmer')}
              className="bg-gradient-primary hover:opacity-90 transition-opacity md:self-start"
            >
              <Plus className="w-4 h-4 mr-2" />
              Add New Record
            </Button>
          </div>

          {/* Search and Filter */}
          <div className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
              <Input
                placeholder="Search herbs, farmers, or locations..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger className="w-full md:w-48">
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="newest">Newest First</SelectItem>
                <SelectItem value="oldest">Oldest First</SelectItem>
                <SelectItem value="herbName">Herb Name A-Z</SelectItem>
                <SelectItem value="farmerName">Farmer Name A-Z</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {filteredRecords.length === 0 ? (
          herbRecords.length === 0 ? (
          <Card className="text-center p-12 animate-fade-in">
            <CardContent>
              <Leaf className="w-16 h-16 mx-auto mb-4 text-muted-foreground" />
              <h3 className="text-xl font-semibold mb-2">No herb records yet</h3>
              <p className="text-muted-foreground mb-6">
                Start by creating your first herb record to generate a QR code for traceability.
              </p>
              <Button 
                onClick={() => navigate('/farmer')}
                className="bg-gradient-primary hover:opacity-90 transition-opacity"
              >
                Create First Record
              </Button>
            </CardContent>
          </Card>
          ) : (
            <Card className="text-center p-12 animate-fade-in">
              <CardContent>
                <Search className="w-16 h-16 mx-auto mb-4 text-muted-foreground" />
                <h3 className="text-xl font-semibold mb-2">No results found</h3>
                <p className="text-muted-foreground mb-6">
                  Try adjusting your search terms or filters to find what you're looking for.
                </p>
                <Button 
                  variant="outline"
                  onClick={() => {
                    setSearchTerm("");
                    setSortBy("newest");
                  }}
                >
                  Clear Filters
                </Button>
              </CardContent>
            </Card>
          )
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredRecords.map((record) => (
              <Card 
                key={record.id} 
                className={`shadow-card-soft animate-fade-in transition-all duration-300 ${
                  highlightedRecordId === record.id 
                    ? 'ring-2 ring-primary shadow-herb' 
                    : 'hover:shadow-herb'
                }`}
              >
                <CardHeader className="pb-3">
                  <div className="flex justify-between items-start mb-2">
                    <CardTitle className="text-lg text-foreground flex items-center gap-2">
                      <Leaf className="w-5 h-5 text-forest" />
                      {record.herbName}
                    </CardTitle>
                    {highlightedRecordId === record.id && (
                      <Badge variant="secondary" className="bg-herb text-forest">
                        New
                      </Badge>
                    )}
                  </div>
                  <CardDescription className="text-sm">
                    Batch ID: {record.id}
                  </CardDescription>
                </CardHeader>
                
                <CardContent className="space-y-4">
                  <div className="space-y-2 text-sm">
            <div className="flex items-center gap-2 text-muted-foreground">
              <User className="w-4 h-4" />
              <span>{record.farmerName}</span>
            </div>
            <div className="flex items-center gap-2 text-muted-foreground">
              <MapPin className="w-4 h-4" />
              <span className="truncate">{record.location}</span>
            </div>
            <div className="flex items-center gap-2 text-muted-foreground">
              <Calendar className="w-4 h-4" />
              <span>{new Date(record.harvestDate).toLocaleDateString()}</span>
            </div>
                  </div>

                  {/* QR Code */}
                  <div className="flex flex-col items-center p-4 bg-white rounded-lg">
                    <QRCodeSVG
                      id={`qr-${record.id}`}
                      value={getQRCodeUrl(record.id)}
                      size={120}
                      bgColor="#ffffff"
                      fgColor="#000000"
                      level="M"
                      includeMargin={true}
                    />
                    <p className="text-xs text-muted-foreground mt-2 text-center">
                      Scan to view herb details
                    </p>
                  </div>

                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleViewRecord(record.id)}
                      className="flex-1"
                    >
                      <Eye className="w-4 h-4 mr-1" />
                      View
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => downloadQRCode(record.id, record.herbName)}
                    >
                      <Download className="w-4 h-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        <div className="mt-8 text-center">
          <Button variant="outline" onClick={() => navigate('/')}>
            Back to Home
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;