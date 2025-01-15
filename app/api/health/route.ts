import { NextResponse } from "next/server";

// List of your internal services with their URLs
const services = [
  { name: "Frontend (cutslut.app)", url: "https://cutslut.app/" },
  { name: "Frontend (egirls.date)", url: "https://egirls.date/" },
  { name: "Backend (Discord Module API)", url: "https://api.cutslut.app" },
  {
    name: "Postgres Database",
    url: "https://sywtpufwwfcwpoxvlsfx.supabase.co",
  },
];

// Evaluate service status based on response time
const evaluateServiceStatus = (responseTime: number) =>
  responseTime === -1
    ? "Offline"
    : responseTime <= 200
    ? "Operational"
    : responseTime <= 1000
    ? "Degraded Performance"
    : "Offline";

// Measure response time of a single service
const measureResponseTime = async ({
  name,
  url,
}: {
  name: string;
  url: string;
}) => {
  const start = Date.now();
  try {
    await fetch(url, { method: "HEAD" }); // Use HEAD for faster checks
    const responseTime = Date.now() - start;
    return {
      name,
      url,
      responseTime,
      status: evaluateServiceStatus(responseTime),
    };
  } catch {
    return { name, url, responseTime: -1, status: "Offline" };
  }
};

export async function GET() {
  try {
    const results = await Promise.all(services.map(measureResponseTime));
    return NextResponse.json({ status: "success", results });
  } catch (error) {
    return NextResponse.json(
      {
        status: "error",
        message: "Failed to check response times",
        error: String(error),
      },
      { status: 500 }
    );
  }
}
