/* eslint-disable @typescript-eslint/no-explicit-any */
import { ToggleBtn, Upload } from "@/common";
import { ViewInputField } from "@/dashboard/component/viewRoute/ViewInputField";
import { RootState, useAppSelector } from "@/redux/store";
import { url } from "@/routes";
import { IRestaurant } from "@/types";
import axios from "axios";
import { useEffect, useState, useMemo } from "react";
import StripeContainer from "@/components/StripeContainer";
import RestroCard from "@/common/RestroCard";
import toast from "react-hot-toast";
import { EditInput } from "@/dashboard/component/EditRoute/EditInput";

const CreateAds = () => {
  const [noticeSelected, setNoticeSelected] = useState(false);
  const [price, setPrice] = useState(2.9);
  const [formData, setFormData] = useState<any>({
    image: "",
    paymentToken: "",
  });
  const [paymentLoading, setPaymentLoading] = useState(false);
  const [loading, setLoading] = useState(false);
  const [noticeImage, setNoticeImage] = useState({ img: "" });
  const [noticeTitle, setNoticeTitle] = useState("");
  const [noticeDetails, setNoticeDetails] = useState("");

  const [datas, setDatas] = useState<IRestaurant>();
  const menuImg = useMemo(() => datas?.mainImage || "", [datas?.mainImage]);
  const { token } = useAppSelector((state: RootState) => state.signin);

  useEffect(() => {
    const getInfo = async () => {
      try {
        const res = await axios.get(`${url}/rararestaurant/info`, {
          headers: {
            Authorization: token,
          },
        });
        setDatas(res.data?.Data);
      } catch (err) {
        throw err;
      }
    };

    getInfo();
  }, [token]);

  const handlePayment = async (paymentToken?: string) => {
    setLoading(true);

    const updatedForm = { ...formData };
    if (updatedForm.image === "") {
      updatedForm.image = menuImg;
    }

    if (paymentToken) updatedForm.paymentToken = paymentToken || "";

    if (noticeSelected) {
      updatedForm.sendNotice = true;
      updatedForm.noticeImage = noticeImage.img;
      updatedForm.noticetitle = noticeTitle;
      updatedForm.Detail = noticeDetails;
    }

    try {
      const res = await axios.post(
        `${url}/raraadvertisement/stripe_payment`,
        updatedForm,
        {
          headers: {
            Authorization: token,
          },
        }
      );

      if (res.status === 200) {
        toast.success("Successfully created");
      }
    } catch (err: any) {
      toast.error(err.response.data.msg || "Error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (noticeSelected) {
      setPrice(4.8);
    } else {
      setPrice(2.9);
    }
  }, [noticeSelected]);

  return (
    <div className="mt-16">
      <h1 className="text-[#333333] font-extrabold text-3xl">
        Run a Sponsored Listing
      </h1>
      <p>Boost Your Restaurant Visibility</p>
      <div className="flex mt-10 gap-10">
        <div className="border border-gray-200 basis-[100%]">
          <div className="mx-8 mt-4 mb-10">
            <h1 className="text-[#333333] font-extrabold text-3xl">
              Review Selections
            </h1>
            <p className="text-[#555555] text-lg">
              Your ad campaign will run immediately within store house
            </p>
            <form className="mt-4 flex flex-col gap-2">
              <ViewInputField label="Bidding Amount" value={price} />
              <div>
                <label className="font-bold">Upload Image</label>
                <Upload
                  fieldName="image"
                  imgTitle="advertisement"
                  setForm={setFormData}
                  accept=".jpg,.png"
                  showImage={false}
                />
              </div>

              <div className="mt-4">
                <h1 className="text-[#555555] mb-3 font-bold">
                  This ad will be displayed to customers in your delivery radius
                  throughout the campiagn's duration.You'll be only charged with
                  customer click on your ad,and any spend will be deducted your
                  payout.{" "}
                </h1>
                <div className="flex gap-3">
                  <input type="checkbox" name="" id="" />
                  <h1 className="font-bold">
                    I accept the
                    <span className="text-green-500">
                      &nbsp;Terms and Conditions
                    </span>
                  </h1>
                </div>

                <div className="my-5 flex items-center gap-2">
                  <ToggleBtn
                    isOn={noticeSelected}
                    toggleName="notice"
                    onToggle={() => setNoticeSelected(!noticeSelected)}
                  />
                  <span>Select Notice</span>
                </div>

                {noticeSelected && (
                  <div className="my-3 flex flex-col gap-4">
                    <EditInput
                      label="Notice Title"
                      basis={48}
                      value={noticeTitle}
                      onChange={(e) => setNoticeTitle(e.target.value)}
                    />
                    <EditInput
                      label="Notice Details"
                      basis={48}
                      value={noticeDetails}
                      onChange={(e) => setNoticeDetails(e.target.value)}
                    />
                    <div className="flex flex-wrap gap-4 w-full">
                      <div className="basis-[30%]">
                        <h1
                          className={`text-[black] font-semibold text-[14px] mb-2`}
                        >
                          Notice Photo
                        </h1>
                        <div>
                          <Upload
                            accept=".jpg,.png,.svg"
                            fieldName="img"
                            imgTitle="category"
                            setForm={setNoticeImage}
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                <StripeContainer
                  handleSubmit={handlePayment}
                  lodingStripePayment={paymentLoading || loading}
                  setLoadingStripePayment={setPaymentLoading || setLoading}
                />
              </div>
            </form>
          </div>
        </div>

        {/* 2nd part */}
        <div className=" h-96 basis-[80%]">
          <div className="w-[290px] inline-block cursor-pointer relative p-3 overflow-hidden">
            <RestroCard
              imgSrc={formData.image || menuImg}
              address={datas?.address || "Town planning"}
              name={datas?.name || ""}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreateAds;
