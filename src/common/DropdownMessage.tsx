/* eslint-disable @typescript-eslint/no-explicit-any */
import { fetchIndvRestInfo } from "@/redux/restaurant/restaurantSlice";
import { RootState, useAppDispatch, useAppSelector } from "@/redux/store";
import { baseImgUrl } from "@/routes";
import { chatMessageType, chatUserType } from "@/types";
import { useEffect, useRef, useState } from "react";
import { FaRegMessage } from "react-icons/fa6";
import { Link, useNavigate } from "react-router-dom";

interface DropDownMsg {
  message: chatMessageType[];
  chatUser: chatUserType[];
}

const DropdownMessage = ({ message, chatUser }: DropDownMsg) => {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dispatch = useAppDispatch();
  const trigger = useRef<any>(null);
  const dropdown = useRef<any>(null);
  const { token } = useAppSelector((state: RootState) => state.signin);

  const { restInfo } = useAppSelector((state: RootState) => state.restaurant);

  useEffect(() => {
    dispatch(fetchIndvRestInfo(token));
  }, [dispatch, token]);

  // close on click outside
  useEffect(() => {
    const clickHandler = ({ target }: MouseEvent) => {
      if (!dropdown.current) return;
      if (
        !dropdownOpen ||
        dropdown.current.contains(target) ||
        trigger.current.contains(target)
      )
        return;
      setDropdownOpen(false);
    };
    document.addEventListener("click", clickHandler);
    return () => document.removeEventListener("click", clickHandler);
  });

  // close if the esc key is pressed
  useEffect(() => {
    const keyHandler = ({ keyCode }: KeyboardEvent) => {
      if (!dropdownOpen || keyCode !== 27) return;
      setDropdownOpen(false);
    };
    document.addEventListener("keydown", keyHandler);
    return () => document.removeEventListener("keydown", keyHandler);
  });

  const navigate = useNavigate();

  return (
    <li className="relative" x-data="{ dropdownOpen: false, notifying: true }">
      <Link
        ref={trigger}
        onClick={() => setDropdownOpen(!dropdownOpen)}
        className="relative flex h-8.5 w-8.5 items-center justify-center rounded-full border-[0.5px] border-stroke bg-gray hover:text-primary dark:border-strokedark dark:bg-meta-4 dark:text-white"
        to="#"
      >
        <span className="absolute -top-0.5 -right-0.5 z-1 h-2 w-2 rounded-full bg-meta-1">
          <span className="absolute -z-1 inline-flex h-full w-full animate-ping rounded-full bg-meta-1 opacity-75"></span>
        </span>

        <FaRegMessage size={20} color="red" />
      </Link>
      <div
        ref={dropdown}
        onFocus={() => setDropdownOpen(true)}
        onBlur={() => setDropdownOpen(false)}
        className={`absolute -right-16 mt-2.5 flex h-90 w-75 flex-col rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark sm:right-0 sm:w-80 ${
          dropdownOpen === true ? "block" : "hidden"
        }`}
      >
        <div className="px-4.5 py-3">
          <h5 className="text-base text-gray-900 font-bold">New Messages</h5>
        </div>

        <ul className="flex h-auto flex-col overflow-y-auto">
          {message &&
            message?.map((item) => {
              if (!item) return null;

              const user = chatUser?.find(
                (user) => user?.members[0]?._id === item?.senderId
              );
              return (
                <li
                  onClick={() => navigate("/dashboard/restaurant/chat")}
                  key={item._id}
                  className="flex justify-between relative border-t border-stroke px-4.5 hover:bg-gray-2 cursor-pointer"
                >
                  <h1 className="text-sm">{item.content}</h1>
                  <div className="flex w-[90px] flex-col items-end justify-center gap-2">
                    {!user ? (
                      <img
                        src={`${baseImgUrl}/${restInfo?.mainImage}`}
                        alt="restro"
                        className="w-6 h-6 rounded-full object-cover"
                      />
                    ) : (
                      <img
                        src={`${baseImgUrl}/${user?.members[0]?.photo}`}
                        alt={user?.members[0]?.name}
                        className="w-6 h-6 rounded-full object-cover"
                      />
                    )}
                    <span className="text-xs font-bold ">
                      {user?.members[0]?.name || "You"}
                    </span>
                  </div>
                </li>
              );
            })}
        </ul>
      </div>
    </li>
  );
};

export default DropdownMessage;
