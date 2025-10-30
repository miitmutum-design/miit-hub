
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

const chartData = [
  { day: "Seg", "5-stars": 5, "4-stars": 7, "3-stars": 2, "2-stars": 1, "1-star": 0 },
  { day: "Ter", "5-stars": 8, "4-stars": 6, "3-stars": 3, "2-stars": 2, "1-star": 1 },
  { day: "Qua", "5-stars": 10, "4-stars": 5, "3-stars": 1, "2-stars": 0, "1-star": 0 },
  { day: "Qui", "5-stars": 6, "4-stars": 8, "3-stars": 4, "2-stars": 1, "1-star": 0 },
  { day: "Sex", "5-stars": 12, "4-stars": 9, "3-stars": 3, "2-stars": 1, "1-star": 1 },
  { day: "Sáb", "5-stars": 15, "4-stars": 10, "3-stars": 5, "2-stars": 3, "1-star": 2 },
  { day: "Dom", "5-stars": 18, "4-stars": 12, "3-stars": 6, "2-stars": 4, "1-star": 2 },
]

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

export default function ReviewsChart() {
  return (
    <ChartContainer config={chartConfig} className="min-h-[150px] w-full">
      <BarChart accessibilityLayer data={chartData} margin={{ top: 0, right: 0, left: -25, bottom: 0 }}>
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
