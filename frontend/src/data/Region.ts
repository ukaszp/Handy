import { Handyman } from "./Handyman";
import { Task } from "./Task";

export interface Region{
    id: number;
    name: string;
    handymen: Handyman[];
    tasks: Task[];
}