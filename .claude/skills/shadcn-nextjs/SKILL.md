# Skill: shadcn/ui + Next.js Patterns for TripMind

> Only contains patterns NOT already in CLAUDE.md.
> For general project context, read CLAUDE.md.

## 1. Form Pattern (React Hook Form + Zod + shadcn/ui)

TripMind forms should follow this pattern:

```typescript
"use client";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const formSchema = z.object({
  title: z.string().min(1, "Required").max(100),
  // ... fields
});

type FormValues = z.infer<typeof formSchema>;

interface Props {
  onSubmit: (values: FormValues) => Promise<void>;
  onCancel?: () => void;
  loading?: boolean;
  defaultValues?: Partial<FormValues>;
}

export function MyForm({ onSubmit, onCancel, loading, defaultValues }: Props) {
  const { register, handleSubmit, formState: { errors } } = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: { title: "", ...defaultValues },
  });

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="title">Title</Label>
        <Input id="title" {...register("title")} />
        {errors.title && (
          <p className="text-sm text-destructive">{errors.title.message}</p>
        )}
      </div>
      <div className="flex gap-2 justify-end">
        {onCancel && (
          <Button type="button" variant="outline" onClick={onCancel}>Cancel</Button>
        )}
        <Button type="submit" disabled={loading}>
          {loading ? "Saving..." : "Save"}
        </Button>
      </div>
    </form>
  );
}
```

## 2. Dialog + Form Combo Pattern

Common pattern in TripMind (see places-list.tsx):

```typescript
const [open, setOpen] = useState(false);
const [loading, setLoading] = useState(false);

async function handleSubmit(values: FormValues) {
  setLoading(true);
  try {
    const res = await fetch("/api/...", { ... });
    if (!res.ok) { toast.error("Failed"); return; }
    toast.success("Saved");
    setOpen(false);
  } finally {
    setLoading(false);
  }
}

<Dialog open={open} onOpenChange={setOpen}>
  <DialogTrigger asChild>
    <Button size="sm"><Plus className="h-4 w-4 mr-1" /> Add</Button>
  </DialogTrigger>
  <DialogContent className="max-w-md max-h-[90vh] overflow-y-auto">
    <DialogHeader><DialogTitle>Add Item</DialogTitle></DialogHeader>
    <MyForm onSubmit={handleSubmit} onCancel={() => setOpen(false)} loading={loading} />
  </DialogContent>
</Dialog>
```

## 3. Inline Edit Pattern

For edit-in-place (toggle between view and edit mode):

```typescript
const [editing, setEditing] = useState(false);

if (editing) {
  return <MyForm defaultValues={item} onSubmit={handleUpdate} onCancel={() => setEditing(false)} />;
}
return (
  <Card onClick={() => setEditing(true)}>
    {/* display mode */}
  </Card>
);
```
