import React from "react";
import Header from "./Header";
import Footer from "./Footer";

// This is a simple page component for the Terms of Service.
export default function TermsPage() {
  return (
    <div className="bg-white">
      <Header />
      <main className="container mx-auto px-6 py-16 text-left max-w-4xl">
        <h1 className="text-4xl font-bold text-center mb-12">
          Terms of Service
        </h1>
        <div className="space-y-6 text-slate-700">
          <p>
            Welcome to Finvesto. By accessing or using our platform, you agree
            to be bound by these terms of service. Please read them carefully.
          </p>
          <h2 className="text-2xl font-semibold pt-6">
            1. Account Registration
          </h2>
          <p>
            You must be 18 years or older to use this service. You are
            responsible for maintaining the security of your account and
            password. Finvesto cannot and will not be liable for any loss or
            damage from your failure to comply with this security obligation.
          </p>
          <h2 className="text-2xl font-semibold pt-6">
            2. Prohibited Activities
          </h2>
          <p>
            You are prohibited from using the service to engage in any form of
            market manipulation, fraudulent activity, or any action that
            violates applicable laws and regulations.
          </p>
          <h2 className="text-2xl font-semibold pt-6">
            3. Disclaimer of Warranties
          </h2>
          <p>
            The service is provided "as is". Finvesto and its suppliers and
            licensors hereby disclaim all warranties of any kind, express or
            implied, including, without limitation, the warranties of
            merchantability, fitness for a particular purpose and
            non-infringement.
          </p>
          <h2 className="text-2xl font-semibold pt-6">
            4. Limitation of Liability
          </h2>
          <p>
            In no event will Finvesto, or its suppliers or licensors, be liable
            with respect to any subject matter of this agreement under any
            contract, negligence, strict liability or other legal or equitable
            theory for: (i) any special, incidental or consequential damages;
            (ii) the cost of procurement for substitute products or services.
          </p>
        </div>
      </main>
      <Footer />
    </div>
  );
}
