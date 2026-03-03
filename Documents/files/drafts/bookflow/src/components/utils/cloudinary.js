export const uploadAvatar = async (file) => {
  const formData = new FormData();
  formData.append("file", file);
  formData.append("upload_preset", "bookflow");

  const res = await fetch("https://api.cloudinary.com/v1_1/dggvnbw4a/image/upload", {
    method: "POST",
    body: formData
  });

  const data = await res.json();
  return data.secure_url;
};

export const uploadToCloudinary = async (file) => {
  const formData = new FormData();
  formData.append("file", file);
  formData.append("upload_preset", "bookflow");

  const res = await fetch("https://api.cloudinary.com/v1_1/dggvnbw4a/image/upload", {
    method: "POST",
    body: formData
  });

  const data = await res.json();
  return data.secure_url;
};