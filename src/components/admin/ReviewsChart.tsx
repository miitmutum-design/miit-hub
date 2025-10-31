
"use client"

import { TrendingUp } from "lucide-react"
import { Bar, BarChart, CartesianGrid, XAxis, YAxis, Tooltip } from "recharts"

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  ChartContainer,
  ChartTooltipContent,
} from "@/components/ui/chart"

const chartConfig = {
  "5-stars": {
    label: "5 Estrelas",
    color: "hsl(var(--chart-1))",
  },
  "4-stars": {
    label: "4 Estrelas",
    color: "hsl(var(--chart-2))",
  },
  "3-stars": {
    label: "3 Estrelas",
    color: "hsl(var(--chart-3))",
  },
  "2-stars": {
    label: "2 Estrelas",
    color: "hsl(var(--chart-4))",
  },
  "1-star": {
    label: "1 Estrela",
    color: "hsl(var(--chart-5))",
  },
}

type ReviewsChartProps = {
  data: any[];
};

export default function ReviewsChart({ data }: ReviewsChartProps) {
  return (
    <ChartContainer config={chartConfig} className="min-h-[150px] w-full">
      <BarChart accessibilityLayer data={data} margin={{ top: 0, right: 0, left: -25, bottom: 0 }}>
        <CartesianGrid vertical={false} />
        <XAxis
          dataKey="day"
          tickLine={false}
          tickMargin={10}
          axisLine={false}
          tickFormatter={(value) => value.slice(0, 3)}
        />
        <YAxis />
        <Tooltip cursor={false} content={<ChartTooltipContent />} />
        <Bar dataKey="5-stars" fill="var(--color-5-stars)" radius={4} />
        <Bar dataKey="4-stars" fill="var(--color-4-stars)" radius={4} />
        <Bar dataKey="3-stars" fill="var(--color-3-stars)" radius={4} />
      </BarChart>
    </ChartContainer>
  )
}
