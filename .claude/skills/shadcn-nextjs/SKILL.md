# Skill: shadcn/ui + Next.js App Router Patterns

These are standard patterns used in TripMind. Always follow these patterns when generating code.

## 1. Supabase Client Setup

### Server Component / API Route:
```typescript
// src/lib/supabase/server.ts
import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import type { Database } from "./types";

export function createClient() {
  const cookieStore = cookies();
  return createServerClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() { return cookieStore.getAll(); },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) =>
            cookieStore.set(name, value, options)
          );
        },
      },
    }
  );
}
```

### Client Component:
```typescript
// src/lib/supabase/client.ts
import { createBrowserClient } from "@supabase/ssr";
import type { Database } from "./types";

export function createClient() {
  return createBrowserClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );
}
```

## 2. API Route Pattern (Next.js App Router)

```typescript
// src/app/api/trips/route.ts
import { createClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";
import { z } from "zod";

const CreateTripSchema = z.object({
  title: z.string().min(1),
  destination: z.string().min(1),
  start_date: z.string(),
  end_date: z.string(),
});

export async function POST(request: Request) {
  try {
    const supabase = createClient();
    
    // Auth check
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Validate input
    const body = await request.json();
    const parsed = CreateTripSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
    }

    // DB operation
    const { data, error } = await supabase
      .from("trips")
      .insert({ ...parsed.data, user_id: user.id })
      .select()
      .single();

    if (error) throw error;
    return NextResponse.json({ data });
  } catch (error) {
    console.error("POST /api/trips:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
```

## 3. Form với React Hook Form + Zod + shadcn/ui

```typescript
"use client";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";

const formSchema = z.object({
  title: z.string().min(1, "Trip name is required"),
  destination: z.string().min(1, "Destination is required"),
});

type FormValues = z.infer<typeof formSchema>;

export function TripForm({ onSubmit }: { onSubmit: (values: FormValues) => Promise<void> }) {
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: { title: "", destination: "" },
  });

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="title"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Trip Name</FormLabel>
              <FormControl>
                <Input placeholder="Tokyo April 2026" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit" disabled={form.formState.isSubmitting}>
          {form.formState.isSubmitting ? "Creating..." : "Create Trip"}
        </Button>
      </form>
    </Form>
  );
}
```

## 4. AI Streaming Pattern

```typescript
// API Route — streaming
export async function POST(request: Request) {
  const anthropic = new Anthropic();
  const { message, context } = await request.json();

  const stream = await anthropic.messages.stream({
    model: "claude-sonnet-4-5",
    max_tokens: 1024,
    system: buildSystemPrompt(context),
    messages: [{ role: "user", content: message }],
  });

  const readableStream = new ReadableStream({
    async start(controller) {
      for await (const chunk of stream) {
        if (chunk.type === "content_block_delta" && chunk.delta.type === "text_delta") {
          controller.enqueue(new TextEncoder().encode(chunk.delta.text));
        }
      }
      controller.close();
    },
  });

  return new Response(readableStream, {
    headers: { "Content-Type": "text/plain; charset=utf-8" },
  });
}

// Client Component — consume stream
async function streamChat(message: string) {
  const response = await fetch("/api/ai/chat", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ message }),
  });

  const reader = response.body?.getReader();
  const decoder = new TextDecoder();
  setContent(""); // reset

  while (reader) {
    const { done, value } = await reader.read();
    if (done) break;
    setContent((prev) => prev + decoder.decode(value, { stream: true }));
  }
}
```

## 5. Loading States with Skeleton

```typescript
// Always have loading state
import { Skeleton } from "@/components/ui/skeleton";

function TripCardSkeleton() {
  return (
    <div className="rounded-lg border p-4 space-y-3">
      <Skeleton className="h-4 w-3/4" />
      <Skeleton className="h-4 w-1/2" />
      <Skeleton className="h-8 w-full" />
    </div>
  );
}

// Use in page
if (isLoading) return <TripCardSkeleton />;
```

## 6. Mobile Bottom Navigation

```typescript
// src/components/layout/MobileNav.tsx
"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, MapPin, Calendar, MessageCircle } from "lucide-react";
import { cn } from "@/lib/utils";

const navItems = [
  { href: "/dashboard", icon: Home, label: "Trips" },
  { href: "/places", icon: MapPin, label: "Places" },
  { href: "/itinerary", icon: Calendar, label: "Itinerary" },
  { href: "/chat", icon: MessageCircle, label: "AI Chat" },
];

export function MobileNav({ tripId }: { tripId?: string }) {
  const pathname = usePathname();
  const base = tripId ? `/trips/${tripId}` : "";

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 bg-background border-t md:hidden">
      <div className="flex items-center justify-around h-16">
        {navItems.map(({ href, icon: Icon, label }) => {
          const fullHref = tripId ? `${base}${href.replace("/", "/")}` : href;
          const isActive = pathname === fullHref;
          return (
            <Link
              key={href}
              href={fullHref}
              className={cn(
                "flex flex-col items-center gap-1 px-4 py-2 rounded-lg min-w-[44px] min-h-[44px] justify-center",
                isActive ? "text-primary" : "text-muted-foreground"
              )}
            >
              <Icon className="w-5 h-5" />
              <span className="text-xs">{label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
```

## 7. Toast Notifications (Sonner)

```typescript
import { toast } from "sonner";

// Success
toast.success("Trip created successfully!");

// Error
toast.error("An error occurred. Please try again.");

// Loading
const toastId = toast.loading("Saving...");
// ... async operation ...
toast.dismiss(toastId);
toast.success("Saved!");
```

## 8. TypeScript Types for Supabase

```typescript
// src/types/index.ts
import type { Database } from "@/lib/supabase/types";

export type Trip = Database["public"]["Tables"]["trips"]["Row"];
export type TripInsert = Database["public"]["Tables"]["trips"]["Insert"];
export type TripUpdate = Database["public"]["Tables"]["trips"]["Update"];

export type Place = Database["public"]["Tables"]["places"]["Row"];
export type PlaceInsert = Database["public"]["Tables"]["places"]["Insert"];

// Extended types with relationships
export type TripWithPlaces = Trip & {
  places: Place[];
};
```
