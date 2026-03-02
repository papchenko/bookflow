const TermsOfUse = () => {
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
      <h1 className="text-3xl font-bold mb-6">Terms of Use</h1>

      <p className="mb-6">
        These Terms of Use govern your access to and use of our online
        marketplace for buying and selling books.
      </p>

      <h2 className="text-xl font-semibold mt-8 mb-3">1. Acceptance of Terms</h2>
      <p className="mb-4">
        By creating an account or using the platform, you agree to these Terms.
        If you do not agree, you must not use the service.
      </p>

      <h2 className="text-xl font-semibold mt-8 mb-3">2. User Accounts</h2>
      <p className="mb-4">
        Users must provide accurate information when registering. You are
        responsible for maintaining the confidentiality of your account and
        password.
      </p>

      <h2 className="text-xl font-semibold mt-8 mb-3">3. Marketplace Role</h2>
      <p className="mb-4">
        The platform acts as an intermediary between buyers and sellers.
        Payments are made directly from buyer to seller after order confirmation.
        We do not process or store payment card information.
      </p>

      <h2 className="text-xl font-semibold mt-8 mb-3">4. Orders & Payments</h2>
      <p className="mb-4">
        Buyers submit orders through the platform. Sellers may accept or reject
        orders. After acceptance, the seller’s payment details are provided to
        the buyer for direct payment.
      </p>

      <h2 className="text-xl font-semibold mt-8 mb-3">5. Prohibited Conduct</h2>
      <ul className="list-disc ml-6 mb-4 space-y-2">
        <li>Providing false information</li>
        <li>Fraudulent transactions</li>
        <li>Uploading illegal or copyrighted content</li>
        <li>Harassment or abusive behavior</li>
      </ul>

      <h2 className="text-xl font-semibold mt-8 mb-3">6. Limitation of Liability</h2>
      <p className="mb-4">
        The platform is not responsible for disputes between buyers and sellers,
        payment delays, or product condition issues.
      </p>

      <h2 className="text-xl font-semibold mt-8 mb-3">7. Changes to Terms</h2>
      <p className="mb-4">
        We reserve the right to update these Terms at any time. Continued use of
        the platform constitutes acceptance of updated Terms.
      </p>

      <p className="mt-10 text-sm text-gray-500">
        Last updated: {new Date().getFullYear()}
      </p>
    </div>
    </div>
  );
};

export default TermsOfUse;