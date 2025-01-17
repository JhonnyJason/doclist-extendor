import encDetect from "npm:jschardet";
import iconv from "npm:iconv-lite"
import { Buffer } from 'node:buffer';

let encoding;

export function readFile(filePath) {
    const fileData = Deno.readFileSync(filePath)
    
    const fileBuffer = Buffer.from(fileData)
    const result = encDetect.detect(fileBuffer)
    log(result)
   
    let deCoder;
    if(result.confidence > 0.5) {
        encoding = result.encoding
        deCoder = new TextDecoder(result.encoding)
    } else {throw new Error("Uncertainty on file encoding!")}

    return deCoder.decode(fileData)
}

export function writeFile(filePath, fileString) {
    const fileBuf = iconv.encode(fileString, encoding)
    const fileData = new Uint8Array(fileBuf.buffer, fileBuf.byteOffset, fileBuf.byteLength); 
    return Deno.writeFileSync(filePath, fileData)
}