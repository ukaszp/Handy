import { Rating } from "./Rating";
import { Region } from "./Region";
import { Skill } from "./Skill";
import { User } from "./User";

export interface Handyman {
    id: number;
    user?: User;
    userId: number;
    skills?: Skill[];
    portfolioURL?: string;
    region?: Region;
    regionId?: number;
    isActive: boolean;
    ratings?: Rating[];
    description?: string;
  }