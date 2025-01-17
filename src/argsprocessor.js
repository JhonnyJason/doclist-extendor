import path from "node:path"


export function processArgs() {
    const args = Deno.args;
    if(args.length !=2) errorOut(0)
    try {
        const inputPath = path.resolve(args[0])
        const outputPath = path.resolve(args[1])
        return {inputPath, outputPath}
    } catch(error) {
        errorOut(1, error)
    }
}


function errorOut(level, error) {
    console.error(`(${level}) Usage: doclist-extendor <inputPath> <outputPath>`)
    if(level > 0) {console.error(error)}
    Deno.exit()
}