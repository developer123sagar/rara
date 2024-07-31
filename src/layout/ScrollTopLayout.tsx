import React from "react";

const ScrollTopLayout = ({ children }: { children: React.ReactNode }) => {
  React.useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return <div>{children}</div>;
};

export default ScrollTopLayout;
