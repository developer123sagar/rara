import { Spinner, Upload } from "@/common";
import Buttons from "@/common/Button";
import NameMark from "@/common/NameMark";
import { UpdateDataWithUpdate } from "@/redux/dashboard/fetchApiData/fetchApiDataSlice";
import { RootState, useAppDispatch, useAppSelector } from "@/redux/store";
import { IVideo } from "@/types";
import { FormEvent, useState } from "react";
import toast from "react-hot-toast";

const EditVideo = () => {
  const selectedItem: IVideo = useAppSelector(
    (state: RootState) => state.fetchDashData.selectedItem
  );
  const { token } = useAppSelector((state: RootState) => state.signin);
  const { loading } = useAppSelector((state: RootState) => state.fetchDashData);

  const [form, setForm] = useState(selectedItem || {});
  const dispatch = useAppDispatch();

  const handleUpdateForm = async (e: FormEvent) => {
    e.preventDefault();
    await dispatch(
      UpdateDataWithUpdate({
        api: "rarastory/update",
        form: form,
        token: token!,
      })
    ).then((res) => {
      if (UpdateDataWithUpdate.fulfilled.match(res)) {
        toast.success("Successfully updated");
      } else {
        const err = res.error.message || "something went wrong";
        toast.error(err);
      }
    });
  };

  return (
    <div className="w-full mt-10">
      <NameMark label="Update Video" variant="secondary" />
      <div className="mt-6 flex justify-between">
        <div className="mb-4.5">
          <label className="mb-2.5 block text-black">Video Thumbnail</label>
          <div className="flex gap-2">
            <Upload
              accept=".jpg,.png,.svg,.jpeg"
              imgTitle="thumbnail"
              setForm={setForm}
              fieldName="thumbnail"
              existingImg={[selectedItem?.thumbnail]}
            />
          </div>
        </div>
        <div className="mb-4.5">
          <label className="mb-2.5 block text-black">Video</label>
          <div className="flex gap-2">
            <Upload
              fieldName="video"
              imgTitle="video"
              setForm={setForm}
              accept=".mp4,.mpeg"
              isVideo
              showImage={false}
              form={form}
            />
          </div>
        </div>
      </div>
      <Buttons
        type="button"
        onClick={handleUpdateForm}
        className="float-right mt-4"
      >
        {loading ? <Spinner btn /> : "Update"}
      </Buttons>
    </div>
  );
};

export default EditVideo;
