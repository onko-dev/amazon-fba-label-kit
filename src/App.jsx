import { useState, useEffect, useRef } from 'react'
import JsBarcode from 'jsbarcode'
// import { jsPDF } from 'jspdf'
import './index.css'

function App() {
  const [fnsku, setFnsku] = useState('')
  const [title, setTitle] = useState('')
  const [condition, setCondition] = useState('New')
  const [sku, setSku] = useState('')
  const [labelSize, setLabelSize] = useState('4x6') // '4x6' or '2.25x1.25'

  const barcodeRef = useRef(null)
  
  // Generate barcode on change
  useEffect(() => {
    if (fnsku && barcodeRef.current) {
      try {
        JsBarcode(barcodeRef.current, fnsku, {
          format: "CODE128",
          width: 2,
          height: 50,
          displayValue: true,
          fontSize: 14,
          margin: 0
        })
      } catch (e) {
        console.error("Invalid barcode data", e)
      }
    }
  }, [fnsku, labelSize])

  const handlePrint = () => {
    window.print()
  }

  /*
  const handleDownloadPDF = () => {
    // Basic PDF generation using jsPDF
    // Note: Browser print is often better for thermal printers due to driver settings
    const doc = new jsPDF({
      orientation: labelSize === '4x6' ? 'p' : 'l',
      unit: 'in',
      format: labelSize === '4x6' ? [4, 6] : [2.25, 1.25]
    })
    
    // Simple text for now - could capture canvas but direct draw is cleaner
    doc.setFontSize(10)
    // Would need complex logic to replicate HTML layout exactly in PDF
    // For MVP, browser print is primary method per spec
    alert("For best results with thermal printers, use the 'Print' button and select your label size in the print dialog.")
  }
  */

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900 font-sans p-8 print:p-0 print:bg-white">
      <div className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8 print:block print:max-w-none">
        
        {/* Editor Panel */}
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 no-print">
          <h1 className="text-2xl font-bold mb-6 flex items-center gap-2">
            🏷️ FBA Label Kit
          </h1>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">FNSKU (Barcode)</label>
              <input 
                type="text" 
                value={fnsku}
                onChange={(e) => setFnsku(e.target.value.toUpperCase())}
                placeholder="X00..."
                className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500 font-mono"
              />
              <p className="text-xs text-gray-500 mt-1">Must be a valid alphanumeric string.</p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Product Title</label>
              <input 
                type="text" 
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Product Name..."
                className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Condition</label>
                <select 
                  value={condition}
                  onChange={(e) => setCondition(e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option>New</option>
                  <option>Used - Like New</option>
                  <option>Used - Very Good</option>
                  <option>Used - Good</option>
                  <option>Used - Acceptable</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Label Size</label>
                <select 
                  value={labelSize}
                  onChange={(e) => setLabelSize(e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="4x6">4" x 6" (Standard)</option>
                  <option value="2.25x1.25">2.25" x 1.25" (Address)</option>
                </select>
              </div>
            </div>

            <div>
               <label className="block text-sm font-medium text-gray-700 mb-1">Optional SKU</label>
               <input 
                type="text" 
                value={sku}
                onChange={(e) => setSku(e.target.value)}
                placeholder="Seller SKU..."
                className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            <div className="pt-4 flex gap-3">
              <button 
                onClick={handlePrint}
                disabled={!fnsku}
                className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                Print Label
              </button>
              <button 
                onClick={() => {setFnsku(''); setTitle(''); setSku('')}}
                className="px-4 py-2 border border-gray-300 rounded hover:bg-gray-50 text-gray-700"
              >
                Clear
              </button>
            </div>

            <div className="mt-6 p-3 bg-blue-50 text-blue-800 text-xs rounded border border-blue-100">
              <strong>Tip:</strong> Ensure your printer settings are set to match the label size (4x6" or 2.25x1.25") and margins are set to "None".
            </div>
          </div>
        </div>

        {/* Preview Panel */}
        <div className="flex flex-col items-center justify-center bg-gray-200 rounded-lg p-8 print:p-0 print:bg-white print:block">
          <div className="no-print mb-4 text-sm font-medium text-gray-500 uppercase tracking-wider">Live Preview</div>
          
          {/* Label Container */}
          <div 
            id="print-area"
            className={`bg-white shadow-lg print:shadow-none flex flex-col items-center justify-center text-center p-4 border border-gray-200 print:border-0 relative overflow-hidden mx-auto`}
            style={{
              width: labelSize === '4x6' ? '4in' : '2.25in',
              height: labelSize === '4x6' ? '6in' : '1.25in',
              // Scale down preview if needed but print at actual size
            }}
          >
            {fnsku ? (
              <div className="w-full h-full flex flex-col items-center justify-center space-y-2">
                
                {/* Barcode Area */}
                <div className="flex-1 flex items-center justify-center w-full">
                   <svg ref={barcodeRef} className="max-w-full h-auto"></svg>
                </div>

                {/* Text Area */}
                <div className="w-full text-left px-2 text-sm leading-tight">
                  <div className="font-bold truncate line-clamp-2 mb-1">{title || "Product Title"}</div>
                  <div className="flex justify-between items-end">
                    <div className="text-xs text-gray-600 font-mono">{condition}</div>
                    {sku && <div className="text-xs text-gray-500">{sku}</div>}
                  </div>
                </div>

              </div>
            ) : (
              <div className="text-gray-400 text-center p-8">
                Enter FNSKU to generate label
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default App
