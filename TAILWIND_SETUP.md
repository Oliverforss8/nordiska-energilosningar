# Tailwind CSS Setup för Shopify Theme

Detta dokument beskriver hur man använder Tailwind CSS i ditt Shopify theme.

## Installation

1. **Installera dependencies:**

   ```bash
   npm install
   ```

2. **Bygg Tailwind CSS:**

   ```bash
   # Utvecklingsläge (watch mode)
   npm run dev

   # Produktionsläge (minifierad)
   npm run build:prod
   ```

## Användning

### Grundläggande klasser

- `.btn` - Primär knapp
- `.btn-secondary` - Sekundär knapp
- `.btn-outline` - Outline knapp
- `.container-custom` - Container med max-bredd och centrering
- `.section-padding` - Standard sektions-padding

### Typografi

- `.heading-1` - Huvudrubrik (4xl-6xl)
- `.heading-2` - Underrubrik (3xl-5xl)
- `.heading-3` - Mindre rubrik (2xl-4xl)
- `.text-body` - Brödtext
- `.text-lead` - Ledande text

### Utilities

- `.text-shadow` - Textskugga
- `.text-shadow-sm` - Liten textskugga
- `.backdrop-blur-custom` - Bakgrundsblur

## Exempel på användning

### Hero-sektion

```liquid
<section class="relative min-h-screen-75 flex items-center justify-center">
  <div class="container-custom text-center">
    <h1 class="heading-1 text-white mb-6">Välkommen</h1>
    <p class="text-lead text-white mb-8">Beskrivning</p>
    <a href="#" class="btn">Knapp</a>
  </div>
</section>
```

### Grid-layout

```liquid
<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
  <div class="bg-white p-6 rounded-lg shadow-md">
    <!-- Innehåll -->
  </div>
</div>
```

## Responsiv design

Tailwind använder breakpoints:

- `sm:` - 640px+
- `md:` - 768px+
- `lg:` - 1024px+
- `xl:` - 1280px+
- `2xl:` - 1536px+

## Custom CSS

För custom styles, lägg till dem i `assets/tailwind-input.css` under `@layer components` eller `@layer utilities`.

## Färger

Theme har fördefinierade färger:

- `primary-{50-900}` - Primära färger
- `secondary-{50-900}` - Sekundära färger

## Tips

1. Använd Tailwind's utility-first approach
2. Kombinera klasser för snabb styling
3. Använd `@apply` för återanvändbara komponenter
4. Håll custom CSS till minimum
5. Använd Tailwind's responsive prefixes för mobile-first design
