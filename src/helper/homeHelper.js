import { bssPhases, phasesIcons } from "../constants"


export const GetStatusIcons = (statusObj) => {
    bssPhases.forEach((phase) => {
        statusObj[phase] = phasesIcons
    })
}

export const GetPhasesArray = (phases, phasesArray) => {
    phases.forEach((phase) => {
        phasesArray.push({ "phase": phase, value: 0, icons: null })
    })
    return phasesArray
}