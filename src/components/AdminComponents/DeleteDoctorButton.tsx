import React from "react";
import { Button } from "../ui/button";
import { Trash2 } from "lucide-react";
import { deleteDoctor } from "@/utils/requests/data/admin";

export default function DeleteDoctorButton({ id }: { id: string }) {
  return (
    <>
      <Button
        size="icon"
        variant="destructive"
        className="bg-red-100 text-red-500 hover:bg-red-200"
        onClick={async () => {
          if (confirm("Are you sure you want to delete this doctor?")) {
            const response = await deleteDoctor({ id });
            if (response && response.success) {
              alert("Doctor deleted successfully!");
              window.location.reload();
            } else {
              alert(response.message || "Failed to delete doctor.");
            }
          }
        }}
      >
        <Trash2 className="h-4 w-4" />
      </Button>
    </>
  );
}
