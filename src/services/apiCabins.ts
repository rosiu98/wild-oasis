import { CabinState } from "../features/cabins/CreateCabinForm";
import supabase, { supabaseUrl } from "./supabase";

export interface CabinsTable {
  id: number;
  created_at: string;
  name: string;
  maxCapacity: number;
  regularPrice: number;
  discount: number;
  description: string;
  image: string;
}

export const getCabins = async (): Promise<CabinsTable[]> => {
  const { data, error } = await supabase.from("cabins").select("*");

  if (error) {
    console.error(error);
    throw new Error("Cabins could not be loaded");
  }

  return data;
};

export const createEditCabin = async (newCabin: CabinState, id?: number) => {
  console.log(newCabin);

  // https://sgyelkojaxqiyufjfoil.supabase.co/storage/v1/object/public/cabin-images/cabin-001.jpg

  // 0. CREATE PATH IMAGE URL

  let imagePath: string;
  let isUploaded = false;

  if (typeof newCabin.image === "string") {
    // If image is already a string, use it as is
    imagePath = newCabin.image;
  } else {
    // If image is a FileList, generate a random name
    const imageName = `${Math.random()}-${newCabin.image?.[0]
      ?.name}`.replaceAll("/", "");
    imagePath = `${supabaseUrl}/storage/v1/object/public/cabin-images/${imageName}`;

    // Upload the image
    const { error: storageError } = await supabase.storage
      .from("cabin-images")
      .upload(imageName, newCabin.image?.[0]);

    if (storageError) {
      console.error(storageError);
      throw new Error("Cabin image could not be uploaded");
    }

    isUploaded = true;
  }

  // 1. Create cabin

  let query = supabase.from("cabins");

  const queryBuilder = id
    ? query.update({ ...newCabin, image: imagePath }).eq("id", id)
    : query.insert([{ ...newCabin, image: imagePath }]);

  const { data, error } = await queryBuilder.select().returns<CabinsTable[]>();

  if (error) {
    console.error(error);
    throw new Error("Cabins could not be created");
  }

  // 2. Upload image
  if (data && imagePath !== newCabin.image && !isUploaded) {
    const { error: storageError } = await supabase.storage
      .from("cabin-images")
      .upload(imagePath, newCabin.image?.[0]);

    if (storageError) {
      await supabase.from("cabins").delete().eq("id", data[0].id);
      console.error(storageError);
      throw new Error(
        "Cabin image could not be uploaded and the cabin was not created",
      );
    }
  }

  return data;
};

export const deleteCabin = async (id: number) => {
  const { data, error } = await supabase
    .from("cabins")
    .delete()
    .eq("id", id)
    .select()
    .single<CabinsTable>();

  // ("https://sgyelkojaxqiyufjfoil.supabase.co/storage/v1/object/public/cabin-images/0.023717720328322534-cabin-002.jpg");

  const imageName = data?.image.split("/").at(-1);

  if (imageName) {
    const { error: storageError } = await supabase.storage
      .from("cabin-images")
      .remove([imageName]);

    if (storageError) {
      console.error(error);
      throw new Error("Cabin Image could not be deleted from storage");
    }
  }

  if (error) {
    console.error(error);
    throw new Error("Cabins could not be deleted");
  }

  return data;
};
