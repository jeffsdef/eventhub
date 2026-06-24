import { NextRequest, NextResponse } from 'next/server';

async function handleProxy(
  request: NextRequest,
  { params }: { params: Promise<{ path: string[] }> }
) {
  try {
    const { path } = await params;
    const pathString = path.join('/');

    const backendUrl = process.env.NEXT_PUBLIC_API_URL;

    if (!backendUrl) {
      return NextResponse.json(
        { error: 'A variável de ambiente NEXT_PUBLIC_API_URL não está configurada na Vercel.' },
        { status: 500 }
      );
    }

    const cleanBackendUrl = backendUrl.replace(/\/$/, '');
    const searchParams = request.nextUrl.search;
    const targetUrl = `${cleanBackendUrl}/${pathString}${searchParams}`;

    const headers = new Headers(request.headers);
    
    const parsedUrl = new URL(cleanBackendUrl);
    headers.set('host', parsedUrl.host);

    const fetchOptions: RequestInit = {
      method: request.method,
      headers: headers,
    };

    if (!['GET', 'HEAD'].includes(request.method)) {
      const arrayBuffer = await request.arrayBuffer();
      if (arrayBuffer.byteLength > 0) {
        fetchOptions.body = arrayBuffer;
      }
    }

    const response = await fetch(targetUrl, fetchOptions);

    const responseBody = await response.arrayBuffer();

    const responseHeaders = new Headers(response.headers);
    
    responseHeaders.delete('content-encoding');

    return new NextResponse(responseBody, {
      status: response.status,
      headers: responseHeaders,
    });
  } catch (error) {
    console.error('Erro interno no Proxy da API:', error);
    return NextResponse.json(
      { error: 'Erro de comunicação com o servidor backend.', details: String(error) },
      { status: 502 }
    );
  }
}

export { 
  handleProxy as GET, 
  handleProxy as POST, 
  handleProxy as PUT, 
  handleProxy as DELETE, 
  handleProxy as PATCH 
};