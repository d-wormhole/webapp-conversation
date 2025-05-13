import { type NextRequest } from 'next/server'
import { client, getInfo } from '@/app/api/utils/common'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    if (!body) {
      return new Response(JSON.stringify({ error: 'Request body is empty' }), { status: 400 })
    }

    const {
      inputs,
      query,
      files = [],
      conversation_id: conversationId,
      response_mode: responseMode,
    } = body

    if (!inputs || !query) {
      return new Response(JSON.stringify({ error: 'Missing required parameters' }), { status: 400 })
    }

    const { user } = getInfo(request)
    const res = await client.createChatMessage(inputs, query, user, responseMode, conversationId, files)

    if (!res.data) {
      return new Response(JSON.stringify({ error: 'No data returned from API' }), { status: 500 })
    }

    return new Response(res.data as any)
  } catch (error) {
    console.error('[CHAT_MESSAGES_ERROR]', error)
    return new Response(JSON.stringify({ error: 'Internal server error' }), { status: 500 })
  }
}
