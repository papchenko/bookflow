import { useNavigate } from "react-router-dom";

const GetTakersPremium = () => {
  const navigate = useNavigate();

  const handleBuyPremium = () => {
    navigate("/payment/takers-premium", {
      state: {
        product: {
          id: "premium-taker-30",
          name: "Taker Premium (30 days)",
          price: 99,
          quantity: 1,
        },
      },
    });
  };

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
    <div className="max-w-3xl mx-auto p-8 text-center text-gray-800 dark:text-white">
      <h2 className="text-3xl font-bold mb-6 text-gray-800 dark:text-white">
        Become a <span className="text-[var(--secondary-color)]">Taker Premium</span>
      </h2>

      <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-xl border border-gray-200 dark:border-gray-700 p-8">
        <h3 className="text-xl font-semibold mb-4">
          Premium Access — 30 Days
        </h3>

        <ul className="text-gray-600 dark:text-gray-300 space-y-2 mb-6">
          <li><span className="bg-green-400">✔</span> Ability to create sales posts</li>
          <li><span className="bg-green-400">✔</span> Visible in Takers page</li>
        </ul>

        <div className="text-3xl font-bold mb-6">99 ₴</div>

        <button
          onClick={handleBuyPremium}
          className="px-6 py-3 bg-[var(--secondary-color)] text-white rounded-xl hover:opacity-90 transition"
        >
          Get Premium
        </button>
      </div>
    </div>
    </div>
  );
};

export default GetTakersPremium;