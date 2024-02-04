import React from "react";
type CardInfoProps = {
  title: string;
  value: string;
};
const CardInfo = (props: CardInfoProps) => {
  return (
    <div className="space-y-1">
      <h4 className="text-xs font-light uppercase">{props.title}</h4>
      <h3 className="text-3xl font-semibold">{props.value}</h3>
    </div>
  );
};

export default CardInfo;
