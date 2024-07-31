import { Link } from "react-router-dom";
import { CustomIcon, Drawer } from ".";
import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import {
  addCheckoutCartDatas,
  removeBanquetData,
  removeItem,
  setCheckoutBanquetCartDatas,
} from "@/redux/cart/cartSliice";
import { AiFillDelete } from "react-icons/ai";
import { RootState, useAppDispatch, useAppSelector } from "@/redux/store";
import Buttons from "./Button";
import { RxCross1 } from "react-icons/rx";
import { baseImgUrl } from "@/routes";
import { GroupedCartData, IcartDatas } from "@/types";

export default function Cart() {
  const trigger = useRef<HTMLDivElement>(null);
  const dropdown = useRef<HTMLDivElement>(null);

  const [isBanquetCartOpen, setIsBanquetCartOpen] = useState(false);
  const { userToken } = useAppSelector((state: RootState) => state.signin);
  const {
    cartDatas,
    checkoutCartDatas,
    banquetCartDatas,
    checkoutBanquetCartDatas,
  } = useAppSelector((state: RootState) => state.cart);
  const { restaurantData } = useAppSelector(
    (state: RootState) => state.restaurant
  );

  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [showCartRestro, setShowCartRestro] = useState(false);
  const closeDrawer = () => {
    setIsDrawerOpen(false);
    setIsBanquetCartOpen(false);
  };
  const totalPriceOfCart = checkoutCartDatas.reduce(
    (sum, item) => sum + calculateTotalPrice(item),
    0
  );
  function calculateTotalPrice(foodItem: IcartDatas) {
    const foodPrice = foodItem.price * foodItem.minQuantity || 0;
    const addonPrices = foodItem.addon
      ? foodItem.addon.map((addon) => addon.extraPrice * addon.quantity || 0)
      : [];
    const totalAddonPrice = addonPrices.reduce((sum, price) => sum + price, 0);
    return foodPrice + totalAddonPrice;
  }
  const dispatch = useAppDispatch();
  const totalQuantity = cartDatas?.reduce(
    (acc, food) => acc + food.minQuantity,
    0
  );

  const groupedCartDatas: GroupedCartData = cartDatas?.reduce((acc, item) => {
    const restaurantName: string = item.restaurantName;

    if (!acc[restaurantName]) {
      acc[restaurantName] = [item];
    } else {
      acc[restaurantName].push(item);
    }
    return acc;
  }, {} as GroupedCartData);

  const firstArrays = Object.values(groupedCartDatas).map((arr) => arr[0]);

  const haldeOpenCart = (cartDatas: IcartDatas[]) => {
    setIsDrawerOpen(true);
    setIsBanquetCartOpen(false);
    dispatch(addCheckoutCartDatas(cartDatas));
  };

  const handleBanquetCartOpen = (banquetCartData: any) => {
    setIsDrawerOpen(true);
    setIsBanquetCartOpen(true);
    dispatch(setCheckoutBanquetCartDatas(banquetCartData));
  };

  // close on click outside
  useEffect(() => {
    const clickHandler = ({ target }: MouseEvent) => {
      if (!dropdown.current) return;
      if (
        !showCartRestro ||
        dropdown.current.contains(target as Node) ||
        (trigger.current && trigger.current.contains(target as Node))
      )
        return;
      setShowCartRestro(false);
    };
    document.addEventListener("click", clickHandler);
    return () => document.removeEventListener("click", clickHandler);
  });

  const banquetRestro = restaurantData?.find(
    (restro) => restro?._id === checkoutBanquetCartDatas?.restaurant
  );

  return (
    <div>
      <div className="cursor-pointer ">
        {userToken &&
          (firstArrays?.length > 0 || banquetCartDatas?.length > 0) && (
            <div className=" z-50 flex flex-col gap-4 items-center  mx-2">
              <div ref={trigger} className="relative">
                <img
                  src="/carts.svg"
                  alt="Shopping Cart"
                  className="relative top-3"
                  style={{ width: "30px", height: "30px" }}
                  onClick={() => setShowCartRestro(!showCartRestro)}
                />

                {totalQuantity > 0 && (
                  <div className="absolute -top-1 -right-3 rounded-full flex items-center justify-center w-7 h-7 text-sm bg-opacity-90 text-emerald-800">
                    <motion.span>{totalQuantity}</motion.span>
                  </div>
                )}
              </div>
            </div>
          )}
      </div>
      {showCartRestro &&
        (firstArrays?.length > 0 || banquetCartDatas?.length > 0) && (
          <div
            ref={dropdown}
            className="absolute bg-white rounded-lg w-[420px] shadow-xl border top-[4rem] right-1 flex flex-col"
          >
            {firstArrays.map((restro, id) => (
              <div
                onClick={() =>
                  haldeOpenCart(groupedCartDatas[restro.restaurantName])
                }
                key={restro._id + id}
                className="flex  justify-between cursor-pointer items-center border-b border-gray-200 hover:bg-gray-100/70 px-4 py-2"
              >
                <div className="flex items-center gap-2">
                  <img
                    src={`${baseImgUrl}/${restro.restaurantLogo}`}
                    alt={restro.restaurantName}
                    className="w-12 h-12 rounded-full object-cover border border-gray-300"
                  />
                  <span className="font-bold text-xl">
                    {restro.planName || restro.restaurantName}
                  </span>
                </div>
                <div className="text-sm font-bold  bg-emerald-600 h-10 w-10 rounded-full flex items-center justify-center text-white">
                  <span>
                    {groupedCartDatas[restro.restaurantName]?.reduce(
                      (acc, food) => acc + food.minQuantity,
                      0
                    )}
                  </span>
                </div>
              </div>
            ))}
            {banquetCartDatas &&
              banquetCartDatas?.length > 0 &&
              banquetCartDatas.map((item, id: number) => (
                <div
                  key={item._id + id}
                  onClick={() => handleBanquetCartOpen(item)}
                  className="flex justify-between cursor-pointer items-center border-b border-gray-200 hover:bg-gray-100/70 px-4 py-2"
                >
                  {item.plan}
                </div>
              ))}
          </div>
        )}

      <Drawer
        isOpen={isDrawerOpen}
        setIsOpen={setIsDrawerOpen}
        position="right"
        xValue={400}
        width="400px"
      >
        <div className="flex items-center justify-between py-3 px-5 bg-gray-300/30 bg-opacity-80">
          <h1 className="text-2xl text-[#292727]">My Cart</h1>
          <span
            onClick={closeDrawer}
            className="w-[2rem] h-[2rem] rounded-full bg-[#fff]  hover:bg-gray-600 transition duration-700 flex items-center justify-center shadow-xl cursor-pointer"
          >
            <div>
              <RxCross1 />
            </div>
          </span>
        </div>
        {isBanquetCartOpen && checkoutBanquetCartDatas && (
          <div className="px-4 py-2">
            <div className="flex justify-between items-center">
              <div className="flex items-center gap2">
                <img
                  src={`${baseImgUrl}/${banquetRestro?.logo}`}
                  alt={banquetRestro?.name}
                  className="w-12 h-12 rounded-full object-cover border border-gray-300"
                />
                <span className="font-bold text-xl">{banquetRestro?.name}</span>
              </div>
              <CustomIcon
                icon={AiFillDelete}
                onClick={() => {
                  dispatch(removeBanquetData(checkoutBanquetCartDatas?._id));
                  setIsDrawerOpen(false);
                }}
                className="hover:cursor-pointer hover:text-red-500"
                size={24}
              />
            </div>
            <div className="text-xl my-4 flex justify-between">
              <span>{checkoutBanquetCartDatas.plan}</span>

              <span className="text-emerald-400">
                AUD {checkoutBanquetCartDatas.price}
              </span>
            </div>
            <div className="bg-[#e01f2d] py-3 px-4 flex justify-center mt-10 items-center text-white">
              <Link to="/cart/order?isBanquet=true">
                <button className="border border-white py-1 px-8">
                  View Details
                </button>
              </Link>
            </div>
          </div>
        )}
        {!isBanquetCartOpen && totalQuantity > 0 && checkoutCartDatas ? (
          <div>
            <div className="flex gap-2 items-center border-b shadow-md border-gray-300 py-2 px-2">
              <img
                src={`${baseImgUrl}/${checkoutCartDatas[0]?.restaurantLogo}`}
                alt={checkoutCartDatas[0]?.restaurantName}
                className="w-12 h-12 rounded-full object-cover"
              />
              <h1 className="font-bold text-xl capitalize">
                {checkoutCartDatas[0]?.restaurantName}
              </h1>
            </div>
            <ul className="py-2 overflow-hidden">
              <AnimatePresence initial={false}>
                {checkoutCartDatas?.map((item, id) => (
                  <motion.li
                    layout
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{
                      opacity: { duration: 0.3 },
                      height: { duration: 0.3 },
                    }}
                    key={`${item._id}${id}`}
                    className="relative pl-4 pr-2 hover:bg-gray-100/80"
                  >
                    <div className="flex py-3 items-center justify-between border-b pb-2 group border-gray-200">
                      <div className="flex gap-6 items-center">
                        <div className="font-medium">
                          <span className="text-lggroup-hover:text-[#F3723B] hover:cursor-pointer transition duration-400">
                            <span className="text-[15px]">
                              {" "}
                              {item.minQuantity}{" "}
                            </span>
                            {item.name}
                            <span className="text-xs font-bold">
                              {" "}
                              (AUD{item.price.toFixed(2)})
                            </span>
                          </span>
                          <ul className="text-xs flex flex-col gap-2 h-fit">
                            {item.addon.map((item) => (
                              <div key={item._id}>
                                <li>
                                  <span className="text-gray-600">
                                    {item.quantity} {item.name} &nbsp;{" "}
                                  </span>
                                  <span className="font-bold">
                                    +(AUD{item.extraPrice.toFixed(2)})
                                  </span>
                                </li>
                              </div>
                            ))}
                          </ul>
                        </div>
                      </div>
                      {item.planName && (
                        <span className="text-xs">{item.planName}</span>
                      )}
                      <p className="mt-5">
                        AUD{" "}
                        {(
                          item.total +
                          (item?.addon?.reduce(
                            (acc, currentAddon) =>
                              acc +
                              currentAddon.extraPrice * currentAddon.quantity,
                            0
                          ) || 0)
                        ).toFixed(2)}
                      </p>
                      <CustomIcon
                        icon={AiFillDelete}
                        onClick={() => dispatch(removeItem(item))}
                        className="absolute top-1 right-2 hover:cursor-pointer hover:text-red-500"
                        size={16}
                      />
                    </div>
                  </motion.li>
                ))}
              </AnimatePresence>
            </ul>

            <div className="bg-[#e01f2d] py-3 px-4 mt-10 flex justify-between items-center text-white">
              <span className="px-3 py-1 border border-white">
                {checkoutCartDatas?.reduce(
                  (acc, food) => acc + food.minQuantity,
                  0
                )}
              </span>
              <Link to="/cart/order">
                <button className="border border-white py-1 px-8">
                  View Details
                </button>
              </Link>
              <p>AUD {totalPriceOfCart.toFixed(2)}</p>
            </div>
          </div>
        ) : (
          <>
            {!isBanquetCartOpen && (
              <div className="w-full  h-full flex justify-center flex-col  lg:gap-4 items-center my-5">
                <p className="text-3xl font-medium">Your Cart is empty</p>
                <img
                  className="w-[400px] h-[350px]  object-contain"
                  src="/img/empty_cart.gif "
                  alt="shop now"
                />
                <div>
                  <Link to={"/rest_details/noId"}>
                    <Buttons>Go to Shop</Buttons>
                  </Link>
                </div>
              </div>
            )}
          </>
        )}
      </Drawer>
    </div>
  );
}
