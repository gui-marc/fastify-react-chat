import { format } from "date-fns";

export const hourAndMinute = (date: Date) => format(date, "HH:mm");
