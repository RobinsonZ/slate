import {
  faEdit,
  faSave,
  faCircleXmark,
} from "@fortawesome/free-regular-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import EdiText, { EdiTextProps, EdiTextType, InputProps } from "react-editext";

export default function SlateEdiText(props: EdiTextProps) {
  return (
    <EdiText
      {...props}
      editOnViewClick
      cancelOnEscape
      submitOnUnfocus
      editButtonContent={
        <>
          <FontAwesomeIcon icon={faEdit} />
          &nbsp;&nbsp;note
        </>
      }
      saveButtonContent={<FontAwesomeIcon icon={faSave} />}
      cancelButtonContent={<FontAwesomeIcon icon={faCircleXmark} />}
      editButtonClassName="h-full rounded w-16 p-1.5 font-label text-sm text-white italic bg-slate-500 bg-opacity-50 self-end"
      viewContainerClassName="flex flex-col items-end"
      viewProps={{
        className: "self-start h-full p-0.5 w-full cursor-text",
      }}
      editContainerClassName="bg-transparent border-none"
      inputProps={{
        className:
          "block w-full h-full p-0.5 outline-none bg-transparent resize-none font-mono text-sm",
        onFocus: (e: any) => {
          // absolutely horrendous hack but hey it works
          e.target.style.height = e.target.scrollHeight + "px";
        },
        onInput: (e: any) => {
          // absolutely horrendous hack but hey it works
          e.target.style.height = e.target.scrollHeight + "px";
        },
      }}
      saveButtonClassName="rounded h-full p-1.5 font-label text-white italic bg-slate-500 bg-opacity-50 self-end mr-2"
      cancelButtonClassName="rounded h-full p-1.5 font-label text-red-500 italic bg-slate-500 bg-opacity-50 self-end"
      hideIcons
    />
  );
}
