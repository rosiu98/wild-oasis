import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Booking, updateBooking } from "../../services/apiBookings";
import toast from "react-hot-toast";

export const useCheckOut = () => {
  const queryClient = useQueryClient();

  const { mutate: checkout, isLoading: isCheckingOut } = useMutation({
    mutationFn: (bookingId: number) =>
      updateBooking(bookingId, {
        status: "checked-out",
      }),

    onSuccess: (data: Booking) => {
      toast.success(`Booking #${data.id} successfully checked out`);
      queryClient.invalidateQueries({ queryKey: ["booking"] });
    },

    onError: () => toast.error("There was an erro while checking out"),
  });

  return { checkout, isCheckingOut };
};
