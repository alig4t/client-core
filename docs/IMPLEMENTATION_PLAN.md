# Core and generator implementation

The UI architecture follow-up is tracked separately in [CORE_UI_IMPLEMENTATION_PLAN.fa.md](CORE_UI_IMPLEMENTATION_PLAN.fa.md), based on the full [component architecture review](CORE_COMPONENTS_ARCHITECTURE_REVIEW.fa.md). The completed checklist below covers the earlier CRUD/generator scope, not the new design, localization, or package-release work.

The acceptance criteria are tracked against `CORE_READINESS_REVIEW.fa.md`.

- [x] HTTP: typed envelopes, pagination adapters, object requests, cancellation, field errors, string IDs, partial bulk results.
- [x] Access: route matching, action policies, session cache cleanup and expiry handling.
- [x] Entity contract: versioned definitions, separate input/response contracts, field registry, validation and serialization.
- [x] Forms: numeric precision, date semantics, relationships, file adapters, conditions, nested arrays, server errors and record reset.
- [x] Runtime: reusable CRUD forms, lists, details, query keys, URL filters and extension points.
- [x] Existing controls: hooks, filter values, stale autocomplete requests, modal focus and keyboard interaction.
- [x] Generator: validated XML/YAML/config, merged defaults, effective options, registries, safe repeatable writes and extension preservation.
- [x] Reference: migrate ComprehensiveEntity and prove the full field/relationship pipeline.
- [x] Verification: contract/component/generator/browser tests, application and generator builds, lint, CI and usage documentation.

Existing custom module implementations are preserved. New generated implementation files have an explicit ownership manifest; user-facing wrappers and extensions are only created when absent.

The implementation and integration steps are complete. See [CORE_GUIDE.fa.md](CORE_GUIDE.fa.md) for supported contracts, setup, extension points and the boundary between frontend tests and live backend verification. The original review is a historical baseline.

## Local verification

| Check | Result |
| --- | --- |
| Application, generator and test TypeScript | Passed |
| ESLint | No errors or warnings |
| Contract, component, access and generator tests | 52 passed |
| Playwright browser scenarios | 5 passed with mocked API |
| Application production build | Passed |
| Generator build after clean dependency installation | Passed |
| Regeneration check | No changed or preserved files |
| Root and generator dependency audits | No reported vulnerabilities |
| Lockfile installation checks and Git whitespace check | Passed |

The production bundler still reports third-party annotation/eval warnings and a chunk-size warning. These do not fail the build. Live backend compatibility and server-side authorization/file validation require integration verification in the product environment.
