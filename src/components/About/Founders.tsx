import { useEffect } from "react";
import { RootState, useAppDispatch, useAppSelector } from "@/redux/store";
import { fetchDashboardData } from "@/redux/dashboard/fetchApiData/fetchApiDataSlice";
import { IFounder } from "@/types";
import { baseImgUrl } from "@/routes";

export default function Founder_Image() {
  const dispatch = useAppDispatch();
  const data: IFounder[] = useAppSelector((state: RootState) => state.fetchDashData.data);

  useEffect(() => {
    dispatch(fetchDashboardData({ api: "rarafounder" }));
  }, [dispatch]);

  return (
    <section className="pb-1">
      <div className="container mx-auto">
        <div className="text-center mb-8">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900">Meet Our Team</h2>
          <p className="text-lg md:text-xl text-gray-700">We're the founders behind RARA Foods</p>
        </div>

        <div className="flex justify-center overflow-x-auto scrollbar-hide">
          {Array.isArray(data) && data.length > 0 ? (
            data.map((item, i) => (
              <div key={i} className="flex-shrink-0 mr-8">
                <div className="relative rounded-xl overflow-hidden">
                  <img
                    src={`${baseImgUrl}/${item.image}`}
                    alt="founder"
                    className="w-64 h-64 object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black opacity-50"></div>
                  <div className="absolute inset-0 flex flex-col justify-center items-center text-white px-6 py-8">
                    <h3 className="text-xl font-semibold mb-2">{item.name}</h3>
                    <p className="text-sm text-center">{item.extra}</p>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <h1 className="text-center flex justify-center items-center w-full">No Founders added</h1>
          )}
        </div>
      </div>
    </section>
  );
}
