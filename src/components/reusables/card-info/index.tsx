import React from "react";
type CardInfoProps = {
  title: string;
  value: string | number | null;
  isLoading?: boolean;
};
const CardInfo = (props: CardInfoProps) => {
  return (
    <div className="flex flex-col space-y-1">
      <label className="text-xs font-light uppercase">{props.title}</label>
      {props.isLoading ? (
        <div className="skeleton h-10"></div>
      ) : (
        <h3 className="text-3xl font-semibold">{props.value || "N/A"}</h3>
      )}
    </div>
  );
};

export default CardInfo;
