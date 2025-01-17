import { processArgs } from "./argsprocessor.js"
import { processFile } from "./fileprocessor.js"
import { readFile, writeFile } from "./fileIO.js"

globalThis.log = console.log
globalThis.errLog = console.error

try {
    const { inputPath, outputPath } = processArgs()
    
    const fileString = readFile(inputPath)
    const extendedFile = await processFile(fileString)
    
    writeFile(outputPath, extendedFile)
    
    log(`Successfuly written extended file to: ${outputPath}`)
} catch(error) {
    errLog("An uexpected Error appeared! Shutting down without processing.")
    errLog(error)
    Deno.exit()
}