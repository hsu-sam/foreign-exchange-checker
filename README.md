# Frontend Mentor - FX Checker solution

This is a solution to the [FX Checker challenge on Frontend Mentor](https://www.frontendmentor.io/challenges/foreign-exchange-currency-converter). Frontend Mentor challenges help you improve your coding skills by building realistic projects.

## Table of contents

- [Overview](#overview)
  - [The challenge](#the-challenge)
  - [Screenshot](#screenshot)
  - [Links](#links)
- [My process](#my-process)
  - [Built with](#built-with)
  - [What I learned](#what-i-learned)
  - [Continued development](#continued-development)
  - [Useful resources](#useful-resources)
  - [AI Collaboration](#ai-collaboration)
- [Author](#author)
- [Acknowledgments](#acknowledgments)

## Overview

### The challenge

Users should be able to:

#### Converter

- Enter an amount to send and see it convert in real time as they type
- Pick the "send" and "receive" currencies from a searchable currency picker
- See the live exchange rate for the active pair (for example, `1 USD = 0.8530 EUR`)
- Swap the send and receive currencies with the swap button
- Favorite the active pair, and log a conversion to their history

#### Currency picker

- Search the full list of available currencies by code or name
- See currencies grouped into "Popular" and "Other currencies", each row showing the flag, code, and name
- See a check against the currency that's currently selected

#### Live markets ticker

- See a ticker of currency pairs, each with its current rate and 24-hour change (up or down)

#### Rate history

- View a line and area chart of the active pair's rate over time
- Switch the chart range between 1D, 1W, 1M, 3M, 1Y, and 5Y
- See the open, last, absolute change, and percentage change for the selected range

#### Compare

- See their send amount converted into a range of other currencies at once, each with its reference rate
- Pin or unpin any comparison row to their favorites

#### Favorites

- See their pinned pairs, each with its live rate and 24-hour change
- Load a pinned pair back into the converter by selecting its row
- Unpin a pair they no longer want to track

#### Conversion log

- See a log of conversions they've made, each showing the relative time, the pair, and the send and receive amounts
- Clear the whole log
- Delete an individual entry

#### UI & accessibility

- View the optimal layout for the interface depending on their device's screen size
- See hover and focus states for all interactive elements on the page
- Navigate the entire app using only their keyboard

### Screenshot

![](./screenshot.jpg)

### Links

- Solution URL: [https://github.com/hsu-sam/foreign-exchange-checker](https://github.com/hsu-sam/foreign-exchange-checker)
- Live Site URL: [Add live site URL here](https://your-live-site-url.com)

## My process

### Built with

- Semantic HTML5 markup
- Mobile-first workflow
- CSS custom properties via Tailwind CSS v4 `@theme`
- Flexbox and CSS Grid
- [Vue 3](https://vuejs.org/) - Composition API and `<script setup>`
- [Nuxt 4](https://nuxt.com/) - file-based routing, `useAsyncData`, and shared `useState`
- [TypeScript](https://www.typescriptlang.org/)
- [Tailwind CSS v4](https://tailwindcss.com/)
- [Headless UI Vue](https://headlessui.com/) - accessible Combobox and Menu primitives
- [Chart.js](https://www.chartjs.org/) - line/area rate history chart
- [Frankfurter API](https://frankfurter.dev/) - live rates, currencies, and time series
- `localStorage` for favorites and conversion log persistence

### What I learned

This challenge was less about a single converter form and more about sharing live FX state across several views without losing accessibility or SSR safety.

**Shared client state with Nuxt `useState`.** Send/receive currencies, the amount, favorites, and the conversion log all need to stay in sync between the converter, Compare, Favorites, and Logs. `useState` keeps that data consistent across pages, while favorites and logs hydrate from `localStorage` on the client so SSR does not fight browser storage.

**Cross rates from a EUR-based API.** Frankfurter quotes against EUR. Any pair that is not `EUR → X` has to be derived. A small `crossRate` helper made that rule reusable for the converter, ticker, comparison table, and history series:

```ts
export function crossRate(
  send: string,
  receive: string,
  eurQuotes: Map<string, number>,
): number | null {
  if (send === receive) return 1;
  if (send === "EUR") return eurQuotes.get(receive) ?? null;
  if (receive === "EUR") {
    const sendRate = eurQuotes.get(send);
    return sendRate ? 1 / sendRate : null;
  }

  const sendRate = eurQuotes.get(send);
  const receiveRate = eurQuotes.get(receive);
  if (sendRate == null || receiveRate == null) return null;

  return receiveRate / sendRate;
}
```

**Accessible pickers instead of custom dropdowns.** The currency picker is a Headless UI Combobox: keyboard navigation, typeahead, grouped options, and a selected check come with the primitive. That was a better trade-off than reinventing focus management.

**Announcing live updates.** The converted amount and rate label use `aria-live="polite"`, and logging a conversion writes a short `sr-only` confirmation so screen readers hear the action without a visual toast.

**Empty and error states as first-class UI.** Compare, Favorites, Logs, and the history chart each have a dedicated empty or error view instead of rendering a broken table or canvas. The chart also waits behind a skeleton until `useAsyncData` resolves.

### Continued development

- Persist the active pair (and maybe the amount) in the URL so a conversion can be bookmarked or shared
- Add a light theme on top of the dark-first design system
- Cache the last successful rates and show an out-of-date banner when Frankfurter is unreachable
- Hover/focus crosshair on the chart with the exact date and rate
- Export the conversion log as CSV
- Keyboard shortcuts for swap, focusing search, and switching the chart range

### Useful resources

- [Frankfurter API docs](https://frankfurter.dev/) - Clear endpoints for currencies, latest rates, and historical ranges. The EUR base is the constraint that shaped the cross-rate logic.
- [Nuxt `useState`](https://nuxt.com/docs/api/composables/use-state) - Shared reactive state that survives navigation without a separate store.
- [Nuxt `useAsyncData`](https://nuxt.com/docs/api/composables/use-async-data) - Keyed fetches with `watch` for pair/range changes, plus pending/error status for skeletons.
- [Headless UI Combobox](https://headlessui.com/vue/combobox) - Accessible searchable listbox pattern used by the currency picker.
- [Chart.js area charts](https://www.chartjs.org/docs/latest/charts/area.html) - Line + fill setup for the rate history view.
- [MDN: ARIA live regions](https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/ARIA_Live_Regions) - How dynamic conversion updates get announced without stealing focus.

### AI Collaboration

I used **Cursor** as a coding partner during the challenge, with the project's `AGENTS.md` steering the assistant toward guidance rather than dumping a full solution.

Typical uses:

- Weighing architecture options (composables vs a Pinia store, where to persist favorites)
- Debugging Nuxt SSR/hydration issues around `localStorage`
- Tightening accessibility on the picker, swap button, and live rate updates
- Reviewing layout and empty-state copy against the design

What worked well: bouncing trade-offs before committing to a pattern, and using the assistant to spot edge cases (same-currency pairs, empty compare amount, chart fetch failures).

What I still owned: the data model, the Frankfurter cross-rate approach, component structure, and the final UI decisions.

## Author

- GitHub - [hsu-sam](https://github.com/hsu-sam)
- Frontend Mentor - [@yourusername](https://www.frontendmentor.io/profile/yourusername)

## Acknowledgments

Design and challenge brief by [Frontend Mentor](https://www.frontendmentor.io). Exchange rates from the [Frankfurter API](https://frankfurter.dev/), backed by the European Central Bank.
