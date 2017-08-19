// Convert a space seperated string to an upper snake cased string
// e.g. "cat and dog" -> "CAT_AND_DOG"
export function upperSnakeCase (string) {
  return string.split(' ').join('_').toUpperCase();
}

// Convert an underscore or space sepertated sting to a camel-cased string
// e.g. "eat RHUBARB_pie" -> "eatRhubarbPie"
export function camelCase (string) {
  let words = string.toLowerCase().split(/_| /);
  return words.reduce((word, next) =>
    word + next[0].toUpperCase() + next.slice(1));
}
