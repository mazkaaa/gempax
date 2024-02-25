import React from "react";
import CardInfo from "../../card-info";

interface GENERAL_WIDGET_INTERFACE {
  label: string;
  value: string | number | null;
  isLoading?: boolean;
}
const GeneralWidget = (props: GENERAL_WIDGET_INTERFACE) => {
  return (
    <CardInfo
      title={props.label}
      value={props.value === "NaN" ? "N/A" : props.value || "N/A"}
      isLoading={props.isLoading}
    />
  );
};

export default GeneralWidget;
