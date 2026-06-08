export function checkHeading(str){
    return /^(\*)(\*)(.*)\*$/.test(str)
}

export function replaceheadingstars(str){
    return str.replace(/^(\*)(\*)|(\*)$/g,"")
}