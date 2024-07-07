import { Handyman } from "./Handyman";
import { Offer } from "./Offer";
import { RatingRespond } from "./RatingRespond";
import { User } from "./User";

export interface Rating {
    id: number;
    offer: Offer;
    offerId: number;
    rate: number;
    reviewContent?: string;
    handyman: Handyman;
    handymanId: number;
    creationDate: Date;
    ratingResponds?: RatingRespond[];
    user: User;
    userId: number;
  }