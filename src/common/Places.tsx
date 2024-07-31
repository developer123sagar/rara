import { mapboxToken } from "@/routes";
import axios from "axios";
import { useEffect } from "react";

const Places = ({ search_text }: { search_text: string }) => {
  useEffect(() => {
    const getPlaces = async () => {
      try {
        await axios.get(
          `https://api.mapbox.com/geocoding/v5/${mapboxToken}/${search_text}.json`
        );
      } catch (error) {
        throw error;
      }
    };
    getPlaces();
  }, []);

  return (
    <section>
      <div>h</div>
    </section>
  );
};

export default Places;
