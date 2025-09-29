# 🐱‍🏍 Pokédex Challenge — React + Vite + TypeScript

Welcome to the Pokédex Take-Home Challenge! This is a short coding assignment meant to assess your ability to work with APIs, manage state, and build UI components in React with TypeScript.

---

## 🚀 Getting Started

Follow these steps to get the project running locally:

1. **Fork this repository** to your own GitHub account.
2. **Clone your forked repo** to your local machine:

   ```bash
   git clone https://github.com/ArthurKurn/australis-take-home.git
   cd pokedex-challenge
   npm install
   npm run dev

   ```

3. **Open** http://localhost:5173 in your browser to view the app.

# 🎯 Your Task

Build a simple **Pokédex** where users can:

## 🔍 1. Search for Pokémon

Use the [PokéAPI](https://pokeapi.co/).

**Example endpoint:**
https://pokeapi.co/api/v2/pokemon/pikachu

Allow the user to type a name and fetch matching Pokémon info:

- Name
- Image (sprite)
- Types

## ⭐ 2. Save Favorite Pokémon

After viewing search results, the user should be able to **save** a Pokémon.

- Display saved Pokémon in a **Favorites** list.
- Use `localStorage` to persist favorites across page reloads.

## ❌ 3. Remove from Favorites

Allow users to **remove** Pokémon from their favorites list.

---

## ✨ Level-Up Requirements (choose any 3)

Pick any **three** of the following and note your choices in the PR:

1) **Details Route** – Add `/pokemon/:name` with deep linking and a back-friendly details page.
2) **Favorites v2** – Favorites support **notes + tags**; sort by name/type/added-at; no duplicates.
3) **Compare View** – Compare two Pokémon (stats chart).
4) **Caching** – Use React Query (or SWR) with stale-while-revalidate and background refresh indicators.
5) **Resilient Fetching** – Handle 429 rate limits with retry + user feedback.
6) **PWA Offline** – Make recently viewed Pokémon available offline.
7) **Accessibility Pass** – Keyboard navigation, labels/ARIA, visible focus, and contrast checked.
8) **Testing** – 3–5 unit tests + 1 Playwright test (search → details → favorite with note).

### Constraints
- Keep total effort ~4–6 hours.
- Don't add a backend; use PokéAPI only.
- If you use a lib, explain why in your README.

### What We Look For
- Clear, typed API models (narrow to what you render).
- Thoughtful state management and error UX.
- A small but meaningful test surface.

---

## 📝 Submission Instructions

1. Push all your changes to your forked repository.
2. Make sure the app runs using:

   ```bash
   npm install && npm run dev

   ```

3. Share the link to your repo with us

## // Arthur's Notes! //
## Hi everyone, for the level-up requirements, I went with
## - Favorites v2
## - PWA Offline
## - Compare View