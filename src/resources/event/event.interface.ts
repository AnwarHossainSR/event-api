export default interface Event {
    id: string;
    name: string;
    date: Date;
    venue: string;
    totalSeats: number;
    availableSeats: number;
}
