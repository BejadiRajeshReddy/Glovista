import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { getWallet } from "../../services/userApiServices";
import symbol from "../../assets/icons/symbol.svg";

const WalletComponent = () => {
  const [balance, setBalance] = useState(null);
  const [topUpAmount, setTopUpAmount] = useState("");
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(null);
  const [transactions, setTransactions] = useState([]);
  const userData = useSelector((state) => state?.auth?.userInfo || {});

  useEffect(() => {
    fetchWalletData();
    fetchTransactions();
  }, []);

  const fetchWalletData = async () => {
    try {
      setLoading(true);
      const response = await getWallet(userData.user_id);
      console.log(response);
      setBalance(response.balance ?? 0);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching wallet data:", error);
      setError("Failed to load wallet data. Please try again later.");
      setLoading(false);
    }
  };

  const fetchTransactions = async () => {
    try {
      setTransactions([
        // {
        //   id: 1,
        //   type: "Top Up",
        //   amount: 50,
        //   date: "2023-05-15",
        //   status: "completed",
        // },
        {
          id: 2,
          type: "Purchase",
          amount: -25,
          date: "2023-05-14",
          status: "completed",
        },
        {
          id: 3,
          type: "Referral Bonus",
          amount: 10,
          date: "2023-05-10",
          status: "completed",
        },
        {
          id: 4,
          type: "Refund",
          amount: 15,
          date: "2023-05-05",
          status: "completed",
        },
      ]);
    } catch (error) {
      console.error("Error fetching transactions:", error);
    }
  };

  const handleTopUp = async () => {
    if (!topUpAmount || parseFloat(topUpAmount) <= 0) {
      setError("Please enter a valid top-up amount.");
      setTimeout(() => setError(null), 3000);
      return;
    }

    setBalance((pre) => parseFloat(topUpAmount) + pre);

    // setLoading(true);
    setError(null);

    // try {
    //   const response = await axios.post("/api/wallet/topup", {
    //     amount: parseFloat(topUpAmount),
    //   });
    //   setBalance(response.data.newBalance ?? balance);
    //   setTopUpAmount("");
    //   setSuccess(
    // `Successfully added ₹${parseFloat(topUpAmount).toFixed(
    //   2
    // )} to your wallet!`
    //   );
    //   setTimeout(() => setSuccess(null), 3000);
    //   fetchTransactions();
    //   console.error("Error topping up wallet:", error);
    //   setError("Top-up failed. Please try again later.");
    //   setTimeout(() => setError(null), 3000);
    // } finally {
    //   setLoading(false);
    // }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 p-4 md:p-8">
      <div className="max-w-4xl mx-auto">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-800 mb-2 flex items-center">
            <span className="bg-blue-500 text-white p-2 rounded-full mr-3">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z"
                />
              </svg>
            </span>
            GloCash
          </h1>
          <p className="text-gray-600">Manage your wallet and transactions</p>
        </div>

        {/* Notifications */}
        {error && (
          <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-6 rounded shadow-md animate-fade-in">
            <p className="font-medium">Error</p>
            <p>{error}</p>
          </div>
        )}

        {success && (
          <div className="bg-green-100 border-l-4 border-green-500 text-green-700 p-4 mb-6 rounded shadow-md animate-fade-in">
            <p className="font-medium">Success</p>
            <p>{success}</p>
          </div>
        )}

        {/* Balance Card */}
        <div className="bg-gradient-to-r from-blue-500 to-indigo-600 rounded-2xl shadow-xl p-6 mb-6 text-white relative overflow-hidden">
          <div className="absolute top-0 right-0 -mt-4 -mr-4 w-32 h-32 bg-white opacity-10 rounded-full"></div>
          <div className="absolute bottom-0 left-0 -mb-4 -ml-4 w-24 h-24 bg-white opacity-10 rounded-full"></div>

          <h2 className="text-lg font-medium mb-2 opacity-90">
            Current Balance
          </h2>
          {loading && balance === null ? (
            <div className="h-12 w-48 bg-white/20 animate-pulse rounded"></div>
          ) : (
            <div className="flex items-baseline">
              <img src={symbol} className="size-10 mx-1" />
              <span className="text-4xl font-bold tracking-tight font-sans">
                <img src="" alt="" />
                {balance !== null ? balance.toFixed(2) : "0.00"}
              </span>
              {/* <span className="ml-2 text-blue-100">INR</span> */}
            </div>
          )}

          <div className="mt-6 flex items-center text-sm">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5 mr-1"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"
              />
            </svg>
            <span>Last updated: {new Date().toLocaleDateString()}</span>
          </div>
        </div>

        {/* Top Up Section */}
        {/* <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">
            Top Up Your Wallet
          </h2>
          <div className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-grow">
              <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">
                $
              </span>
              <input
                type="number"
                value={topUpAmount}
                onChange={(e) => setTopUpAmount(e.target.value)}
                placeholder="Enter amount"
                className="w-full pl-8 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                disabled={loading}
              />
            </div>
            <button
              onClick={handleTopUp}
              className={`px-6 py-3 rounded-lg font-medium transition-all ${
                loading
                  ? "bg-gray-400 text-white cursor-not-allowed"
                  : "bg-blue-500 hover:bg-blue-600 text-white shadow-md hover:shadow-lg transform hover:-translate-y-0.5"
              }`}
              disabled={loading}
            >
              {loading ? (
                <span className="flex items-center justify-center">
                  <svg
                    className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>
                  </svg>
                  Processing...
                </span>
              ) : (
                "Top Up Now"
              )}
            </button>
          </div>
          <div className="mt-4 flex flex-wrap gap-2">
            {[10, 25, 50, 100].map((amount) => (
              <button
                key={amount}
                onClick={() => setTopUpAmount(amount.toString())}
                className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-100 transition-colors"
              >
                ${amount}
              </button>
            ))}
          </div>
        </div> */}

        {/* Transaction History */}
        <div className="bg-white rounded-xl shadow-lg p-6">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">
            Transaction History
          </h2>

          {transactions.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-12 w-12 mx-auto mb-4 text-gray-400"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                />
              </svg>
              <p className="text-lg font-medium">No transactions yet</p>
              <p className="mt-1">Your transaction history will appear here</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="text-left text-gray-500 border-b">
                    <th className="pb-3 font-medium">Type</th>
                    <th className="pb-3 font-medium">Amount</th>
                    <th className="pb-3 font-medium">Date</th>
                    <th className="pb-3 font-medium">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {transactions.map((transaction) => (
                    <tr
                      key={transaction.id}
                      className="border-b border-gray-100 hover:bg-gray-50 transition-colors"
                    >
                      <td className="py-4">
                        <div className="flex items-center">
                          <span
                            className={`w-2 h-2 rounded-full mr-2 ${
                              transaction.amount > 0
                                ? "bg-green-500"
                                : "bg-red-500"
                            }`}
                          ></span>
                          {transaction.type}
                        </div>
                      </td>
                      <td
                        className={`py-4 font-medium font-sans ${
                          transaction.amount > 0
                            ? "text-green-600"
                            : "text-red-600"
                        }`}
                      >
                        {transaction.amount > 0 ? "+" : ""}₹
                        {Math.abs(transaction.amount).toFixed(2)}
                      </td>
                      <td className="py-4 text-gray-600">
                        {new Date(transaction.date).toLocaleDateString()}
                      </td>
                      <td className="py-4">
                        <span className="px-2 py-1 text-xs rounded-full bg-green-100 text-green-800 font-medium">
                          {transaction.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default WalletComponent;
