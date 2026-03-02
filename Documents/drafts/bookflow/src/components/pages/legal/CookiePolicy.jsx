const CookiePolicy = () => {
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
      <h1 className="text-3xl font-bold mb-6">Cookie Policy</h1>

      <p className="mb-6">
        This Cookie Policy explains how we use cookies and similar technologies.
      </p>

      <h2 className="text-xl font-semibold mt-8 mb-3">1. What Are Cookies</h2>
      <p className="mb-4">
        Cookies are small text files stored on your device to improve user
        experience.
      </p>

      <h2 className="text-xl font-semibold mt-8 mb-3">2. Types of Cookies We Use</h2>
      <ul className="list-disc ml-6 mb-4 space-y-2">
        <li>Essential cookies (authentication, security)</li>
        <li>Functional cookies (preferences)</li>
        <li>Analytics cookies (usage statistics)</li>
      </ul>

      <h2 className="text-xl font-semibold mt-8 mb-3">3. Managing Cookies</h2>
      <p className="mb-4">
        You can control or disable cookies through your browser settings.
        Disabling cookies may affect platform functionality.
      </p>

      <p className="mt-10 text-sm text-gray-500">
        Last updated: {new Date().getFullYear()}
      </p>
    </div>
    </div>
  );
};

export default CookiePolicy;