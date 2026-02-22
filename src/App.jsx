import { useState, useEffect, useRef } from 'react'
import JsBarcode from 'jsbarcode'
import './index.css'

// Icons from a simple SVG set
const PrinterIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" /></svg>
)
const TrashIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
)
const InfoIcon = () => (
  <svg className="w-4 h-4 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
)

function App() {
  // Initialize state from local storage or defaults
  const [fnsku, setFnsku] = useState(() => {
    try {
      const saved = localStorage.getItem('last_label')
      return saved ? JSON.parse(saved).fnsku || '' : ''
    } catch { return '' }
  })
  const [title, setTitle] = useState(() => {
    try {
      const saved = localStorage.getItem('last_label')
      return saved ? JSON.parse(saved).title || '' : ''
    } catch { return '' }
  })
  const [condition, setCondition] = useState(() => {
    try {
      const saved = localStorage.getItem('last_label')
      return saved ? JSON.parse(saved).condition || 'New' : 'New'
    } catch { return 'New' }
  })
  const [sku, setSku] = useState(() => {
    try {
      const saved = localStorage.getItem('last_label')
      return saved ? JSON.parse(saved).sku || '' : ''
    } catch { return '' }
  })
  const [labelSize, setLabelSize] = useState(() => {
    try {
      const saved = localStorage.getItem('last_label')
      return saved ? JSON.parse(saved).labelSize || '4x6' : '4x6'
    } catch { return '4x6' }
  })

  const [showSafeZone, setShowSafeZone] = useState(false)
  const barcodeRef = useRef(null)

  // Remove the initial useEffect loader
  
  // Save to local storage on change
  useEffect(() => {
    localStorage.setItem('last_label', JSON.stringify({ fnsku, title, condition, sku, labelSize }))
  }, [fnsku, title, condition, sku, labelSize])

  // Generate barcode
  useEffect(() => {
    if (fnsku && barcodeRef.current) {
      try {
        JsBarcode(barcodeRef.current, fnsku, {
          format: "CODE128",
          width: 2,
          height: 50,
          displayValue: true,
          fontSize: 14,
          margin: 0,
          font: "JetBrains Mono" // Use monospaced font
        })
      } catch (e) {
        console.error("Invalid barcode data", e)
      }
    }
  }, [fnsku, labelSize])

  const handlePrint = () => {
    window.print()
  }

  const handleClear = () => {
    if (window.confirm('Clear all fields?')) {
      setFnsku('')
      setTitle('')
      setSku('')
      setCondition('New')
    }
  }

  return (
    <div className="min-h-screen bg-neutral-100 text-neutral-900 font-sans print:bg-white">
      
      {/* Header */}
      <header className="bg-white border-b border-gray-200 shadow-sm no-print sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-2xl">📦</span>
            <h1 className="text-xl font-bold text-gray-900 tracking-tight">FBA Label Kit <span className="text-xs font-normal text-gray-500 bg-gray-100 px-2 py-0.5 rounded-full ml-2 border border-gray-200">BETA</span></h1>
          </div>
          <div className="text-sm text-gray-500 hidden sm:block">
            Professional FNSKU Generator
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 print:p-0">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 print:block">
          
          {/* Left Panel: Controls */}
          <div className="lg:col-span-4 space-y-6 no-print">
            
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
              <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
                <span className="w-1 h-6 bg-primary rounded-full"></span>
                Product Details
              </h2>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">FNSKU (Barcode)</label>
                  <div className="relative">
                    <input 
                      type="text" 
                      value={fnsku}
                      onChange={(e) => setFnsku(e.target.value.toUpperCase().trim())}
                      placeholder="X00..."
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-light focus:border-primary font-mono text-lg tracking-wide uppercase transition-shadow"
                      autoFocus
                    />
                    {fnsku && fnsku.length < 10 && (
                      <span className="absolute right-3 top-3.5 text-xs text-alert font-medium">Too short</span>
                    )}
                  </div>
                  <p className="text-xs text-gray-500 mt-1 flex items-center gap-1">
                    <InfoIcon /> Must match Amazon FNSKU exactly.
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Product Title</label>
                  <input 
                    type="text" 
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="e.g. Silicone Spatula Set, Red..."
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-light focus:border-primary transition-shadow"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Condition</label>
                    <select 
                      value={condition}
                      onChange={(e) => setCondition(e.target.value)}
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-light focus:border-primary bg-white"
                    >
                      <option>New</option>
                      <option>Used - Like New</option>
                      <option>Used - Very Good</option>
                      <option>Used - Good</option>
                      <option>Used - Acceptable</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Seller SKU (Optional)</label>
                     <input 
                      type="text" 
                      value={sku}
                      onChange={(e) => setSku(e.target.value)}
                      placeholder="MY-SKU-001"
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-light focus:border-primary font-mono text-sm"
                    />
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
               <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
                <span className="w-1 h-6 bg-secondary rounded-full"></span>
                Print Settings
              </h2>
              
              <div className="space-y-4">
                 <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Label Size</label>
                  <div className="grid grid-cols-2 gap-3">
                    <button
                      onClick={() => setLabelSize('4x6')}
                      className={`p-3 border rounded-lg text-sm font-medium transition-all ${labelSize === '4x6' ? 'border-primary bg-blue-50 text-primary ring-1 ring-primary' : 'border-gray-200 hover:border-gray-300 text-gray-600'}`}
                    >
                      4" x 6"
                      <span className="block text-xs font-normal opacity-75 mt-0.5">Standard Thermal</span>
                    </button>
                    <button
                      onClick={() => setLabelSize('2.25x1.25')}
                      className={`p-3 border rounded-lg text-sm font-medium transition-all ${labelSize === '2.25x1.25' ? 'border-primary bg-blue-50 text-primary ring-1 ring-primary' : 'border-gray-200 hover:border-gray-300 text-gray-600'}`}
                    >
                      2.25" x 1.25"
                      <span className="block text-xs font-normal opacity-75 mt-0.5">Address Label</span>
                    </button>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-2">
                  <label className="text-sm text-gray-700 flex items-center gap-2 cursor-pointer select-none">
                    <input 
                      type="checkbox" 
                      checked={showSafeZone} 
                      onChange={(e) => setShowSafeZone(e.target.checked)}
                      className="rounded text-primary focus:ring-primary border-gray-300" 
                    />
                    Show Print Margins
                  </label>
                  <span className="text-xs text-gray-400">Visual guide only</span>
                </div>
              </div>
            </div>

            <div className="flex gap-3 pt-2">
              <button 
                onClick={handlePrint}
                disabled={!fnsku}
                className="flex-1 bg-primary hover:bg-primary-dark text-white font-bold py-3.5 px-4 rounded-xl shadow-lg shadow-blue-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:shadow-none transition-all transform active:scale-[0.98] flex items-center justify-center gap-2"
              >
                <PrinterIcon />
                Print Label
              </button>
              <button 
                onClick={handleClear}
                className="px-4 py-3.5 border border-gray-300 rounded-xl hover:bg-gray-50 text-gray-700 transition-colors"
                title="Clear All"
              >
                <TrashIcon />
              </button>
            </div>

             <div className="text-xs text-gray-500 text-center mt-4">
              <p>Pro Tip: Set printer scale to <strong>100%</strong> (Do not scale)</p>
            </div>

          </div>

          {/* Right Panel: Preview */}
          <div className="lg:col-span-8 bg-gray-200/50 rounded-xl border border-gray-200/50 p-8 flex flex-col items-center justify-center min-h-[600px] relative print:p-0 print:bg-white print:border-0 print:block print:min-h-0">
            
            <div className="absolute top-4 right-4 no-print text-xs font-medium text-gray-400 uppercase tracking-widest bg-gray-100 px-3 py-1 rounded-full border border-gray-200">
              Live Preview
            </div>

            {/* Label Canvas */}
            <div 
              id="print-area"
              className={`bg-white shadow-xl print:shadow-none flex flex-col items-center justify-center text-center p-4 border transition-all duration-300 mx-auto relative overflow-hidden ${showSafeZone ? 'border-alert border-dashed' : 'border-gray-200 print:border-0'}`}
              style={{
                width: labelSize === '4x6' ? '4in' : '2.25in',
                height: labelSize === '4x6' ? '6in' : '1.25in',
                // Zoom for better visibility on large screens if needed, but keep 1:1 for print accuracy
                transform: 'scale(1)', 
                transformOrigin: 'top center'
              }}
            >
              {/* Safe Zone Overlay */}
              {showSafeZone && (
                <div className="absolute inset-2 border border-blue-200 border-dashed pointer-events-none opacity-50 z-50 flex items-center justify-center">
                  <span className="text-[10px] text-blue-300 font-mono">Safe Zone</span>
                </div>
              )}

              {fnsku ? (
                <div className="w-full h-full flex flex-col items-center justify-center space-y-2 z-10">
                  
                  {/* Barcode Area */}
                  <div className="flex-1 flex items-center justify-center w-full min-h-0">
                     <svg ref={barcodeRef} className="max-w-full h-auto max-h-full"></svg>
                  </div>

                  {/* Text Area */}
                  <div className="w-full text-left px-2 text-sm leading-tight font-sans">
                    <div className="font-bold truncate line-clamp-2 mb-1.5 text-black">{title || "Product Title"}</div>
                    <div className="flex justify-between items-end border-t border-gray-100 pt-1.5 mt-1">
                      <div className="text-xs text-gray-600 font-medium">{condition}</div>
                      {sku && <div className="text-xs text-gray-500 font-mono tracking-tight">{sku}</div>}
                    </div>
                  </div>

                </div>
              ) : (
                <div className="text-gray-300 text-center p-8 flex flex-col items-center justify-center h-full w-full">
                  <div className="w-16 h-16 border-2 border-gray-200 border-dashed rounded-lg mb-3 flex items-center justify-center">
                    <span className="text-2xl opacity-50">🏷️</span>
                  </div>
                  <p className="font-medium">Waiting for input...</p>
                  <p className="text-xs mt-1">Enter FNSKU to generate</p>
                </div>
              )}
            </div>

             <div className="mt-8 text-xs text-gray-400 no-print max-w-sm text-center">
               This preview represents the exact print output. Ensure your printer page size matches the label size ({labelSize}).
             </div>

          </div>
        </div>
      </main>
      
      {/* Footer */}
      <footer className="max-w-7xl mx-auto px-4 py-6 border-t border-gray-200 mt-8 text-center text-sm text-gray-500 no-print">
        <p>© {new Date().getFullYear()} ONKO Label Kit. Local processing only - no data leaves your browser.</p>
      </footer>

    </div>
  )
}

export default App
