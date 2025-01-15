"use client";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useEffect, useState, useCallback } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CheckCircle, AlertCircle, XCircle, LoaderCircle } from "lucide-react";
import { toast } from "sonner";

interface ServiceStatus {
  name: string;
  url: string;
  responseTime: number;
  status: string;
  error?: string;
}

export default function StatusPage() {
  const [services, setServices] = useState<ServiceStatus[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchStatus = useCallback(async () => {
    setLoading(true);
    try {
      const response = await fetch("/api/health");
      const data = await response.json();

      if (data.status === "success") {
        setServices(data.results);
        setError(null);
      } else {
        setError("Failed to fetch service status.");
      }
    } catch (err) {
      setError("An error occurred while fetching service status.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchStatus();
  }, [fetchStatus]);

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "Operational":
        return <CheckCircle className="h-5 w-5 text-green-500" />;
      case "Degraded Performance":
        return <AlertCircle className="h-5 w-5 text-yellow-500" />;
      case "Offline":
        return <XCircle className="h-5 w-5 text-red-500" />;
      default:
        return <AlertCircle className="h-5 w-5 text-gray-500" />;
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "Operational":
        return (
          <Badge
            variant="outline"
            className="bg-green-500/10 text-green-500 border-green-500/20"
          >
            Operational
          </Badge>
        );
      case "Degraded Performance":
        return (
          <Badge
            variant="outline"
            className="bg-yellow-500/10 text-yellow-500 border-yellow-500/20"
          >
            Degraded
          </Badge>
        );
      case "Offline":
        return (
          <Badge
            variant="outline"
            className="bg-red-500/10 text-red-500 border-red-500/20"
          >
            Offline
          </Badge>
        );
      default:
        return (
          <Badge
            variant="outline"
            className="bg-gray-500/10 text-gray-500 border-gray-500/20"
          >
            Unknown
          </Badge>
        );
    }
  };

  return (
    <div className="min-h-screen p-8">
      <Card className="max-w-4xl mx-auto border-zinc-800">
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-center">
            System Status
          </CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="text-center justify-center items-center text-xl text-zinc-400">
              <LoaderCircle className="animate-spin" />
            </div>
          ) : error ? (
            toast.error(error)
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="text-zinc-400">Service</TableHead>
                  <TableHead className="text-zinc-400">Status</TableHead>
                  <TableHead className="text-zinc-400">Response Time</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {services.map((service) => (
                  <TableRow key={service.url} className="border-zinc-800">
                    <TableCell className="font-medium">
                      {service.name}
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center space-x-2">
                        {getStatusIcon(service.status)}
                        {getStatusBadge(service.status)}
                      </div>
                    </TableCell>
                    <TableCell>
                      {service.responseTime === -1
                        ? "N/A"
                        : `${service.responseTime} ms`}
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
}
