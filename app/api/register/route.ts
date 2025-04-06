import { NextResponse } from 'next/server'
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import clientPromise from '@/lib/mongodb'

export async function POST(req: Request) {
  try {
    const body = await req.json()
    console.log("Received body:", body) // 👈 Debug log

    const { username, password } = body

    if (!username || !password) {
      return NextResponse.json({ error: 'Username and password required' }, { status: 400 })
    }

    const client = await clientPromise
    const db = client.db('CodeBinge') // your DB name
    const users = db.collection('users')

    const existing = await users.findOne({ username })
    if (existing) {
      return NextResponse.json({ error: 'User already exists' }, { status: 400 })
    }

    const hashed = await bcrypt.hash(password, 10)

    const result = await users.insertOne({
      username,
      password: hashed,
      createdAt: new Date()
    })

    const token = jwt.sign(
      { id: result.insertedId, username },
      process.env.JWT_SECRET!,
      { expiresIn: '7d' }
    )

    return NextResponse.json({ token })

  } catch (err: any) {
    console.error('Register error:', err)
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }
}
