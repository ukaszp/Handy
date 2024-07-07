import { Handyman } from "./Handyman";
import { OfferStatus } from "./OfferStatus";
import { Rating } from "./Rating";
import { Task } from "./Task";

export interface Offer {
    id: number;
    task: Task;
    taskId: number;
    handyman: Handyman;
    handymanId: number;
    price?: number;
    estimatedTime?: string;
    status: OfferStatus;
    rating: Rating;
    comment: string;
  }

 