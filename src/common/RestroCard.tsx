/* eslint-disable @typescript-eslint/no-explicit-any */
import { saveRestroId } from "@/redux/restaurant/restaurantSlice";
import { RootState, useAppDispatch, useAppSelector } from "@/redux/store";
import { toggleWishlist } from "@/redux/wishlist/wishlistSlice";
import { baseImgUrl, url } from "@/routes";
import { IRestaurant } from "@/types";
import axios from "axios";
import React from "react";
import { AiOutlineHeart } from "react-icons/ai";
import { FaStar } from "react-icons/fa";
import { IoIosHeart } from "react-icons/io";
import { useNavigate } from "react-router-dom";

const RestroCard = ({
  slideno,
  restro,
  imgSrc,
  address,
  name,
  id,
}: {
  slideno?: number;
  restro?: IRestaurant;
  imgSrc?: string;
  name?: string;
  address?: string;
  id?: string;
}) => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { userToken } = useAppSelector((state: RootState) => state.signin);

  const wishlist = useAppSelector(
    (state: RootState) => state.wishlist.wishlist
  );

  const restroId = restro?._id || id;

  const handleWishlist = async (e: React.MouseEvent) => {
    e.stopPropagation();
    try {
      const res = await axios.put(`${url}/rarawishlist/${restroId}`, null, {
        headers: {
          Authorization: userToken,
        },
      });
      if (res.status === 200) {
        dispatch(toggleWishlist(restroId!));
      }
    } catch (err) {
      console.error("Error updating wishlist:", err);
    }
  };

  return (
    <div
      onClick={() => {
        if (slideno === 0) navigate(`/book_details/${restroId}`);
        else navigate(`/food_details/${restroId}`);
      }}
      className="w-[290px] relative h-[250px] inline-block cursor-pointer p-3 overflow-hidden shadow-1"
    >
      <div onClick={() => dispatch(saveRestroId(restroId))} className="w-96">
        <div className="relative w-full">
          <figure className="h-full w-full">
            <img
              src={`${baseImgUrl}/${restro?.mainImage || imgSrc}`}
              alt={restro?.name}
              className="w-96 object-cover h-[200px] rounded-tr-xl rounded-tl-xl"
            />
          </figure>
          <div className="absolute top-0 w-full items-center">
            <div className="flex justify-between">
              <div className="bg-white w-60 py-1 rounded-br-xl flex items-center justify-center">
                <h1 className="font-semibold">{restro?.address || address}</h1>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="w-[280px] absolute bottom-0 right-0-0 bg-gray-900">
        <div>
          <h1 className="font-bold text-yellow-600 flex z-60 flex-row px-3">
            <FaStar />
            <FaStar />
            <FaStar />
            <FaStar />
            <FaStar className="opacity-100" />
          </h1>
        </div>
        <div className="flex justify-between items-center px-3 py-2 mt-2 bg-white w-full">
          <div className="w-fit">
            <h1 className="font-extrabold text-black">
              {restro?.name || name}
            </h1>
            {restro?.features && (
              <div className="flex overflow-hidden gap-x-4">
                {restro?.features.slice(0, 2).map((feature) => (
                  <p key={feature} className="text-gray-500 text-sm">
                    {feature}
                  </p>
                ))}
              </div>
            )}
          </div>
          <div>
            {restro?.vegetarian ? (
              <img src="/vegg.png" alt="veg" className="w-8" />
            ) : (
              <img src="/nonveg.png" alt="non veg" className="w-8" />
            )}
          </div>
        </div>
      </div>
      <div className="absolute top-4 right-0 w-8 h-8 text-white font-bolder bg-opacity-50 transition duration-500 opacity-100 hover:opacity-100 cursor-pointer">
        {wishlist.includes(restroId!) ? (
          <IoIosHeart color="red" size={28} onClick={handleWishlist} />
        ) : (
          <AiOutlineHeart size={28} onClick={handleWishlist} />
        )}
      </div>
    </div>
  );
};

export default RestroCard;
