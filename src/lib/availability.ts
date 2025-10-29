
import type { CompanyProfile, OperatingHours } from '@/contexts/CompanyContext';

/**
 * Gets the current day name in Portuguese.
 * e.g., 'Segunda', 'Terça', ...
 */
function getCurrentDayName(): string {
  const days = ['Domingo', 'Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta', 'Sábado'];
  return days[new Date().getDay()];
}

/**
 * Checks if the current time is within the provided open and close times.
 * @param openTime - e.g., "09:00"
 * @param closeTime - e.g., "18:00"
 */
function isWithinTime(openTime: string, closeTime: string): boolean {
  if (!openTime || !closeTime) return false;
  
  const now = new Date();
  const currentTime = now.getHours() * 60 + now.getMinutes();

  const [openHour, openMinute] = openTime.split(':').map(Number);
  const openTotalMinutes = openHour * 60 + openMinute;
  
  const [closeHour, closeMinute] = closeTime.split(':').map(Number);
  const closeTotalMinutes = closeHour * 60 + closeMinute;

  // Handle overnight logic (e.g., closes at 02:00)
  if (closeTotalMinutes < openTotalMinutes) {
    return currentTime >= openTotalMinutes || currentTime < closeTotalMinutes;
  }
  
  return currentTime >= openTotalMinutes && currentTime < closeTotalMinutes;
}


/**
 * Determines if a company is currently open based on its availability status and operating hours.
 * Follows a strict hierarchy: OPEN/CLOSED overrides > AUTO (schedule).
 *
 * @param company - The company profile object.
 * @returns boolean - True if the company is considered open, false otherwise.
 */
export function isCompanyActuallyOpen(company: Partial<CompanyProfile>): boolean {
  // 1. Manual Override: OPEN
  if (company.availabilityStatus === 'OPEN') {
    return true;
  }

  // 2. Manual Override: CLOSED
  if (company.availabilityStatus === 'CLOSED') {
    return false;
  }

  // 3. Automatic Mode (based on schedule)
  if (company.availabilityStatus === 'AUTO') {
    if (!company.hoursOfOperation) {
      return false; // Default to closed if no hours are provided
    }
    
    const todayName = getCurrentDayName();
    const todayHours = company.hoursOfOperation.find(h => h.day === todayName);

    if (!todayHours || !todayHours.isOpen) {
      return false; // Closed all day
    }

    return isWithinTime(todayHours.open, todayHours.close);
  }

  // Default fallback if status is somehow invalid
  return false;
}
