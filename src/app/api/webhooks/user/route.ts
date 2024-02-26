import { NextResponse } from 'next/server';
import { Webhook, WebhookRequiredHeaders } from 'svix';
import { headers } from 'next/headers';
import { prisma } from '@/lib/db';
import { IncomingHttpHeaders } from 'http';

const webhookSecret = process.env.WEBHOOK_SECRET || "";

type WebhookEventData = {
  email: string;
  firstName: string;
  lastName: string;
  id: string; // Assuming this maps to externalId in your user model
};

type Event = {
  data: WebhookEventData;
  type: "user.created" | "user.updated";
};

async function handler(request: Request) {
  if (!webhookSecret) {
    console.error('WEBHOOK_SECRET is not defined');
    return new Response('Server configuration error', { status: 500 });
  }

  const payload = await request.json();
  const headersList = headers();
  const heads = {
    "svix-id": headersList.get("svix-id"),
    "svix-timestamp": headersList.get("svix-timestamp"),
    "svix-signature": headersList.get("svix-signature"),
  } as any;

  const wh = new Webhook(webhookSecret);

  try {
    const event = wh.verify(
      JSON.stringify(payload),
      heads as IncomingHttpHeaders & WebhookRequiredHeaders
    ) as any; // Temporarily using 'any' to bypass type checking. Consider defining a precise type.
    
    // Assuming 'user.created' event type includes necessary user details
    if (event.type === "user.created") {
      const userData = event.data;

      // Extract the primary email address, first name, and last name
      const primaryEmail = userData.email_addresses[0].email_address;
      const firstName = userData.first_name;
      const lastName = userData.last_name;
      const externalId = userData.id; // Use Clerk's user ID as external ID

      // Use Prisma client to upsert user data based on the external ID.
      await prisma.user.upsert({
        where: { externalId: externalId },
        update: {
          email: primaryEmail,
          firstName: firstName,
          lastName: lastName,
        },
        create: {
          email: primaryEmail,
          firstName: firstName,
          lastName: lastName,
          externalId: externalId,
        },
      });

      return new Response(JSON.stringify({ message: 'User processed successfully' }), {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      });
    } else {
      // Handle other event types or ignore
      return new Response(JSON.stringify({ message: 'Event type not handled' }), {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      });
    }
  } catch (err) {
    console.error('Verification failed:', err);
    return new Response(JSON.stringify({ error: 'Verification failed' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}

export const POST = handler;