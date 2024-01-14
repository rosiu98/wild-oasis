import { SubmitHandler, useForm } from "react-hook-form";
import Button from "../../ui/Button";
import Form from "../../ui/Form";
import FormRow from "../../ui/FormRow";
import Input from "../../ui/Input";
import Spinner from "../../ui/Spinner";
import { ButtonsCointainer } from "../cabins/CreateCabinForm";
import { useSettings } from "./useSettings";
import { useUpdateSettings } from "./useUpdateSettings";
import { SettingsTable } from "../../services/apiSettings";

function UpdateSettingsForm() {
  const { settings, isLoading } = useSettings();

  const { isUpdating, updateSettings } = useUpdateSettings();

  const { register, handleSubmit } = useForm<SettingsTable>();

  const onSubmit: SubmitHandler<SettingsTable> = (data) => {
    let settingsTable: SettingsTable;

    if (settings) {
      settingsTable = {
        ...data,
        id: settings.id,
      };

      updateSettings({ newSettings: settingsTable });
    }
  };

  if (isLoading) return <Spinner />;

  if (settings)
    return (
      <Form onSubmit={handleSubmit(onSubmit)}>
        <FormRow label="Minimum nights/booking">
          <Input
            type="number"
            id="min-nights"
            {...register("minBookingLength", {
              required: "This field is required",
            })}
            defaultValue={settings?.minBookingLength}
          />
        </FormRow>
        <FormRow label="Maximum nights/booking">
          <Input
            type="number"
            id="max-nights"
            {...register("maxBookingLength", {
              required: "This field is required",
            })}
            defaultValue={settings?.maxBookingLength}
          />
        </FormRow>
        <FormRow label="Maximum guests/booking">
          <Input
            type="number"
            id="max-guests"
            {...register("maxGuestsPerBooking", {
              required: "This field is required",
            })}
            defaultValue={settings?.maxGuestsPerBooking}
          />
        </FormRow>
        <FormRow label="Breakfast price">
          <Input
            type="number"
            id="breakfast-price"
            {...register("breakfastPrice", {
              required: "This field is required",
            })}
            defaultValue={settings?.breakfastPrice}
          />
        </FormRow>

        <ButtonsCointainer>
          {/* type is an HTML attribute! */}
          <Button disabled={isUpdating}>Update Settings</Button>
        </ButtonsCointainer>
      </Form>
    );

  return null;
}

export default UpdateSettingsForm;
