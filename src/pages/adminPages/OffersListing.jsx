import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Edit, Trash2, Plus } from "lucide-react";
import Loader from "../../components/common/Loader";
import { showToast } from "../../components/utils/toast";
import { deleteOffer, getOffers } from "../../services/adminApiService";
import { toast } from "react-toastify";

export default function OffersListing() {
  const [offers, setOffers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    fetchOffers();
  }, []);

  const fetchOffers = async () => {
    setIsLoading(true);
    try {
      const response = await getOffers();
      setOffers(Array.isArray(response) ? response : []);
    } catch (error) {
      showToast("error", "Failed to fetch offers");
      console.error("Error fetching offers:", error);
      setOffers([]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleEdit = (offerId) => {
    navigate(`/admin/offers/add`, { state: offerId });
  };

  const handleDelete = async (id) => {
    const confirmDelete = toast(
      <div className="">
        <p>Are you sure you want to delete this Coupon?</p>
        <div className="flex space-x-2">
          <button
            className="bg-green-500 text-white p-2 rounded"
            onClick={async () => {
              toast.dismiss(confirmDelete);
              setIsLoading(true);
              try {
                await deleteOffer(id);
                showToast("success", "Coupon deleted successfully");
                fetchOffers();
              } catch (error) {
                showToast("error", "Failed to delete coupon");
                console.error("Error deleting coupon:", error);
              } finally {
                setIsLoading(false);
              }
            }}
          >
            Yes
          </button>
          <button
            className="bg-red-500 text-white p-2 rounded"
            onClick={() => toast.dismiss(confirmDelete)}
          >
            No
          </button>
        </div>
      </div>,
      { autoClose: false, closeOnClick: false }
    );
  };

  const handleAddNew = () => {
    navigate("/admin/offers/add");
  };

  if (isLoading) return <Loader />;

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="mx-auto max-w-6xl">
        <header className="flex items-center justify-between mb-8">
          <h1 className="text-2xl font-semibold text-gray-800">Offers</h1>
          <button
            onClick={handleAddNew}
            className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 flex items-center gap-2"
          >
            <Plus size={20} />
            Add New Offer
          </button>
        </header>

        {isLoading ? (
          <div className="text-center">Loading...</div>
        ) : offers.length < 1 ? (
          <div className="flex justify-center flex-col items-center gap-4">
            <div className=" text-center text-gray-500">
              No offers Available
            </div>
            <button
              onClick={handleAddNew}
              className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 flex items-center gap-2"
            >
              <Plus size={20} />
              Add New Offer
            </button>
          </div>
        ) : (
          <div className="bg-white shadow-md rounded-lg overflow-hidden">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Offer Name
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Discount
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Start Date
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    End Date
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {offers.map((offer) => (
                  <tr key={offer.id}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {offer.offer_name}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {offer.offer_type === "percentage"
                        ? `${offer.offer_value}%`
                        : `$${offer.offer_value}`}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {new Date(offer.start_date).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {new Date(offer.expiry_date).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                          offer.is_active
                            ? "bg-green-100 text-green-800"
                            : "bg-red-100 text-red-800"
                        }`}
                      >
                        {offer.is_active ? "Active" : "Inactive"}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <button
                        onClick={() => handleEdit(offer.id)}
                        className="text-indigo-600 hover:text-indigo-900 mr-4"
                      >
                        <Edit size={18} />
                      </button>
                      <button
                        onClick={() => handleDelete(offer.id)}
                        className="text-red-600 hover:text-red-900"
                      >
                        <Trash2 size={18} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
