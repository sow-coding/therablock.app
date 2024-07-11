"use client";
import {
  Trash2,
  Settings,
  Settings2,
  SquareTerminal,
  SquareUser,
  LifeBuoy,
  Triangle,
  Home,
  FolderKanban,
  LockKeyhole,
} from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import { Input } from "@/components/ui/input";
import { StartTimer } from "@/components/nextui/startTimer";
import { EndTimer } from "@/components/nextui/endTimer";
import { useState } from "react";
import { DaysMultipleSelection } from "../../components/nextui/daysMultipleSelection";
import { useRouter } from "next/navigation";

export default function Dashboard() {
  const [website, setWebsite] = useState("");
  const [websites, setWebsites] = useState([]);
  const [hoveredWebsite, setHoveredWebsite] = useState(null);

  const handleRemoveWebsite = (website) => {
    setWebsites((prevWebsites) => prevWebsites.filter((site) => site !== website));
  };

  const [apps, setApps] = useState([]);
  const [app, setApp] = useState("");
  const [hoveredApp, setHoveredApp] = useState(null);

  const handleRemoveApps = (application) => {
    setApps((prevApps) => prevApps.filter((app) => app !== application));
  };

  const [startHour, setStartHour] = useState(null);
  const [startMinute, setStartMinute] = useState(null);

  const [endHour, setEndHour] = useState(null);
  const [endMinute, setEndMinute] = useState(null);

  const [daysOfWeek, setDaysOfWeek] = useState([]);

  const handleSchedule = () => {
    const sitesArray = websites.map((site) => site.trim());
    const start = { hour: parseInt(startHour), minute: parseInt(startMinute) };
    const end = { hour: parseInt(endHour), minute: parseInt(endMinute) };
    const daysArray = daysOfWeek.map((day) => day.trim());
    
    if (start.hour === null || start.minute === null || end.hour === null || end.minute === null || daysArray.length === 0) {
      console.error("Please set all scheduling parameters.");
      return;
    }

    window.electronAPI.scheduleBlock(sitesArray, start, end, daysArray);
  };
  const router = useRouter()

  return (
    <div className="grid h-screen w-full pl-[53px]">
      <aside className="inset-y fixed left-0 z-20 flex h-full flex-col border-r">
        <div className="p-2">
          <Button variant="outline" size="icon" aria-label="Home">
            <LockKeyhole className="size-5" />
          </Button>
        </div>
        <nav className="grid gap-1 p-2">
          <Button
            variant="ghost"
            size="icon"
            className="rounded-lg bg-muted"
            aria-label="Playground"
          >
            <Home className="size-5" />
          </Button>
          <Button variant="ghost" size="icon" className="rounded-lg" aria-label="Settings" onClick={() => {
            router.push("/management")
          }}>
            <FolderKanban className="size-5" />
          </Button>
        </nav>
        <nav className="mt-auto grid gap-1 p-2">
          <Button variant="ghost" size="icon" className="mt-auto rounded-lg" aria-label="Help">
            <LifeBuoy className="size-5" />
          </Button>
          <Button variant="ghost" size="icon" className="mt-auto rounded-lg" aria-label="Account">
            <Settings className="size-5" />
          </Button>
        </nav>
      </aside>
      <div className="flex flex-col">
        <header className="sticky top-0 z-10 flex h-[53px] items-center gap-1 bg-background px-4">
          <h1 className="text-xl font-semibold">Therablock</h1>
          <Drawer>
            <DrawerTrigger asChild>
              <Button variant="ghost" size="icon" className="md:hidden">
                <Settings className="size-4" />
                <span className="sr-only">Settings</span>
              </Button>
            </DrawerTrigger>
            <DrawerContent className="max-h-[80vh]">
              <DrawerHeader>
                <DrawerTitle>Configuration</DrawerTitle>
                <DrawerDescription>Configure the settings for the block.</DrawerDescription>
              </DrawerHeader>
              <form className="grid w-full items-start gap-6 overflow-auto p-4 pt-0">
                <fieldset className="grid gap-6 rounded-lg border p-4">
                  <legend className="-ml-1 px-1 text-sm font-medium">Settings</legend>
                  <div className="grid gap-3">
                    <DaysMultipleSelection setDaysOfWeek={setDaysOfWeek} />
                  </div>
                  <div className="flex flex-row gap-3">
                    <StartTimer setStartHour={setStartHour} setStartMinute={setStartMinute} />
                    <EndTimer setEndHour={setEndHour} setEndMinute={setEndMinute} />
                  </div>
                </fieldset>
              </form>
            </DrawerContent>
          </Drawer>
        </header>
        <main className="grid flex-1 gap-4 overflow-auto p-4 md:grid-cols-2 lg:grid-cols-3">
          <div className="relative hidden flex-col items-start gap-8 md:flex">
            <form className="grid w-full items-start gap-6">
              <fieldset className="grid gap-6 rounded-lg border p-4">
                <legend className="-ml-1 px-1 text-sm font-medium">Settings</legend>
                <div className="grid gap-3">
                  <DaysMultipleSelection setDaysOfWeek={setDaysOfWeek} />
                </div>
                <div className="flex flex-row gap-3">
                  <StartTimer setStartHour={setStartHour} setStartMinute={setStartMinute} />
                  <EndTimer setEndHour={setEndHour} setEndMinute={setEndMinute} />
                </div>
              </fieldset>
            </form>
          </div>
          <div className="relative flex h-full min-h-[50vh] flex-col rounded-xl bg-muted/50 p-4 lg:col-span-2">
            <Badge variant="outline" className="absolute right-3 top-3">
              Websites and apps
            </Badge>
            <div className="mt-16" />
            <form
              className="relative overflow-hidden rounded-lg border bg-background focus-within:ring-1 focus-within:ring-ring"
            >
              <div className="grid gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Websites</CardTitle>
                    <CardDescription>Select websites to block.</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Input
                      placeholder="e.g: tiktok.com"
                      value={website}
                      onChange={(e) => {
                        setWebsite(e.currentTarget.value);
                      }}
                      onKeyDown={(e) => {
                        if (e.key === "Enter") {
                          e.preventDefault();
                          setWebsites([...websites, website]);
                          setWebsite("");
                        }
                      }}
                    />
                  </CardContent>
                  <div className="flex ml-4 mb-4 items-center flex-wrap">
                    {websites.map((website, index) => (
                      <div
                        key={index}
                        onMouseEnter={() => setHoveredWebsite(website)}
                        onMouseLeave={() => setHoveredWebsite(null)}
                        className="relative cursor-pointer mx-2"
                        onClick={() => handleRemoveWebsite(website)}
                      >
                        <Badge variant="outline">
                          {hoveredWebsite === website ? <Trash2 color="red" size={16} /> : website}
                        </Badge>
                      </div>
                    ))}
                  </div>
                  <CardFooter className="border-t px-6 py-4">
                    <Button
                      type="button"
                      onClick={() => {
                        setWebsites([...websites, website]);
                        setWebsite("");
                      }}
                    >
                      Add
                    </Button>
                  </CardFooter>
                </Card>
                <Card>
                  <CardHeader>
                    <CardTitle>Apps</CardTitle>
                    <CardDescription>Select apps to block.</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Input
                      placeholder="e.g: TikTok"
                      value={app}
                      onChange={(e) => {
                        setApp(e.currentTarget.value);
                      }}
                      onKeyDown={(e) => {
                        if (e.key === "Enter") {
                          e.preventDefault();
                          setApps([...apps, app]);
                          setApp("");
                        }
                      }}
                    />
                  </CardContent>
                  <div className="flex ml-4 mb-4 items-center flex-wrap">
                    {apps.map((application, index) => (
                      <div
                        key={index}
                        onMouseEnter={() => setHoveredApp(application)}
                        onMouseLeave={() => setHoveredApp(null)}
                        className="relative cursor-pointer mx-2"
                        onClick={() => handleRemoveApps(application)}
                      >
                        <Badge variant="outline">
                          {hoveredApp === application ? <Trash2 color="red" size={16} /> : application}
                        </Badge>
                      </div>
                    ))}
                  </div>
                  <CardFooter className="border-t px-6 py-4">
                    <Button
                      type="button"
                      onClick={() => {
                        setApps([...apps, app]);
                        setApp("");
                      }}
                    >
                      Add
                    </Button>
                  </CardFooter>
                </Card>
              </div>
              <Button
                type="button"
                className="self-center m-6"
                variant={"destructive"}
                onClick={() => {
                  handleSchedule();
                }}
              >
                Schedule block
              </Button>
            </form>
          </div>
        </main>
      </div>
    </div>
  );
}
