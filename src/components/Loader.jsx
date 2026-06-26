// ============================================================
// Loader Component — 3 variants for different use cases
// ============================================================
// Usage examples:
//
// 1. Full page loader (e.g. while page initial data loads):
//    {loading && <Loader fullPage />}
//
// 2. Inline loader (e.g. inside a table while fetching):
//    {loading ? <Loader inline /> : <table>...</table>}
//
// 3. Button loader (e.g. while saving form):
//    <button disabled={saving}>
//      {saving ? <Loader button /> : 'Save'}
//    </button>
// ============================================================

export default function Loader({ fullPage, inline, button, text }) {
    // Button-sized spinner (small, inline with text)
    if (button) {
        return <span className="ld-spinner ld-spinner-sm" aria-label="Loading"></span>
    }

    // Inline loader (inside a card or section)
    if (inline) {
        return (
            <div className="ld-inline-wrap">
                <span className="ld-spinner"></span>
                {text && <span className="ld-text">{text}</span>}
            </div>
        )
    }

    // Default: full-page loader (covers the whole screen)
    if (fullPage) {
        return (
            <div className="ld-fullpage">
                <span className="ld-spinner ld-spinner-lg"></span>
                {text && <span className="ld-text">{text}</span>}
            </div>
        )
    }

    // Fallback (no variant specified): inline
    return (
        <div className="ld-inline-wrap">
            <span className="ld-spinner"></span>
            {text && <span className="ld-text">{text}</span>}
        </div>
    )
}
