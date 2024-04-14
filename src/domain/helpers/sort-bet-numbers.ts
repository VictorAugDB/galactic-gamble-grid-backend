export function sortBetNumbers() {
  function shuffleArray(array: number[]) {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1))

      ;[array[i], array[j]] = [array[j], array[i]]
    }
    return array
  }

  let numbers = Array.from({ length: 25 }, (_, i) => i + 1)

  console.log({ numbers })

  numbers = shuffleArray(numbers)

  return numbers.slice(0, 15)
}
