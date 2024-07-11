"use client"
import React, { useEffect, useState } from "react";
import {Select, SelectItem} from "@nextui-org/react";
import {days} from "./days";

export function DaysMultipleSelection ({setDaysOfWeek}) {
  const [values, setValues] = useState(new Set([]));

  useEffect(() => {
    const selectedDays = Array.from(values);
    setDaysOfWeek(selectedDays)
  }, [values, setDaysOfWeek]);

  return (
    <Select
      label="Days"
      placeholder="Select days"
      selectionMode="multiple"
      className="max-w-xs"
      selectedKeys={values}
      onSelectionChange={setValues}
    >
      {days.map((day) => (
        <SelectItem key={day}>
          {day}
        </SelectItem>
      ))}
    </Select>
  );
}
