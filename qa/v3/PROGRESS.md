# V3 checkpoint — 20 October 2026

- State: IMPLEMENTED-NOT-DEPLOYED. The rejected 61f40e6 candidate remains undeployed. Its LCP regression is mitigated in the revised runtime; user release-hold clarification is pending.
- Final revised checks: core 65/0, extended 17/0, V3 14/0; CSP, seven focus checks, Worker tests pass. Current 15 captures and 20 comparison boards are retained; taste heuristics have the same narrowly documented exceptions.
- Complete final performance-delivery-paired comparison: median Home 2.875s to 2.118s, Menu 2.266s to 1.519s, Gallery 1.979s to 1.823s; paired TBT medians improve; all nine V3 CLS values zero. Minor FCP cost about 0.2s is disclosed. No waiver is used.
- New source binding and staged scan are the next steps; update release-identity.json after commit. Production still V2 source 695daaa31b57b6d3af261696644db2f80ef2e7ab. Main remains the original 19e44f6 base.
- Existing Worker/account/domain and unrelated local work are preserved. Re-query active version/traffic/remote before any authorized deployment, then finish hosted verification and final reporting.
