import styled from "styled-components";

import BookingDataBox from "./BookingDataBox";
import Row from "../../ui/Row";
import Heading from "../../ui/Heading";
import Tag from "../../ui/Tag";
import ButtonGroup from "../../ui/ButtonGroup";
import Button from "../../ui/Button";
import ButtonText from "../../ui/ButtonText";

import { useMoveBack } from "../../hooks/useMoveBack";
import { useBooking } from "./useBooking";
import Spinner from "../../ui/Spinner";
import { useNavigate } from "react-router-dom";
import { useCheckOut } from "../check-in-out/useCheckOut";
import { HiArrowUpOnSquare } from "react-icons/hi2";
import { useDeleteBooking } from "./useDeleteBooking";
import Empty from "../../ui/Empty";

const HeadingGroup = styled.div`
  display: flex;
  gap: 2.4rem;
  align-items: center;
`;

function BookingDetail() {
  const { booking, isLoading } = useBooking();
  const { checkout, isCheckingOut } = useCheckOut();
  const { deleteBooking, isDeletingBooking } = useDeleteBooking();

  const navigate = useNavigate();

  const moveBack = useMoveBack();

  if (isLoading) return <Spinner />;
  if (!booking) return <Empty resource="booking" />;

  const statusToTagName = {
    unconfirmed: "blue",
    "checked-in": "green",
    "checked-out": "silver",
  };

  return (
    <>
      <Row type="horizontal">
        <HeadingGroup>
          <Heading as="h1">Booking #{booking?.id}</Heading>
          <Tag
            type={statusToTagName[!booking ? "unconfirmed" : booking.status]}
          >
            {booking && booking.status.replace("-", " ")}
          </Tag>
        </HeadingGroup>
        <ButtonText onClick={moveBack}>&larr; Back</ButtonText>
      </Row>

      {booking && <BookingDataBox booking={booking} />}

      <ButtonGroup>
        {booking?.status === "unconfirmed" && (
          <Button onClick={() => navigate(`/checkin/${booking?.id}`)}>
            Check in
          </Button>
        )}

        {booking?.status === "checked-in" && (
          <Button disabled={isCheckingOut} onClick={() => checkout(booking.id)}>
            <HiArrowUpOnSquare /> Check out
          </Button>
        )}

        {booking && (
          <Button
            variation="danger"
            disabled={isDeletingBooking}
            onClick={() => {
              deleteBooking(booking.id);
              navigate("/");
            }}
          >
            Delete
          </Button>
        )}

        <Button variation="secondary" onClick={moveBack}>
          Back
        </Button>
      </ButtonGroup>
    </>
  );
}

export default BookingDetail;
