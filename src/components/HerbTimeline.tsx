import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CheckCircle, Clock, Leaf, QrCode, Eye } from "lucide-react";
import { HerbRecord } from "@/types/herb";

interface HerbTimelineProps {
  record: HerbRecord;
}

const HerbTimeline = ({ record }: HerbTimelineProps) => {
  const timelineEvents = [
    {
      id: 1,
      title: "Herb Harvested",
      description: `${record.herbName} harvested by ${record.farmerName}`,
      timestamp: record.harvestDate,
      icon: Leaf,
      status: "completed",
      color: "text-forest"
    },
    {
      id: 2,
      title: "Record Created",
      description: "Herb details recorded in AyurChain system",
      timestamp: record.createdAt,
      icon: CheckCircle,
      status: "completed",
      color: "text-forest"
    },
    {
      id: 3,
      title: "QR Code Generated",
      description: "Unique QR code created for traceability",
      timestamp: record.createdAt,
      icon: QrCode,
      status: "completed",
      color: "text-forest"
    },
    {
      id: 4,
      title: "Available for Scanning",
      description: "Consumers can now scan and verify authenticity",
      timestamp: record.createdAt,
      icon: Eye,
      status: "active",
      color: "text-primary"
    }
  ];

  const formatDateTime = (dateString: string) => {
    return new Date(dateString).toLocaleString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <Card className="shadow-card-soft animate-fade-in">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-foreground">
          <Clock className="w-5 h-5 text-forest" />
          Herb Journey Timeline
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {timelineEvents.map((event, index) => (
            <div key={event.id} className="flex gap-4">
              {/* Timeline Line */}
              <div className="flex flex-col items-center">
                <div className={`p-2 rounded-full bg-background border-2 ${
                  event.status === 'completed' 
                    ? 'border-forest bg-herb/20' 
                    : 'border-primary bg-primary/20'
                }`}>
                  <event.icon className={`w-4 h-4 ${event.color}`} />
                </div>
                {index < timelineEvents.length - 1 && (
                  <div className="w-0.5 h-8 bg-border mt-2" />
                )}
              </div>

              {/* Event Details */}
              <div className="flex-1 pb-8">
                <div className="flex items-center gap-2 mb-1">
                  <h3 className="font-semibold text-foreground">{event.title}</h3>
                  {event.status === 'completed' && (
                    <Badge variant="secondary" className="bg-herb text-forest text-xs">
                      Completed
                    </Badge>
                  )}
                  {event.status === 'active' && (
                    <Badge variant="default" className="bg-primary text-primary-foreground text-xs">
                      Active
                    </Badge>
                  )}
                </div>
                <p className="text-sm text-muted-foreground mb-2">
                  {event.description}
                </p>
                <p className="text-xs text-muted-foreground">
                  {formatDateTime(event.timestamp)}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Future Events Preview */}
        <div className="mt-6 p-4 bg-sage/10 rounded-lg border-l-4 border-sage">
          <h4 className="font-medium text-foreground mb-2">Next Steps</h4>
          <p className="text-sm text-muted-foreground">
            When consumers scan this QR code, their interaction will be logged here, 
            showing the full journey from farm to consumer.
          </p>
        </div>
      </CardContent>
    </Card>
  );
};

export default HerbTimeline;