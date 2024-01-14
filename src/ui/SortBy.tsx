import React from "react";
import Select from "./Select";
import { useSearchParams } from "react-router-dom";

type Props = {
  options: { value: string; label: string }[];
};

const SortBy = ({ options }: Props) => {
  const [searchParams, setSearchParams] = useSearchParams();

  const sortBy = searchParams.get("sortBy") || "";

  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    e.target?.value && searchParams.set("sortBy", e.target.value);
    setSearchParams(searchParams);
  };

  return (
    <Select
      options={options}
      value={sortBy}
      onChange={handleChange}
      type="white"
    />
  );
};

export default SortBy;
