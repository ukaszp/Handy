import { User } from "@/data/User";

export function getUserInitials(user: User | null | undefined) {
    const firstName = user?.name || '';
    const lastName = user?.lastName || '';
    const initials = `${firstName[0] ?? ''}${lastName[0] ?? ''}`;
    return initials.toUpperCase();
  }