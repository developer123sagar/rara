import { IoFilter } from "react-icons/io5";
import { AnimatePresence, motion } from "framer-motion";
import { useState } from "react";
import { FaChevronDown, FaChevronUp } from "react-icons/fa";
import { FaLocationDot } from "react-icons/fa6";
import { useAppDispatch } from "@/redux/store";
import { setShowPopUp } from "@/redux/map/mapSlice";

interface CheckBoxProps {
  selectedOption: number;
  setSelectedOption: React.Dispatch<React.SetStateAction<number>>;
  setShowComboOffers: React.Dispatch<React.SetStateAction<boolean>>;
  setShowSpecialPackage: React.Dispatch<React.SetStateAction<boolean>>;
  showComboOffers: boolean;
  showSpecialPackage: boolean;
  comboOfferRef: React.RefObject<HTMLDivElement>;
  specialPackageRef: React.RefObject<HTMLDivElement>;
  setSortByTime: React.Dispatch<React.SetStateAction<boolean>>;
  priceValue: string;
  setPriceValue: React.Dispatch<React.SetStateAction<string>>;
  setFilterOnPrice: React.Dispatch<React.SetStateAction<boolean>>;
}

const Filter = (props: CheckBoxProps) => {
  const [showDropdown, setshowDropdown] = useState(false);
  const toggleMenu = () => {
    setshowDropdown(!showDropdown);
  };

  const dispatch = useAppDispatch();

  return (
    <div className="w-full h-auto py-2  flex items-center flex-col">
      <div className="w-full flex justify-between p-2 mb-2">
        <span className="font-extrabold text-lg">Filters</span>
        <IoFilter title="filter" className="cursor-pointer" size={28} />
      </div>
      <ul
        onClick={() => toggleMenu()}
        className="flex py-2 px-2 bg-gray-100 items-center cursor-pointer justify-between border mt-2 w-[250px] "
      >
        <span className="text-gray-600">Specials</span>
        {showDropdown ? (
          <FaChevronUp className="text-gray-600" />
        ) : (
          <FaChevronDown className="text-gray-600" />
        )}
      </ul>
      <AnimatePresence>
        {showDropdown && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3, type: "just", stiffness: "100" }}
            layout
            className="mt-1 w-[250px]"
          >
            <div
              className="w-full p-2 bg-gray-100  text-gray-600 cursor-pointer"
              onClick={(e) => {
                e.preventDefault();
                if (props.comboOfferRef.current !== null) {
                  const rect =
                    props.comboOfferRef.current.getBoundingClientRect();
                  const targetPosition = window.scrollY + rect.top;
                  window.scrollTo({
                    top: targetPosition,
                    behavior: "smooth",
                  });
                }
              }}
            >
              Combo Offers
            </div>
            <div
              onClick={(e) => {
                e.preventDefault();
                if (props.specialPackageRef.current !== null) {
                  const rect =
                    props.specialPackageRef.current.getBoundingClientRect();
                  const targetPosition = window.scrollY + rect.top;
                  window.scrollTo({
                    top: targetPosition,
                    behavior: "smooth",
                  });
                }
              }}
              className="w-full mt-1 p-2 bg-gray-100  text-gray-600 cursor-pointer"
            >
              Special Package
            </div>
          </motion.div>
        )}
      </AnimatePresence>
      <div
        onClick={() => dispatch(setShowPopUp(true))}
        className="flex gap-2 items-center p-2 bg-gray-100 border border-gray-300  my-2 w-[250px] justify-center cursor-pointer"
      >
        <FaLocationDot size={12} className="text-blue-500" />

        <div className="md:text-[12px] lg:text-[15px] font-bold   ">
          {localStorage.getItem("location")}
        </div>
      </div>
      <ul className="my-2 w-[250px] p-2">
        <li className="flex justify-between my-2">
          <span>Minimum Checkout</span>
          <span>{props.priceValue === "0" ? "0" : props.priceValue}</span>
        </li>

        <input
          value={props.priceValue}
          type="range"
          className="w-[250px] cursor-pointer"
          onChange={(e) => props.setPriceValue!(e.target.value)}
          min={0}
          max={10}
        />
      </ul>
      <button
        onClick={(e) => {
          e.preventDefault();
          props.setFilterOnPrice(true);
        }}
        className="bg-[#dc3545] py-2  border-none w-[250px] text-white"
      >
        Filter
      </button>
    </div>
  );
};

export default Filter;
