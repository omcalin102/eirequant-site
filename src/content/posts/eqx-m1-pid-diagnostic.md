---
title: "EQX-M1: PID vs. Baseline, What Actually Changed"
date: "2025-10-05"
author: "Oisin McAlinden"
type: "think"
summary: "A diagnostic of stability, drawdowns, and where the controller earned its keep."
---

EQX-M1 was always designed to be a research chassis. The PID variant kept the same signal spine and introduced a lightweight position controller to modulate exposure under stress. The question is whether those controls delivered value beyond theoretical neatness.

The first lens is stability. The controller lowered realized volatility versus the unmanaged baseline over comparable windows while maintaining a similar gross opportunity set. The effect is most visible around gap-heavy weeks where the baselines equity curve shows fast swings. PID dampened the amplitude of these moves without fully muting upside days, which is what we want. Smoothness alone is not sufficient, but it is a precondition for capital that values risk budgeting.

Drawdowns matter more than point-in-time volatility. The largest peak-to-trough in the PID track is smaller than the baselines deepest cut over long windows, and recovery time is shorter. Critically, the controller trimmed exposure when realized variance accelerated, which helped avoid compounding losses at the wrong time. There were also periods where the controller was intentionally permissive, allowing the system to earn in calm regimes rather than over-engineer itself out of returns.

The final lens is calibration. PID does not improve the models probability calibration directly; it improves how calibrated signals are turned into positions. That distinction becomes important when you review regime slices: in trending, low-variance buckets, both variants earn; in choppier or shock-driven buckets, PIDs defensive posture preserves more capital. When you line this against a broad equity benchmark, the controllers edge is clearest precisely when the benchmark is least forgiving.

Net-net, EQX-M1 with PID is the preferred variant for live-style operation because it converts the same ideas into a return stream with better drawdown control and time-to-recovery. The baseline remains valuable as a diagnostic baseline and a stress harness for future changes.
