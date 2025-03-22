
import { useState } from 'react';
import { Calendar } from '@/components/ui/calendar';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { toast } from '@/components/ui/use-toast';
import { Canteen, Schedule, ShiftTime, Shift, ClosedDate } from '@/lib/types';
import { updateSchedule, addClosedDate } from '@/data/mockData';
import { Calendar as CalendarIcon, Clock, X, Plus, Save } from 'lucide-react';

interface ScheduleCalendarProps {
  canteen: Canteen;
  onUpdate: (updatedCanteen: Canteen) => void;
  readOnly?: boolean;
}

const ScheduleCalendar = ({ canteen, onUpdate, readOnly = false }: ScheduleCalendarProps) => {
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined);
  const [closingReason, setClosingReason] = useState('');
  const [isClosingDialogOpen, setIsClosingDialogOpen] = useState(false);
  const [isShiftDialogOpen, setIsShiftDialogOpen] = useState(false);
  const [schedule, setSchedule] = useState<Schedule>(canteen.schedule);
  const [selectedDay, setSelectedDay] = useState<string>('monday');
  const [shifts, setShifts] = useState<Shift[]>([]);
  
  // Format date for display
  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', {
      weekday: 'long',
      month: 'long',
      day: 'numeric',
      year: 'numeric',
    });
  };
  
  // Check if a date is marked as closed
  const isDateClosed = (date: Date) => {
    return schedule.closedDates.some(
      (closedDate) => 
        new Date(closedDate.date).toDateString() === date.toDateString()
    );
  };
  
  // Handle adding a new closed date
  const handleAddClosedDate = () => {
    if (!selectedDate) {
      toast({
        title: "Error",
        description: "Please select a date",
        variant: "destructive",
      });
      return;
    }
    
    if (!closingReason.trim()) {
      toast({
        title: "Error",
        description: "Please provide a reason for closing",
        variant: "destructive",
      });
      return;
    }
    
    // Add to schedule
    const newClosedDate = {
      date: selectedDate,
      reason: closingReason,
    };
    
    addClosedDate(canteen.id, newClosedDate);
    
    // Update local state
    const updatedSchedule = {
      ...schedule,
      closedDates: [
        ...schedule.closedDates,
        {
          id: `closed-${Date.now()}`,
          date: selectedDate,
          reason: closingReason,
        },
      ],
    };
    
    setSchedule(updatedSchedule);
    
    // Update canteen
    const updatedCanteen = {
      ...canteen,
      schedule: updatedSchedule,
    };
    
    onUpdate(updatedCanteen);
    
    // Reset form
    setSelectedDate(undefined);
    setClosingReason('');
    setIsClosingDialogOpen(false);
    
    toast({
      title: "Closing Added",
      description: `The canteen will be closed on ${formatDate(selectedDate)}.`,
    });
  };
  
  // Handle removing a closed date
  const handleRemoveClosedDate = (closedDateId: string) => {
    const updatedClosedDates = schedule.closedDates.filter(
      (date) => date.id !== closedDateId
    );
    
    const updatedSchedule = {
      ...schedule,
      closedDates: updatedClosedDates,
    };
    
    setSchedule(updatedSchedule);
    updateSchedule(canteen.id, updatedSchedule);
    
    // Update canteen
    const updatedCanteen = {
      ...canteen,
      schedule: updatedSchedule,
    };
    
    onUpdate(updatedCanteen);
    
    toast({
      title: "Closing Removed",
      description: "The closing date has been removed.",
    });
  };
  
  // Load shifts for a day
  const loadShiftsForDay = (day: string) => {
    const daySchedule = schedule.regularHours.find((d) => d.day === day);
    if (daySchedule) {
      setShifts([...daySchedule.shifts]);
    } else {
      setShifts([]);
    }
    setSelectedDay(day);
    setIsShiftDialogOpen(true);
  };
  
  // Add a new shift
  const handleAddShift = () => {
    setShifts([
      ...shifts,
      { id: `shift-${Date.now()}`, start: '09:00', end: '17:00' },
    ]);
  };
  
  // Remove a shift
  const handleRemoveShift = (shiftId: string) => {
    setShifts(shifts.filter((shift) => shift.id !== shiftId));
  };
  
  // Update shift time
  const handleShiftChange = (shiftId: string, field: 'start' | 'end', value: string) => {
    setShifts(
      shifts.map((shift) =>
        shift.id === shiftId ? { ...shift, [field]: value } : shift
      )
    );
  };
  
  // Save shifts for a day
  const handleSaveShifts = () => {
    // Validate shifts (ensure start is before end)
    for (const shift of shifts) {
      const [startHour, startMinute] = shift.start.split(':').map(Number);
      const [endHour, endMinute] = shift.end.split(':').map(Number);
      
      const startTime = startHour * 60 + startMinute;
      const endTime = endHour * 60 + endMinute;
      
      if (startTime >= endTime) {
        toast({
          title: "Invalid Shift Time",
          description: "End time must be after start time",
          variant: "destructive",
        });
        return;
      }
    }
    
    const updatedRegularHours = schedule.regularHours.map((day) =>
      day.day === selectedDay
        ? { ...day, shifts: [...shifts] }
        : day
    );
    
    const updatedSchedule = {
      ...schedule,
      regularHours: updatedRegularHours,
    };
    
    setSchedule(updatedSchedule);
    updateSchedule(canteen.id, updatedSchedule);
    
    // Update canteen
    const updatedCanteen = {
      ...canteen,
      schedule: updatedSchedule,
    };
    
    onUpdate(updatedCanteen);
    
    setIsShiftDialogOpen(false);
    
    toast({
      title: "Schedule Updated",
      description: `The schedule for ${selectedDay} has been updated.`,
    });
  };
  
  // Format time for display
  const formatTime = (time: string) => {
    const [hours, minutes] = time.split(':');
    const hour = parseInt(hours);
    const period = hour >= 12 ? 'PM' : 'AM';
    const formattedHour = hour % 12 || 12;
    return `${formattedHour}:${minutes} ${period}`;
  };
  
  // Get day name from date
  const getDayName = (date: Date) => {
    return date.toLocaleDateString('en-US', { weekday: 'long' }).toLowerCase();
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-1 space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CalendarIcon size={18} />
                <span>Calendar</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Calendar
                mode="single"
                selected={selectedDate}
                onSelect={setSelectedDate}
                className="rounded-md border"
                modifiers={{
                  closed: (date) => isDateClosed(date),
                }}
                modifiersClassNames={{
                  closed: 'bg-destructive/10 text-destructive font-medium',
                }}
              />
              
              {!readOnly && (
                <div className="mt-4">
                  <Dialog open={isClosingDialogOpen} onOpenChange={setIsClosingDialogOpen}>
                    <DialogTrigger asChild>
                      <Button className="w-full">
                        Mark Selected Date as Closed
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Mark Canteen as Closed</DialogTitle>
                        <DialogDescription>
                          {selectedDate
                            ? `The canteen will be closed on ${formatDate(selectedDate)}.`
                            : 'Please select a date on the calendar.'}
                        </DialogDescription>
                      </DialogHeader>
                      
                      {selectedDate && (
                        <div className="space-y-4 py-4">
                          <div className="space-y-2">
                            <Label htmlFor="closing-reason">Reason for Closing</Label>
                            <Input
                              id="closing-reason"
                              value={closingReason}
                              onChange={(e) => setClosingReason(e.target.value)}
                              placeholder="e.g., Holiday, Maintenance, etc."
                            />
                          </div>
                        </div>
                      )}
                      
                      <DialogFooter>
                        <Button variant="outline" onClick={() => setIsClosingDialogOpen(false)}>
                          Cancel
                        </Button>
                        <Button onClick={handleAddClosedDate} disabled={!selectedDate}>
                          Confirm Closing
                        </Button>
                      </DialogFooter>
                    </DialogContent>
                  </Dialog>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
        
        <div className="md:col-span-2 space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Clock size={18} />
                  <span>Regular Operating Hours</span>
                </div>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {schedule.regularHours.map((day) => (
                <div
                  key={day.id}
                  className="flex flex-col sm:flex-row justify-between items-start sm:items-center p-3 rounded-md border"
                >
                  <div>
                    <div className="font-medium capitalize">{day.day}</div>
                    <div className="text-sm text-muted-foreground space-y-0.5">
                      {day.shifts.length > 0 ? (
                        day.shifts.map((shift, index) => (
                          <div key={index}>
                            {formatTime(shift.start)} - {formatTime(shift.end)}
                          </div>
                        ))
                      ) : (
                        <div>Closed</div>
                      )}
                    </div>
                  </div>
                  
                  {!readOnly && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => loadShiftsForDay(day.day)}
                      className="mt-2 sm:mt-0"
                    >
                      Edit Hours
                    </Button>
                  )}
                </div>
              ))}
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CalendarIcon size={18} />
                <span>Special Closings</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              {schedule.closedDates.length > 0 ? (
                schedule.closedDates.map((closedDate) => (
                  <div
                    key={closedDate.id}
                    className="flex justify-between items-center p-3 rounded-md border border-destructive/20 bg-destructive/5"
                  >
                    <div>
                      <div className="font-medium">
                        {new Date(closedDate.date).toLocaleDateString('en-US', {
                          weekday: 'short',
                          month: 'short',
                          day: 'numeric',
                        })}
                      </div>
                      <div className="text-sm text-muted-foreground">{closedDate.reason}</div>
                    </div>
                    
                    {!readOnly && (
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleRemoveClosedDate(closedDate.id)}
                        className="h-8 w-8 text-destructive"
                      >
                        <X size={16} />
                      </Button>
                    )}
                  </div>
                ))
              ) : (
                <div className="text-center py-4 text-muted-foreground">
                  No special closings scheduled
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
      
      {!readOnly && (
        <Dialog open={isShiftDialogOpen} onOpenChange={setIsShiftDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Edit Shifts for {selectedDay && selectedDay.charAt(0).toUpperCase() + selectedDay.slice(1)}</DialogTitle>
              <DialogDescription>
                Set the regular operating hours for this day of the week.
              </DialogDescription>
            </DialogHeader>
            
            <div className="space-y-4 py-4">
              {shifts.map((shift, index) => (
                <div key={shift.id} className="flex items-center gap-2">
                  <div className="grid grid-cols-2 gap-2 flex-grow">
                    <div className="space-y-1">
                      <Label htmlFor={`start-${shift.id}`}>Start Time</Label>
                      <Input
                        id={`start-${shift.id}`}
                        type="time"
                        value={shift.start}
                        onChange={(e) => handleShiftChange(shift.id, 'start', e.target.value)}
                      />
                    </div>
                    <div className="space-y-1">
                      <Label htmlFor={`end-${shift.id}`}>End Time</Label>
                      <Input
                        id={`end-${shift.id}`}
                        type="time"
                        value={shift.end}
                        onChange={(e) => handleShiftChange(shift.id, 'end', e.target.value)}
                      />
                    </div>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleRemoveShift(shift.id)}
                    className="self-end mb-0.5 h-10 w-10 flex-shrink-0 text-destructive"
                  >
                    <X size={18} />
                  </Button>
                </div>
              ))}
              
              <Button
                type="button"
                variant="outline"
                onClick={handleAddShift}
                className="w-full"
              >
                <Plus size={16} className="mr-2" />
                Add Shift
              </Button>
            </div>
            
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsShiftDialogOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleSaveShifts}>
                <Save size={16} className="mr-2" />
                Save Changes
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
};

export default ScheduleCalendar;
