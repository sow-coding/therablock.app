"use client"
import React, { useState } from "react";
import {TimeInput} from "@nextui-org/react";

export function EndTimer({setEndHour, setEndMinute}) {
  
  return (
    <div className="flex flex-wrap gap-4">
      <TimeInput label={"End"} onChange={(e) => {
        setEndHour(e.hour)
        setEndMinute(e.minute)
      }}/>
    </div>
  );
}
