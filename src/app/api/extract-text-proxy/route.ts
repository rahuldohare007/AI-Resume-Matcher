import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  console.log('\n' + '='.repeat(60))
  console.log('📤 Extract Text Proxy API Called')
  console.log('='.repeat(60))
  
  try {
    const formData = await request.formData()
    const file = formData.get('file') as File

    if (!file) {
      console.error('❌ No file in request')
      return NextResponse.json(
        { success: false, message: 'No file provided' },
        { status: 400 }
      )
    }

    console.log('📄 File received:')
    console.log('   Name:', file.name)
    console.log('   Size:', file.size, 'bytes')
    console.log('   Type:', file.type)

    // Check if NLP service URL is configured
    if (!process.env.NLP_SERVICE_URL) {
      console.error('❌ NLP_SERVICE_URL not configured')
      return NextResponse.json(
        { success: false, message: 'NLP service URL not configured' },
        { status: 500 }
      )
    }

    console.log('🌐 NLP Service URL:', process.env.NLP_SERVICE_URL)

    // Forward to NLP service
    const nlpFormData = new FormData()
    nlpFormData.append('file', file)

    const nlpUrl = `${process.env.NLP_SERVICE_URL}/extract-text`
    console.log('📤 Sending to:', nlpUrl)

    const nlpResponse = await fetch(nlpUrl, {
      method: 'POST',
      body: nlpFormData,
    })

    console.log('📥 NLP Response status:', nlpResponse.status)

    if (!nlpResponse.ok) {
      const errorText = await nlpResponse.text()
      console.error('❌ NLP service error:', errorText)
      return NextResponse.json(
        { 
          success: false, 
          message: `NLP service failed: ${nlpResponse.status}`,
          error: errorText
        },
        { status: nlpResponse.status }
      )
    }

    const data = await nlpResponse.json()
    console.log('✅ Text extracted:', data.text?.length || 0, 'characters')
    console.log('='.repeat(60) + '\n')

    return NextResponse.json({
      success: true,
      text: data.text,
      word_count: data.word_count,
      char_count: data.char_count,
    })
  } catch (error) {
    console.error('❌ Extract text proxy error:', error)
    console.log('='.repeat(60) + '\n')
    
    return NextResponse.json(
      { 
        success: false, 
        message: error instanceof Error ? error.message : 'Text extraction failed',
        error: String(error)
      },
      { status: 500 }
    )
  }
}