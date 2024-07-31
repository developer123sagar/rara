/* eslint-disable @typescript-eslint/no-explicit-any */
import axios from "axios";
import { Spinner, Upload } from "@/common";
import { RootState, useAppSelector } from "@/redux/store";
import { url } from "@/routes";
import { FormEvent, useState } from "react";
import { FormBooking } from "@/types";
import Buttons from "@/common/Button";
import NameMark from "@/common/NameMark";
import { EditInput } from "@/dashboard/component/EditRoute/EditInput";
import toast from "react-hot-toast";

const CreateTable = () => {
  const [loading, setLoading] = useState(false);
  const [tableImage, setTableImage] = useState({ image: "" });

  const { token } = useAppSelector((state: RootState) => state.signin);

  const [form, setForm] = useState<FormBooking>({
    isBookingOpen: true,
    table: [
      {
        bookingamount: null,
        image: "",
        number_of_seats: null,
        tableNo: "",
      },
    ],
  });

  const handleFormSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const updatedForm = { ...form };
    updatedForm.table[0].image = tableImage.image;
    try {
      const res = await axios.post(`${url}/raratable/add_table`, updatedForm, {
        headers: {
          Authorization: token,
        },
      });
      if (res.status === 201) {
        toast.success("Successfully created");
      }
    } catch (err: any) {
      if (
        err.response.data.msg ===
        "booking restaurant is already created through this restaurant. Please use diffrent restaurant"
      ) {
        try {
          const res = await axios.post(
            `${url}/raratable/add_newtable`,
            updatedForm,
            {
              headers: {
                Authorization: token,
              },
            }
          );
          if (res.status === 201) {
            toast.success("Successfully created");
          }
        } catch (err) {
          console.log(err)
          toast.error("something went wrong");
          throw err;
        }
      }
    } finally {
      setLoading(false);
    }
  };

  const heading = "text-[black]  font-semibold text-[14px] mb-2";

  const isAuthorized = localStorage.getItem("authorized") === "true" || false;

  return (
    <div className="w-full">
      <NameMark label="Add Table" variant="secondary" />
      {isAuthorized && (
        <form>
          <div className="my-5 flex gap-8 flex-wrap justify-between">
            <EditInput
              label="Table Number"
              basis={48}
              type="text"
              value={form.table[0].tableNo}
              onChange={(e) =>
                setForm({
                  ...form,
                  table: [{ ...form.table[0], tableNo: e.target.value }],
                })
              }
            />
            <EditInput
              label="Booking Amount"
              basis={48}
              type="number"
              value={form.table[0].bookingamount as number}
              onChange={(e) =>
                setForm({
                  ...form,
                  table: [
                    {
                      ...form.table[0],
                      bookingamount: e.target.value,
                    },
                  ],
                })
              }
            />
            <EditInput
              label="Number of seat"
              basis={48}
              type="number"
              min={1}
              value={form.table[0].number_of_seats as number}
              onChange={(e) =>
                setForm({
                  ...form,
                  table: [
                    {
                      ...form.table[0],
                      number_of_seats: parseInt(e.target.value),
                    },
                  ],
                })
              }
            />

            <div className="flex flex-wrap gap-4 w-full my-4">
              <div className="basis-[30%]">
                <h1 className={`${heading}`}>Table Image</h1>
                <div>
                  <Upload
                    fieldName="image"
                    imgTitle="table"
                    setForm={setTableImage}
                    accept=".jpg,.png,.svg"
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="mt-6 flex justify-end gap-10 mb-2">
            <Buttons
              disabled={loading}
              type="submit"
              onClick={handleFormSubmit}
            >
              {loading ? <Spinner btn /> : "Create"}
            </Buttons>
            <Buttons back variant="destructive">
              Cancel
            </Buttons>
          </div>
        </form>
      )}
    </div>
  );
};

export default CreateTable;
