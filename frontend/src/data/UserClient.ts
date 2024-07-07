import { Task } from "./Task";
import { User } from "./User";

export interface UserClient{
    id: number; 
    user: User;  
    userid: number;
    tasks: Task[];
    
}