import { Offer } from "./Offer";
import { Photo } from "./Photo";
import { Region } from "./Region";
import { Skill } from "./Skill";
import { StatusOfTask } from "./StatusOfTask";
import { User } from "./User";


export interface Task {
    id: number;
    user: User;
    clientId: number;
    title: string;
    description?: string;
    region?: Region;
    regionId?: number;
    status: StatusOfTask;
    creationDate: Date;
    completionDate?: Date;
    isActive: boolean;
    skills?: Skill[];
    offers?: Offer[];
    photos?: Photo[];
    finishedClient?: boolean;
    finishedHandyman?: boolean;
    acceptedOffer?: Offer;
    acceptedOfferId?: number;
  }

