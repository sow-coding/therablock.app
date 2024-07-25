import React from "react";
import {CircularProgress} from "@nextui-org/react";

export default function CircularProgressComponent() {
  return (
    <div className="flex gap-4">
      <CircularProgress color="primary" aria-label="Loading..." size="lg"/>
    </div> 
  );
}
