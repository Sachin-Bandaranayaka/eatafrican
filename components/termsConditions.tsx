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
        className="flex justify-between items-center w-full py-3 px-4 text-left border border-[#f1c232] "
      >
        <span className="font-bold text-white">{title}</span>
        {isOpen ? <Minus className="w-4 h-4 white" /> : <Plus className="w-4 h-4 white" />}
      </button>
      {isOpen && <div className="p-4 bg-[#ff9920] mt-1 mb-1 rounded-3xl">{children}</div>}
    </div>
  );
}

export default function Terms({ isOpen, onClose }: TermsProps) {
  const [openSection, setOpenSection] = useState<string | null>(null);

  const toggleSection = (section: string) => {
    setOpenSection(openSection === section ? null : section);
  };

  if (!isOpen) return null;

  return (
    <div className="md:fixed lg:fixed xl:fixed 2xl:fixed -mt-[80%] md:mt-[10vh] lg:[20vh] xl:[20vh] 2xl:[20vh] inset-0 z-50 flex items-start justify-end ">
      <div className="relative w-[95%] md:w-full h-[95%] md:max-w-2xl rounded-bl-3xl rounded-tl-3xl shadow-lg overflow-hidden">

        {/* Header */}
        <div className="flex justify-start md:ml-10 mt-6 z-20 items-center space-x-2">
          {/* close btn */}
          <button
            onClick={onClose}
            className="bg-[#ff9920] text-black border rounded-full p-1 mr-2 z-30"
            type="button"
          >
            <img
              src="/images/cancelBtnBlack.png"
              alt="Close"
              className="w-4 h-4 object-contain"
            />
          </button>

          {/* heading text */}
          <div className="bg-[#ff9920] border border-[2px] border-[#fff2ccff] inline-block rounded-r-full p-6 pr-2 py-2 relative">
            <div className="pr-10">
              <h2 className="block text-black text-[15px] font-bold uppercase rounded whitespace-nowrap">
                PRIVACY POLICY
              </h2>
            </div>
          </div>
        </div>

        {/* Image Container */}
        <div className="relative w-full max-w-[600px] mx-auto mt-4 border border-[#f1c232] rounded-3xl">
          <Image
            src="/images/privacypolicy_1.png"
            width={600}
            height={400}
            alt="privacy policy"
            className="w-full h-auto rounded-3xl"
          />
          {/* Background Overlay */}
          <div className="absolute inset-0 bg-[#783f04ff] opacity-75 rounded-3xl z-20"></div>

          {/* Content Area */}
          <div className="absolute inset-0 flex flex-col justify-center z-30 ">
            {/* Scrollable Content with Hidden Scrollbar */}
            <div className="relative z-30 p-2 rounded-md max-h-full overflow-y-auto hide-scrollbar">
              <div className="divide-y divide-amber-800/20 w-[100%] text-xs md:text-sm lg:text-sm xl:text-sm 2xl:text-sm">
                <AccordionItem
                  title="Introduction"
                  isOpen={openSection === "introduction"}
                  toggleOpen={() => toggleSection("introduction")}
                >
                  <p className="text-[10px] md:text-sm lg:text-sm xl:text-sm 2xl:text-sm text-black">
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
                  <p className="text-[10px] md:text-sm lg:text-sm xl:text-sm 2xl:text-sm text-black">
                    To use our services, you must be at least 18 years old and capable of forming legally binding contracts.
                    When creating an account, you must provide accurate and complete information.
                  </p>
                </AccordionItem>

                <AccordionItem
                  title="Platform Use and Conduct"
                  isOpen={openSection === "platform"}
                  toggleOpen={() => toggleSection("platform")}
                >
                  <p className="text-[10px] md:text-sm lg:text-sm xl:text-sm 2xl:text-sm text-black">
                    Users must use the platform responsibly and not engage in any activity that disrupts the service or
                    violates these terms.
                  </p>
                </AccordionItem>

                <AccordionItem
                  title="Orders and Payments"
                  isOpen={openSection === "orders"}
                  toggleOpen={() => toggleSection("orders")}
                >
                  <p className="text-[10px] md:text-sm lg:text-sm xl:text-sm 2xl:text-sm text-black">
                    All payments are processed securely. Prices are inclusive of applicable taxes. Additional delivery fees
                    may apply based on your location.
                  </p>
                </AccordionItem>

                <AccordionItem
                  title="Delivery and Pickup"
                  isOpen={openSection === "delivery"}
                  toggleOpen={() => toggleSection("delivery")}
                >
                  <p className="text-[10px] md:text-sm lg:text-sm xl:text-sm 2xl:text-sm text-black">
                    Delivery times are estimates and may vary based on restaurant preparation times, traffic, and other
                    factors. We strive to deliver all orders promptly.
                  </p>
                </AccordionItem>

                <AccordionItem
                  title="Restaurant Partner Responsibilities"
                  isOpen={openSection === "restaurant"}
                  toggleOpen={() => toggleSection("restaurant")}
                >
                  <p className="text-[10px] md:text-sm lg:text-sm xl:text-sm 2xl:text-sm text-black">
                    Restaurant partners are responsible for food preparation, quality, and safety. We work with partners who
                    maintain high standards.
                  </p>
                </AccordionItem>

                <AccordionItem
                  title="Pricing and Fees"
                  isOpen={openSection === "pricing"}
                  toggleOpen={() => toggleSection("pricing")}
                >
                  <p className="text-[10px] md:text-sm lg:text-sm xl:text-sm 2xl:text-sm text-black">
                    All prices are set by the restaurant partners. We charge a service fee for using our platform, which is
                    clearly displayed at checkout.
                  </p>
                </AccordionItem>

                <AccordionItem
                  title="Cancellations and Refunds"
                  isOpen={openSection === "cancellations"}
                  toggleOpen={() => toggleSection("cancellations")}
                >
                  <p className="text-[10px] md:text-sm lg:text-sm xl:text-sm 2xl:text-sm text-black">
                    Cancellation policies vary by restaurant. Refunds are processed according to our refund policy, which
                    considers order status and circumstances.
                  </p>
                </AccordionItem>

                <AccordionItem
                  title="Intellectual Property"
                  isOpen={openSection === "intellectual"}
                  toggleOpen={() => toggleSection("intellectual")}
                >
                  <p className="text-[10px] md:text-sm lg:text-sm xl:text-sm 2xl:text-sm text-black">
                    All content on the platform, including logos, text, and images, is protected by intellectual property
                    rights and may not be used without permission.
                  </p>
                </AccordionItem>

                <AccordionItem
                  title="Privacy and Data Protection"
                  isOpen={openSection === "privacy"}
                  toggleOpen={() => toggleSection("privacy")}
                >
                  <p className="text-[10px] md:text-sm lg:text-sm xl:text-sm 2xl:text-sm text-black">
                    We collect and process personal data in accordance with our Privacy Policy. By using our services, you
                    consent to our data practices.
                  </p>
                </AccordionItem>

                <AccordionItem
                  title="Limitation of Liability"
                  isOpen={openSection === "liability"}
                  toggleOpen={() => toggleSection("liability")}
                >
                  <p className="text-[10px] md:text-sm lg:text-sm xl:text-sm 2xl:text-sm text-black">
                    We strive to provide reliable services but cannot guarantee uninterrupted access. Our liability is
                    limited as permitted by applicable law.
                  </p>
                </AccordionItem>

                <AccordionItem
                  title="Termination of Use"
                  isOpen={openSection === "termination"}
                  toggleOpen={() => toggleSection("termination")}
                >
                  <p className="text-[10px] md:text-sm lg:text-sm xl:text-sm 2xl:text-sm text-black">
                    We reserve the right to terminate or suspend accounts that violate these terms or engage in fraudulent
                    activity.
                  </p>
                </AccordionItem>

                <AccordionItem
                  title="Changes to These Terms"
                  isOpen={openSection === "changes"}
                  toggleOpen={() => toggleSection("changes")}
                >
                  <p className="text-[10px] md:text-sm lg:text-sm xl:text-sm 2xl:text-sm text-black">
                    We may update these terms from time to time. Continued use of the platform after changes constitutes
                    acceptance of the revised terms.
                  </p>
                </AccordionItem>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}