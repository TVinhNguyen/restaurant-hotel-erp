import { UsersService } from './users.service';
import { UpdateUserDto } from '../auth/dto/update-user.dto';
export declare class UsersController {
    private usersService;
    constructor(usersService: UsersService);
    findAll(): Promise<import("../entities").User[]>;
    findOne(id: string): Promise<import("../entities").User>;
    update(id: string, updateUserDto: UpdateUserDto): Promise<import("../entities").User>;
    remove(id: string): Promise<void>;
}
