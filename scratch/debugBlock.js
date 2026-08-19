const block = "EDUCATION Bachelor of Technology in CSE | 2023 - Present Expected Graduation: 2027 ABC University"
const regex = /(?:expected|graduat(?:ing|ion)?|passing|completion|est\.?)[^0-9\r\n]{0,30}\b(20\d{2})\b/i
console.log('Match:', block.match(regex))
