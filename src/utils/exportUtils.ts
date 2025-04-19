
import { Event, User } from '@/types';

// Export attendance list as CSV
export const exportAttendanceListCSV = (event: Event, attendees: User[]): void => {
  // Create CSV headers
  let csvContent = 'Name,Email,Department,Year,Check-in Time\n';
  
  // Add each attendee
  attendees.forEach(user => {
    const row = [
      user.name,
      user.email,
      user.department,
      user.year,
      new Date().toLocaleString() // Current time as check-in time
    ].map(value => `"${value}"`).join(',');
    
    csvContent += row + '\n';
  });
  
  // Create a Blob with the CSV content
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  
  // Create a URL for the Blob
  const url = URL.createObjectURL(blob);
  
  // Create a link element to trigger the download
  const link = document.createElement('a');
  link.href = url;
  link.setAttribute('download', `attendance_${event.name.replace(/\s+/g, '_')}_${new Date().toISOString().split('T')[0]}.csv`);
  document.body.appendChild(link);
  
  // Trigger the download
  link.click();
  
  // Clean up
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
};

// Export attendance list as JSON
export const exportAttendanceListJSON = (event: Event, attendees: User[]): void => {
  // Create a simplified array of attendees
  const attendeeList = attendees.map(user => ({
    name: user.name,
    email: user.email,
    department: user.department,
    year: user.year,
    checkInTime: new Date().toISOString()
  }));
  
  // Create the export object
  const exportData = {
    event: {
      id: event.id,
      name: event.name,
      date: event.date,
      venue: event.venue
    },
    attendees: attendeeList,
    exportTime: new Date().toISOString()
  };
  
  // Convert to JSON string
  const jsonContent = JSON.stringify(exportData, null, 2);
  
  // Create a Blob with the JSON content
  const blob = new Blob([jsonContent], { type: 'application/json' });
  
  // Create a URL for the Blob
  const url = URL.createObjectURL(blob);
  
  // Create a link element to trigger the download
  const link = document.createElement('a');
  link.href = url;
  link.setAttribute('download', `attendance_${event.name.replace(/\s+/g, '_')}_${new Date().toISOString().split('T')[0]}.json`);
  document.body.appendChild(link);
  
  // Trigger the download
  link.click();
  
  // Clean up
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
};
