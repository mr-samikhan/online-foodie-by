"use client";
import ServicesView from "@/components/services/ServicesView";
import InvoicePanel from "@/components/invoice/InvoicePanel";

export default function ServicesPage() {
  return (
    <div className="flex flex-col lg:flex-row h-full">
      {/* Services */}
      <div className="flex-1 bg-gray-100 p-3 md:p-4 overflow-auto">
        <ServicesView />
      </div>

      {/* Invoice */}
      <div className="lg:w-[320px] w-full border-t lg:border-t-0 lg:border-l">
        <InvoicePanel />
      </div>
    </div>
  );
}
