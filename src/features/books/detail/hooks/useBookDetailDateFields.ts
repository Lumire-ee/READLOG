import { useMemo, useState } from "react";

type Params = {
  startDateText: string | null;
  endDateText: string | null;
};

function toDate(value: string | null): Date | null {
  if (!value) return null;
  const date = new Date(`${value}T00:00:00`);
  return Number.isNaN(date.getTime()) ? null : date;
}

function startOfToday(): Date {
  const now = new Date();
  return new Date(now.getFullYear(), now.getMonth(), now.getDate());
}

export function useBookDetailDateFields({ startDateText, endDateText }: Params) {
  const [isStartDateOpen, setIsStartDateOpen] = useState(false);
  const [isEndDateOpen, setIsEndDateOpen] = useState(false);

  const startDate = useMemo(() => toDate(startDateText), [startDateText]);
  const endDate = useMemo(() => toDate(endDateText), [endDateText]);
  const today = useMemo(() => startOfToday(), []);

  const isStartDateDisabled = (date: Date) => date > today;
  const isEndDateDisabled = (date: Date) => {
    if (date > today) return true;
    if (startDate && date < startDate) return true;
    return false;
  };

  return {
    startDate,
    endDate,
    isStartDateOpen,
    isEndDateOpen,
    setIsStartDateOpen,
    setIsEndDateOpen,
    isStartDateDisabled,
    isEndDateDisabled,
  };
}

