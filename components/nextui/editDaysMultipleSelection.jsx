"use client"
import React, { useEffect, useState } from "react";
import {Select, SelectItem} from "@nextui-org/react";
import {days} from "./days";

export function EditDaysMultipleSelection ({setDaysOfWeek, disabledItems}) {
  const [values, setValues] = useState(new Set([]));
  
  useEffect(() => {
    const selectedDays = Array.from(values);
    setDaysOfWeek([disabledItems, selectedDays])
  }, [values, setDaysOfWeek, disabledItems]);

  return (
    <Select
      label="Days"
      placeholder="Select days"
      selectionMode="multiple"
      value={disabledItems}
      className="max-w-xs"
      selectedKeys={values}
      disabledKeys={disabledItems}
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
