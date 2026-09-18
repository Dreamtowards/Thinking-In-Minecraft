# English edition progress

Rule: a chapter appears here only after the Chinese original in `docs/v2/` is marked `✔`.
Status: all entries below are ✔ = adapted from the reviewed Chinese edition and structurally reviewed (frontmatter / H2 parity / footnote pairing / no CJK / registered components only / links intact).

## Prelude
- `prelude/thesis.mdx` The Thesis of This Book — ✔ (main author)
- `prelude/method.mdx` Method and Standards — ✔ (main author)
- `prelude/index.mdx` How to Read This Book — ✔ (main author)

## Volume I · History and Business (14)
- `history/index.mdx` volume intro — ✔
- `history/infiniminer.mdx` — ✔
- `history/alpha.mdx` — ✔
- `history/mojang-beta.mdx` — ✔
- `history/mods-as-authors.mdx` — ✔
- `history/servers.mdx` — ✔
- `history/media-education.mdx` — ✔
- `history/acquisition.mdx` — ✔
- `history/java-bedrock.mdx` — ✔
- `history/version-politics.mdx` — ✔
- `history/revenue.mdx` — ✔
- `history/grey-economy.mdx` — ✔ (as "The Grey Economy", matching inbound links)
- `history/competition.mdx` — ✔
- `history/heritage.mdx` — ✔

## Volume II · Game Design (17)
- `design/index.mdx` volume intro — ✔
- `design/voxel-primitive.mdx` — ✔
- `design/verbs-feel.mdx` — ✔
- `design/survival.mdx` — ✔
- `design/creative-mode.mdx` — ✔
- `design/crafting-inventory.mdx` — ✔
- `design/worldgen.mdx` — ✔
- `design/redstone.mdx` — ✔
- `design/commands-datapacks.mdx` — ✔
- `design/mobs-combat.mdx` — ✔
- `design/dimensions-endgame.mdx` — ✔
- `design/multiplayer.mdx` — ✔
- `design/who-makes-rules.mdx` — ✔
- `design/mods-as-method.mdx` — ✔
- `design/emergence.mdx` — ✔
- `design/constraints.mdx` — ✔
- `design/transferable.mdx` — ✔

## Volume III · Technical Implementation (19)
- `impl/index.mdx` volume intro — ✔
- `impl/data-model.mdx` — ✔
- `impl/storage.mdx` — ✔
- `impl/worldgen-pipeline.mdx` — ✔
- `impl/light-fluid-updates.mdx` — ✔
- `impl/tick.mdx` — ✔
- `impl/entities.mdx` — ✔
- `impl/items.mdx` — ✔
- `impl/redstone.mdx` — ✔
- `impl/client-render.mdx` — ✔
- `impl/protocol.mdx` — ✔
- `impl/feel-client.mdx` — ✔
- `impl/mod-architecture.mdx` — ✔
- `impl/datapacks.mdx` — ✔
- `impl/java-runtime.mdx` — ✔
- `impl/bedrock.mdx` — ✔
- `impl/servers.mdx` — ✔
- `impl/tech-debt.mdx` — ✔
- `impl/modifiable-engine.mdx` — ✔

## Volume IV · Rewrite (12)
- `rewrite/index.mdx` volume intro — ✔
- `rewrite/what-to-rewrite.mdx` — ✔
- `rewrite/invariants.mdx` — ✔
- `rewrite/accidents.mdx` — ✔
- `rewrite/world-rep.mdx` — ✔
- `rewrite/scheduler.mdx` — ✔
- `rewrite/scripting.mdx` — ✔
- `rewrite/network-perms.mdx` — ✔
- `rewrite/render-tools.mdx` — ✔
- `rewrite/compat.mdx` — ✔
- `rewrite/who-rewrites.mdx` — ✔
- `rewrite/seeing-the-original.mdx` — ✔

## Appendix (6)
- `appendix/timeline.mdx` — ✔
- `appendix/people.mdx` — ✔
- `appendix/java-bedrock.mdx` — ✔
- `appendix/glossary.mdx` — ✔
- `appendix/references.mdx` — ✔
- `appendix/exercises.mdx` — ✔

## Final audit (2026-09-18)
- 71/71 files present; directory tree 1:1 with `docs/v2`.
- Mechanical audit across all 71: frontmatter ✔, no unregistered components ✔, no CJK residue ✔, no Cyrillic residue ✔.
- All footnote URLs are the ones verified during the Chinese review; adaptation agents did not re-verify online (by design) and did not invent sources.
- Known adaptations flagged during review: hub chapters run longer than first estimates because every sourced claim was kept (mods-as-authors, java-bedrock, servers, mod-architecture, redstone); CN source inconsistencies caught and fixed in EN (eating-time contradiction in verbs-feel, orphaned footnote markers in protocol/datapacks/mobs-combat/tech-debt, stale cross-references in creative-mode and modifiable-engine — each mapped to the intended EN anchor).
- Site integration (replacing `docs/`, adding per-folder `meta.json`) remains a follow-up, same as for the Chinese edition.
