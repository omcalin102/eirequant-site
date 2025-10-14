export type HelpEntry = { title: string; html: string };
export type HelpMap = Record<string, HelpEntry>;

export const helptext: HelpMap = {
    greeks: {
        title: "Portfolio Greeks",
        html: `<p>?/?/? are risk proxies derived from price curvature and implied/realized vol context. They guide exposure clamps and sizing.</p>
           <ul><li><b>?</b>: directional bias</li><li><b>?</b>: convexity / turning risk</li><li><b>?</b>: sensitivity to vol regime</li></ul>`
    },
    model_selection: {
        title: "Model Selection",
        html: `<p>Daily picks with action and confidence. Actions reflect policy constraints; confidence is post-calibration.</p>`
    },
    sector_health: {
        title: "Sector Health",
        html: `<p>Ranked sector snapshot. Aggregates breadth, momentum, and dispersion signals.</p>`
    },
    headlines: {
        title: "Headlines",
        html: `<p>Same-day market/quant headlines curated into brief bullets. Source links open in a new tab.</p>`
    },
    drivers: {
        title: "Top Drivers",
        html: `<p>Primary features or factors moving the model's signal on the selected window.</p>`
    },
    leaders: {
        title: "Top Tickers",
        html: `<p>Highest composite scores across the investable universe after filters.</p>`
    },
    spotlight_sector: {
        title: "Spotlight Sector",
        html: `<p>Sector-of-the-month based on persistence and magnitude of relative strength.</p>`
    },
    eqx_viewer: {
        title: "Performance Viewer",
        html: `<p>Switch between published equity windows. “CB” overlay shows cash baseline. Stats are computed client-side.</p>`
    },
    compare: {
        title: "Compare",
        html: `<p>Overlay EQX-M1 windows vs cash baseline. One chart, one table of stats; windowed re-scaling for fair comparison.</p>`
    },
    pipeline_status: {
        title: "Pipeline Status",
        html: `<p>Operational state of the live publisher. Includes trading toggle, last successful run, and active model.</p>`
    },
    pid_policy: {
        title: "Policy Control Trace",
        html: `<p>PID-like controller governing exposure around target signal with leak and clamps.</p>`
    },
    ops_health: {
        title: "Ops Health",
        html: `<p>Lightweight green/amber/red module checks—data freshness, publish success, artifact counts.</p>`
    },
    calibration: {
        title: "Calibration (ECE)",
        html: `<p>Expected Calibration Error on binned probabilities; monitors reliability drift across regimes.</p>`
    },
    regimes: {
        title: "Regimes",
        html: `<p>Binary or multi-state labels used for training splits and stability checks. Transitions penalized to avoid noise.</p>`
    },
    workstation: {
        title: "Workstation",
        html: `<p>Hub for architecture, math notes, and experiment logs. Links to model pages and compare for artifacts.</p>`
    }
};

export function getHelp(key: string): HelpEntry {
    return helptext[key] ?? { title: "Help", html: `<p>No help available for "${key}".</p>` };
}
