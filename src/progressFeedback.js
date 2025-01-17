import yoctoSpinner from "npm:yocto-spinner"

const finishedChar = "="
const unfinishedChar = "-"

let text = ""
let progress = getProgressString(0, 1)
const spinner = yoctoSpinner()


function getProgressString(current, max) {
    const percent = 100.0 * (current / max)

    const finishedNr = (percent - (percent % 4))/ 4 
    const unfinishedNr = 25 - finishedNr
    
    const finishedString = finishedChar.repeat(finishedNr)
    const unfinishedString = unfinishedChar.repeat(unfinishedNr)

    return `[${finishedString}${unfinishedString}]`
}


function updateSpinnerProgress(current, total) {
    progress = getProgressString(current, total)
    text = `processing entries ${progress} (${current}/${total})`
    spinner.text = text
}


export function start() {spinner.start()}

export function update(current, total) { 
    updateSpinnerProgress(current, total)
}

export function succeed() {spinner.success()}

export function fail() {spinner.error()}