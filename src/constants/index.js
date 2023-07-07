import { FiCheckCircle } from "react-icons/fi";
import { BiMessageRoundedError } from 'react-icons/bi';
import { GiSandsOfTime } from "react-icons/gi";
import { BsCloudUpload, BsClipboardCheck } from "react-icons/bs";
import { AiOutlineAppstoreAdd } from "react-icons/ai";

export const bssPhases = ["completed", "processing", "uploading", "validating", "starting", "error"]

export const phasesIcons = {
    "completed": <FiCheckCircle />,
    "processing": <GiSandsOfTime />,
    "validating": <BsClipboardCheck />,
    "starting": <AiOutlineAppstoreAdd />,
    "uploading": <BsCloudUpload />,
    "error": <BiMessageRoundedError />
}