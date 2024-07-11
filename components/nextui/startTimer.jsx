"use client"
import React, { useState } from "react";
import {TimeInput} from "@nextui-org/react";

export function StartTimer({setStartHour, setStartMinute}) {
  return (
    <div className="flex flex-wrap gap-4">
      <TimeInput label={"Start"} onChange={(e) => {
        setStartHour(e.hour)
        setStartMinute(e.minute)
      }}/>
    </div>
  );
}
