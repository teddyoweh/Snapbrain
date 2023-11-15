import { createHash } from 'crypto';
import { ip } from '../config/ip';
 
function uniqueId_() {
  const timestamp = new Date().getTime();
  const timestampHex = timestamp.toString(26);
  const randomFourDigitsHex = Math.floor(Math.random() * 9000 + 1000).toString(16);
  const prefix = 'ABC';
  const combinedString = `${prefix}${timestampHex}${randomFourDigitsHex}`;
  const hash =  combinedString.split('').map(char => char.charCodeAt(0).toString(16).padStart(2, '0')).join('');

 
  return hash;
}

async function sha256(text) {
    const key = '12345678901234567890123456789012'
    const keyLength = key.length;
  let encrypted = '';

  for (let i = 0; i < text.length; i++) {
    const charCode = text.charCodeAt(i);
    const keyChar = key.charCodeAt(i % keyLength);
    const encryptedChar = String.fromCharCode(charCode ^ keyChar);
    encrypted += encryptedChar;
  }

  return encrypted;
//   const hashHex = hashArray.map(byte => byte.toString(16).padStart(2, '0')).join('');
//   return hashHex;
}

async function checkId(setUserId=null) {

    let userId = localStorage.getItem('userid');

    if (!userId) {
      
      userId = await uniqueId_();
  
      if (setUserId) {
        setUserId(userId);
      }
      localStorage.setItem('userid', userId);
    }
  
    return userId;
  }

function wrapImg(img){
  return `${ip}/public/${img}`;
}
export { uniqueId_ ,checkId,wrapImg};