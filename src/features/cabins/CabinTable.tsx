import Spinner from "../../ui/Spinner";
import CabinRow from "./CabinRow";
import { useCabins } from "./useCabins";
import Table from "../../ui/Table";
import { CabinsTable } from "../../services/apiCabins";
import Menus from "../../ui/Menus";
import { useSearchParams } from "react-router-dom";
import Empty from "../../ui/Empty";

type Field = [
  field:
    | "id"
    | "created_at"
    | "name"
    | "maxCapacity"
    | "regularPrice"
    | "description"
    | "image",
  directon: "asc" | "desc",
];

const CabinTable = () => {
  const { isLoading, cabins } = useCabins();
  const [searchParams] = useSearchParams();

  if (isLoading) return <Spinner />;

  if (!cabins?.length) return <Empty resource="cabins" />;

  // 1) FILTER
  const filterValue = searchParams.get("discount") || "all";

  let filteredCabins;

  if (filterValue === "all") filteredCabins = cabins;
  if (filterValue === "no-discount") {
    filteredCabins = cabins?.filter((cabin) => cabin.discount === 0);
  }
  if (filterValue === "with-discount") {
    filteredCabins = cabins?.filter((cabin) => cabin.discount > 0);
  }

  // 2) SORT
  const sortBy = searchParams.get("sortBy") || "startDate-asc";
  const [field, directon] = sortBy.split("-") as Field;
  const modifier = directon === "asc" ? 1 : -1;
  const sortedCabins = filteredCabins?.sort((a, b) => {
    const aValue = Number(a[field]);
    const bValue = Number(b[field]);

    if (!isNaN(aValue) && !isNaN(bValue)) {
      return (aValue - bValue) * modifier;
    }

    // Handle the case where the values are not numbers
    return 0;
  });

  return (
    <Menus>
      <Table columns="0.6fr 1.8fr 2.2fr 1fr 1fr 1fr">
        <Table.Header>
          <div></div>
          <div>Cabin</div>
          <div>Capacity</div>
          <div>Price</div>
          <div>Discount</div>
          <div></div>
        </Table.Header>
        <Table.Body
          data={sortedCabins}
          render={(cabin: CabinsTable) => (
            <CabinRow cabin={cabin} key={cabin.id} />
          )}
        />
      </Table>
    </Menus>
  );
};

export default CabinTable;
