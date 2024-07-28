"use client"
import Image from "next/image"
import Link from "next/link"
import {
  File,
  FolderKanban,
  Home,
  LineChart,
  ListFilter,
  MoreHorizontal,
  Package,
  Package2,
  PanelLeft,
  PlusCircle,
  Search,
  Settings,
  ShoppingCart,
  Users2,
} from "lucide-react"
import { Badge } from "@/components/ui/badge"
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Input } from "@/components/ui/input"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs"
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import {EditDaysMultipleSelection} from "@/components/nextui/editDaysMultipleSelection"

export default function TaskManagement() {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [editingTask, setEditingTask] = useState(null);
  const [newDays, setNewDays] = useState([]);
  const [newStart, setNewStart] = useState('');
  const [newEnd, setNewEnd] = useState('');
  const [deletingTask, setDeletingTask] = useState(null)
  const [deleteAttempt, setDeleteAttempt] = useState(0)
  const [isDeleting, setIsDeleting] = useState(false)
  const [deleteInput, setDeleteInput] = useState("")
  const [isRisky, setIsRisky] = useState(false)
  const [moreOrNothing, setMoreOrNothing] = useState(false)
  const router = useRouter()
  const [daysOfWeekArray, setDaysOfWeekArray] = useState([])

  useEffect(() => {
    loadTasks();
    window.electronAPI.onScheduledTasksResponse((response) => {
      if (response.success) {
        setTasks(combineTasks(response.data));
      } else {
        router.push("/home")
        setError(response.error);
      }
      setLoading(false);
    });

    window.electronAPI.onTaskUpdateResponse((response) => {
      if (response.success) {
        console.log('Task updated successfully, reloading tasks...');
        loadTasks();
      } else {
        console.error('Failed to update task:', response.error);
        router.push("/home")
      }
    });
  }, [router]);

  const loadTasks = () => {
    setLoading(true);
    setError(null);
    window.electronAPI.getScheduledTasks();
  };

  const combineTasks = (taskList) => {
    const combinedTasks = {};
  
    taskList.forEach(task => {
      // Extraire la date et le nom du site du nom de la tâche
      const parts = task.TaskName.split('_');
      const timestamp = parts[1];
      const siteName = parts.slice(2).join('_'); // Inclut toutes les parties après le deuxième underscore
      const key = `${timestamp}_${siteName}`; // Utiliser timestamp_siteName comme clé unique
  
      if (!combinedTasks[key]) {
        combinedTasks[key] = {  taskName: key, name: siteName, daysOfWeek: '', start: null, end: null, timestamp: timestamp };
      }
  
      const formattedDays = Array.isArray(task.Triggers.DaysOfWeek) ? task.Triggers.DaysOfWeek.join(', ') : task.Triggers.DaysOfWeek;
  
      if (task.TaskName.startsWith('BlockSite')) {
        combinedTasks[key].start = task.Triggers.StartBoundary;
        combinedTasks[key].daysOfWeek = formattedDays;
      } else if (task.TaskName.startsWith('UnblockSite')) {
        combinedTasks[key].end = task.Triggers.StartBoundary;
        combinedTasks[key].daysOfWeek = formattedDays;
      }
    });
  
    return Object.values(combinedTasks);
  };
  
  const formatTime = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const handleEditTask = (task) => {
    setEditingTask(task);
    setNewDays(task.daysOfWeek.split(', '));
    setNewStart(task.start ? formatTime(task.start) : '');
    setNewEnd(task.end ? formatTime(task.end) : '');
  };

  const getOriginalTaskNames = (taskName) => {
    return {
      blockTaskName: `BlockSite_${taskName}`,
      unblockTaskName: `UnblockSite_${taskName}`
    };
  };

  const handleSaveEdit = () => {
    const startHour = parseInt(newStart.split(':')[0]);
    const startMinute = parseInt(newStart.split(':')[1]);
    const endHour = parseInt(newEnd.split(':')[0]);
    const endMinute = parseInt(newEnd.split(':')[1]);
  
    const oldStart = new Date(editingTask.start);
    const oldEnd = new Date(editingTask.end);
  
    const newStartDate = new Date(oldStart);
    newStartDate.setHours(startHour);
    newStartDate.setMinutes(startMinute);
  
    const newEndDate = new Date(oldEnd);
    newEndDate.setHours(endHour);
    newEndDate.setMinutes(endMinute);
  
    const oldDuration = oldEnd - oldStart;
    const newDuration = newEndDate - newStartDate;
  
    if (newDuration < oldDuration) {
      setMoreOrNothing(true)
      return;
    }
  
    const newTask = {
      ...editingTask,
      daysOfWeek: daysOfWeekArray.join(', '),
      start: { hour: startHour, minute: startMinute },
      end: { hour: endHour, minute: endMinute },
      site: [editingTask.name]
    };
  
    const originalTaskNames = getOriginalTaskNames(editingTask.taskName);

    window.electronAPI.updateTask(originalTaskNames, newTask);
    setEditingTask(null);
  };

  const handleDeleteTask = (taskName) => {
    setIsDeleting(true)
    setDeletingTask(taskName)
  };

  const confirmDeleteTask = () => {
    if (deleteInput != "I confirm I want to delete this block") {
      setDeleteInput("")
      setDeleteAttempt(0)
      setIsDeleting(false)
      setIsRisky(true)
    } else {
      setDeleteAttempt(deleteAttempt + 1)
      setDeleteInput("")
    }
    if (deleteAttempt > 999) {
      setIsDeleting(false)
      window.electronAPI.deleteTask(taskName);
      router.push("/home")
    }
  }

  const confirmConfirmationContinueDeleting = () => {
    setDeleteAttempt(deleteAttempt + 1)
    setDeleteInput("")
    if (deleteAttempt > 999) {
      setIsDeleting(false)
      window.electronAPI.deleteTask(deletingTask);
      router.push("/home")
    }
  }

  const cancelDelete = () => {
    setIsDeleting(false)
    setDeleteAttempt(0)
    setDeleteInput("")
  }

  if (loading) {
    return (
      <Card className="fixed bottom-4 right-4 z-50 w-1/3 bg-white shadow-lg">
        <CardHeader>
          <CardTitle>Loading tasks...</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4">
            <Button variant="outline" onClick={() => {
              router.push("/home")
            }}>Go back</Button>
          </div>
        </CardContent>
      </Card>
    )
  }

  console.log("Voici tasks:" + tasks)

  if (tasks[0] = "rien") {
    router.push("/home")
  }

  if (error) {
    router.push("/home")
  }

  return (
    <div className="flex min-h-screen w-full flex-col bg-muted/40">
      <aside className="fixed inset-y-0 left-0 z-10 hidden w-14 flex-col border-r bg-background sm:flex">
        <nav className="flex flex-col items-center gap-4 px-2 py-4">
          <Link href="#" className="group flex h-9 w-9 shrink-0 items-center justify-center gap-2 rounded-full bg-primary text-lg font-semibold text-primary-foreground md:h-8 md:w-8 md:text-base">
            <Home className="h-4 w-4 transition-all group-hover:scale-110" />
            <span className="sr-only">Acme Inc</span>
          </Link>
          <Tooltip>
            <TooltipTrigger asChild>
              <Link href="/home" className="flex h-9 w-9 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:text-foreground md:h-8 md:w-8">
                <Home className="h-5 w-5" />
                <span className="sr-only">Dashboard</span>
              </Link>
            </TooltipTrigger>
            <TooltipContent side="right">Dashboard</TooltipContent>
          </Tooltip>
          <Tooltip>
            <TooltipTrigger asChild>
              <Link href="/management" className="flex h-9 w-9 items-center justify-center rounded-lg transition-colors hover:text-foreground md:h-8 md:w-8">
                <FolderKanban className="h-5 w-5" />
                <span className="sr-only">Management</span>
              </Link>
            </TooltipTrigger>
            <TooltipContent side="right">Management</TooltipContent>
          </Tooltip>
        </nav>
        <nav className="mt-auto flex flex-col items-center gap-4 px-2 py-4">
          <Tooltip>
            <TooltipTrigger asChild>
              <Link href="/settings" className="flex h-9 w-9 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:text-foreground md:h-8 md:w-8">
                <Settings className="h-5 w-5" />
                <span className="sr-only">Settings</span>
              </Link>
            </TooltipTrigger>
            <TooltipContent side="right">Settings</TooltipContent>
          </Tooltip>
        </nav>
      </aside>
      <div className="flex flex-col sm:gap-4 sm:py-4 sm:pl-14">
        <header className="sticky top-0 z-30 flex h-14 items-center gap-4 border-b bg-background px-4 sm:static sm:h-auto sm:border-0 sm:bg-transparent sm:px-6">
          <Breadcrumb className="hidden md:flex">
            <BreadcrumbList>
              <BreadcrumbItem>
                <BreadcrumbLink asChild>
                  <Link href="#">Home</Link>
                </BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbLink asChild>
                  <Link href="#">Management</Link>
                </BreadcrumbLink>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </header>
        <main className="grid flex-1 items-start gap-4 p-4 sm:px-6 sm:py-0 md:gap-8">
          <Tabs defaultValue="all">
            <div className="flex items-center">
              <TabsList>
                <TabsTrigger value="all">Websites</TabsTrigger>
                <TabsTrigger value="apps">Apps</TabsTrigger>
              </TabsList>
            </div>
            <TabsContent value="all">
              <Card>
                <CardHeader>
                  <CardTitle>Websites - Block</CardTitle>
                  <CardDescription>Manage your site blocks.</CardDescription>
                </CardHeader>
                <CardContent>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Name</TableHead>
                        <TableHead>Days</TableHead>
                        <TableHead>Start</TableHead>
                        <TableHead>End</TableHead>
                        <TableHead><span className="sr-only">Actions</span></TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {tasks.map((task, index) => (
                        <TableRow key={index}>
                          <TableCell>{task.name}</TableCell>
                          <TableCell>{task.daysOfWeek}</TableCell>
                          <TableCell>{task.start ? formatTime(task.start) : 'N/A'}</TableCell>
                          <TableCell>{task.end ? formatTime(task.end) : 'N/A'}</TableCell>
                          <TableCell>
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button aria-haspopup="true" size="icon" variant="ghost">
                                  <MoreHorizontal className="h-4 w-4" />
                                  <span className="sr-only">Toggle menu</span>
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end">
                                <DropdownMenuLabel>Actions</DropdownMenuLabel>
                                <DropdownMenuItem onClick={() => handleEditTask(task)}>Edit</DropdownMenuItem>
                                <DropdownMenuItem onClick={() => handleDeleteTask(task.name)}>Delete</DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </CardContent>
                <CardFooter>
                  <div className="text-xs text-muted-foreground">{`Don't make excuses, you know you don't need that ;)`}</div>
                </CardFooter>
              </Card>
            </TabsContent>
            <TabsContent value="apps">
              <Card>
                <CardHeader>
                  <CardTitle>Apps - Block</CardTitle>
                  <CardDescription>Coming soon...</CardDescription>
                </CardHeader>
              </Card>
            </TabsContent>
          </Tabs>

          {editingTask && (
            <Card className="fixed bottom-4 right-4 z-50 w-1/3 bg-white shadow-lg">
              <CardHeader>
                <CardTitle>Edit Block</CardTitle>
                <CardDescription>Editing block for {editingTask.name}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid gap-4">
                  <div>
                    <label htmlFor="daysOfWeek" className="block text-sm font-medium text-gray-700">Days of Week</label>
                    {/* changer ici c'est pas readonly c'est juste que les jours deja pris seront inselectionnable nextUI component */}
                    <EditDaysMultipleSelection setDaysOfWeek={setDaysOfWeekArray} disabledItems={newDays}/>
                  </div>
                  <div>
                    <label htmlFor="newStart" className="block text-sm font-medium text-gray-700">Start Time</label>
                    <Input type="time" id="newStart" value={newStart} onChange={(e) => setNewStart(e.target.value)} />
                  </div>
                  <div>
                    <label htmlFor="newEnd" className="block text-sm font-medium text-gray-700">End Time</label>
                    <Input type="time" id="newEnd" value={newEnd} onChange={(e) => setNewEnd(e.target.value)} />
                  </div>
                </div>
              </CardContent>
              <CardFooter className="flex justify-end gap-2">
                <Button variant="outline" onClick={() => setEditingTask(null)}>Cancel</Button>
                <Button onClick={handleSaveEdit}>Save</Button>
              </CardFooter>
            </Card>
          )}

          {isDeleting && (
            <Card className="fixed bottom-4 right-4 z-50 w-1/3 bg-white shadow-lg">
              <CardHeader>
                <CardTitle>Confirm Deletion</CardTitle>
                <CardDescription>
                {deleteAttempt % 2 === 0 ? (
                    `To delete ${deletingTask}, type: "I confirm I want to delete this block" below : (Get yourself a coffee, you'll have to do it ${1000 - deleteAttempt} times ;))`
                  ) : (
                    `You have confirmed ${deleteAttempt} times. Do you want to continue deleting ${deletingTask}?`
                  )}
                </CardDescription>
              </CardHeader>
              <CardContent>
              {deleteAttempt % 2 === 0 ? (
                <Input
                  type="text"
                  value={deleteInput}
                  placeholder="I confirm I want to delete this block"
                  onChange={(e) => setDeleteInput(e.target.value)}
                  onPaste={(e) => e.preventDefault()}
                />
              ) : (
                <div>
                  <p className="mb-4">Do you want to continue deleting {deletingTask}?</p>
                  <Button variant="outline" className="mr-4" onClick={() => confirmConfirmationContinueDeleting()}>Yes</Button>
                  <Button variant="outline" onClick={cancelDelete}>No</Button>
                </div>
              )}
              </CardContent>
              {deleteAttempt % 2 === 0 && 
              <CardFooter className="flex justify-end gap-2">
                <Button variant="outline" onClick={cancelDelete}>Cancel</Button>
                <Button onClick={confirmDeleteTask}>Confirm</Button>
              </CardFooter>}
            </Card>
          )}

          {isRisky && (
              <Card className="fixed bottom-4 right-4 z-50 w-1/3 bg-white shadow-lg">
              <CardHeader>
                <CardTitle>Tricky</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid gap-4">
                  <h1>{`Hey hey be careful, you have to type exactly what is written or you risk having to start from the beginning lol ;)`}</h1>
                  <Button variant="outline" onClick={() => {
                    setIsRisky(false)
                  }}>Ok</Button>
                </div>
              </CardContent>
            </Card>
          )}

          {moreOrNothing && (
              <Card className="fixed bottom-4 right-4 z-50 w-1/3 bg-white shadow-lg">
              <CardHeader>
                <CardTitle>More or nothing</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid gap-4">
                  <h1>{`Hi buddy, to edit you only have the choice of increasing the blocking duration you cannot decrease it. It's either you increase or you delete it`}</h1>
                  <Button variant="outline" onClick={() => {
                    setMoreOrNothing(false)
                  }}>Ok</Button>
                </div>
              </CardContent>
            </Card>
          )} 
        </main>
      </div>
    </div>
  );
}