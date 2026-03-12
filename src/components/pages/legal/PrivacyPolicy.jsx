const PrivacyPolicy = () => {
  return (
    <div className="py-12 bg-gradient-to-br
        from-[#e0f2fe]
        via-[#bae6fd]
        to-[#7dd3fc]

        dark:bg-gradient-to-br
        dark:from-[#111018]
        dark:via-[#1b1a2b]
        dark:to-[#1c2a3a] 
        
        text-gray-600 dark:text-white">
    <div className="max-w-7xl mx-auto px-6 md:py-6 text-gray-800 dark:text-gray-200">
       <h1 className="text-3xl font-bold mb-6">Privacy Policy</h1>

      <p className="mb-6">
        This Privacy Policy describes how we collect, use, and protect your
        personal data in accordance with the General Data Protection Regulation (GDPR).
      </p>

      <h2 className="text-xl font-semibold mt-8 mb-3">1. Data Controller</h2>
      <p className="mb-4">
        The platform operates as a marketplace for books and acts as the data controller
        for user account and order information.
      </p>

      <h2 className="text-xl font-semibold mt-8 mb-3">2. Personal Data We Collect</h2>
      <ul className="list-disc ml-6 mb-4 space-y-2">
        <li>Email address</li>
        <li>Profile information (nickname, avatar)</li>
        <li>Order history and transaction status</li>
        <li>Technical data (IP, browser type, device info)</li>
      </ul>

      <h2 className="text-xl font-semibold mt-8 mb-3">3. Legal Basis for Processing</h2>
      <ul className="list-disc ml-6 mb-4 space-y-2">
        <li>Contract performance (processing orders)</li>
        <li>Legitimate interest (platform security, fraud prevention)</li>
        <li>User consent (cookies, analytics)</li>
      </ul>

      <h2 className="text-xl font-semibold mt-8 mb-3">4. Payments</h2>
      <p className="mb-4">
        We do not process or store payment card data. After order acceptance,
        buyers transfer funds directly to sellers.
      </p>

      <h2 className="text-xl font-semibold mt-8 mb-3">5. Data Storage</h2>
      <p className="mb-4">
        Data is stored securely using cloud services including Firebase infrastructure.
      </p>

      <h2 className="text-xl font-semibold mt-8 mb-3">6. Your GDPR Rights</h2>
      <ul className="list-disc ml-6 mb-4 space-y-2">
        <li>Right to access your data</li>
        <li>Right to rectification</li>
        <li>Right to erasure ("Right to be forgotten")</li>
        <li>Right to restrict processing</li>
        <li>Right to data portability</li>
      </ul>

      <h2 className="text-xl font-semibold mt-8 mb-3">7. Data Retention</h2>
      <p className="mb-4">
        Personal data is retained only as long as necessary to fulfill the purposes
        described in this policy.
      </p>

      <h2 className="text-xl font-semibold mt-8 mb-3">8. Changes</h2>
      <p className="mb-4">
        We may update this Privacy Policy periodically.
      </p>

      <p className="mt-10 text-sm text-gray-500">
        Last updated: {new Date().getFullYear()}
      </p>
    </div>
    </div>
  );
};

export default PrivacyPolicy;