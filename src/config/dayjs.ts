import dayjs from "dayjs";
import timezone = require("dayjs/plugin/timezone");
import utc = require("dayjs/plugin/utc");
import isBetween from "dayjs/plugin/isBetween";
dayjs.extend(isBetween);
dayjs.extend(timezone);
dayjs.extend(utc);

export default dayjs;