"use client";

import type React from "react";
import { useState } from "react";
import Image from "next/image";
import { X, Plus, Minus } from "lucide-react";

interface TermsProps {
  isOpen: boolean;
  onClose: () => void;
}

interface AccordionItemProps {
  title: string;
  children: React.ReactNode;
  isOpen: boolean;
  toggleOpen: () => void;
}

function AccordionItem({ title, children, isOpen, toggleOpen }: AccordionItemProps) {
  return (
    <div className="rounded-3xl">
      <button
        onClick={toggleOpen}
        className="flex justify-between items-center w-full py-3 px-4 text-left bg-[#fff2d9]/90 hover:bg-[#fff2d9]"
      >
        <span className="font-medium text-amber-950">{title}</span>
        {isOpen ? <Minus className="w-4 h-4 text-amber-950" /> : <Plus className="w-4 h-4 text-amber-950" />}
      </button>
      {isOpen && <div className="p-4 bg-[#ff9920] mt-1 mb-1 rounded-3xl">{children}</div>}
    </div>
  );
}

export default function Terms({ isOpen, onClose }: TermsProps) {
  const [openSection, setOpenSection] = useState<string | null>("introduction");

  const toggleSection = (section: string) => {
    setOpenSection(openSection === section ? null : section);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-end">
      <div className="relative max-w-full md:max-w-2xl rounded-bl-3xl rounded-tl-3xl shadow-lg mt-12 mr-4 overflow-hidden">
   
        {/* Image - BEHIND */}
        <div className="absolute left-10 md:left-20 w-40 h-40 md:w-48 md:h-48 z-10">
          <Image
            src="/images/chefs-group.png"
            alt="Chefs group"
            fill
            className="object-cover rounded-md opacity-90"
          />
        </div>

        {/* Header */}
        <div className="flex justify-end md:mr-6 mt-16 z-20 flex items-center space-x-2">
          <div className="bg-amber-900 text-white px-4 py-2 rounded-l-full border border-amber-600 flex items-center">
            <span className="text-sm md:text-base font-bold uppercase">TERMS & CONDITIONS</span>
          </div>
          {/* Close Button */}
          <button
            onClick={onClose}
            className="bg-[#FFF3C7] text-black rounded-full p-1"
            type="button"
          >
            <img
              src="/images/cancelBtn.png"
              alt="Close"
              className="w-4 h-4 object-contain"
            />
          </button>
        </div>

        {/* Scrollable Content with Hidden Scrollbar */}
        <div className="relative z-30 p-1 md:p-1 m-4 md:m-4 md:mt-6 rounded-md max-h-[70vh] overflow-y-auto hide-scrollbar">
          <div className="divide-y divide-amber-800/20 w-full md:w-[500px]">
            <AccordionItem
              title="Introduction"
              isOpen={openSection === "introduction"}
              toggleOpen={() => toggleSection("introduction")}
            >
              <p className="text-sm text-black">
                Welcome to eatafrican.ch, a food ordering and delivery platform connecting customers with African
                restaurants across Switzerland. These Terms and Conditions govern your use of our platform. By accessing
                or using our services, you agree to be bound by these terms.
              </p>
            </AccordionItem>

            <AccordionItem
              title="Eligibility and Account Registration"
              isOpen={openSection === "eligibility"}
              toggleOpen={() => toggleSection("eligibility")}
            >
              <p className="text-sm text-black">
                To use our services, you must be at least 18 years old and capable of forming legally binding contracts.
                When creating an account, you must provide accurate and complete information.
              </p>
            </AccordionItem>

            <AccordionItem
              title="Platform Use and Conduct"
              isOpen={openSection === "platform"}
              toggleOpen={() => toggleSection("platform")}
            >
              <p className="text-sm text-black">
                Users must use the platform responsibly and not engage in any activity that disrupts the service or
                violates these terms.
              </p>
            </AccordionItem>

            <AccordionItem
              title="Orders and Payments"
              isOpen={openSection === "orders"}
              toggleOpen={() => toggleSection("orders")}
            >
              <p className="text-sm text-black">
                All payments are processed securely. Prices are inclusive of applicable taxes. Additional delivery fees
                may apply based on your location.
              </p>
            </AccordionItem>

            <AccordionItem
              title="Delivery and Pickup"
              isOpen={openSection === "delivery"}
              toggleOpen={() => toggleSection("delivery")}
            >
              <p className="text-sm text-black">
                Delivery times are estimates and may vary based on restaurant preparation times, traffic, and other
                factors. We strive to deliver all orders promptly.
              </p>
            </AccordionItem>

            <AccordionItem
              title="Restaurant Partner Responsibilities"
              isOpen={openSection === "restaurant"}
              toggleOpen={() => toggleSection("restaurant")}
            >
              <p className="text-sm text-black">
                Restaurant partners are responsible for food preparation, quality, and safety. We work with partners who
                maintain high standards.
              </p>
            </AccordionItem>

            <AccordionItem
              title="Pricing and Fees"
              isOpen={openSection === "pricing"}
              toggleOpen={() => toggleSection("pricing")}
            >
              <p className="text-sm text-black">
                All prices are set by the restaurant partners. We charge a service fee for using our platform, which is
                clearly displayed at checkout.
              </p>
            </AccordionItem>

            <AccordionItem
              title="Cancellations and Refunds"
              isOpen={openSection === "cancellations"}
              toggleOpen={() => toggleSection("cancellations")}
            >
              <p className="text-sm text-black">
                Cancellation policies vary by restaurant. Refunds are processed according to our refund policy, which
                considers order status and circumstances.
              </p>
            </AccordionItem>

            <AccordionItem
              title="Intellectual Property"
              isOpen={openSection === "intellectual"}
              toggleOpen={() => toggleSection("intellectual")}
            >
              <p className="text-sm text-black">
                All content on the platform, including logos, text, and images, is protected by intellectual property
                rights and may not be used without permission.
              </p>
            </AccordionItem>

            <AccordionItem
              title="Privacy and Data Protection"
              isOpen={openSection === "privacy"}
              toggleOpen={() => toggleSection("privacy")}
            >
              <p className="text-sm text-black">
                We collect and process personal data in accordance with our Privacy Policy. By using our services, you
                consent to our data practices.
              </p>
            </AccordionItem>

            <AccordionItem
              title="Limitation of Liability"
              isOpen={openSection === "liability"}
              toggleOpen={() => toggleSection("liability")}
            >
              <p className="text-sm text-black">
                We strive to provide reliable services but cannot guarantee uninterrupted access. Our liability is
                limited as permitted by applicable law.
              </p>
            </AccordionItem>

            <AccordionItem
              title="Termination of Use"
              isOpen={openSection === "termination"}
              toggleOpen={() => toggleSection("termination")}
            >
              <p className="text-sm text-black">
                We reserve the right to terminate or suspend accounts that violate these terms or engage in fraudulent
                activity.
              </p>
            </AccordionItem>

            <AccordionItem
              title="Changes to These Terms"
              isOpen={openSection === "changes"}
              toggleOpen={() => toggleSection("changes")}
            >
              <p className="text-sm text-black">
                We may update these terms from time to time. Continued use of the platform after changes constitutes
                acceptance of the revised terms.
              </p>
            </AccordionItem>
          </div>
        </div>
      </div>
    </div>
  );
}