import {
  faSave,
  faCircleXmark,
} from "@fortawesome/free-regular-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import EdiText, { EdiTextProps, EdiTextType, InputProps } from "react-editext";

export default function SlateEdiText(props: EdiTextProps) {
  return (
    <EdiText
    editOnViewClick
    cancelOnEscape
    submitOnUnfocus
    saveButtonContent={<FontAwesomeIcon icon={faSave} />}
    cancelButtonContent={<FontAwesomeIcon icon={faCircleXmark} />}
    viewProps={{
      className: "self-start h-full p-0.5 w-full cursor-text",
    }}
    editContainerClassName="bg-transparent border-none"
    hideIcons
    {...props}
    />
  );
}
