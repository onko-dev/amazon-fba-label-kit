import { useState, useEffect, useRef } from 'react'
import JsBarcode from 'jsbarcode'
import './index.css'

// Icon components (using cleaner strokes for modern feel)
const IconPrint = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" /></svg>
)
const IconRefresh = () => (
  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" /></svg>
)
const IconSettings = () => (
   <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
)

function App() {
  // Initialize state from local storage or defaults (same logic, cleaner code)
  const usePersistedState = (key, defaultValue) => {
    const [state, setState] = useState(() => {
      try {
        const saved = localStorage.getItem(key)
        return saved ? JSON.parse(saved) : defaultValue
      } catch { return defaultValue }
    })
    useEffect(() => {
      localStorage.setItem(key, JSON.stringify(state))
    }, [key, state])
    return [state, setState]
  }

  const [fnsku, setFnsku] = usePersistedState('fnsku', '')
  const [title, setTitle] = usePersistedState('title', '')
  const [condition, setCondition] = usePersistedState('condition', 'New')
  const [sku, setSku] = usePersistedState('sku', '')
  const [labelSize, setLabelSize] = usePersistedState('labelSize', '4x6')
  const [showSafeZone, setShowSafeZone] = useState(false)

  const barcodeRef = useRef(null)

  // Generate barcode
  useEffect(() => {
    if (fnsku && barcodeRef.current) {
      try {
        JsBarcode(barcodeRef.current, fnsku, {
          format: "CODE128",
          width: 2, // Slightly thinner for cleaner look
          height: 40, // Balanced height
          displayValue: false, // We render value manually for font control
          margin: 0,
        })
      } catch (e) { console.error(e) }
    }
  }, [fnsku, labelSize])

  const handlePrint = () => {
    window.print()
  }

  const handleReset = () => {
    if(window.confirm("Reset all fields?")) {
      setFnsku('')
      setTitle('')
      setSku('')
      setCondition('New')
    }
  }

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans antialiased selection:bg-primary-100 selection:text-primary-700 print:bg-white print:text-black">
      
      {/* Subtle background pattern */}
      <div className="absolute inset-0 z-0 opacity-[0.03] pointer-events-none no-print" style={{ backgroundImage: 'radial-gradient(#64748b 1px, transparent 1px)', backgroundSize: '24px 24px' }}></div>

      {/* Main Container */}
      <div className="relative z-10 max-w-6xl mx-auto px-4 py-8 lg:py-12 print:p-0">
        
        {/* Modern Header */}
        <header className="flex items-center justify-between mb-12 no-print">
          <div className="flex items-center gap-3 group">
            <div className="w-10 h-10 bg-gradient-to-br from-primary-500 to-primary-600 rounded-xl shadow-lg shadow-primary-500/20 flex items-center justify-center text-white text-xl">
              📦
            </div>
            <div>
              <h1 className="text-xl font-bold tracking-tight text-slate-900 group-hover:text-primary-600 transition-colors">FBA Label Kit</h1>
              <p className="text-xs text-slate-500 font-medium tracking-wide uppercase">Precision FNSKU Generator</p>
            </div>
          </div>
          
          <button 
            onClick={handleReset}
            className="text-slate-400 hover:text-slate-600 transition-colors p-2 rounded-full hover:bg-slate-100"
            title="Reset"
          >
            <IconRefresh />
          </button>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start print:block">
          
          {/* Left: Interactive Form (Floating Card) */}
          <div className="lg:col-span-5 space-y-8 no-print sticky top-8">
            <div className="bg-white rounded-3xl shadow-float p-8 border border-slate-100/50 backdrop-blur-sm bg-white/90">
              
              <div className="space-y-6">
                
                {/* FNSKU Input (Hero) */}
                <div className="group">
                  <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2 group-focus-within:text-primary-500 transition-colors">
                    FNSKU Barcode
                  </label>
                  <div className="relative">
                    <input 
                      type="text" 
                      value={fnsku}
                      onChange={(e) => setFnsku(e.target.value.toUpperCase().trim())}
                      placeholder="X00..."
                      className="block w-full px-4 py-4 text-lg font-mono tracking-wider bg-slate-50 border-0 rounded-2xl text-slate-900 placeholder-slate-300 focus:ring-2 focus:ring-primary-500/20 focus:bg-white transition-all shadow-inner"
                      autoFocus
                    />
                    {fnsku && (
                      <div className="absolute right-4 top-1/2 -translate-y-1/2">
                         {fnsku.length >= 10 ? (
                           <span className="w-2 h-2 rounded-full bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.6)] animate-pulse"></span>
                         ) : (
                           <span className="text-xs text-amber-500 font-medium">Too Short</span>
                         )}
                      </div>
                    )}
                  </div>
                </div>

                {/* Other Inputs */}
                <div className="space-y-5">
                  <div>
                    <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">Product Title</label>
                    <input 
                      type="text" 
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                      placeholder="e.g. Silicone Spatula Set..."
                      className="block w-full px-4 py-3 text-sm bg-slate-50 border-0 rounded-xl text-slate-700 placeholder-slate-300 focus:ring-2 focus:ring-primary-500/20 focus:bg-white transition-all"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">Condition</label>
                      <select 
                        value={condition}
                        onChange={(e) => setCondition(e.target.value)}
                        className="block w-full px-4 py-3 text-sm bg-slate-50 border-0 rounded-xl text-slate-700 focus:ring-2 focus:ring-primary-500/20 focus:bg-white transition-all appearance-none cursor-pointer"
                      >
                        <option>New</option>
                        <option>Used - Like New</option>
                        <option>Used - Very Good</option>
                        <option>Used - Good</option>
                        <option>Used - Acceptable</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">SKU (Optional)</label>
                      <input 
                        type="text" 
                        value={sku}
                        onChange={(e) => setSku(e.target.value)}
                        placeholder="Internal SKU"
                        className="block w-full px-4 py-3 text-sm font-mono bg-slate-50 border-0 rounded-xl text-slate-700 placeholder-slate-300 focus:ring-2 focus:ring-primary-500/20 focus:bg-white transition-all"
                      />
                    </div>
                  </div>
                </div>

                {/* Size Selector (Pills) */}
                <div>
                   <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-3 flex items-center gap-2">
                     <IconSettings /> Label Size
                   </label>
                   <div className="flex bg-slate-100 p-1 rounded-xl">
                     {['4x6', '2.25x1.25'].map((s) => (
                       <button
                         key={s}
                         onClick={() => setLabelSize(s)}
                         className={`flex-1 py-2 text-xs font-medium rounded-lg transition-all ${labelSize === s ? 'bg-white text-primary-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
                       >
                         {s === '4x6' ? '4" x 6" (Standard)' : '2.25" x 1.25"'}
                       </button>
                     ))}
                   </div>
                </div>

                {/* Primary Action */}
                <button 
                  onClick={handlePrint}
                  disabled={!fnsku}
                  className="w-full group relative overflow-hidden bg-slate-900 text-white font-semibold py-4 px-6 rounded-2xl shadow-xl shadow-slate-900/10 disabled:opacity-50 disabled:cursor-not-allowed transition-all transform active:scale-[0.98] hover:shadow-2xl hover:shadow-primary-500/20 hover:bg-slate-800"
                >
                  <span className="relative z-10 flex items-center justify-center gap-2">
                    <IconPrint /> Print Label
                  </span>
                </button>

              </div>
            </div>
          </div>

          {/* Right: The Label (Central Stage) */}
          <div className="lg:col-span-7 flex flex-col items-center justify-center min-h-[600px] relative">
            
            {/* Visual Context */}
            <div className="absolute inset-0 flex items-center justify-center opacity-30 pointer-events-none no-print">
              <div className="w-[500px] h-[500px] bg-gradient-to-tr from-primary-100 to-transparent rounded-full blur-3xl"></div>
            </div>

            <div className="relative z-10 no-print mb-6 flex items-center gap-2">
               <label className="text-xs font-medium text-slate-400 flex items-center gap-2 cursor-pointer select-none px-3 py-1.5 rounded-full hover:bg-white/50 transition-colors border border-transparent hover:border-slate-200/50">
                <input 
                  type="checkbox" 
                  checked={showSafeZone} 
                  onChange={(e) => setShowSafeZone(e.target.checked)}
                  className="rounded text-primary-500 focus:ring-0 border-slate-300 w-3.5 h-3.5" 
                />
                Show Print Safe Zone
              </label>
            </div>

            {/* The Physical Label (Preview) */}
            <div 
              id="print-area"
              className={`bg-white text-black transition-all duration-500 ease-out mx-auto relative overflow-hidden flex flex-col items-center justify-center
                ${showSafeZone ? 'after:absolute after:inset-[0.125in] after:border after:border-dashed after:border-primary-200 after:rounded-sm after:pointer-events-none' : ''}
                shadow-2xl shadow-slate-200 print:shadow-none print:border-0`}
              style={{
                width: labelSize === '4x6' ? '4in' : '2.25in',
                height: labelSize === '4x6' ? '6in' : '1.25in',
                transform: 'scale(1)', // Keep 1:1 visually for accuracy
              }}
            >
              {fnsku ? (
                <div className="w-full h-full flex flex-col items-center justify-center p-[0.125in] relative z-10">
                  
                  {/* Barcode SVG */}
                  <div className="flex-1 flex items-center justify-center w-full">
                     <svg ref={barcodeRef} className="max-w-full h-auto" style={{ maxHeight: '80%' }}></svg>
                  </div>

                  {/* Text Data */}
                  <div className="w-full text-left font-sans text-sm leading-tight space-y-1">
                    
                    {/* FNSKU Text (Manually rendered for font control) */}
                    <div className="font-mono text-xs tracking-widest text-center mb-2">{fnsku}</div>
                    
                    <div className="font-bold truncate line-clamp-2 pr-2">{title || "Product Title"}</div>
                    <div className="flex justify-between items-end text-xs text-gray-600 pt-1 border-t border-gray-100">
                      <span className="font-medium">{condition}</span>
                      {sku && <span className="font-mono text-[10px] tracking-tighter opacity-75">{sku}</span>}
                    </div>
                  </div>

                </div>
              ) : (
                // Empty State
                <div className="absolute inset-0 flex flex-col items-center justify-center text-slate-300 p-8 text-center animate-pulse">
                  <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mb-4">
                    <span className="text-4xl opacity-20">🏷️</span>
                  </div>
                  <p className="font-medium text-sm">Enter FNSKU to generate preview</p>
                </div>
              )}
            </div>

          </div>
        </div>
      </div>
      
      {/* Footer */}
      <footer className="py-8 text-center no-print">
        <p className="text-[10px] text-slate-400 font-medium tracking-wider uppercase">
           Secure Local Processing • <a href="#" className="hover:text-primary-500 transition-colors">v1.2.0</a>
        </p>
      </footer>

    </div>
  )
}

export default App
