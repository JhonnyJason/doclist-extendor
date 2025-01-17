import { parse, stringify } from "jsr:@std/csv";
import * as progress from "./progressFeedback.js"
import * as docvz from "./docvzRequest.js"

import { setTimeout } from "node:timers/promises";

const parseOptions = {
    skipFirstRow: true,
    strip: true,
    separator: ";"
}

async function extendRow(rowData) {
    const firstNameFull = rowData["First name"]
    const lastName = rowData["Name"]
    const zip = rowData["ZIP"]

    const firstNameTokens = firstNameFull.split(" ")
    const firstname = firstNameTokens[0]

    const docvzEntry = await docvz.requestEntry(firstname, lastName, zip)
    
    // log(docvzEntry)
    // log(rowData)
    Object.assign(rowData, docvzEntry)
    // log(rowData)
    
    // await  setTimeout(1000, null)    
    // throw new Error("Death on Purpose!")
}


export async function processFile(fileString) {
    const rowData = parse(fileString, parseOptions)

    const totalRows = rowData.length
    let cnt = totalRows
    let current = totalRows - cnt
    
    progress.start()
    
    try { while(cnt--) {
        progress.update(current, totalRows)
        await extendRow(rowData[current])
        current = totalRows - cnt
    }} catch(error) {
        progress.fail()
        throw error
    }

    const stringifyOptions = {
        columns: Object.keys(rowData[0]),
        separator: ";"
    }
    const resultCSV = stringify(rowData, stringifyOptions)

    progress.update(current, totalRows)
    progress.succeed()

    return resultCSV

}