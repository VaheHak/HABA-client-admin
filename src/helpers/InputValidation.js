export function validateInput(num) {
  try {
    if (typeof +num === 'number' && +num < 0) return 0
    else if (typeof +num === 'number' && +num >= 0) return num
    else if (num === '') return ''
    else return '';
  } catch (err) {
    return "Input " + err;
  }
}

export function dateToday(date) {
  try {
    const today = new Date().toISOString().substring(0, 16)
    if (date < today){
      return today;
    }
    return date;
  } catch (err) {
    return "Input " + err;
  }
}

