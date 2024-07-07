import { format } from "timeago.js";

function formatUserLocaleDate(date: Date) {
  const userLocale =
    navigator.language || (navigator as any)?.userLanguage || "en-GB";
  return date.toLocaleDateString(userLocale, {
    day: "2-digit",
    month: "2-digit",
    year: "2-digit",
  });
}

interface DateCompProps {
  timestamp: EpochTimeStamp;
  prepend?: string | Element | any;
}
let DateString = (props: DateCompProps) => {
  let date = new Date(props.timestamp);
  if ((date as unknown) === "Invalid Date") {
    console.error("Invalid date: ", props.timestamp);
    return null;
  }
  return (
    date && (
      <p class="text-sm text-neutral-400 mb-2">
        {date && (
          <>
            {props.prepend || "Submitted "}
            <span class="text-neutral-400 font-bold">
              {format(new Date(date))}
            </span>{" "}
            on{" "}
            <span class="text-neutral-400 font-bold">
              {formatUserLocaleDate(new Date(date))}
            </span>
          </>
        )}
      </p>
    )
  );
};

export default DateString;
