import { docvzURL, docvzPageSize } from "./config.js"

//############################################################
const notFoundObj = {
    Statuscode: "NOT FOUND"
}

const errorObj = {
    Statuscode: "ERROR"
}

const multipleResultsObj = {
    Statuscode: "MULTIPLE RESULTS"
}



//############################################################
async function postRequest(url, data) {
    
    const options = {
        method: 'POST',
        mode: 'cors',
        credentials: 'include',
        body: JSON.stringify(data),
        headers: {'Content-Type': 'application/json' }
    }

    try {
        const response = await fetch(url, options)
        if(!response.ok) {
            throw new Error(`Response not ok - status: ${response.status}!`) 
        }

        return response.json()
    } catch(err){ throw new Error("Network Error: "+err.message) }

}



async function retrieveProviders(searchData) {
    const { vpn, first_name, last_name, city, zip, expertise_id } = searchData

    try {
        const page_size = docvzPageSize
        const page = 1
        
        const requestData = { vpn, first_name, last_name, city, zip, expertise_id, page, page_size }
        const data = await postRequest(docvzURL, requestData)
        
        if(Array.isArray(data.providers)) { return data.providers }
        else { return [] }
            
    } catch(err) { throw err }
}
    

function createResultObject(provider) {
    
    let vpns = ""
    if(Array.isArray(provider.vpnList)) {
        vpns = provider.vpnList.join(" | ")
    }
    let mes = ""
    if(Array.isArray(provider.dameIds)) {
        mes = provider.dameIds.join(" | ")
    }
    let addresses = ""
    if(Array.isArray(provider.addresses)) {
        addresses = provider.addresses.map((adr) => adr.street)
        addresses = addresses.filter((el) => typeof el == "string" )
        addresses = addresses.join(" | ")
    }

    return {
            "VPN imported": vpns,
            "ME imported": mes,
            "Address imported": addresses,
            Statuscode: "OK"
    }

    // errLog("Provider result caused issues:")
    // errLog(provider)
    // errLog(err)
    // return errorObj
}


export async function requestEntry(first_name, last_name, zip) {
    try{
        const providers = await retrieveProviders({ first_name, last_name, zip })
        if(providers.length == 0 ) return notFoundObj
        if(providers.length > 1 ) return multipleResultsObj
        
        return createResultObject(providers[0])
    
    } catch(err) { 
        // errLog(err)
        return errorObj
    }
    
}
