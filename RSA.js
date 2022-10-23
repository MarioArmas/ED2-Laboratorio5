const P = 5
const Q = 7
const N = P * Q
const phi = (P-1) * (Q-1)
let e = 2
while (e < phi) {
  if (gcd(e, phi) === 1) {
    break
  }
  e = e + 1
}
const d = getKeyDesencryption(e, phi)
//const publicKeys = [e, N]
//const privateKeys = [d, N]

function gcd(e, phi) {
  let a = e
  let h = phi
  let temp = 0
  while(true) {
    temp = a % h
    if (temp === 0){
      return h
    }
    a = h
    h = temp
  }
}

function getKeyDesencryption(e, phi) {
  let counter = 1
  const possibleValues = []
  while (possibleValues.length < 1) {
    const DxE = e * counter
    if (DxE % phi === 1) {
      possibleValues.push(counter)
    }
    counter += 1
  }

  return possibleValues[possibleValues.length - 1]
}

function encodeRSA(e, N, input) {
  const num = Math.pow(input, e)
  return num % N
}

function decodeRSA(d, N, input) {
  const num = Math.pow(input, d)
  return num % N
}

function convertOneToFourLetters(num) {
  const firstNum1 = Math.floor(num / 2)
  const firstNum2 = Math.ceil(num / 2)

  const num1 = Math.floor(firstNum1 / 2)
  const num2 = Math.ceil(firstNum1 / 2)
  const num3 = Math.floor(firstNum2 / 2)
  const num4 = Math.ceil(firstNum2 / 2)

  const array = [num]
  const temp = [...array].flat(1)
  array.length = 0
  array.push([...temp.map(number => [Math.floor(number / 2), Math.ceil(number / 2)])])
  return [num1, num2, num3, num4]
}

function deconvertFourToOneLetter(nums) {
  let num = 0
  nums.forEach(item => {
    num += item
  })

  return num
}

export function encodeMessageRSA(message) {
  const messageArray = message.split('').map(letter => letter.charCodeAt(0))
  const result = messageArray.map(num => {
    const dividedNums = convertOneToFourLetters(num).map(singleNum => encodeRSA(e, N, singleNum))
    //console.log(dividedNums, dividedNums.reduce((x, y) => x + y))
    return dividedNums
  })

  return result.flat(1).map(num => String.fromCharCode(num)).join('')
}

export function decodeMessageRSA(codedMessage) {
  const messageArray = codedMessage.split('').map(letter => letter.charCodeAt(0))
  const message = []
  for (let i = 0; i < messageArray.length / 4; i++) {
    const numsArray = [messageArray[0 + 4 * i], messageArray[1 + 4 * i], messageArray[2 + 4 * i], messageArray[3 + 4 * i]]
    message.push(deconvertFourToOneLetter(numsArray.map(num => decodeRSA(d, N, num))))
  }

  return message.flat(1).map(num => String.fromCharCode(num)).join('')
}