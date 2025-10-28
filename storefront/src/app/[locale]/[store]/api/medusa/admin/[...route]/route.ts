import { MEDUSA_ADMIN_API_TOKEN, MEDUSA_BACKEND_URL } from '@/config/env';

export async function GET(request: Request, { params }: { params: { route: string[] } }) {
  const targetUrl = `${MEDUSA_BACKEND_URL}/admin/${params.route?.join('/')}`;

  try {
    const response = await fetch(targetUrl, {
      headers: {
        'x-medusa-access-token': MEDUSA_ADMIN_API_TOKEN,
      },
    });
    if (response.status === 401) {
      return Response.json(
        {
          code: 'unauthorized',
          message: 'Unauthorized',
        },
        { status: 401 }
      );
    }
    const data = await response.json();
    return Response.json(data);
  } catch (error: any) {
    return Response.json(
      {
        code: 'generic_error',
        message: error.message,
      },
      { status: 500 }
    );
  }
}
