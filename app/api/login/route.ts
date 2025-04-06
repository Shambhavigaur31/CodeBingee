import { NextResponse } from 'next/server'
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import clientPromise from '@/lib/mongodb'

export async function POST(req: Request) {
  try {
    const { username, password } = await req.json()
    console.log('Received body:', { username, password }) // Debug log
    if (!username || !password) {
      return NextResponse.json({ error: 'Missing fields' }, { status: 400 })
    }

    const client = await clientPromise
    const db = client.db('CodeBinge') // your database name
    const users = db.collection('users')

    const user = await users.findOne({ username })
    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 401 })
    }

    const isValid = await bcrypt.compare(password, user.password)
    console.log('Password valid:', isValid) // Debug log
    if (!isValid) {
      return NextResponse.json({ error: 'Invalid password' }, { status: 401 })
    }

    const token = jwt.sign(
      { id: user._id, username: user.username },
      process.env.JWT_SECRET!,
      { expiresIn: '7d' }
    )

    return NextResponse.json({ token })
  } catch (err) {
    console.error('Login error:', err)
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }
}
