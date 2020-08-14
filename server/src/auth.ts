import { Request } from 'express'
import { createHash } from 'crypto'

export function isAuthorized (expectedSha: string, request: Request) {
  if (request.headers && request.headers.authorization) {
    const { authorization } = request.headers
    const [algo, b64] = authorization.split(' ')
    if (algo.toLowerCase() === 'basic') {
      const sha = createHash('sha256').update(Buffer.from(b64, 'base64').toString()).digest('hex')
      return sha === expectedSha
    }
  }
  return false
}
