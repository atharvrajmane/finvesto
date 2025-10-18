import React from "react";
import Header from "./Header";
import Footer from "./Footer";

// This is a simple page component for the Privacy Policy.
export default function PrivacyPage() {
  return (
    <div className="bg-white">
      <Header />
      <main className="container mx-auto px-6 py-16 text-left max-w-4xl">
        <h1 className="text-4xl font-bold text-center mb-12">Privacy Policy</h1>
        <div className="space-y-6 text-slate-700">
          <p>
            Your privacy is important to us. It is Finvesto's policy to respect
            your privacy regarding any information we may collect from you
            across our website.
          </p>
          <h2 className="text-2xl font-semibold pt-6">
            1. Information We Collect
          </h2>
          <p>
            We only ask for personal information when we truly need it to
            provide a service to you. We collect it by fair and lawful means,
            with your knowledge and consent. We also let you know why we’re
            collecting it and how it will be used.
          </p>
          <h2 className="text-2xl font-semibold pt-6">
            2. How We Use Information
          </h2>
          <p>
            We use the information we collect to provide, maintain, and improve
            our services, including to process transactions, develop new
            features, provide customer support, and protect Finvesto and our
            users.
          </p>
          <h2 className="text-2xl font-semibold pt-6">
            3. Information Sharing
          </h2>
          <p>
            We don’t share any personally identifying information publicly or
            with third-parties, except when required to by law.
          </p>
          <h2 className="text-2xl font-semibold pt-6">4. Security</h2>
          <p>
            We take security seriously and take reasonable measures to protect
            your information. However, no method of transmission over the
            Internet or method of electronic storage is 100% secure.
          </p>
        </div>
      </main>
      <Footer />
    </div>
  );
}
