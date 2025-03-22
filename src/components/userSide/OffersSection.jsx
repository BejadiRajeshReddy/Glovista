import React from "react";

const OffersSection = ({ availableOffers, appliedOffer, handleApplyOffer }) => {
  return (
    <div className="bg-white p-6 rounded-lg shadow-sm border">
      <h2 className="text-xl font-medium mb-6">Offers </h2>

      {availableOffers.length > 0 ? (
        <div className="space-y-4">
          <div className="flex gap-4 items-center w-full">
            {availableOffers.map((offer, i) => (
              <div
                key={offer.id}
                className=" border  border-gray-400 px-3 py-4 rounded-md w-1/4"
              >
                <div className={`flex items-center justify-between `}>
                  <p className="font-medium px-2 py-1 rounded-md text-black border bg-gray-300">
                    {offer.offer_code}
                  </p>
                  {appliedOffer ? (
                    <button
                      onClick={() => handleApplyOffer(offer)}
                      disabled
                      className="bg-transparent text-sm text-gray-300 p-2 rounded-md hover:bg-gray-50"
                    >
                      Apply
                    </button>
                  ) : (
                    <button
                      onClick={() => handleApplyOffer(offer)}
                      className="bg-transparent text-sm text-green-500 hover:text-green-700 p-2 rounded-md hover:bg-green-50"
                    >
                      Apply
                    </button>
                  )}
                </div>
                <div className="text-sm mt-2">
                  {" "}
                  Save {offer.offer_value}{" "}
                  {offer.offer_type === "percentage"
                    ? offer.offer_type
                    : offer.offer_type + " amount"}
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <>
          <div className="border border-gray-400 bg-gray-200 rounded-md px-4 sm:px-6 py-3 gap-2 flex items-center">
            <p className="text-2xl text-gray-500">&#x1F6C8;</p>
            <p className="text-sm sm:text-base">No Available offers found</p>
          </div>
        </>
      )}
    </div>
  );
};

export default OffersSection;
