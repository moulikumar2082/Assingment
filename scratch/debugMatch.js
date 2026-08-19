const contextBlock = "Bachelor of Technology in CSE | 2023 - Present Expected Graduation: 2027"
const expectedRegex = /(?:expected|graduat(?:ing|ion)?|passing|completion|est\.?)[^0-9\r\n]{0,30}\b(20\d{2})\b/i
console.log('Match:', contextBlock.match(expectedRegex))
