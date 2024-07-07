import { Handyman } from "./Handyman";
import { Offer } from "./Offer";
import { StatusOfTask } from "./StatusOfTask";
import { User } from "./User";

export interface Conflict {
    id: number;
    clientId: number;
    handymanId: number;
    offerId: number;
    description?: string;
    status: StatusOfTask;
    created?: Date;
    client: User;
    offer: Offer;
    handymen: Handyman;
  }