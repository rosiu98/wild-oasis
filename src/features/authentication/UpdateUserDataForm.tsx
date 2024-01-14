import React, { useRef, useState } from "react";
import Button from "../../ui/Button";
import FileInput from "../../ui/FileInput";
import Form from "../../ui/Form";
import FormRow from "../../ui/FormRow";
import Input from "../../ui/Input";
import { useUser } from "./useUser";
import { useUpdatedUser } from "./useUpdatedUser";

function UpdateUserDataForm() {
  const {
    user: {
      email,
      user_metadata: { fullName: currentFullName },
    },
  } = useUser() as any;

  const { updateUser, isUpdating } = useUpdatedUser();

  const formRef = useRef<HTMLFormElement>(null);

  const [fullName, setFullName] = useState(currentFullName);
  const [avatar, setAvatar] = useState<File | null>(null);

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!fullName) return;
    updateUser(
      { fullName, avatar },
      {
        onSuccess: () => {
          setAvatar(null);
          formRef.current?.reset();
        },
      },
    );
  }

  function handleCancel() {
    setFullName(currentFullName);
    setAvatar(null);
  }

  return (
    <Form onSubmit={handleSubmit} ref={formRef}>
      <FormRow label="Email address">
        <Input value={email} disabled />
      </FormRow>
      <FormRow label="Full name">
        <Input
          disabled={isUpdating}
          type="text"
          value={fullName}
          onChange={(e) => setFullName(e.target.value)}
          id="fullName"
        />
      </FormRow>
      <FormRow label="Avatar image">
        <FileInput
          disabled={isUpdating}
          id="avatar"
          accept="image/*"
          onChange={(e) => {
            const selectedFile = e.target.files?.[0];
            if (selectedFile) {
              setAvatar(selectedFile);
            }
          }}
        />
      </FormRow>
      <FormRow>
        <div style={{ display: "flex", gap: "2rem" }}>
          <Button
            disabled={isUpdating}
            onClick={handleCancel}
            type="reset"
            variation="secondary"
          >
            Cancel
          </Button>
          <Button disabled={isUpdating}>Update account</Button>
        </div>
      </FormRow>
    </Form>
  );
}

export default UpdateUserDataForm;
