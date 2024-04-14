export function countTicketNumbers(numbers: number[]): number {
  return numbers.reduce((acc, curr) => (curr === 1 ? acc + 1 : acc))
}
