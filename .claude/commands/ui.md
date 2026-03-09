# /ui

Add shadcn/ui component and integrate into TripMind: $ARGUMENTS

## Implementation:

1. Check if component is already installed (see `src/components/ui/`)

2. If not installed, run:
   ```bash
   npx shadcn@latest add <component-name>
   ```

3. Create wrapper component if customization needed for TripMind:
   - Place in `src/components/<domain>/` (not `src/components/ui/`)
   - Wrapper component can add TripMind-specific styling or behavior

4. Provide specific usage example in TripMind context

## Commonly used shadcn/ui components in project:
- `button` — everywhere
- `card` — TripCard, PlaceCard, AlertCard
- `dialog` — confirm actions, modals
- `sheet` — mobile slide-up panels
- `form` + `input` + `select` + `textarea` — all forms
- `tabs` — trip navigation tabs
- `badge` — status indicators (booked/pending, alert severity)
- `skeleton` — loading states
- `toast` — success/error notifications (use `sonner`)
- `dropdown-menu` — action menus
- `calendar` + `date-picker` — date selection
- `separator` — dividers
