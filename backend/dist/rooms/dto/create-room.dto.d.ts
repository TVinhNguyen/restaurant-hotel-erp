export declare class CreateRoomDto {
    propertyId: string;
    roomTypeId: string;
    number: string;
    floor?: string;
    viewType?: string;
    operationalStatus?: 'available' | 'out_of_service';
    housekeepingStatus?: 'clean' | 'dirty' | 'inspected';
    housekeeperNotes?: string;
}
