import fs from 'node:fs'
import { parse } from 'csv-parse'

const fileName = 'tasks.csv'
const filePath = new URL(`./${fileName}`, import.meta.url)

const streamFile = fs.createReadStream(filePath)

const csvParseConfig = parse({
  delimiter: ',',
  skipEmptyLines: true,
  fromLine: 2,
})

async function importData() {
  const linesTotal = streamFile.pipe(csvParseConfig)

  for await (const line of linesTotal) {
    const [title, description] = line

    await fetch('http://localhost:3333/tasks', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        title,
        description,
      }),
    })
  }
}

importData()

function wait(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms))
}
