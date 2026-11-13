// The data now lives in everything.json. You don't edit this file.
// To add or change things, run `npm run dev` and open /admin/everything.
// (You can also edit everything.json by hand: it's just a list.)
//
// dates on each item:
//   year: start year. endYear: optional, for ranges.
//   ongoing: true if it's still going ("2023 – present").
//   Leave all three off if you don't know the date.
//
// tags: the FIRST tag is the item's main topic; extra tags make it show up
// under more filters. Tag colors: 1 pink, 2 orange, 3 yellow, 4 green, 5 blue, 6 purple.
//
// side: "professional" or "personal" decides which tab an item lands on
// ("everything" always shows all of them). Items with no side yet get a guess
// from their tags (see PRO_TAGS); set it in the admin page to override.
//
// hidden: true keeps an item in the file but off the page.
// reviewed: true is only for the admin page ("feels good"). It's stripped out
//   here, so the public page never sees it.

import data from "./everything.json";

// the two tabs that sort things, in order. color is the same 1-6 scale as tags.
export const SIDES = [
  { id: "professional", label: "professionally,", color: 5 },
  { id: "personal", label: "personally,", color: 3 },
];

// an item with one of these tags is guessed to be professional
const PRO_TAGS = ["tech", "research", "indeed", "centene", "s-a", "other-jobs"];

export const sideOf = (item) =>
  item.side ?? (item.tags.some((t) => PRO_TAGS.includes(t)) ? "professional" : "personal");

export const items = data.items
  .filter((i) => !i.hidden)
  .map(({ reviewed, ...item }) => ({ ...item, side: sideOf(item) })); // eslint-disable-line no-unused-vars

// only tags that something visible actually uses, so there are no empty sections
export const TAGS = data.tags.filter((t) => items.some((i) => i.tags.includes(t.id)));