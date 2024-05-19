import * as React from "react";
import dayjs from "dayjs";
import Badge from "@mui/material/Badge";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { PickersDay } from "@mui/x-date-pickers/PickersDay";
import { DateCalendar } from "@mui/x-date-pickers/DateCalendar";
import { DayCalendarSkeleton } from "@mui/x-date-pickers/DayCalendarSkeleton";
import { Box } from "@mui/material";
import leacture from "../../images/lecture.png";
import "./calendar.css";
import { useEffect, useState, useRef } from "react";
import { toast } from "react-toastify";

function getRandomNumber(min, max) {
  return Math.round(Math.random() * (max - min) + min);
}
const MeetingArea = [
  "Powell's City of Books (Portland, OR)",
  "Strand Bookstore (New York, NY)",
  "Books & Books (Miami, FL)",
  "Brooklyn Book Festival",
  "the 92nd Street Y in New York",
  "Kennedy Center in Washington, D.C",
  "New York Public Library (NYPL) - New York",
  "The NYPL, the Stephen A. Schwarzman Building",
  "Los Angeles Public Library (LAPL) - Los Angeles, CA",
  "Chicago Public Library (CPL) - Chicago, IL",
  "Seattle Public Library (SPL) - Seattle, WA",
  "San Francisco Public Library (SFPL) - San Francisco, CA",
  "Boston Public Library (BPL) - Boston, MA",
  "Philadelphia Free Library - Philadelphia, PA",
  "Austin Public Library - Austin, TX",
  "Denver Public Library - Denver, CO",
  "Miami-Dade Public Library System - Miami, FL",
  "Columbia University - New York, NY",
  "University of Iowa - Iowa City, IA",
  "New York University (NYU) - New York, NY",
  "University of California, Berkeley - Berkeley, CA",
  "Stanford University - Stanford, CA",
  "University of Michigan - Ann Arbor, MI",
  "Yale University - New Haven, CT",
  "University of Texas at Austin - Austin, TX",
  "University of Chicago - Chicago, IL",
];
const dayToMeetingAreaIndex = {};

function organize(selectedDay) {
  if (typeof selectedDay === "number") {
    if (dayToMeetingAreaIndex[selectedDay] === undefined) {
      dayToMeetingAreaIndex[selectedDay] =
        Object.keys(dayToMeetingAreaIndex).length % MeetingArea.length;
    }

    toast(MeetingArea[dayToMeetingAreaIndex[selectedDay]]);
  } else {
  }
}

function fakeFetch(date, { signal }) {
  const storageKey = `dateMeeting-${date.format("YYYY-MM")}`;

  const storedDays = localStorage.getItem(storageKey);

  if (storedDays) {
    const daysToHighlight = JSON.parse(storedDays);
    return Promise.resolve({ daysToHighlight });
  } else {
    return new Promise((resolve, reject) => {
      const timeout = setTimeout(() => {
        const daysInMonth = date.daysInMonth();
        const daysToHighlight = [1, 2, 3].map(() =>
          getRandomNumber(1, daysInMonth)
        );

        localStorage.setItem(storageKey, JSON.stringify(daysToHighlight));

        resolve({ daysToHighlight });
      }, 500);

      signal.onabort = () => {
        clearTimeout(timeout);
        reject(new DOMException("aborted", "AbortError"));
      };
    });
  }
}
const initialValue = dayjs("2024-04-31");

function ServerDay(props) {
  const { highlightedDays = [], day, outsideCurrentMonth, ...other } = props;

  const handleDayClick = (dayOfMonth) => {
    if (isSelected) {
      organize(dayOfMonth);
    }
  };
  const isSelected =
    !props.outsideCurrentMonth &&
    highlightedDays.indexOf(props.day.date()) >= 0;

  const frame = !!isSelected
    ? {
        backgroundImage: `url(${require("../../images/frame.png")})`,
        backgroundSize: " 30px",
        backgroundRepeat: "no-repeat",
        backgroundPosition: "center",
      }
    : {};

  return (
    <Badge
      key={props.day.toString()}
      overlap="circular"
      badgeContent={
        isSelected ? (
          <img
            src={leacture}
            alt="leacture"
            style={{ width: 10, height: 10 }}
          ></img>
        ) : undefined
      }
    >
      <PickersDay
        {...other}
        outsideCurrentMonth={outsideCurrentMonth}
        day={day}
        sx={frame}
        onClick={() => handleDayClick(day.date())}
      />
    </Badge>
  );
}

export default function DateCalendarServerRequest() {
  const requestAbortController = useRef(null);
  const [isLoading, setIsLoading] = useState(false);
  const [highlightedDays, setHighlightedDays] = useState([]);

  useEffect(() => {
    const date = dayjs();
    const abortController = new AbortController();

    setIsLoading(true);
    fakeFetch(date, { signal: abortController.signal })
      .then(({ daysToHighlight }) => {
        setHighlightedDays(daysToHighlight);
        setIsLoading(false);
      })
      .catch((error) => {
        setIsLoading(false);
      });

    return () => abortController.abort();
  }, []);

  const fetchHighlightedDays = (date) => {
    const controller = new AbortController();
    fakeFetch(date, {
      signal: controller.signal,
    })
      .then(({ daysToHighlight }) => {
        setHighlightedDays(daysToHighlight);
        setIsLoading(false);
      })
      .catch((error) => {
        if (error.name !== "AbortError") {
          throw error;
        }
      });

    requestAbortController.current = controller;
  };

  useEffect(() => {
    fetchHighlightedDays(initialValue);

    return () => requestAbortController.current?.abort();
  }, []);

  const handleMonthChange = (date) => {
    if (requestAbortController.current) {
      requestAbortController.current.abort();
    }

    setIsLoading(true);
    setHighlightedDays([]);
    fetchHighlightedDays(date);
  };

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <div className="calendar-scale">
        <DateCalendar
          defaultValue={initialValue}
          loading={isLoading}
          onMonthChange={handleMonthChange}
          renderLoading={() => <DayCalendarSkeleton />}
          slots={{
            day: ServerDay,
          }}
          slotProps={{
            day: {
              highlightedDays,
            },
          }}
        />
      </div>
    </LocalizationProvider>
  );
}
