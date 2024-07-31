import { Download } from "@/constants";
import { FaCheck } from "react-icons/fa";

const DownloadAPP1 = () => {
  return (
    <>
      <div className="hidden lg:block w-screen my-32 relative">
        <div className="absolute -left-16 2xl:left-12 top-1 z-30 flex items-center  w-fit">
          <img src="../img/Home/phone.png" alt="" className="" />
          <img
            loading="lazy"
            src="/logo.png"
            alt="logo"
            className="w-32 absolute left-[35%] z-30"
          />
        </div>
        <figure className="absolute -top-8 right-[8%] z-10 w-full flex items-center justify-end">
          <img
            src="https://live.staticflickr.com/7348/13106562225_d06ed36047_b.jpg"
            alt=""
            className="rounded-full w-40 h-40 "
          />
        </figure>
        <div className="clip-path h-[15rem] border lg:h-[27rem] bg-[#e01f2d] w-[95%] mx-auto">
          <div className="max-w-[70%] 2xl:max-w-[70%] flex flex-col gap-5 items-center justify-center mt-12">
            <h1 className="text-white text-5xl lg:font-extrabold font-serif mt-20">
              Download <br />
              Our Mobile App
            </h1>
            <div className="flex justify-center mt-4 z-50 gap-2">
              <img
                src="https://img.freepik.com/free-photo/painting-representing-krishna_23-2151073044.jpg?t=st=1714118093~exp=1714121693~hmac=29cd4a1d64ccf1c48a1e9f5c8e01aa8b97b5bd0d67e9df8896b3d690a022648f&w=1380"
                alt="pp"
                className="rounded-full h-12 border lg:h-16 lg:w-16"
              />
              <img
                src="https://img.freepik.com/free-vector/businessman-character-avatar-isolated_24877-60111.jpg?t=st=1714118175~exp=1714121775~hmac=8563c541dbcdb84a1d177a35fb2fbbcd7de249deeef3f49a9a944eae83981878&w=740"
                alt="pp"
                className="rounded-full h-14 border  lg:h-16 lg:w-16"
              />
              <img
                src="https://img.freepik.com/free-vector/businessman-character-avatar-isolated_24877-60111.jpg?t=st=1714118175~exp=1714121775~hmac=8563c541dbcdb84a1d177a35fb2fbbcd7de249deeef3f49a9a944eae83981878&w=740"
                alt="pp"
                className="rounded-full h-14 border  lg:h-16 lg:w-16"
              />
              <img
                src="https://img.freepik.com/free-vector/businessman-character-avatar-isolated_24877-60111.jpg?t=st=1714118175~exp=1714121775~hmac=8563c541dbcdb84a1d177a35fb2fbbcd7de249deeef3f49a9a944eae83981878&w=740"
                alt="pp"
                className="rounded-full h-14 border  lg:h-16 lg:w-16"
              />
              <img
                src="https://img.freepik.com/free-vector/businessman-character-avatar-isolated_24877-60111.jpg?t=st=1714118175~exp=1714121775~hmac=8563c541dbcdb84a1d177a35fb2fbbcd7de249deeef3f49a9a944eae83981878&w=740"
                alt="pp"
                className="rounded-full h-14 border mr-10 lg:mr-20 lg:h-16 lg:w-16"
              />
            </div>
          </div>
          <div className=" absolute -bottom-12 right-[10%] 2xl:right-[20%] flex gap-5">
            <div className="w-40 h-60 flex items-center justify-center mt-24 rounded-t-full bg-white">
              <button className="px-2 flex items-center gap-3 h-12 w-[130px] text-black bg-gray-200 font-bold rounded">
                <span className="icon">
                  <svg
                    fill="currentcolor"
                    viewBox="-52.01 0 560.035 560.035"
                    xmlns="http://www.w3.org/2000/svg"
                    stroke="#ffffff"
                  >
                    <g id="SVGRepo_bgCarrier" strokeWidth="0"></g>
                    <g
                      id="SVGRepo_tracerCarrier"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    ></g>
                    <g id="SVGRepo_iconCarrier">
                      <path d="M380.844 297.529c.787 84.752 74.349 112.955 75.164 113.314-.622 1.988-11.754 40.191-38.756 79.652-23.343 34.117-47.568 68.107-85.731 68.811-37.499.691-49.557-22.236-92.429-22.236-42.859 0-56.256 21.533-91.753 22.928-36.837 1.395-64.889-36.891-88.424-70.883-48.093-69.53-84.846-196.475-35.496-282.165 24.516-42.554 68.328-69.501 115.882-70.192 36.173-.69 70.315 24.336 92.429 24.336 22.1 0 63.59-30.096 107.208-25.676 18.26.76 69.517 7.376 102.429 55.552-2.652 1.644-61.159 35.704-60.523 106.559M310.369 89.418C329.926 65.745 343.089 32.79 339.498 0 311.308 1.133 277.22 18.785 257 42.445c-18.121 20.952-33.991 54.487-29.709 86.628 31.421 2.431 63.52-15.967 83.078-39.655"></path>
                    </g>
                  </svg>
                </span>

                <span className="flex flex-col">
                  <span className="text-[12px]">App Store</span>
                </span>
              </button>
            </div>
            <div className="w-40 h-60 left-40 flex flex-col mt-24 items-center justify-center rounded-t-full bg-white">
              <button className="px-2 flex items-center gap-3 h-12 w-[130px] bg-gray-200 text-black font-bold rounded">
                <img
                  src="/img/Home/GooglePlay.png"
                  alt="googleplay"
                  className="w-6 "
                />

                <span className="flex flex-col ">
                  <span className="text-[12px]">Google Play</span>
                </span>
              </button>
            </div>
          </div>
        </div>
      </div>
      <div className=" mt-16 lg:mt-28 h-[540px] md:h-[600px]  relative w-[95%] mx-auto">
        <div className="absolute bg-white ">
          <div className="flex flex-col lg:flex-row  gap-2  ">
            <div className="relative lg:block  w-full  px-4 lg:w-6/12 xl:w-5/12 ">
              <figure className="flex  ">
                <img
                  src="/loginbg.jpg"
                  alt="food"
                  className=" object-cover mb-5 h-[29rem] w-full "
                />
              </figure>
            </div>
            <div className="w-full  px-4 lg:w-6/12">
              <h1 className="text-black font-semibold text-[24px] md:text-xl mb-3">
                Get Your own Online <br /> Food Ordering App and Website
              </h1>
              <p className="mt-4 text-[#696969] text-base text-justify mb-4">
                "Seamlessly incorporate our restaurant's online ordering system
                to embrace the future. Our robust online ordering software is
                designed to meet your needs with excellence."
              </p>
              {Download.map((item, index) => (
                <div className="flex gap-4 mb-2" key={index}>
                  <h1 className="flex items-center justify-center rounded-full w-10 h-10 shadow-inner font-bold">
                    <FaCheck size={20} color="green" />
                  </h1>
                  <li className="list-none text-black font-semibold text-base">
                    {item.title}
                  </li>
                </div>
              ))}
              <div className="flex gap-4 mt-4 ">
                <button className="px-2 flex items-center  gap-3 h-12 w-[130px] bg-white admin-header opacity-90 text-black font-bold rounded">
                  <img
                    src="/img/Home/GooglePlay.png"
                    alt="googleplay"
                    className="w-6 "
                  />

                  <span className="flex flex-col ">
                    <span className="text-[12px]">Google Play</span>
                  </span>
                </button>
                <button className="px-2 flex items-center gap-3 h-12 w-[130px] admin-header opacity-90 text-black bg-white font-bold rounded">
                  <span className="icon">
                    <svg
                      fill="currentcolor"
                      viewBox="-52.01 0 560.035 560.035"
                      xmlns="http://www.w3.org/2000/svg"
                      stroke="#ffffff"
                    >
                      <g id="SVGRepo_bgCarrier" strokeWidth="0"></g>
                      <g
                        id="SVGRepo_tracerCarrier"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      ></g>
                      <g id="SVGRepo_iconCarrier">
                        <path d="M380.844 297.529c.787 84.752 74.349 112.955 75.164 113.314-.622 1.988-11.754 40.191-38.756 79.652-23.343 34.117-47.568 68.107-85.731 68.811-37.499.691-49.557-22.236-92.429-22.236-42.859 0-56.256 21.533-91.753 22.928-36.837 1.395-64.889-36.891-88.424-70.883-48.093-69.53-84.846-196.475-35.496-282.165 24.516-42.554 68.328-69.501 115.882-70.192 36.173-.69 70.315 24.336 92.429 24.336 22.1 0 63.59-30.096 107.208-25.676 18.26.76 69.517 7.376 102.429 55.552-2.652 1.644-61.159 35.704-60.523 106.559M310.369 89.418C329.926 65.745 343.089 32.79 339.498 0 311.308 1.133 277.22 18.785 257 42.445c-18.121 20.952-33.991 54.487-29.709 86.628 31.421 2.431 63.52-15.967 83.078-39.655"></path>
                      </g>
                    </svg>
                  </span>

                  <span className="flex flex-col">
                    <span className="text-[12px]">App Store</span>
                  </span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default DownloadAPP1;
