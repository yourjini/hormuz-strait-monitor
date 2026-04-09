import { readFileSync } from 'fs'
import { join } from 'path'
import { NextResponse } from 'next/server'

const FILE = join(process.cwd(), 'data', 'industries.json')

export async function GET() {
  const data = JSON.parse(readFileSync(FILE, 'utf-8'))
  return NextResponse.json(data)
}
