export default function Warranty() {
  return (
    <div className="bg-white min-h-screen font-sans">
      {/* Hero Banner Section */}
      <div className="relative w-full h-[300px] md:h-[400px]">
        <img 
          src="https://cdn.shopify.com/s/files/1/0509/3454/6613/files/banner-warranty.jpg?v=1696666486" 
          alt="Warranty Banner" 
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 flex items-center justify-start px-8 md:px-16 lg:px-32 xl:px-48">
          <div className="max-w-xl lg:max-w-2xl">
            <h1 className="text-3xl md:text-4xl lg:text-[42px] font-semibold text-[#1a1a1a] mb-6 tracking-tight">
              Warranty Registration
            </h1>
            <p className="text-[15px] font-medium text-[#1a1a1a] mb-2 leading-relaxed">
              We are committed to providing you with the best products and services.
            </p>
            <p className="text-[15px] font-medium text-[#1a1a1a] mb-6 leading-relaxed">
              For components not directly contact with ink, a warranty period of 12 months 
              since printer shipment date is provided, unless damage is user-induced. 
              Register warranty on our website to get warranty on some types of printhead 
              limited to one replacement.
            </p>
            <p className="text-[16px] font-semibold text-[#1a1a1a] mb-2">Need Additional Help? Contact Us</p>
            <p className="text-[15px] font-medium text-[#1a1a1a]">
              Email: <a href="mailto:support@procollored.com" className="hover:text-red-600 transition-colors">support@procollored.com</a>
            </p>
          </div>
        </div>
      </div>

      {/* Warranty Policy Content Section */}
      <div className="max-w-[1000px] mx-auto px-6 py-20 text-[#1a1a1a]">
        <h2 className="text-[28px] font-semibold mb-10 tracking-tight">Section One — Warranty Policy</h2>
        
        <div className="space-y-12 mb-16">
          {/* 1. Warranty Coverage */}
          <div>
            <h3 className="text-[20px] font-semibold mb-6">1. Warranty Coverage</h3>
            
            <div className="space-y-8 pl-4 lg:pl-6">
              <div>
                <h4 className="text-[17px] font-semibold mb-3">1.1 Mainboard</h4>
                <p className="text-[15px] leading-[1.7] font-medium mb-3">
                  Mainboard for dual-head printer is not covered by warranty. Customers may send them in for repairs at their own expense.
                </p>
                <p className="text-[15px] leading-[1.7] font-medium">
                  Mainboard for single-head printer is covered by a 6-month warranty period since printer shipment date. Within this warranty period, you are eligible for one replacement.
                </p>
              </div>

              <div>
                <h4 className="text-[17px] font-semibold mb-3">1.2 Print Head and Related Components</h4>
                <p className="text-[15px] leading-[1.7] font-medium">
                  After warranty registration, the following printheads are covered by a 6-month warranty period since printer shipment date, limited to one replacement: (L1800, R1390, L800, L805, TX800, XP600). Other print heads or components that contact with ink are not covered by warranty.
                </p>
              </div>

              <div>
                <h4 className="text-[17px] font-semibold mb-3">1.3 Warranty for Other Accessories</h4>
                <p className="text-[15px] leading-[1.7] font-medium">
                  Other accessories are covered by a 12-month warranty period since shipment date of the Procolored printer.
                </p>
              </div>

              <div>
                <h4 className="text-[17px] font-semibold mb-3">1.4 Disclaimer</h4>
                <ul className="list-disc pl-5 space-y-3">
                  <li className="text-[15px] leading-[1.7] font-medium">
                    The warranty for the ink-contact components requires the printer exclusively use Procolored inks. Warranty coverage does not include the printhead blockage resulting from the use of inks from other brands.
                  </li>
                  <li className="text-[15px] leading-[1.7] font-medium">
                    The warranty for printer-related components is subject to the shipment date of a Procolored printer.
                  </li>
                  <li className="text-[15px] leading-[1.7] font-medium">
                    The damage must not be caused by user negligence or misuse.
                  </li>
                  <li className="text-[15px] leading-[1.7] font-medium">
                    The damage must be confirmed by our customer service team or engineers as non-user-induced.
                  </li>
                </ul>
              </div>
            </div>
          </div>

          {/* 2. Warranty Costs */}
          <div>
            <h3 className="text-[20px] font-semibold mb-4">2. Warranty Costs</h3>
            <p className="text-[15px] leading-[1.7] font-medium pl-4 lg:pl-6">
              If the component within warranty period is damaged within one month of printer receiving, we will bear the cost of component and covering the shipping fees. For damage reported after one month of printer receipt, we will cover the cost of component but will not cover the shipping fees.
            </p>
          </div>
        </div>

        <h2 className="text-[28px] font-semibold mb-8 tracking-tight">Section Two — Return Policy</h2>
        <div className="space-y-4 pl-4 lg:pl-6 pb-20 border-b border-gray-100">
          <p className="text-[15px] leading-[1.7] font-medium">
            If the printer is received within one week and no ink is added, it can be shipped back in its original packaging, and returns and exchanges are accepted. If any ink has been added into the printer, we cannot process returns or exchanges.
          </p>
          <p className="text-[15px] leading-[1.7] font-medium">
            Please note that this warranty policy is subject to change, and any modifications will be posted on our website. For any warranty claims or inquiries, please contact our customer service team. For all customers who have purchased Procolored printer equipment but are beyond the 12-month warranty period, we offer extended warranty services, which include two programs: Remote Expert Service and Extended Warranty.
          </p>
        </div>
      </div>
    </div>
  );
}
