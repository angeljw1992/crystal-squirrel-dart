"use client"

import * as React from "react"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { DayPicker, useDayPicker, useNavigation } from "react-day-picker"
import { es } from "date-fns/locale"
import { format } from "date-fns"

import { cn } from "@/lib/utils"
import { buttonVariants } from "@/components/ui/button"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

export type CalendarProps = React.ComponentProps<typeof DayPicker>

function CustomCaption({ displayMonth }: { displayMonth: Date }) {
  const { goToMonth, nextMonth, previousMonth } = useNavigation()
  const { fromYear, toYear } = useDayPicker()

  const handleMonthChange = (value: string) => {
    const newDate = new Date(displayMonth)
    newDate.setMonth(parseInt(value))
    goToMonth(newDate)
  }

  const handleYearChange = (value: string) => {
    const newDate = new Date(displayMonth)
    newDate.setFullYear(parseInt(value))
    goToMonth(newDate)
  }

  const months = Array.from({ length: 12 }, (_, i) => ({
    value: i.toString(),
    label: format(new Date(0, i), "MMMM", { locale: es }),
  }))

  const years = []
  const start = fromYear || 1900
  const end = toYear || new Date().getFullYear() + 10
  for (let i = start; i <= end; i++) {
    years.push({ value: i.toString(), label: i.toString() })
  }

  return (
    <div className="flex items-center justify-center gap-2 mb-4">
      <button
        type="button"
        disabled={!previousMonth}
        onClick={() => previousMonth && goToMonth(previousMonth)}
        className={cn(
          buttonVariants({ variant: "outline" }),
          "h-7 w-7 p-0"
        )}
      >
        <ChevronLeft className="h-4 w-4" />
      </button>
      <Select
        value={displayMonth.getMonth().toString()}
        onValueChange={handleMonthChange}
      >
        <SelectTrigger className="w-[120px] focus:ring-0">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          {months.map((month) => (
            <SelectItem key={month.value} value={month.value}>
              {month.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      <Select
        value={displayMonth.getFullYear().toString()}
        onValueChange={handleYearChange}
      >
        <SelectTrigger className="w-[80px] focus:ring-0">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          {years.map((year) => (
            <SelectItem key={year.value} value={year.value}>
              {year.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      <button
        type="button"
        disabled={!nextMonth}
        onClick={() => nextMonth && goToMonth(nextMonth)}
        className={cn(
          buttonVariants({ variant: "outline" }),
          "h-7 w-7 p-0"
        )}
      >
        <ChevronRight className="h-4 w-4" />
      </button>
    </div>
  )
}

function Calendar({
  className,
  classNames,
  showOutsideDays = true,
  ...props
}: CalendarProps) {
  return (
    <DayPicker
      locale={es}
      showOutsideDays={showOutsideDays}
      className={cn("p-3", className)}
      classNames={{
        months: "flex flex-col sm:flex-row space-y-4 sm:space-x-4 sm:space-y-0",
        month: "space-y-4",
        caption: "hidden", // Hide default caption
        table: "w-full border-collapse space-y-1",
        head_row: "flex",
        head_cell:
          "text-muted-foreground rounded-md w-9 font-normal text-[0.8rem]",
        row: "flex w-full mt-2",
        cell: "h-9 w-9 text-center text-sm p-0 relative [&:has([aria-selected])]:bg-accent first:[&:has([aria-selected])]:rounded-l-md last:[&:has([aria-selected])]:rounded-r-md focus-within:relative focus-within:z-20",
        day: cn(
          buttonVariants({ variant: "ghost" }),
          "h-9 w-9 p-0 font-normal aria-selected:opacity-100"
        ),
        day_selected:
          "bg-primary text-primary-foreground hover:bg-primary hover:text-primary-foreground focus:bg-primary focus:text-primary-foreground",
        day_today: "bg-accent text-accent-foreground",
        day_outside: "text-muted-foreground opacity-50",
        day_disabled: "text-muted-foreground opacity-50",
        day_range_middle:
          "aria-selected:bg-accent aria-selected:text-accent-foreground",
        day_hidden: "invisible",
        ...classNames,
      }}
      components={{
        Caption: CustomCaption,
      }}
      {...props}
    />
  )
}
Calendar.displayName = "Calendar"

export { Calendar }