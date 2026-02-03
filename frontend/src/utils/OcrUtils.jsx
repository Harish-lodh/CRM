export const extractTextFromImage = async (file) => {
  const formData = new FormData();
  formData.append("file", file);
  formData.append("language", "eng");
  formData.append("apikey", "your_ocr_space_api_key");
  formData.append("isOverlayRequired", "false");

  const response = await fetch("https://api.ocr.space/parse/image", {
    method: "POST",
    body: formData,
  });

  console.log(response);

  const result = await response.json();
  return result?.ParsedResults?.[0]?.ParsedText || "";
};
