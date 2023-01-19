import { useQuery } from "@tanstack/react-query";
import { showNotes, showTags } from "../backend";
import { Tag, RawNote } from "../types/types";
import Swal from "sweetalert2";

const queryTag = () => {
  return useQuery<Tag[], Error>({
    queryKey: ["tags"],
    queryFn: showTags,
  });
};

const queryNote = () => {
  return useQuery<RawNote[], Error>({
    queryKey: ["notes"],
    queryFn: showNotes,
  });
};

const convertNotes = (notes: RawNote[], tags: Tag[]) => {
  const unorderedNotes = notes?.map((note) => {
    return {
      ...note,
      tags: tags.filter((tag) => note.tagIds.includes(tag.id)),
    };
  });

  return unorderedNotes.sort((a, b) => b.timestamp - a.timestamp);
};

const successAlert = () =>
  Swal.fire({
    background: "#292b2c",
    color: "white",
    title: "Action Completed",
    icon: "success",
    confirmButtonText: "Ok",
  });

const errorAlert = (error: Error) =>
  Swal.fire({
    background: "#292b2c",
    color: "white",
    title: "Error",
    text: error.toString(),
    icon: "error",
    confirmButtonText: "Ok",
  });

const getDateFromTimestamp = (timestamp: number) => {
  const months = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];

  const date = new Date(timestamp);
  const splitString = date.toString().split(" ");
  const year = splitString[3];
  const month = months.findIndex((it) => it === splitString[1]) + 1;
  const monthString = month < 10 ? `0${month}` : `${month}`;
  const day = splitString[2];
  const hourAndMinute = splitString[4].split(":").slice(0, 2);
  const hourAndMinuteString = hourAndMinute.join(":");

  return `🕒 ${day}-${monthString}-${year} • ${hourAndMinuteString}`;
};

export {
  queryTag,
  queryNote,
  convertNotes,
  successAlert,
  errorAlert,
  getDateFromTimestamp,
};
