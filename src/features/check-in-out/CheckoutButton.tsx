import Button from "../../ui/Button";
import { useCheckOut } from "./useCheckOut";

function CheckoutButton({ bookingId }: { bookingId: number }) {
  const { checkout, isCheckingOut } = useCheckOut();

  return (
    <Button
      disabled={isCheckingOut}
      variation="primary"
      size="small"
      onClick={() => checkout(bookingId)}
    >
      Check&nbsp;out
    </Button>
  );
}

export default CheckoutButton;
