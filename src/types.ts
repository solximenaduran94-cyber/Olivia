export interface RSVP {
  id: string;
  name: string;
  attending: 'yes' | 'no';
  dietary: string;
  message?: string;
  guestsCount: number;
  createdAt: string;
}

export interface InvitationConfig {
  name: string;
  age: number;
  date: string; // e.g. "2026-08-08" for countdown calculations
  displayDate: string; // e.g. "Sábado, 8 de Agosto"
  timeFrom: string; // e.g. "15:00"
  timeTo: string; // e.g. "19:00"
  venue: string;
  address: string;
  mapsUrl: string;
  dressCodeTitle: string;
  dressCodeDesc: string;
  whatsappPhone: string; // phone number that receives RSVP notices
  rsvpDeadline: string; // e.g., "25 de Julio"
}
