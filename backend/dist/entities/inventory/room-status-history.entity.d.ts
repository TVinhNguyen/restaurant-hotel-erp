import { Room } from './room.entity';
import { Employee } from '../core/employee.entity';
export declare class RoomStatusHistory {
    id: string;
    roomId: string;
    statusType: 'operational' | 'housekeeping';
    status: string;
    changedAt: Date;
    changedBy: string;
    notes: string;
    room: Room;
    changedByEmployee: Employee;
}
