import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
export default function DownloadPage() {
  return (
    <Card className="mx-auto max-w-sm mt-6">
      <CardHeader>
        <CardTitle className="text-xl">Download Therablock</CardTitle>
        <CardDescription>
          Thank you for signing up on Therablock
        </CardDescription>
      </CardHeader>
      <form className="mx-4 my-4">
        <a href="">
            <Button type="button" className="w-full">
                Download
            </Button>
        </a>
    </form>
    </Card>
  );
}