
import "dotenv/config";
import { v2 as cloudinary } from "cloudinary";
import fs from "node:fs";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const images = [];
let nextCursor;

try {
  do {
    const result = await cloudinary.api.resources({
      type: "upload",
      resource_type: "image",
      max_results: 500,
      next_cursor: nextCursor,
    });

    for (const image of result.resources) {
      if (
        image.asset_folder?.startsWith("wasama-perfume/") ||
        image.asset_folder === "wasama-perfume" ||
        image.public_id.startsWith("wasama-perfume/")
      ) {
        images.push({
          public_id: image.public_id,
          asset_folder: image.asset_folder ?? "",
          filename: image.display_name ?? "",
          url: image.secure_url,
          format: image.format,
          width: image.width,
          height: image.height,
        });
      }
    }

    nextCursor = result.next_cursor;
  } while (nextCursor);

  fs.writeFileSync(
    "cloudinary-images.json",
    JSON.stringify(images, null, 2),
    "utf8"
  );

  console.log(`Exported ${images.length} images.`);
  console.log("Saved: cloudinary-images.json");
} catch (error) {
  console.error("Cloudinary export failed:", error.message);
  process.exitCode = 1;
}
