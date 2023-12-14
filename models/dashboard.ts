export interface Announcement {
  id: string;
  sender: string;
  createdAt: Date;
  content: string;
  photoUri?: string;
}
