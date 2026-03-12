import { ChevronRight } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function Warranty() {
  return (
    <div className="bg-white min-h-screen">
      {/* Breadcrumbs */}
      <div className="max-w-7xl mx-auto px-4 py-4 border-b border-gray-100">
        <div className="flex items-center gap-2 text-sm text-gray-500">
          <Link to="/" className="hover:text-black hover:underline transition-colors">Home</Link>
          <ChevronRight className="w-4 h-4" />
          <span className="text-black">Warranty Policy</span>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-16">
        <h1 className="text-3xl md:text-4xl font-bold text-center mb-12 text-black">Procolored Warranty Policy</h1>
        
        <div className="prose prose-lg max-w-none prose-p:text-gray-600 prose-headings:text-black prose-li:text-gray-600">
          <div className="bg-gray-50 p-6 rounded-lg mb-8 border border-gray-200">
            <h2 className="text-xl font-bold mt-0 mb-4">Limited One-Year Warranty</h2>
            <p className="mb-0">
              Procolored warrants its products against defects in materials and workmanship under normal use for a period of ONE (1) YEAR from the date of retail purchase by the original end-user purchaser ("Warranty Period").
            </p>
          </div>

          <h3 className="text-lg font-bold mt-8 mb-4">What is Covered?</h3>
          <ul className="list-disc pl-6 space-y-2 mb-8">
            <li>Mainboard and carriage board.</li>
            <li>Motors (X/Y axis, ink pump motors).</li>
            <li>Sensors and limit switches.</li>
            <li>Power supply unit.</li>
            <li>Control panels and display screens.</li>
          </ul>

          <h3 className="text-lg font-bold mt-8 mb-4">What is NOT Covered?</h3>
          <p className="mb-4">
            This warranty does not apply to any non-Procolored branded hardware products or any software, even if packaged or sold with Procolored hardware. Consumable parts and damage resulting from improper maintenance are excluded.
          </p>
          <ul className="list-disc pl-6 space-y-2 mb-8">
            <li><strong>Printheads:</strong> Excluded from the 1-year warranty. A separate 3-month limited warranty applies to manufacturing defects only. Clogging due to lack of maintenance is not covered.</li>
            <li>Ink dampers, capping stations, and wiper blades (consumables).</li>
            <li>Ink lines and reservoirs.</li>
            <li>Damage caused by using third-party inks or films.</li>
            <li>Damage caused by accident, abuse, misuse, liquid contact, fire, or earthquake.</li>
            <li>Modifications or unauthorized repairs.</li>
          </ul>

          <h3 className="text-lg font-bold mt-8 mb-4">How to Obtain Warranty Service</h3>
          <p className="mb-6">
            If a defect arises during the Warranty Period, please contact Procolored Support with your order number, machine serial number, and a detailed description of the issue (including photos/videos if applicable).
          </p>
          
          <div className="bg-red-50 border border-red-100 p-6 rounded-lg flex flex-col items-center text-center">
            <p className="text-red-800 font-medium mb-4">Need to file a warranty claim or request a repair?</p>
            <Link to="/repair" className="bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-6 rounded transition-colors inline-block">
              Submit Repair Request
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
